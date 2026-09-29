import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export type CalendarDayData = {
  tithi?: string;
  tithiFirstLine?: string;
  tithiSecondLine?: string;
  eventLabel?: string;
  eventCount?: number;
  isHoliday?: boolean;
  reminderCount?: number;
  nakshatra?: string;
  accessibilityLabel?: string;
};

export type CalendarDayCellProps = {
  date: string;
  day: number;
  dayLabel?: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  isSunday?: boolean;
  isWeekEnd?: boolean;
  todayLabel?: string;
  data?: CalendarDayData;
  density?: 'simple' | 'detailed';
  onPress: (date: string) => void;
};

export function CalendarDayCell({
  date,
  day,
  dayLabel,
  isCurrentMonth = true,
  isToday = false,
  isSelected = false,
  isSunday = false,
  isWeekEnd = false,
  todayLabel,
  data,
  density = 'simple',
  onPress,
}: CalendarDayCellProps) {
  const label = data?.accessibilityLabel ?? [date, isToday && todayLabel, data?.tithi, data?.eventLabel].filter(Boolean).join(', ');
  const specialDay = isSunday || !!data?.isHoliday || !!data?.eventLabel;
  const numberTone = isSelected ? 'inverse' : (isSunday || data?.isHoliday) ? 'sunday' : 'default';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onPress(date)}
      style={({ pressed }) => [styles.cell, density === 'detailed' && styles.detailedCell, !isWeekEnd && styles.verticalDivider,
        specialDay && styles.specialCell, isToday && styles.todayCell, !isCurrentMonth && styles.outside, pressed && styles.pressed]}
    >
      <View style={[styles.numberBadge, isSelected && styles.selected, isToday && !isSelected && styles.today]}>
        <AppText variant="small" weight="700" tone={numberTone} style={styles.number}>{dayLabel ?? day}</AppText>
      </View>
      {data?.tithiFirstLine && data.tithiSecondLine ? (
        <View style={styles.tithiStack}>
          <AppText variant="caption" tone="muted" weight="600" numberOfLines={1} style={styles.tithiFirstLine}>{data.tithiFirstLine}</AppText>
          <AppText variant="caption" tone="muted" weight="500" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={styles.tithiSecondLine}>{data.tithiSecondLine}</AppText>
        </View>
      ) : data?.tithi ? <AppText variant="caption" tone="muted" numberOfLines={1} adjustsFontSizeToFit style={styles.markerText}>{data.tithi}</AppText> : null}
      {data?.eventLabel ? <AppText variant="caption" tone="primary" weight="600" numberOfLines={1} style={styles.markerText}>{data.eventLabel}</AppText> : null}
      {density === 'detailed' && data?.nakshatra ? <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.markerText}>{data.nakshatra}</AppText> : null}
      {(data?.reminderCount ?? 0) > 0 || (data?.eventCount ?? 0) > 1 ? (
        <View style={styles.markers}>
          {(data?.reminderCount ?? 0) > 0 ? <View style={styles.reminderDot} /> : null}
          {(data?.eventCount ?? 0) > 1 ? <AppText variant="caption" tone="muted" style={styles.count}>+{(data?.eventCount ?? 0) - 1}</AppText> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: '14.2857%', height: 90, alignItems: 'center', paddingHorizontal: 1, paddingVertical: spacing.xs, overflow: 'hidden', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  detailedCell: { height: 104 },
  verticalDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  specialCell: { backgroundColor: '#FFF9F5' },
  todayCell: { backgroundColor: colors.goldTint },
  outside: { opacity: 0.42 },
  pressed: { backgroundColor: colors.goldTint },
  numberBadge: { width: 24, minHeight: 24, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  selected: { backgroundColor: colors.primary },
  today: { borderColor: colors.primary, borderWidth: 2, borderRadius: radius.md },
  number: { textAlign: 'center' },
  markerText: { fontSize: 9, lineHeight: 13, textAlign: 'center', maxWidth: '100%' },
  tithiStack: { width: '100%', alignItems: 'center' },
  tithiFirstLine: { fontSize: 9, lineHeight: 12, textAlign: 'center', width: '100%' },
  tithiSecondLine: { fontSize: 9, lineHeight: 14, textAlign: 'center', width: '100%' },
  markers: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reminderDot: { width: 6, height: 6, backgroundColor: colors.gold, borderRadius: radius.pill },
  count: { fontSize: 10, lineHeight: 14 },
});
