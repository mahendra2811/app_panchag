import { Info } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export type SourceBadgeProps = { label: string; detail?: string; onPress?: () => void; tone?: 'neutral' | 'warning' | 'success' };

export function SourceBadge({ label, detail, onPress, tone = 'neutral' }: SourceBadgeProps) {
  const content = <><Info size={15} color={tone === 'warning' ? colors.warning : tone === 'success' ? colors.success : colors.primary} /><AppText variant="caption" weight="600" tone={tone === 'success' ? 'success' : 'primary'} style={styles.text}>{label}</AppText></>;
  if (onPress) {
    return <Pressable accessibilityRole="button" accessibilityLabel={[label, detail].filter(Boolean).join(', ')} onPress={onPress} style={[styles.badge, tone === 'warning' && styles.warning, tone === 'success' && styles.success]}>{content}</Pressable>;
  }
  return <View accessibilityLabel={[label, detail].filter(Boolean).join(', ')} style={[styles.badge, tone === 'warning' && styles.warning, tone === 'success' && styles.success]}>{content}</View>;
}

const styles = StyleSheet.create({ badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.primaryTint, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, warning: { backgroundColor: colors.warningTint }, success: { backgroundColor: colors.successTint }, text: { flexShrink: 1 } });
