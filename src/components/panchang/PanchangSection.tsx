import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card } from '@/components/ui';
import { colors, minimumTouchTarget, spacing } from '@/theme';

export type PanchangSectionProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  initiallyExpanded?: boolean;
  unavailableLabel?: string;
  accessibilityExpandLabel?: string;
  accessibilityCollapseLabel?: string;
};

export function PanchangSection({ title, subtitle, children, initiallyExpanded = true, unavailableLabel, accessibilityExpandLabel, accessibilityCollapseLabel }: PanchangSectionProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? accessibilityCollapseLabel ?? title : accessibilityExpandLabel ?? title}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={styles.header}
      >
        <View style={styles.titleBlock}>
          <AppText variant="subtitle" weight="700">{title}</AppText>
          {subtitle ? <AppText variant="small" tone="muted">{subtitle}</AppText> : null}
        </View>
        {expanded ? <ChevronUp color={colors.primary} size={20} /> : <ChevronDown color={colors.primary} size={20} />}
      </Pressable>
      {expanded ? <View style={styles.body}>{children ?? (unavailableLabel ? <AppText tone="muted">{unavailableLabel}</AppText> : null)}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: minimumTouchTarget, flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.sm },
  titleBlock: { flex: 1 },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.sm },
});
