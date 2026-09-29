import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DatePickerField } from '@/components/calendar';
import { RecurrencePicker } from '@/components/reminders';
import { AppText, Button, Card, Chip, ConfirmDialog, Screen, TextField } from '@/components/ui';
import { addCivilDays, isCivilDate, isTimeZone, isWallTime, occurrencePreview, validateRecurrence } from '@/domain/recurrence';
import type { ReminderCategory, RepeatFrequency } from '@/domain/recurrence';
import { formatReminderDate, deviceCivilDate, deviceTimeZone } from './presentation';
import type { ReminderInput } from './types';
import { reconcileNotifications, requestReminderPermission } from '@/services/notifications';
import { usePreferences } from '@/store/preferences';
import { colors, minimumTouchTarget, spacing } from '@/theme';

const CATEGORIES: ReminderCategory[] = ['birthday', 'anniversary', 'religious', 'medicine', 'personal', 'work', 'other'];

export function ReminderForm({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Partial<ReminderInput>;
  onSubmit: (input: ReminderInput) => Promise<void>;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const setNotificationsEnabled = usePreferences((state) => state.setNotificationsEnabled);
  const [name, setName] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [category, setCategory] = useState<ReminderCategory>(initial?.category ?? 'personal');
  const [date, setDate] = useState(initial?.startDate ?? deviceCivilDate());
  const [hasTime, setHasTime] = useState(initial?.wallTime !== null && initial?.wallTime !== undefined);
  const [time, setTime] = useState(initial?.wallTime ?? '');
  const [timeZone, setTimeZone] = useState(initial?.timeZone ?? deviceTimeZone());
  const [frequency, setFrequency] = useState<RepeatFrequency>(initial?.recurrence?.frequency ?? 'none');
  const [interval, setInterval] = useState(String(initial?.recurrence?.interval ?? 1));
  const [untilDate, setUntilDate] = useState(initial?.recurrence?.untilDate ?? '');
  const [notify, setNotify] = useState(initial?.notificationEnabled ?? false);
  const [alertTurnedOn, setAlertTurnedOn] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const allowLeave = useRef(false);
  const [initialSnapshot] = useState(() => JSON.stringify({
    name: initial?.title ?? '', notes: initial?.notes ?? '', category: initial?.category ?? 'personal',
    date: initial?.startDate ?? deviceCivilDate(), hasTime: initial?.wallTime !== null && initial?.wallTime !== undefined,
    time: initial?.wallTime ?? '', timeZone: initial?.timeZone ?? deviceTimeZone(),
    frequency: initial?.recurrence?.frequency ?? 'none', interval: String(initial?.recurrence?.interval ?? 1),
    untilDate: initial?.recurrence?.untilDate ?? '', notify: initial?.notificationEnabled ?? false,
  }));
  const currentSnapshot = JSON.stringify({ name, notes, category, date, hasTime, time, timeZone, frequency, interval, untilDate, notify });
  const dirty = initialSnapshot !== currentSnapshot;
  const dirtyRef = useRef(false);
  useEffect(() => { dirtyRef.current = dirty; }, [dirty]);

  const leave = useCallback(() => {
    if (!allowLeave.current && dirtyRef.current) setShowDiscard(true);
    else router.back();
  }, [router]);

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!allowLeave.current && dirtyRef.current) {
        setShowDiscard(true);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, []));

  const parsedRule = useMemo(() => ({
    version: 1 as const, frequency, interval: frequency === 'none' ? 1 : Number(interval),
    untilDate: frequency === 'none' ? null : untilDate.trim() || null,
  }), [frequency, interval, untilDate]);
  const preview = useMemo(() => {
    try {
      if (!isCivilDate(date) || !isTimeZone(timeZone) || (hasTime && !isWallTime(time))) return [];
      validateRecurrence(parsedRule, date);
      const from = date > deviceCivilDate() ? date : deviceCivilDate();
      return occurrencePreview(date, hasTime ? time : null, timeZone, parsedRule, from, addCivilDays(from, 366 * 21), 5);
    } catch { return []; }
  }, [date, timeZone, hasTime, time, parsedRule]);

  const save = async () => {
    setError('');
    if (!name.trim()) { setError(t('titleRequired')); return; }
    if (!isCivilDate(date)) { setError(t('invalidDate')); return; }
    if (hasTime && !isWallTime(time)) { setError(t('timeFormatHint')); return; }
    if (notify && (!hasTime || !isWallTime(time))) { setError(t('alertTimeNeeded')); return; }
    if (!isTimeZone(timeZone)) { setError(t('timeZone')); return; }
    if (untilDate && (!isCivilDate(untilDate) || untilDate < date)) { setError(t('endDateInvalid')); return; }
    try { validateRecurrence(parsedRule, date); } catch { setError(t('interval')); return; }
    setBusy(true);
    try {
      if (notify) {
        if (alertTurnedOn) {
          try { await requestReminderPermission(); } catch { /* save the reminder even if the OS cannot schedule it */ }
        }
      }
      await onSubmit({
        title: name, notes, category, startDate: date, wallTime: hasTime ? time : null,
        timeZone, recurrence: parsedRule, notificationEnabled: notify,
      });
      if (notify) {
        setNotificationsEnabled(true);
        try { await reconcileNotifications({ enabled: true, language }); } catch { /* retry on app resume */ }
      }
      allowLeave.current = true;
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={leave} style={styles.back}>
          <ChevronLeft size={24} color={colors.primary} />
        </Pressable>
        <AppText variant="title" weight="700" style={styles.heading}>{title}</AppText>
      </View>
      <View style={styles.content}>
        <TextField label={t('reminderTitle')} value={name} onChangeText={setName} maxLength={120} autoFocus />
        <View style={styles.row}>
          <View style={styles.grow}><DatePickerField date={date} label={t('date')} onSelect={setDate} /></View>
          <Button title={t('today')} variant="secondary" onPress={() => setDate(deviceCivilDate())} />
        </View>
        <View style={styles.field}>
          <AppText weight="700">{t('reminderCategory')}</AppText>
          <View style={styles.chips}>{CATEGORIES.map((value) => <Chip key={value} label={t(value)} selected={category === value} onPress={() => setCategory(value)} />)}</View>
        </View>
        <Card>
          <View style={styles.switchRow}>
            <View style={styles.grow}>
              <AppText weight="700">{t('reminderTime')}</AppText>
              <AppText variant="small" tone="muted">{hasTime ? t('timeFormatHint') : t('allDay')}</AppText>
            </View>
            <Switch accessibilityLabel={t('reminderTime')} value={hasTime} onValueChange={(value) => { setHasTime(value); if (!value) setNotify(false); }} trackColor={{ true: colors.primary }} />
          </View>
          {hasTime ? <TextField label={t('time')} value={time} onChangeText={setTime} placeholder="09:00" keyboardType="numbers-and-punctuation" maxLength={5} /> : null}
          <TextField label={t('timeZone')} value={timeZone} onChangeText={setTimeZone} autoCapitalize="none" autoCorrect={false} placeholder="Asia/Kolkata" />
        </Card>
        <RecurrencePicker
          title={t('repeat')}
          value={frequency}
          onChange={(value) => setFrequency(value as RepeatFrequency)}
          includeCustom={false}
          labels={{ none: t('noRepeat'), daily: t('daily'), weekly: t('weekly'), monthly: t('monthly'), yearly: t('yearly'), custom: t('repeat') }}
        />
        {frequency !== 'none' ? (
          <View style={[styles.row, styles.recurrenceRow]}>
            <View style={styles.grow}><TextField label={t('interval')} value={interval} onChangeText={setInterval} keyboardType="number-pad" maxLength={3} /></View>
            <View style={styles.grow}>
              <DatePickerField date={untilDate} fallbackDate={date} label={t('endsOn')} placeholder={t('never')} onSelect={setUntilDate} />
              {untilDate ? <Button title={t('clear')} variant="ghost" onPress={() => setUntilDate('')} style={styles.clearDate} /> : null}
            </View>
          </View>
        ) : null}
        <Card>
          <View style={styles.switchRow}>
            <View style={styles.grow}><AppText weight="700">{t('notification')}</AppText><AppText variant="small" tone="muted">{t('notificationHint')}</AppText></View>
            <Switch accessibilityLabel={t('notification')} value={notify} onValueChange={(value) => { setNotify(value); if (value) setAlertTurnedOn(true); if (value && !hasTime) setHasTime(true); }} trackColor={{ true: colors.primary }} />
          </View>
          {notify && !isWallTime(time) ? <AppText variant="small" tone="error">{t('alertTimeNeeded')}</AppText> : null}
          {notify ? <AppText variant="caption" tone="muted">{t('repeatHorizon')}</AppText> : null}
        </Card>
        <TextField label={t('reminderNotes')} value={notes} onChangeText={setNotes} multiline maxLength={5000} />
        {preview.length ? (
          <Card>
            <AppText weight="700">{t('previewOccurrences')}</AppText>
            {preview.map((item) => <AppText key={item.key} variant="small" tone="muted">{formatReminderDate(item.date, language, item.wallTime)}</AppText>)}
          </Card>
        ) : null}
        {error ? <AppText tone="error" accessibilityRole="alert">{error}</AppText> : null}
        <Button title={t('save')} onPress={() => void save()} loading={busy} fullWidth />
      </View>
      <ConfirmDialog
        visible={showDiscard} title={t('discardChangesTitle')} description={t('discardChangesMessage')}
        confirmLabel={t('discard')} cancelLabel={t('cancel')} destructive
        onConfirm={() => { allowLeave.current = true; setShowDiscard(false); router.back(); }}
        onCancel={() => setShowDiscard(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  back: { minWidth: minimumTouchTarget, minHeight: minimumTouchTarget, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1 }, content: { gap: spacing.lg }, row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  recurrenceRow: { alignItems: 'flex-start' },
  grow: { flex: 1 }, clearDate: { alignSelf: 'flex-start' }, field: { gap: spacing.sm }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  switchRow: { minHeight: minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
