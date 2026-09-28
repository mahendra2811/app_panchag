import { useTranslation } from 'react-i18next';
import { AppText, Card, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { spacing } from '@/theme';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  return (
    <Page title={t('privacy')}>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('privacy')} />
        <AppText>{t('privacySummary')}</AppText>
      </Card>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('notifications')} />
        <AppText>{t('privacyLockScreen')}</AppText>
        <AppText variant="small" tone="muted">{t('notificationHint')}</AppText>
      </Card>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('sources')} />
        <AppText>{t('dataPolicy')}</AppText>
      </Card>
    </Page>
  );
}
