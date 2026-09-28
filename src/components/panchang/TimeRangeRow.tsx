import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { spacing } from '@/theme';

export type TimeRangeRowProps = { label: string; start?: string; end?: string; value?: string; context?: string; unavailableLabel?: string };

export function TimeRangeRow({ label, start, end, value, context, unavailableLabel }: TimeRangeRowProps) {
  const displayed = value ?? (start && end ? `${start} – ${end}` : start ?? end ?? unavailableLabel ?? '—');
  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <AppText variant="small" tone="muted">{label}</AppText>
        {context ? <AppText variant="caption" tone="muted">{context}</AppText> : null}
      </View>
      <AppText variant="small" weight="600" style={styles.value}>{displayed}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, minHeight: 34 }, label: { flex: 1 }, value: { flex: 1, textAlign: 'right' } });
