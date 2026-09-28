import { StyleSheet, View } from 'react-native';
import { AppText, Card, StatusState } from '@/components/ui';
import { colors, spacing } from '@/theme';
import type { CalendarDayData } from './CalendarDayCell';

export type AgendaDay = { date: string; dateLabel: string; data?: CalendarDayData; isToday?: boolean; isSelected?: boolean };
export type AgendaDayListProps = {
  days: readonly AgendaDay[];
  todayLabel?: string;
  emptyLabel?: string;
  onSelectDate: (date: string) => void;
};

/** Readable alternative to the seven-column grid at large system font sizes. */
export function AgendaDayList({ days, todayLabel, emptyLabel, onSelectDate }: AgendaDayListProps) {
  if (days.length === 0 && emptyLabel) return <StatusState title={emptyLabel} />;
  return (
    <View style={styles.list}>
      {days.map((day) => (
        <Card key={day.date} onPress={() => onSelectDate(day.date)} accessibilityLabel={day.data?.accessibilityLabel ?? [day.dateLabel, day.data?.tithi, day.data?.eventLabel].filter(Boolean).join(', ')} style={day.isSelected ? styles.selected : undefined}>
          <View style={styles.header}>
            <AppText variant="body" weight="700" style={styles.date}>{day.dateLabel}</AppText>
            {day.isToday && todayLabel ? <AppText variant="small" weight="700" tone="primary">{todayLabel}</AppText> : null}
          </View>
          {day.data?.tithi ? <AppText variant="small" tone="muted">{day.data.tithi}</AppText> : null}
          {day.data?.eventLabel ? <AppText variant="small" tone="primary">{day.data.eventLabel}</AppText> : null}
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.sm }, header: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, date: { flex: 1 }, selected: { borderWidth: 2, borderColor: colors.primary } });
