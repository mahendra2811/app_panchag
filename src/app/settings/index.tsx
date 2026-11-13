import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useEffectiveLocation } from '@/features/location/useEffectiveLocation';
import { MenuRow, Page } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import { languageName } from '@/i18n/languages';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, textSize } = usePreferences();
  const { city, fallback, timezone } = useEffectiveLocation();
  return (
    <Page title={t('settings')}>
      <MenuRow title={t('language')} subtitle={languageName(language)} onPress={() => router.push('/settings/language')} />
      <MenuRow title={t('location')} subtitle={`${language === 'hi' ? city.nameHi : city.name}${fallback ? ' (fallback)' : ''} · ${timezone}`} onPress={() => router.push('/settings/location')} />
      <MenuRow title={t('calendarSettings')} subtitle={t('monthSystemHint')} onPress={() => router.push('/settings/calendar')} />
      <MenuRow title={t('appearance')} subtitle={t(textSize)} onPress={() => router.push('/settings/appearance')} />
      <MenuRow title={t('notifications')} subtitle={t('notificationHint')} onPress={() => router.push('/settings/notifications')} />
      <MenuRow title={t('storage')} subtitle={t('clearCacheHint')} onPress={() => router.push('/settings/storage')} />
      <MenuRow title={t('about')} subtitle={t('aboutDescription')} onPress={() => router.push('/about')} />
    </Page>
  );
}
