import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Chip, IconButton } from '@/components/ui';
import { colors, spacing } from '@/theme';

export type CalendarView = 'today' | 'week' | 'month';
export type CalendarHeaderProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onPickMonth?: () => void;
  onToday?: () => void;
  onChangeView?: (view: CalendarView) => void;
  view?: CalendarView;
  labels: { previous: string; next: string; pickMonth: string; today: string; week: string; month: string };
};

export function CalendarHeader({ monthLabel, onPrevious, onNext, onPickMonth, onToday, onChangeView, view = 'month', labels }: CalendarHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.monthRow}>
        <IconButton label={labels.previous} icon={<ChevronLeft color={colors.primary} size={24} />} onPress={onPrevious} />
        <View style={styles.monthTitle}>
          {onPickMonth ? (
            <Button title={monthLabel} icon={<ChevronDown color={colors.primary} size={18} />} onPress={onPickMonth} variant="ghost" />
          ) : <AppText variant="subtitle" weight="700" align="center">{monthLabel}</AppText>}
        </View>
        <IconButton label={labels.next} icon={<ChevronRight color={colors.primary} size={24} />} onPress={onNext} />
      </View>
      {onToday || onChangeView ? (
        <View style={styles.actionRow}>
          {onToday ? <Button title={labels.today} variant="secondary" onPress={onToday} /> : <View />}
          {onChangeView ? (
            <View style={styles.views}>
              <Chip label={labels.today} selected={view === 'today'} compact onPress={() => onChangeView('today')} />
              <Chip label={labels.week} selected={view === 'week'} compact onPress={() => onChangeView('week')} />
              <Chip label={labels.month} selected={view === 'month'} compact onPress={() => onChangeView('month')} />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  monthRow: { flexDirection: 'row', alignItems: 'center' },
  monthTitle: { flex: 1, alignItems: 'center' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  views: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
