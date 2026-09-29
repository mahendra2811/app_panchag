import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Chip, IconButton } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export type CalendarView = 'today' | 'week' | 'month';
export type CalendarHeaderProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onPickMonth?: () => void;
  onToday?: () => void;
  panchangSummary?: { months: string; samvat: string };
  onChangeView?: (view: CalendarView) => void;
  view?: CalendarView;
  labels: {
    previous: string;
    next: string;
    pickMonth: string;
    today: string;
    week: string;
    month: string;
  };
};

export function CalendarHeader({
  monthLabel,
  onPrevious,
  onNext,
  onPickMonth,
  onToday,
  panchangSummary,
  onChangeView,
  view = 'month',
  labels,
}: CalendarHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.monthRow}>
        <IconButton
          label={labels.previous}
          icon={<ChevronLeft color={colors.primary} size={24} />}
          onPress={onPrevious}
        />
        <View style={styles.monthTitle}>
          {onPickMonth ? (
            <Button
              title={monthLabel}
              icon={<ChevronDown color={colors.primary} size={18} />}
              onPress={onPickMonth}
              variant="ghost"
              compact
              style={styles.monthPicker}
            />
          ) : (
            <AppText variant="subtitle" weight="700" align="center">
              {monthLabel}
            </AppText>
          )}
        </View>
        <IconButton
          label={labels.next}
          icon={<ChevronRight color={colors.primary} size={24} />}
          onPress={onNext}
        />
      </View>
      {onToday || onChangeView ? (
        <View style={styles.actionRow}>
          {onToday && !onChangeView ? (
            <Button title={labels.today} variant="secondary" onPress={onToday} compact />
          ) : null}
          {onChangeView ? (
            <View style={styles.views}>
              <Chip
                label={labels.today}
                selected={view === 'today'}
                compact
                singleLine
                style={styles.viewChip}
                onPress={() => { onToday?.(); onChangeView('today'); }}
              />
              <Chip
                label={labels.week}
                selected={view === 'week'}
                compact
                singleLine
                style={styles.viewChip}
                onPress={() => onChangeView('week')}
              />
              <Chip
                label={labels.month}
                selected={view === 'month'}
                compact
                singleLine
                style={styles.viewChip}
                onPress={() => onChangeView('month')}
              />
            </View>
          ) : null}
          {panchangSummary ? (
            <View
              style={styles.todayPanchang}
              accessibilityLabel={`${panchangSummary.months}, ${panchangSummary.samvat}`}
            >
              <AppText
                variant="caption"
                tone="primary"
                weight="600"
                align="right"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {panchangSummary.months}
              </AppText>
              {!!panchangSummary.samvat && (
                <AppText
                  variant="caption"
                  tone="muted"
                  align="right"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {panchangSummary.samvat}
                </AppText>
              )}
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
  monthPicker: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  todayPanchang: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.goldTint,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  views: { width: '62%', maxWidth: 260, flexDirection: 'row', gap: spacing.sm },
  viewChip: { flex: 1, minWidth: 0, paddingHorizontal: spacing.xxs },
});
