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
          {panchangSummary || (onToday && !onChangeView) ? (
            <View style={styles.todayGroup}>
              {onToday && !onChangeView ? (
                <Button title={labels.today} variant="secondary" onPress={onToday} compact />
              ) : null}
              {!!panchangSummary && (
                <View
                  style={styles.todayPanchang}
                  accessibilityLabel={`${panchangSummary.months}, ${panchangSummary.samvat}`}
                >
                  <AppText
                    variant="caption"
                    tone="primary"
                    weight="600"
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
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {panchangSummary.samvat}
                    </AppText>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View />
          )}
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  todayGroup: { flex: 1, minWidth: 138, alignItems: 'flex-start' },
  todayPanchang: { flex: 1, minWidth: 138, maxWidth: 220 },
  views: { flexDirection: 'row', flexWrap: 'nowrap', minWidth: 220, maxWidth: '100%', marginLeft: 'auto', gap: spacing.xs },
  viewChip: { flexShrink: 1, minWidth: 0, paddingHorizontal: spacing.xs },
});
