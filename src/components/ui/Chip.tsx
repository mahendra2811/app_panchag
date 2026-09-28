import { Pressable, StyleSheet, View } from 'react-native';
import { colors, minimumTouchTarget, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function Chip({ label, selected = false, onPress, compact = false, accessibilityLabel }: ChipProps) {
  const content = (
    <AppText variant={compact ? 'caption' : 'small'} weight="600" tone={selected ? 'inverse' : 'primary'}>
      {label}
    </AppText>
  );
  if (!onPress) return <View style={[styles.base, styles.static, selected && styles.selected, compact && styles.compact]}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles.interactive, selected && styles.selected, compact && styles.compact, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  static: { minHeight: 30 },
  interactive: { minHeight: minimumTouchTarget },
  compact: { paddingHorizontal: spacing.sm },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.7 },
});
