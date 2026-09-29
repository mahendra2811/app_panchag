import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { CalendarDayCell, type CalendarDayData } from './CalendarDayCell';
import { addCivilDays, dayOfWeek, daysInCivilMonth, toIsoDate } from './dateMath';

export type MonthGridProps = {
  year: number;
  month: number;
  weekdayLabels: readonly string[];
  weekStart?: 0 | 1;
  selectedDate?: string;
  todayDate?: string;
  todayLabel?: string;
  formatDay?: (day: number) => string;
  days?: Record<string, CalendarDayData>;
  density?: 'simple' | 'detailed';
  onSelectDate: (date: string) => void;
};

export function MonthGrid({ year, month, weekdayLabels, weekStart = 0, selectedDate, todayDate, todayLabel, formatDay, days = {}, density = 'simple', onSelectDate }: MonthGridProps) {
  const first = toIsoDate(year, month, 1);
  const offset = (dayOfWeek(first) - weekStart + 7) % 7;
  const daysInMonth = daysInCivilMonth(year, month);
  const total = Math.ceil((offset + daysInMonth) / 7) * 7;
  const dates = Array.from({ length: total }, (_, index) => {
    try { return addCivilDays(first, index - offset); } catch { return null; }
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.weekdays}>
        {Array.from({ length: 7 }, (_, index) => (
          <View key={index} style={[styles.weekday, index < 6 && styles.verticalDivider]}>
            <AppText variant="small" weight="700" tone={(index + weekStart) % 7 === 0 ? 'sunday' : 'muted'} align="center" numberOfLines={1}>{weekdayLabels[(index + weekStart) % 7] ?? ''}</AppText>
          </View>
        ))}
      </View>
      <View style={styles.cells}>
        {dates.map((date, index) => {
          if (!date) return <View key={`outside-${index}`} style={[styles.emptyCell, density === 'detailed' && styles.detailedEmptyCell, index % 7 !== 6 && styles.verticalDivider]} />;
          const currentMonth = date.startsWith(`${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-`);
          return (
            <CalendarDayCell
              key={date}
              date={date}
              day={Number(date.slice(8, 10))}
              dayLabel={formatDay?.(Number(date.slice(8, 10)))}
              isCurrentMonth={currentMonth}
              isToday={date === todayDate}
              isSelected={date === selectedDate}
              isSunday={dayOfWeek(date) === 0}
              isWeekEnd={index % 7 === 6}
              todayLabel={todayLabel}
              data={days[date]}
              density={density}
              onPress={onSelectDate}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  weekdays: { flexDirection: 'row', backgroundColor: colors.surfaceWarm, borderBottomColor: colors.border, borderBottomWidth: 1, paddingVertical: spacing.sm },
  weekday: { width: '14.2857%' },
  verticalDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  cells: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyCell: { width: '14.2857%', height: 90, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  detailedEmptyCell: { height: 104 },
});
