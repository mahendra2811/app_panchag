import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getReminder } from '@/features/reminders/repository';
import i18n from '@/i18n';
import { reconcileNotifications, startReminderReconciliation } from '@/services/notifications';
import { usePreferences } from '@/store/preferences';
import { colors, radius, spacing, TextScaleProvider } from '@/theme';

export default function RootLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { language, hydrated, onboardingComplete, notificationsEnabled, textSize } =
    usePreferences();
  const [brandIntroReady, setBrandIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBrandIntroReady(true), 550);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (!hydrated) return;
    const onOnboarding = segments[0] === 'onboarding';
    if (!onboardingComplete && !onOnboarding) router.replace('/onboarding');
    if (onboardingComplete && onOnboarding) router.replace('/(tabs)');
  }, [hydrated, onboardingComplete, router, segments]);

  useEffect(() => {
    if (!hydrated) return;
    return startReminderReconciliation(() => {
      const state = usePreferences.getState();
      return { language: state.language, enabled: state.notificationsEnabled };
    });
  }, [hydrated]);

  useEffect(() => {
    if (hydrated)
      void reconcileNotifications({ language, enabled: notificationsEnabled }).catch(
        () => undefined,
      );
  }, [hydrated, language, notificationsEnabled]);

  useEffect(() => {
    if (!hydrated || !onboardingComplete) return;
    const openReminder = async (data: Record<string, unknown> | undefined) => {
      if (data?.owner !== 'hindu-calendar-reminder' || typeof data.reminderId !== 'string') return;
      const reminder = await getReminder(data.reminderId);
      if (reminder) router.push(`/reminders/${reminder.id}`);
    };
    void Notifications.getLastNotificationResponseAsync()
      .then((response) => openReminder(response?.notification.request.content.data))
      .catch(() => undefined);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      void openReminder(response.notification.request.content.data).catch(() => undefined);
    });
    return () => subscription.remove();
  }, [hydrated, onboardingComplete, router]);

  return (
    <TextScaleProvider value={textSize}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      />
      {(!hydrated || !brandIntroReady) && (
        <View
          style={styles.loading}
          accessibilityRole="progressbar"
          accessibilityLabel={i18n.t('loading')}
        >
          <View style={styles.brand}>
            <View style={styles.logoHalo}>
              <Image
                source={require('../../assets/images/logo_without_background.png')}
                resizeMode="contain"
                style={styles.logo}
                accessibilityLabel="हिन्दू कैलेंडर"
              />
            </View>
            <Text style={styles.brandName}>हिन्दू कैलेंडर</Text>
            <View style={styles.divider} />
            <Text style={styles.brandDescription}>पंचांग · तिथि · त्योहार</Text>
          </View>
          <View style={[styles.loadingIndicator, { bottom: insets.bottom + spacing.xxxl }]}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>लोड हो रहा है…</Text>
          </View>
        </View>
      )}
    </TextScaleProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  brand: { alignItems: 'center', width: '100%' },
  logoHalo: {
    width: 224,
    height: 224,
    borderRadius: radius.pill,
    backgroundColor: colors.goldTint,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  logo: { width: 188, height: 188 },
  brandName: {
    color: colors.primaryPressed,
    fontSize: 30,
    lineHeight: 42,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    width: 72,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    marginVertical: spacing.md,
  },
  brandDescription: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
