import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, Button, Card, SectionHeader, StatusState } from '@/components/ui';
import { PanchangSection, SourceBadge, TimeRangeRow } from '@/components/panchang';
import { getCityById } from '@/data/cities';
import { isValidCivilDate } from '@/domain/calendar';
import { clockLabel, dateLabel } from '@/features/calendar/format';
import { Page } from '@/features/common/Page';
import { deleteNote, listNotes, listOccurrences, saveNote, type DateNote, type ReminderOccurrence } from '@/features/reminders/repository';
import { usePanchangDay } from '@/features/panchang/usePanchang';
import { usePreferences } from '@/store/preferences';
import { colors, radius, spacing } from '@/theme';

export default function DateDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ date: string }>();
  const date = Array.isArray(params.date) ? params.date[0] ?? '' : params.date ?? '';
  const valid = isValidCivilDate(date);
  const { language, cityId, devanagariDigits } = usePreferences();
  const city = cityId ? getCityById(cityId) : null;
  const { day, result, loading } = usePanchangDay(date);
  const [notes, setNotes] = useState<DateNote[]>([]);
  const [noteText, setNoteText] = useState('');
  const [occurrences, setOccurrences] = useState<ReminderOccurrence[]>([]);
  const [saving, setSaving] = useState(false);

  const refreshPersonal = useCallback(() => {
    if (!valid) return;
    let active = true;
    void Promise.all([listNotes(date), listOccurrences(date, date)]).then(([nextNotes, nextOccurrences]) => {
      if (!active) return;
      setNotes(nextNotes);
      setNoteText(nextNotes[0]?.text ?? '');
      setOccurrences(nextOccurrences);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [date, valid, setNoteText, setNotes, setOccurrences]);
  useFocusEffect(refreshPersonal);

  if (!valid) return <Page title={t('dayDetails')}><StatusState title={t('invalidDate')} /></Page>;

  async function savePersonalNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    try { await saveNote(date, noteText, notes[0]?.id); const next = await listNotes(date); setNotes(next); }
    catch (error) { Alert.alert(t('saveNote'), error instanceof Error ? error.message : t('dataUnavailable')); }
    finally { setSaving(false); }
  }

  function removePersonalNote() {
    const id = notes[0]?.id;
    if (!id) return;
    Alert.alert(t('deleteNote'), t('deleteNote'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => { void deleteNote(id).then(() => { setNotes([]); setNoteText(''); }); } },
    ]);
  }

  const summary = day?.summaryAtSunrise;
  const limbs = day?.limbs;
  const sections = [
    { key: 'tithi', rows: limbs?.tithi },
    { key: 'nakshatra', rows: limbs?.nakshatra },
    { key: 'yoga', rows: limbs?.yoga },
    { key: 'karana', rows: limbs?.karana },
  ];

  return (
    <Page title={t('dayDetails')} subtitle={dateLabel(date, language, devanagariDigits)}>
      {/* {city ? <SourceBadge label={t('calculated', { city: language === 'hi' ? city.nameHi : city.name })} detail={t('calculationUnverified')} tone="warning" />
        : <Button title={t('selectCity')} onPress={() => router.push('/settings/location')} />} */}

      {loading && <AppText tone="muted">{t('loading')}</AppText>}
      {!loading && result && result.status !== 'available' && <StatusState title={t(result.status === 'outside_coverage' ? 'outsideCoverage' : 'dataUnavailable')} description={result.reason} />}

      {day && (
        <>
          <Card style={styles.summary}>
            <AppText variant="title" weight="700">{[summary?.masaName, summary?.tithiName].filter(Boolean).join(' · ')}</AppText>
            <AppText tone="muted">{summary?.pakshaId === 'SHUKLA' ? (language === 'hi' ? 'शुक्ल पक्ष' : 'Shukla Paksha') : summary?.pakshaId === 'KRISHNA' ? (language === 'hi' ? 'कृष्ण पक्ष' : 'Krishna Paksha') : ''}</AppText>
            {summary?.isAdhika && <AppText tone="primary">{language === 'hi' ? 'अधिक मास' : 'Adhika Masa'}</AppText>}
            {summary?.vikramSamvat && <AppText variant="small" tone="muted">{t('samvat')} {summary.vikramSamvat}</AppText>}
          </Card>

          <SectionHeader title={t('fiveLimbs')} />
          <PanchangSection title={t('vara')}><TimeRangeRow label={t('vara')} value={limbs?.varaName} /></PanchangSection>
          {sections.map(({ key, rows }) => (
            <PanchangSection key={key} title={t(key)} unavailableLabel={t('notSupported')}>
              {rows?.map((entry) => <TimeRangeRow key={`${entry.id}:${entry.startsAt}`} label={entry.name}
                start={clockLabel(entry.startsLocal)} end={clockLabel(entry.endsLocal)}
                context={entry.isActiveAtSunrise ? t('sunrise') : undefined} />)}
            </PanchangSection>
          ))}

          <PanchangSection title={t('astronomy')}>
            <TimeRangeRow label={t('sunrise')} value={clockLabel(day.astronomy.sunrise.local)} unavailableLabel={t('noEvent')} />
            <TimeRangeRow label={t('sunset')} value={clockLabel(day.astronomy.sunset.local)} unavailableLabel={t('noEvent')} />
            <TimeRangeRow label={t('moonrise')} value={clockLabel(day.astronomy.moonrise.local)} unavailableLabel={t('noEvent')} />
            <TimeRangeRow label={t('moonset')} value={clockLabel(day.astronomy.moonset.local)} unavailableLabel={t('noEvent')} />
          </PanchangSection>
          <Button title={t('fullPanchang')} variant="secondary" onPress={() => router.push(`/panchang?date=${date}`)} />
        </>
      )}

      <SectionHeader title={t('festivals')} action={<Button title={t('viewAll')} variant="ghost" onPress={() => router.push('/festivals')} />} />
      {day?.observances.length ? day.observances.map((item) => <Card key={item.id} onPress={() => router.push(`/festivals/${encodeURIComponent(item.canonicalId)}?date=${date}`)}>
        <AppText weight="700">{item.name}</AppText><AppText variant="small" tone="muted">{item.category}</AppText>
      </Card>) : <AppText tone="muted">{city ? t('noFestival') : t('locationNeeded')}</AppText>}

      <SectionHeader title={t('holidays')} action={<Button title={t('viewAll')} variant="ghost" onPress={() => router.push('/holidays')} />} />
      <AppText tone="muted" variant="small">{t('officialHolidayUnavailable')}</AppText>

      <SectionHeader title={t('reminders')} action={<Button title={t('addReminder')} variant="secondary" onPress={() => router.push(`/reminders/create?date=${date}`)} />} />
      {occurrences.length ? occurrences.map((item) => <Card key={`${item.reminder.id}:${item.occurrenceKey}`} onPress={() => router.push(`/reminders/${item.reminder.id}`)}>
        <AppText weight="700">{item.reminder.title}</AppText>
        <AppText variant="small" tone="muted">{item.reminder.wallTime ?? t('allDay')}{item.state ? ` · ${t(item.state)}` : ''}</AppText>
      </Card>) : <AppText tone="muted">{t('noReminders')}</AppText>}

      <SectionHeader title={t('notesForDate')} />
      <TextInput value={noteText} onChangeText={setNoteText} multiline maxLength={5000} style={styles.noteInput}
        placeholder={t('notesForDate')} placeholderTextColor={colors.mutedLight} accessibilityLabel={t('notesForDate')} />
      <View style={styles.noteActions}>
        {notes.length > 0 && <Button title={t('deleteNote')} variant="danger" onPress={removePersonalNote} />}
        <Button title={t('saveNote')} onPress={() => void savePersonalNote()} disabled={!noteText.trim()} loading={saving} />
      </View>
      <AppText variant="caption" tone="muted">{t('sourceHint')}</AppText>
    </Page>
  );
}

const styles = StyleSheet.create({
  summary: { gap: spacing.sm },
  noteInput: { minHeight: 120, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, textAlignVertical: 'top', padding: spacing.md, color: colors.text, fontSize: 16 },
  noteActions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: spacing.sm },
});
