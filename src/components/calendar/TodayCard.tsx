import { ArrowRight, Bell, Sun } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Divider } from '@/components/ui';
import { colors, spacing } from '@/theme';

export type TodayCardProps = {
  dateLabel: string;
  hinduDate?: string;
  eventLabel?: string;
  sunriseLabel?: string;
  sunrise?: string;
  sunsetLabel?: string;
  sunset?: string;
  rahuKaalLabel?: string;
  rahuKaal?: string;
  reminderCount?: number;
  reminderLabel?: string;
  actionLabel: string;
  onOpen: () => void;
};

export function TodayCard({ dateLabel, hinduDate, eventLabel, sunriseLabel, sunrise, sunsetLabel, sunset, rahuKaalLabel, rahuKaal, reminderCount, reminderLabel, actionLabel, onOpen }: TodayCardProps) {
  return (
    <Card style={styles.card}>
      <AppText variant="title" weight="700">{dateLabel}</AppText>
      {hinduDate ? <AppText variant="body" tone="primary" weight="600">{hinduDate}</AppText> : null}
      {eventLabel ? <AppText variant="body" weight="600">{eventLabel}</AppText> : null}
      {(sunrise || sunset || rahuKaal) ? <Divider /> : null}
      {sunrise ? <View style={styles.row}><Sun size={17} color={colors.primary} /><AppText variant="small" tone="muted">{sunriseLabel}: {sunrise}</AppText></View> : null}
      {sunset ? <View style={styles.row}><Sun size={17} color={colors.primary} /><AppText variant="small" tone="muted">{sunsetLabel}: {sunset}</AppText></View> : null}
      {rahuKaal ? <AppText variant="small" tone="muted">{rahuKaalLabel}: {rahuKaal}</AppText> : null}
      {(reminderCount ?? 0) > 0 ? <View style={styles.row}><Bell size={17} color={colors.primary} /><AppText variant="small" tone="primary">{reminderLabel ?? reminderCount}</AppText></View> : null}
      <Button title={actionLabel} onPress={onOpen} icon={<ArrowRight size={18} color={colors.surface} />} fullWidth />
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm } });
