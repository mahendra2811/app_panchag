import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { CalendarDayCell, type CalendarDayData } from './CalendarDayCell';
import { addCivilDays, dayOfWeek } from './dateMath';

export type WeekStripProps = {
  startDate: string;
  weekdayLabels: readonly string[];
  weekStart?: 0 | 1;
  selectedDate?: string;
  todayDate?: string;
  todayLabel?: string;
  formatDay?: (day: number) => string;
  days?: Record<string, CalendarDayData>;
  onSelectDate: (date: string) => void;
};

export function WeekStrip({ startDate, weekdayLabels, weekStart = 0, selectedDate, todayDate, todayLabel, formatDay, days = {}, onSelectDate }: WeekStripProps) {
  const startOffset = -((dayOfWeek(startDate) - weekStart + 7) % 7);
  const dates = Array.from({ length: 7 }, (_, index) => {
    try { return addCivilDays(startDate, startOffset + index); } catch { return null; }
  });
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {dates.map((date, index) => (
          <View key={date ?? `outside-${index}`} style={[styles.weekday, index < 6 && styles.verticalDivider]}>
            <AppText variant="small" weight="700" tone={(weekStart + index) % 7 === 0 ? 'sunday' : 'muted'} align="center" numberOfLines={1}>
              {weekdayLabels[(weekStart + index) % 7] ?? ''}
            </AppText>
          </View>
        ))}
      </View>
      <View style={styles.row}>
        {dates.map((date, index) => date ? (
          <CalendarDayCell
            key={date}
            date={date}
            day={Number(date.slice(8, 10))}
            dayLabel={formatDay?.(Number(date.slice(8, 10)))}
            isSelected={date === selectedDate}
            isToday={date === todayDate}
            isSunday={dayOfWeek(date) === 0}
            isWeekEnd={index === 6}
            todayLabel={todayLabel}
            data={days[date]}
            onPress={onSelectDate}
          />
        ) : <View key={`outside-${index}`} style={[styles.emptyCell, index < 6 && styles.verticalDivider]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ wrapper: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, overflow: 'hidden' }, row: { flexDirection: 'row', paddingTop: spacing.xs }, weekday: { width: '14.2857%' }, verticalDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border }, emptyCell: { width: '14.2857%', height: 90 } });
