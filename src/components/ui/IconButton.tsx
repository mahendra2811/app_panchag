import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { colors, minimumTouchTarget, radius } from '@/theme';

export type IconButtonProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
  style?: ViewStyle;
};

export function IconButton({ icon, label, onPress, disabled = false, selected = false, style }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, selected && styles.selected, pressed && styles.pressed, disabled && styles.disabled, style]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: minimumTouchTarget, height: minimumTouchTarget, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  selected: { backgroundColor: colors.primaryTint },
  pressed: { backgroundColor: colors.goldTint },
  disabled: { opacity: 0.4 },
});
