import { CalendarDays, ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Chip } from '@/components/ui';
import { colors, spacing } from '@/theme';

export type FestivalCardProps = {
  title: string;
  dateLabel: string;
  categoryLabel?: string;
  description?: string;
  regionLabel?: string;
  onPress?: () => void;
};

export function FestivalCard({ title, dateLabel, categoryLabel, description, regionLabel, onPress }: FestivalCardProps) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${title}, ${dateLabel}`} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleBlock}>
          <AppText variant="body" weight="700">{title}</AppText>
          <View style={styles.date}><CalendarDays size={16} color={colors.primary} /><AppText variant="small" tone="muted">{dateLabel}</AppText></View>
        </View>
        {onPress ? <ChevronRight size={20} color={colors.primary} /> : null}
      </View>
      {description ? <AppText variant="small" tone="muted" numberOfLines={2}>{description}</AppText> : null}
      {categoryLabel || regionLabel ? <View style={styles.chips}>{categoryLabel ? <Chip label={categoryLabel} compact /> : null}{regionLabel ? <Chip label={regionLabel} compact /> : null}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, titleBlock: { flex: 1, gap: spacing.xs }, date: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
