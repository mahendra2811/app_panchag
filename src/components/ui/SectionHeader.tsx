import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText } from './AppText';

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="subtitle" weight="700">{title}</AppText>
        {subtitle ? <AppText variant="small" tone="muted">{subtitle}</AppText> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, text: { flex: 1 } });
