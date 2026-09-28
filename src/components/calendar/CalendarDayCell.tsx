import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export type CalendarDayData = {
  tithi?: string;
  eventLabel?: string;
  eventCount?: number;
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
  todayLabel,
  data,
  density = 'simple',
  onPress,
}: CalendarDayCellProps) {
  const label = data?.accessibilityLabel ?? [date, isToday && todayLabel, data?.tithi, data?.eventLabel].filter(Boolean).join(', ');
  const numberTone = isSelected ? 'inverse' : isSunday ? 'sunday' : 'default';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onPress(date)}
      style={({ pressed }) => [styles.cell, !isCurrentMonth && styles.outside, pressed && styles.pressed]}
    >
      <View style={[styles.numberBadge, isSelected && styles.selected, isToday && !isSelected && styles.today]}>
        <AppText variant="small" weight="700" tone={numberTone} style={styles.number}>{dayLabel ?? day}</AppText>
      </View>
      {isToday && todayLabel ? <AppText variant="caption" weight="700" tone="primary" numberOfLines={1} style={styles.todayLabel}>{todayLabel}</AppText> : null}
      {data?.tithi ? <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.markerText}>{data.tithi}</AppText> : null}
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
  cell: { width: '14.2857%', minHeight: 90, alignItems: 'center', paddingHorizontal: 1, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  outside: { opacity: 0.42 },
  pressed: { backgroundColor: colors.goldTint },
  numberBadge: { width: 30, minHeight: 30, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  selected: { backgroundColor: colors.primary },
  today: { borderColor: colors.primary, borderWidth: 2, borderRadius: radius.md },
  number: { textAlign: 'center' },
  todayLabel: { fontSize: 9, lineHeight: 15, maxWidth: '100%' },
  markerText: { fontSize: 10, lineHeight: 17, textAlign: 'center', maxWidth: '100%' },
  markers: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reminderDot: { width: 6, height: 6, backgroundColor: colors.gold, borderRadius: radius.pill },
  count: { fontSize: 10, lineHeight: 14 },
});
