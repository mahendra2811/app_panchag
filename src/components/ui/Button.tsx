import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, minimumTouchTarget, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  compact?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  compact = false,
  accessibilityHint,
  style,
}: ButtonProps) {
  const unavailable = disabled || loading;
  const foreground = variant === 'primary' || variant === 'danger' ? colors.surface : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      hitSlop={{ top: compact ? 6 : spacing.xxs, bottom: compact ? 6 : spacing.xxs }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !unavailable && styles.pressed,
        unavailable && styles.disabled,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={foreground} size="small" /> : icon}
      <AppText variant="small" weight="700" tone={variant === 'primary' || variant === 'danger' ? 'inverse' : 'primary'}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minimumTouchTarget - spacing.xs,
    minWidth: minimumTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compact: { minHeight: 36, paddingVertical: 0 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.48 },
});
