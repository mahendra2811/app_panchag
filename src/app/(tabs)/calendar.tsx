import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AgendaDayList, CalendarHeader, DatePickerField, MonthGrid, MonthYearPicker } from '@/components/calendar';
import type { CalendarDayData } from '@/components/calendar';
import { AppText, Button, Card, Screen, SectionHeader } from '@/components/ui';
import { SourceBadge } from '@/components/panchang';
import { getCityById } from '@/data/cities';
import { formatCivilDate, getMonthGrid, parseCivilDate } from '@/domain/calendar';
import { dateLabel, monthLabel } from '@/features/calendar/format';
import { useMonthSummary } from '@/features/calendar/useMonthSummary';
import { useToday } from '@/features/calendar/useToday';
import { usePanchangProfile } from '@/features/panchang/usePanchang';
import { localizeDigits, MONTH_NAMES, WEEKDAY_NAMES } from '@/i18n';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';

export default function CalendarScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const today = useToday();
  const { language, cityId, simpleMode, textSize, weekStart, devanagariDigits } = usePreferences();
  const profile = usePanchangProfile();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [pickerOpen, setPickerOpen] = useState(false);
  const { days, loadedCount, totalCount, loading } = useMonthSummary(year, month, profile, language);
  const city = cityId ? getCityById(cityId) : null;

  const markers = useMemo(() => {
    const next: Record<string, CalendarDayData> = {};
    for (const [date, day] of Object.entries(days)) next[date] = {
      tithi: day.summaryAtSunrise.tithiName ?? undefined,
      eventLabel: day.observances[0]?.name,
      eventCount: day.observances.length,
      nakshatra: day.limbs.nakshatra.find((entry) => entry.isActiveAtSunrise)?.name,
    };
    return next;
  }, [days]);

  const weekdays = WEEKDAY_NAMES[language].map((name) => name.slice(0, language === 'hi' ? 2 : 3));
  const selected = days[selectedDate];

  function choose(date: string) {
    const parts = parseCivilDate(date);
    if (!parts) return;
    setSelectedDate(date); setYear(parts.year); setMonth(parts.month);
  }

  function move(delta: -1 | 1) {
    const absolute = year * 12 + month - 1 + delta;
    const nextYear = Math.floor(absolute / 12);
    const nextMonth = ((absolute % 12) + 12) % 12 + 1;
    const next = formatCivilDate(nextYear, nextMonth, 1);
    if (next) choose(next);
  }

  return (
    <Screen>
      <AppText variant="title" weight="700">{t('calendar')}</AppText>
      <AppText tone="muted" variant="small">{t('selectDateHint')}</AppText>
      <View style={styles.searchRow}>
        <DatePickerField date={selectedDate} label={t('chooseDate')} onSelect={(date) => { choose(date); router.push(`/date/${date}`); }} />
      </View>

      <CalendarHeader monthLabel={monthLabel(year, month, language, devanagariDigits)} onPrevious={() => move(-1)} onNext={() => move(1)}
        onPickMonth={() => setPickerOpen(true)} onToday={() => choose(today)}
        labels={{ previous: t('previous'), next: t('next'), pickMonth: t('chooseMonth'), today: t('today'), week: t('week'), month: t('month') }} />

      {textSize === 'extraLarge' ? (
        <AgendaDayList days={getMonthGrid(year, month, weekStart).weeks.flat().filter((cell) => cell.inMonth && cell.date).map((cell) => ({
          date: cell.date!, dateLabel: dateLabel(cell.date!, language, devanagariDigits), data: markers[cell.date!], isToday: cell.date === today, isSelected: cell.date === selectedDate,
        }))} todayLabel={t('today')} onSelectDate={choose} />
      ) : (
        <MonthGrid year={year} month={month} weekStart={weekStart} weekdayLabels={weekdays} formatDay={(day) => localizeDigits(day, language, devanagariDigits)} selectedDate={selectedDate}
          todayDate={today} todayLabel={t('today')} days={markers} density={simpleMode ? 'simple' : 'detailed'} onSelectDate={choose} />
      )}

      {loading && <AppText tone="muted" variant="small">{t('loading')} {loadedCount}/{totalCount}</AppText>}
      {!city && <Button title={t('selectCity')} variant="secondary" onPress={() => router.push('/settings/location')} />}
      {/* {city && <SourceBadge label={t('calculated', { city: language === 'hi' ? city.nameHi : city.name })} detail={t(city.kind === 'district' ? 'districtApproximation' : 'calculationUnverified')} />} */}

      <Card style={styles.summary}>
        <SectionHeader title={t('selectedDay')} subtitle={dateLabel(selectedDate, language, devanagariDigits)} />
        {selected ? <AppText tone="primary">{[selected.summaryAtSunrise.masaName, selected.summaryAtSunrise.tithiName].filter(Boolean).join(' · ')}</AppText>
          : <AppText tone="muted">{city ? t('dataUnavailable') : t('locationNeeded')}</AppText>}
        <Button title={t('dayDetails')} onPress={() => router.push(`/date/${selectedDate}`)} fullWidth />
      </Card>

      <MonthYearPicker visible={pickerOpen} year={year} month={month} monthLabels={MONTH_NAMES[language]}
        title={t('chooseMonth')} closeLabel={t('close')} previousYearLabel={t('previous')} nextYearLabel={t('next')}
        minYear={1} maxYear={9999} onClose={() => setPickerOpen(false)} onSelect={(pickedYear, pickedMonth) => {
          const date = formatCivilDate(pickedYear, pickedMonth, 1); if (date) choose(date); setPickerOpen(false);
        }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summary: { gap: spacing.md },
});
