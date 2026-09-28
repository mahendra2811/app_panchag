import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

type StatusStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function StatusState({ title, description, icon, actionLabel, onAction }: StatusStateProps) {
  return (
    <View style={styles.container} accessibilityRole="summary">
      {icon}
      <AppText variant="subtitle" weight="700" align="center">{title}</AppText>
      {description ? <AppText tone="muted" align="center">{description}</AppText> : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} variant="secondary" /> : null}
    </View>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={colors.primary} />
      <AppText tone="muted" align="center">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ container: { minHeight: 176, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.xl } });
