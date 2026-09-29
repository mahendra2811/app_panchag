import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LocationPicker } from '@/components/location/LocationPicker';
import { Page } from '@/features/common/Page';

export default function LocationSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Page title={t('selectCity')} subtitle={t('locationIntro')}>
      <LocationPicker onSelected={() => router.back()} />
    </Page>
  );
}
