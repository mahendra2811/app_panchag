import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, Button, Card, SectionHeader } from '@/components/ui';
import { isValidCivilDate, normalizeDateDigits } from '@/domain/calendar';
import { dateLabel } from '@/features/calendar/format';
import { useMonthSummary } from '@/features/calendar/useMonthSummary';
import { useToday } from '@/features/calendar/useToday';
import { Page } from '@/features/common/Page';
import { listReminders, type Reminder } from '@/features/reminders/repository';
import { usePanchangProfile } from '@/features/panchang/usePanchang';
import { usePreferences } from '@/store/preferences';
import { colors, radius, spacing } from '@/theme';

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const today = useToday();
  const { language, devanagariDigits } = usePreferences();
  const profile = usePanchangProfile();
  const [query, setQuery] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { days } = useMonthSummary(Number(today.slice(0, 4)), Number(today.slice(5, 7)), profile, language);
  const trimmed = query.trim();
  const dateQuery = normalizeDateDigits(trimmed);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!trimmed) { setReminders([]); return; }
      void listReminders({ search: trimmed }).then((next) => { if (active) setReminders(next.slice(0, 30)); }).catch(() => undefined);
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [trimmed]);

  const festivals = trimmed ? Object.values(days).flatMap((day) =>
    day.observances.filter((festival) => `${festival.name} ${festival.canonicalId}`.toLocaleLowerCase().includes(trimmed.toLocaleLowerCase()))
      .map((festival) => ({ date: day.date, festival }))) : [];

  return (
    <Page title={t('search')} subtitle={t('searchPlaceholder')}>
      <TextInput value={query} onChangeText={setQuery} placeholder={t('searchPlaceholder')}
        placeholderTextColor={colors.mutedLight} style={styles.input} autoFocus accessibilityLabel={t('search')} />
      {isValidCivilDate(dateQuery) && <Card onPress={() => router.push(`/date/${dateQuery}`)}>
        <AppText weight="700">{dateLabel(dateQuery, language, devanagariDigits)}</AppText>
        <AppText variant="small" tone="primary">{t('dayDetails')}</AppText>
      </Card>}
      {!!trimmed && !isValidCivilDate(dateQuery) && /^\d{4}-/.test(dateQuery) && <AppText variant="small" tone="error">{t('invalidDate')}</AppText>}

      <SectionHeader title={t('reminders')} />
      {reminders.length ? reminders.map((reminder) => <Card key={reminder.id} onPress={() => router.push(`/reminders/${reminder.id}`)}>
        <AppText weight="700">{reminder.title}</AppText>
        <AppText variant="small" tone="muted">{dateLabel(reminder.startDate, language, devanagariDigits)}</AppText>
      </Card>) : trimmed ? <AppText tone="muted">{t('noResults')}</AppText> : <AppText tone="muted">{t('searchPlaceholder')}</AppText>}

      <SectionHeader title={`${t('festivals')} · ${t('monthHighlights')}`} />
      {festivals.length ? festivals.map(({ date, festival }) => <Card key={festival.id} onPress={() => router.push({ pathname: '/festivals/[eventId]', params: { eventId: festival.id, date, region: profile?.region ?? 'all' } })}>
        <AppText weight="700">{festival.name}</AppText>
        <AppText variant="small" tone="muted">{dateLabel(date, language, devanagariDigits)}</AppText>
      </Card>) : <AppText tone="muted">{trimmed ? t('noResults') : t('festivalSearch')}</AppText>}
      <Button title={t('viewAll')} variant="secondary" onPress={() => router.push('/festivals')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, minHeight: 52, paddingHorizontal: spacing.md, fontSize: 16, color: colors.text },
});
