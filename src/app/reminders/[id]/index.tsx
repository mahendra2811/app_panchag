import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReminderCard } from '@/components/reminders';
import { AppText, Button, Card, Chip, ConfirmDialog, LoadingState, StatusState } from '@/components/ui';
import { isCivilDate } from '@/domain/recurrence';
import { deleteReminder, getReminder, listStoredOccurrenceStates, setOccurrenceState } from '@/features/reminders';
import type { Reminder, StoredOccurrenceState } from '@/features/reminders';
import { deviceCivilDate, formatReminderDate, previewDates, recurrenceLabel } from '@/features/reminders/presentation';
import { Page } from '@/features/common/Page';
import { getNotificationStatus } from '@/services/notifications';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';

type NativeStatus = Awaited<ReturnType<typeof getNotificationStatus>>;

export default function ReminderDetailScreen() {
  const params = useLocalSearchParams<{ id: string; date?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const notificationsEnabled = usePreferences((state) => state.notificationsEnabled);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [states, setStates] = useState<StoredOccurrenceState[]>([]);
  const [status, setStatus] = useState<NativeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof params.id !== 'string') { setLoading(false); return; }
    try {
      const found = await getReminder(params.id);
      setReminder(found);
      if (found) {
        const [nextStates, nextStatus] = await Promise.all([
          listStoredOccurrenceStates(found.id), getNotificationStatus(found.id).catch(() => null),
        ]);
        setStates(nextStates);
        setStatus(nextStatus);
      }
      setError('');
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setLoading(false); }
  }, [params.id]);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const today = deviceCivilDate();
  const upcoming = reminder ? previewDates(reminder, today, 5) : [];
  const selected = typeof params.date === 'string' && isCivilDate(params.date) ? params.date : upcoming[0] ?? null;
  const selectedState = states.find((state) => state.occurrenceKey === selected)?.state ?? null;

  const changeState = async (state: 'completed' | 'skipped' | null) => {
    if (!reminder || !selected) return;
    try { await setOccurrenceState(reminder.id, selected, state); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
  };

  const remove = async () => {
    if (!reminder || deleting) return;
    setDeleting(true);
    try { await deleteReminder(reminder.id); setDeleteOpen(false); router.replace('/(tabs)/reminders'); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); setDeleting(false); }
  };

  const statusLabel = !reminder?.notificationEnabled || !notificationsEnabled
    ? t('notificationOff')
    : status?.permission === 'denied' ? t('permissionDenied')
    : status?.permission === 'undetermined' ? t('notificationPending')
    : status && !status.channelEnabled ? t('notificationChannelOff')
    : status?.scheduledCount ? t('scheduled') : t('savedUnscheduled');

  return (
    <Page title={t('details')}>
      {loading ? <LoadingState label={t('loading')} /> : !reminder ? <StatusState title={t('noResults')} /> : (
        <View style={styles.content}>
          <Card>
            <AppText variant="title" weight="700">{reminder.title}</AppText>
            <View style={styles.chips}>
              <Chip label={t(reminder.category)} />
              <Chip label={recurrenceLabel(reminder.recurrence, t)} />
            </View>
            <AppText tone="muted">{formatReminderDate(reminder.startDate, language, reminder.wallTime)}</AppText>
            <AppText variant="small" tone="muted">{reminder.timeZone}</AppText>
            {reminder.notes ? <AppText>{reminder.notes}</AppText> : null}
          </Card>
          <Card>
            <AppText weight="700">{t('notification')}</AppText>
            <AppText variant="small" tone={status?.permission === 'denied' || status?.failedCount ? 'error' : 'muted'}>{statusLabel}</AppText>
            {reminder.notificationEnabled ? <AppText variant="caption" tone="muted">{t('repeatHorizon')}</AppText> : null}
          </Card>
          {selected ? (
            <Card>
              <AppText weight="700">{t('selectedDay')}</AppText>
              <AppText>{formatReminderDate(selected, language, reminder.wallTime)}</AppText>
              {selectedState ? <AppText variant="small" tone="success">{t(selectedState)}</AppText> : null}
              <View style={styles.actions}>
                <Button title={selectedState === 'completed' ? t('markIncomplete') : t('markComplete')} variant="secondary" onPress={() => void changeState(selectedState === 'completed' ? null : 'completed')} />
                <Button title={t('skipOccurrence')} variant="ghost" onPress={() => void changeState(selectedState === 'skipped' ? null : 'skipped')} />
              </View>
            </Card>
          ) : null}
          <AppText variant="subtitle" weight="700">{t('previewOccurrences')}</AppText>
          {upcoming.length ? upcoming.map((date) => (
            <ReminderCard
              key={date}
              title={reminder.title}
              dueLabel={formatReminderDate(date, language, reminder.wallTime)}
              completed={states.some((state) => state.occurrenceKey === date && state.state === 'completed')}
              onPress={() => router.setParams({ date })}
            />
          )) : <AppText tone="muted">{t('noEvent')}</AppText>}
          <View style={styles.actions}>
            <Button title={t('edit')} onPress={() => router.push(`/reminders/${reminder.id}/edit`)} />
            <Button title={t('delete')} variant="danger" onPress={() => setDeleteOpen(true)} />
          </View>
        </View>
      )}
      {error ? <AppText tone="error" accessibilityRole="alert">{error}</AppText> : null}
      <ConfirmDialog
        visible={deleteOpen} title={t('deleteReminderTitle')} description={t('deleteReminderMessage')}
        confirmLabel={t('delete')} cancelLabel={t('cancel')} destructive
        onConfirm={() => void remove()} onCancel={() => setDeleteOpen(false)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
