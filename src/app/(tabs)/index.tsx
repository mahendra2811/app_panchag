import { useFocusEffect, useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AgendaDayList, CalendarHeader, MonthGrid, MonthYearPicker, TodayCard, WeekStrip } from '@/components/calendar';
import type { CalendarDayData } from '@/components/calendar';
import { AppText, Button, Card, IconButton, Screen, SectionHeader } from '@/components/ui';
import { SourceBadge } from '@/components/panchang';
import { getCityById } from '@/data/cities';
import { addCivilDays, daysInMonth, formatCivilDate, getMonthGrid, parseCivilDate } from '@/domain/calendar';
import { dateLabel, clockLabel, monthLabel } from '@/features/calendar/format';
import { useMonthSummary } from '@/features/calendar/useMonthSummary';
import { useToday } from '@/features/calendar/useToday';
import { listOccurrences } from '@/features/reminders/repository';
import { usePanchangDay, usePanchangProfile } from '@/features/panchang/usePanchang';
import { localizeDigits, MONTH_NAMES, WEEKDAY_NAMES } from '@/i18n';
import { usePreferences } from '@/store/preferences';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const today = useToday();
  const { language, cityId, homeView, setHomeView, simpleMode, textSize, weekStart, devanagariDigits } = usePreferences();
  const profile = usePanchangProfile();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [displayMonth, setDisplayMonth] = useState(() => ({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) }));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reminderCounts, setReminderCounts] = useState<Record<string, number>>({});
  const { day: selectedDay, loading: dayLoading } = usePanchangDay(selectedDate);
  const city = cityId ? getCityById(cityId) : null;
  const { days: monthDays } = useMonthSummary(displayMonth.year, displayMonth.month, profile, language);

  useFocusEffect(useCallback(() => {
    const first = formatCivilDate(displayMonth.year, displayMonth.month, 1);
    const last = formatCivilDate(displayMonth.year, displayMonth.month, daysInMonth(displayMonth.year, displayMonth.month));
    if (!first || !last) return;
    let active = true;
    void listOccurrences(first, last).then((occurrences) => {
      if (!active) return;
      const counts: Record<string, number> = {};
      for (const occurrence of occurrences) counts[occurrence.date] = (counts[occurrence.date] ?? 0) + 1;
      setReminderCounts(counts);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [displayMonth.year, displayMonth.month]));

  const dayData = useMemo(() => {
    const data: Record<string, CalendarDayData> = {};
    for (const [date, day] of Object.entries(monthDays)) {
      data[date] = {
        tithi: day.summaryAtSunrise.tithiName ?? undefined,
        eventLabel: day.observances[0]?.name,
        eventCount: day.observances.length,
        nakshatra: day.limbs.nakshatra.find((item) => item.isActiveAtSunrise)?.name,
        reminderCount: reminderCounts[date],
        accessibilityLabel: [date, day.summaryAtSunrise.tithiName, day.observances.map((item) => item.name).join(', ')].filter(Boolean).join(', '),
      };
    }
    for (const [date, count] of Object.entries(reminderCounts)) data[date] = { ...data[date], reminderCount: count };
    return data;
  }, [monthDays, reminderCounts]);

  const hinduMonths = [...new Set(Object.values(monthDays).map((day) => day.summaryAtSunrise.masaName).filter(Boolean))];
  const samvats = [...new Set(Object.values(monthDays).map((day) => day.summaryAtSunrise.vikramSamvat).filter((value) => value !== null))];
  const highlights = Object.values(monthDays).flatMap((day) => day.observances.map((event) => ({ date: day.date, event }))).slice(0, 8);
  const weekdayLabels = WEEKDAY_NAMES[language].map((name) => name.slice(0, language === 'hi' ? 2 : 3));

  function selectDate(date: string) {
    setSelectedDate(date);
    const parts = parseCivilDate(date);
    if (parts) setDisplayMonth({ year: parts.year, month: parts.month });
  }

  function move(direction: -1 | 1) {
    if (homeView === 'week' || homeView === 'today') {
      const next = addCivilDays(selectedDate, direction * (homeView === 'week' ? 7 : 1));
      if (next) selectDate(next);
      return;
    }
    const candidate = displayMonth.year * 12 + displayMonth.month - 1 + direction;
    const year = Math.floor(candidate / 12);
    const month = ((candidate % 12) + 12) % 12 + 1;
    const date = formatCivilDate(year, month, 1);
    if (date) selectDate(date);
  }

  function jumpToday() { selectDate(today); }
  const summary = selectedDay?.summaryAtSunrise;
  const rahu = selectedDay?.namedPeriods.rahuKalam?.[0];

  return (
    <Screen>
      <View style={styles.topLine}>
        <View style={styles.topText}><AppText variant="title" weight="700">{t('appName')}</AppText><AppText tone="muted" variant="small">{t('onboardingDescription')}</AppText></View>
        <IconButton label={t('search')} icon={<Search size={23} color={colors.primary} />} onPress={() => router.push('/search')} />
      </View>

      <Pressable onPress={() => router.push('/settings/location')} accessibilityRole="button" style={styles.location}>
        <AppText tone="primary" weight="700">{city ? (language === 'hi' ? city.nameHi : city.name) : t('selectCity')} ⌄</AppText>
        <AppText variant="caption" tone="muted">{city ? t('localData') : t('locationNeeded')}</AppText>
      </Pressable>

      {hinduMonths.length > 0 && <AppText variant="small" tone="primary" weight="600">{hinduMonths.join(' · ')}{samvats.length > 0 ? ` · ${t('samvat')} ${samvats.join('–')}` : ''}</AppText>}

      <CalendarHeader
        monthLabel={monthLabel(displayMonth.year, displayMonth.month, language, devanagariDigits)}
        onPrevious={() => move(-1)} onNext={() => move(1)} onPickMonth={() => setPickerOpen(true)} onToday={jumpToday}
        view={homeView} onChangeView={setHomeView}
        labels={{ previous: t('previous'), next: t('next'), pickMonth: t('chooseMonth'), today: t('today'), week: t('week'), month: t('month') }}
      />

      {homeView === 'month' && (textSize === 'extraLarge' ? (
        <AgendaDayList
          days={getMonthGrid(displayMonth.year, displayMonth.month, weekStart).weeks.flat().filter((cell) => cell.inMonth && cell.date).map((cell) => ({
            date: cell.date!, dateLabel: dateLabel(cell.date!, language, devanagariDigits), data: dayData[cell.date!], isToday: cell.date === today, isSelected: cell.date === selectedDate,
          }))}
          todayLabel={t('today')} onSelectDate={selectDate}
        />
      ) : (
        <MonthGrid year={displayMonth.year} month={displayMonth.month} weekStart={weekStart} weekdayLabels={weekdayLabels} formatDay={(day) => localizeDigits(day, language, devanagariDigits)}
          selectedDate={selectedDate} todayDate={today} todayLabel={t('today')} days={dayData} density={simpleMode ? 'simple' : 'detailed'} onSelectDate={selectDate} />
      ))}

      {homeView === 'week' && <WeekStrip startDate={selectedDate} weekStart={weekStart} weekdayLabels={weekdayLabels} formatDay={(day) => localizeDigits(day, language, devanagariDigits)} selectedDate={selectedDate} todayDate={today} todayLabel={t('today')} days={dayData} onSelectDate={selectDate} />}

      {homeView === 'today' && <TodayCard dateLabel={dateLabel(selectedDate, language, devanagariDigits)}
        hinduDate={[summary?.masaName, summary?.tithiName].filter(Boolean).join(' · ') || undefined}
        eventLabel={selectedDay?.observances[0]?.name} sunriseLabel={t('sunrise')} sunrise={clockLabel(selectedDay?.astronomy.sunrise.local)}
        sunsetLabel={t('sunset')} sunset={clockLabel(selectedDay?.astronomy.sunset.local)} rahuKaalLabel={t('rahuKaal')}
        rahuKaal={rahu ? `${clockLabel(rahu.startsLocal)}–${clockLabel(rahu.endsLocal)}` : undefined}
        reminderCount={reminderCounts[selectedDate]} reminderLabel={`${reminderCounts[selectedDate] ?? 0} ${t('reminders')}`}
        actionLabel={t('dayDetails')} onOpen={() => router.push(`/date/${selectedDate}`)} />}

      {homeView !== 'today' && (
        <Card style={styles.selectedCard}>
          <SectionHeader title={t('selectedDay')} subtitle={dateLabel(selectedDate, language, devanagariDigits)} />
          {city ? dayLoading ? <AppText tone="muted">{t('loading')}</AppText> : summary ? <AppText tone="primary">{[summary.masaName, summary.tithiName].filter(Boolean).join(' · ')}</AppText> : <AppText tone="muted">{t('dataUnavailable')}</AppText> : <AppText tone="muted">{t('locationNeeded')}</AppText>}
          {selectedDay?.observances.map((event) => <AppText key={event.id} variant="small">• {event.name}</AppText>)}
          <Button title={t('dayDetails')} onPress={() => router.push(`/date/${selectedDate}`)} fullWidth />
        </Card>
      )}

      {!!city && <SourceBadge label={t('calculated', { city: language === 'hi' ? city.nameHi : city.name })} detail={t('calculationUnverified')} />}

      <SectionHeader title={t('monthHighlights')} action={<Button title={t('viewAll')} variant="ghost" onPress={() => router.push('/festivals')} />} />
      {highlights.length === 0 ? <AppText tone="muted">{city ? t('noFestivalsInMonth') : t('locationNeeded')}</AppText> : highlights.map(({ date, event }) => (
        <Card key={event.id} onPress={() => router.push({ pathname: '/festivals/[eventId]', params: { eventId: event.id, date, region: profile?.region ?? 'all' } })}>
          <AppText weight="700">{event.name}</AppText>
          <AppText variant="small" tone="muted">{dateLabel(date, language, devanagariDigits)}</AppText>
        </Card>
      ))}

      <MonthYearPicker visible={pickerOpen} year={displayMonth.year} month={displayMonth.month}
        monthLabels={MONTH_NAMES[language]} title={t('chooseMonth')} closeLabel={t('close')}
        previousYearLabel={t('previous')} nextYearLabel={t('next')}
        minYear={1} maxYear={9999} onClose={() => setPickerOpen(false)}
        onSelect={(year, month) => { const date = formatCivilDate(year, month, 1); if (date) selectDate(date); setPickerOpen(false); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  topText: { flex: 1 },
  location: { backgroundColor: colors.goldTint, borderRadius: 12, padding: spacing.md, gap: spacing.xs },
  selectedCard: { gap: spacing.sm },
});
