import { useTranslation } from 'react-i18next';
import { AppText, Card, SectionHeader } from '@/components/ui';
import { SourceBadge } from '@/components/panchang';
import { Page } from '@/features/common/Page';
import { spacing } from '@/theme';

export default function SourcesScreen() {
  const { t } = useTranslation();
  return (
    <Page title={t('sources')}>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('panchang')} />
        <AppText weight="700">panchang-ts</AppText>
        <AppText variant="small" tone="muted">{t('sourceVersion')}: 5.4.0</AppText>
        <SourceBadge label={t('localData')} />
        <AppText>{t('sourceCoverage')}</AppText>
        {/* <AppText variant="small" tone="muted">{t('calculationUnverified')}</AppText> */}
      </Card>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('festivals')} />
        {/* <AppText>{t('calculationUnverified')}</AppText> */}
        <AppText variant="small" tone="muted">{t('sourceHint')}</AppText>
      </Card>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('holidays')} />
        <AppText>{t('officialHolidayUnavailable')}</AppText>
      </Card>
    </Page>
  );
}
