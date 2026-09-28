import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, Screen } from '@/components/ui';
import { colors, spacing } from '@/theme';

export function Page({ title, subtitle, children, scroll = true }: { title: string; subtitle?: string; children: ReactNode; scroll?: boolean }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen scroll={scroll}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.heading}>
          <AppText variant="title" weight="700">{title}</AppText>
          {subtitle ? <AppText variant="small" tone="muted">{subtitle}</AppText> : null}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </Screen>
  );
}

export function MenuRow({ title, subtitle, onPress, leading }: { title: string; subtitle?: string; onPress: () => void; leading?: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
      {leading}
      <View style={styles.menuText}>
        <AppText weight="600">{title}</AppText>
        {subtitle ? <AppText variant="small" tone="muted">{subtitle}</AppText> : null}
      </View>
      <ChevronRight size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  back: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },
  heading: { flex: 1 },
  content: { gap: spacing.md },
  menuRow: { minHeight: 58, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuText: { flex: 1 },
  pressed: { opacity: 0.75 },
});
