import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, minimumTouchTarget, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  compact?: boolean;
  accessibilityLabel?: string;
  singleLine?: boolean;
  style?: ViewStyle;
};

export function Chip({ label, selected = false, onPress, compact = false, accessibilityLabel, singleLine = false, style }: ChipProps) {
  const content = (
    <AppText
      variant={compact ? 'caption' : 'small'}
      weight="600"
      tone={selected ? 'inverse' : 'primary'}
      numberOfLines={singleLine ? 1 : undefined}
      adjustsFontSizeToFit={singleLine}
      minimumFontScale={0.7}
    >
      {label}
    </AppText>
  );
  if (!onPress) return <View style={[styles.base, styles.static, selected && styles.selected, compact && styles.compact, style]}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      hitSlop={compact ? { top: 6, bottom: 6 } : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles.interactive, selected && styles.selected, compact && styles.compact, compact && styles.compactInteractive, pressed && styles.pressed, style]}
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
  compactInteractive: { minHeight: 36 },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.7 },
});
