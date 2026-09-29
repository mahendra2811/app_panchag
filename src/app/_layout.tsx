import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, View } from 'react-native';

import { getReminder } from '@/features/reminders/repository';
import i18n from '@/i18n';
import { reconcileNotifications, startReminderReconciliation } from '@/services/notifications';
import { usePreferences } from '@/store/preferences';
import { TextScaleProvider } from '@/theme';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { language, hydrated, onboardingComplete, notificationsEnabled, textSize } = usePreferences();
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
    if (hydrated) void reconcileNotifications({ language, enabled: notificationsEnabled }).catch(() => undefined);
  }, [hydrated, language, notificationsEnabled]);

  useEffect(() => {
    if (!hydrated || !onboardingComplete) return;
    const openReminder = async (data: Record<string, unknown> | undefined) => {
      if (data?.owner !== 'hindu-calendar-reminder' || typeof data.reminderId !== 'string') return;
      const reminder = await getReminder(data.reminderId);
      if (reminder) router.push(`/reminders/${reminder.id}`);
    };
    void Notifications.getLastNotificationResponseAsync().then((response) => openReminder(response?.notification.request.content.data)).catch(() => undefined);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      void openReminder(response.notification.request.content.data).catch(() => undefined);
    });
    return () => subscription.remove();
  }, [hydrated, onboardingComplete, router]);

  return (
    <TextScaleProvider value={textSize}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      {(!hydrated || !brandIntroReady) && (
        <View style={styles.loading} accessibilityRole="progressbar" accessibilityLabel={i18n.t('loading')}>
          <ImageBackground source={require('../../assets/images/mobile view logo_and_name.png')} resizeMode="cover" style={styles.loadingArtwork}>
            <View style={styles.loadingIndicator}><ActivityIndicator color="#A83E0C" size="small" /></View>
          </ImageBackground>
        </View>
      )}
    </TextScaleProvider>
  );
}

const styles = StyleSheet.create({
  loading: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#FFF8EC' },
  loadingArtwork: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  loadingIndicator: { marginBottom: 40, padding: 12, borderRadius: 999, backgroundColor: 'rgba(255,248,236,0.9)' },
});
