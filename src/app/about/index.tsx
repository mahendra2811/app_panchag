import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Card } from '@/components/ui';
import { MenuRow, Page } from '@/features/common/Page';
import { spacing } from '@/theme';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Page title={t('about')}>
      <Card style={{ gap: spacing.sm }}>
        <Image source={require('../../../assets/images/logo_with_name_without_backgro.png')} style={styles.wordmark} resizeMode="contain" accessibilityLabel={t('appName')} />
        <AppText tone="muted">{t('aboutDescription')}</AppText>
        <AppText variant="small" tone="muted">{t('version')} {version}</AppText>
      </Card>
      <MenuRow title={t('privacy')} subtitle={t('privacySummary')} onPress={() => router.push('/about/privacy')} />
      <MenuRow title={t('sources')} subtitle={t('sourceCoverage')} onPress={() => router.push('/about/sources')} />
      <MenuRow title={t('licences')} subtitle={t('licencePanchang')} onPress={() => router.push('/about/licenses')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  wordmark: { width: '100%', height: 105 },
});
