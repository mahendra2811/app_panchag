import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export type ScreenProps = { children: ReactNode; scroll?: boolean; padded?: boolean; style?: ViewStyle; contentStyle?: ViewStyle };

export function Screen({ children, scroll = true, padded = true, style, contentStyle }: ScreenProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, padded && styles.padded, contentStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, padded && styles.padded, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, fill: { flex: 1 }, scrollContent: { flexGrow: 1, paddingBottom: spacing.xxxl }, padded: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg } });
