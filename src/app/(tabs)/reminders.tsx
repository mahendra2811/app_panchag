import { useFocusEffect, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReminderCard } from '@/components/reminders';
import { AppText, Button, Chip, LoadingState, Screen, StatusState, TextField } from '@/components/ui';
import { addCivilDays } from '@/domain/recurrence';
import type { ReminderCategory } from '@/domain/recurrence';
import { listOccurrences, listReminders, listStoredOccurrenceStates, setOccurrenceState } from '@/features/reminders';
import { deviceCivilDate, formatReminderDate, previewDates, recurrenceLabel } from '@/features/reminders/presentation';
import type { Reminder, ReminderOccurrence, StoredOccurrenceState } from '@/features/reminders';
import { usePreferences } from '@/store/preferences';
import { colors, spacing } from '@/theme';

type Segment = 'upcoming' | 'past' | 'completed';
type Item = { reminder: Reminder; date: string; state: 'completed' | 'skipped' | null };
const CATEGORIES: ReminderCategory[] = ['birthday', 'anniversary', 'religious', 'medicine', 'personal', 'work', 'other'];

export default function RemindersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const [segment, setSegment] = useState<Segment>('upcoming');
  const [category, setCategory] = useState<ReminderCategory | null>(null);
  const [search, setSearch] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [past, setPast] = useState<ReminderOccurrence[]>([]);
  const [states, setStates] = useState<StoredOccurrenceState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = deviceCivilDate();

  const refresh = useCallback(async () => {
    try {
      const now = deviceCivilDate();
      const [nextReminders, pastOccurrences, storedStates] = await Promise.all([
        listReminders(), listOccurrences(addCivilDays(now, -30), addCivilDays(now, -1)), listStoredOccurrenceStates(),
      ]);
      setReminders(nextReminders);
      setPast(pastOccurrences);
      setStates(storedStates);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const items = useMemo(() => {
    const byId = new Map(reminders.map((reminder) => [reminder.id, reminder]));
    const handled = new Set(states.map((state) => `${state.reminderId}:${state.occurrenceKey}`));
    let result: Item[] = [];
    if (segment === 'upcoming') {
      result = reminders.map((reminder) => ({
        reminder,
        date: previewDates(reminder, today, 512).find((date) => !handled.has(`${reminder.id}:${date}`)) ?? '',
        state: null,
      })).filter((item) => !!item.date);
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (segment === 'past') {
      result = past.filter((item) => !item.state).map((item) => ({ reminder: item.reminder, date: item.date, state: null }));
      result.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      result = states.flatMap((state): Item[] => {
        const reminder = byId.get(state.reminderId);
        return reminder ? [{ reminder, date: state.originalDate, state: state.state }] : [];
      })
        .sort((a, b) => b.date.localeCompare(a.date));
    }
    const term = search.trim().toLocaleLowerCase();
    return result.filter((item) => (!category || item.reminder.category === category) &&
      (!term || `${item.reminder.title} ${item.reminder.notes}`.toLocaleLowerCase().includes(term)));
  }, [category, past, reminders, search, segment, states, today]);

  const toggle = async (item: Item) => {
    try {
      await setOccurrenceState(item.reminder.id, item.date, item.state === 'completed' ? null : 'completed');
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.heading}><AppText variant="title" weight="700">{t('reminders')}</AppText><AppText variant="small" tone="muted">{t('notificationHint')}</AppText></View>
        <Button title={t('addReminder')} icon={<Plus color={colors.surface} size={18} />} onPress={() => router.push('/reminders/create')} />
      </View>
      <View style={styles.content}>
        <TextField label={t('search')} value={search} onChangeText={setSearch} placeholder={t('searchPlaceholder')} autoCorrect={false} />
        <View style={styles.chips}>
          {(['upcoming', 'past', 'completed'] as Segment[]).map((value) => <Chip key={value} label={t(value)} selected={segment === value} onPress={() => setSegment(value)} />)}
        </View>
        <View style={styles.chips}>
          <Chip label={t('all')} selected={!category} onPress={() => setCategory(null)} compact />
          {CATEGORIES.map((value) => <Chip key={value} label={t(value)} selected={category === value} onPress={() => setCategory(value)} compact />)}
        </View>
        {error ? <AppText tone="error" accessibilityRole="alert">{error}</AppText> : null}
        {loading ? <LoadingState label={t('loading')} /> : items.length ? items.map((item) => (
          <ReminderCard
            key={`${item.reminder.id}:${item.date}`}
            title={item.reminder.title}
            dueLabel={`${formatReminderDate(item.date, language, item.reminder.wallTime)}${item.state === 'skipped' ? ` · ${t('skipped')}` : ''}`}
            categoryLabel={t(item.reminder.category)}
            notes={item.reminder.notes}
            completed={item.state === 'completed'}
            notificationEnabled={item.reminder.notificationEnabled}
            recurrenceLabel={recurrenceLabel(item.reminder.recurrence, t)}
            onPress={() => router.push(`/reminders/${item.reminder.id}?date=${item.date}`)}
            onToggleComplete={() => void toggle(item)}
            completeActionLabel={t('markComplete')}
            undoActionLabel={t('markIncomplete')}
          />
        )) : (
          <StatusState
            title={reminders.length === 0 ? t('noReminders') : t('noResults')}
            actionLabel={reminders.length === 0 ? t('createFirstReminder') : undefined}
            onAction={reminders.length === 0 ? () => router.push('/reminders/create') : undefined}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heading: { flex: 1, gap: spacing.xs },
  content: { gap: spacing.md, paddingTop: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
