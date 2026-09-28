import { useRouter } from 'expo-router';
import { BookOpen, CalendarRange, Clock3, Globe2, MapPin, Settings2, ShieldCheck, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, Screen, SectionHeader } from '@/components/ui';
import { MenuRow } from '@/features/common/Page';
import { colors, spacing } from '@/theme';

export default function MoreScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const icon = (Component: typeof BookOpen) => <Component size={21} color={colors.primary} />;

  return (
    <Screen>
      <AppText variant="title" weight="700">{t('more')}</AppText>
      <View style={styles.group}>
        <SectionHeader title={t('panchang')} />
        <MenuRow title={t('fullPanchang')} onPress={() => router.push('/panchang')} leading={icon(BookOpen)} />
        <MenuRow title={t('choghadiya')} onPress={() => router.push('/panchang/choghadiya')} leading={icon(Clock3)} />
        <MenuRow title={t('hora')} onPress={() => router.push('/panchang/hora')} leading={icon(Clock3)} />
        <MenuRow title={t('muhurta')} onPress={() => router.push('/panchang/muhurta')} leading={icon(Sparkles)} />
        <MenuRow title={t('astronomy')} onPress={() => router.push('/panchang/astronomy')} leading={icon(Globe2)} />
      </View>
      <View style={styles.group}>
        <SectionHeader title={t('festivals')} />
        <MenuRow title={t('festivals')} onPress={() => router.push('/festivals')} leading={icon(Sparkles)} />
        <MenuRow title={t('holidays')} onPress={() => router.push('/holidays')} leading={icon(CalendarRange)} />
      </View>
      <View style={styles.group}>
        <SectionHeader title={t('settings')} />
        <MenuRow title={t('location')} onPress={() => router.push('/settings/location')} leading={icon(MapPin)} />
        <MenuRow title={t('language')} onPress={() => router.push('/settings/language')} leading={icon(Globe2)} />
        <MenuRow title={t('calendarSettings')} onPress={() => router.push('/settings/calendar')} leading={icon(CalendarRange)} />
        <MenuRow title={t('appearance')} onPress={() => router.push('/settings/appearance')} leading={icon(Settings2)} />
        <MenuRow title={t('notifications')} onPress={() => router.push('/settings/notifications')} leading={icon(Clock3)} />
        <MenuRow title={t('storage')} onPress={() => router.push('/settings/storage')} leading={icon(ShieldCheck)} />
      </View>
      <View style={styles.group}>
        <SectionHeader title={t('about')} />
        <MenuRow title={t('sources')} onPress={() => router.push('/about/sources')} leading={icon(BookOpen)} />
        <MenuRow title={t('privacy')} onPress={() => router.push('/about/privacy')} leading={icon(ShieldCheck)} />
        <MenuRow title={t('licences')} onPress={() => router.push('/about/licenses')} leading={icon(BookOpen)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.sm, marginTop: spacing.xl } });
