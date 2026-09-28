import { useTranslation } from 'react-i18next';
import { Card, Chip, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';

export default function LanguageSettingsScreen() {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const setLanguage = usePreferences((state) => state.setLanguage);
  return (
    <Page title={t('language')}>
      <Card style={{ gap: spacing.md }}>
        <SectionHeader title={t('chooseLanguage')} />
        <Chip label={t('hindi')} selected={language === 'hi'} onPress={() => setLanguage('hi')} />
        <Chip label={t('english')} selected={language === 'en'} onPress={() => setLanguage('en')} />
      </Card>
    </Page>
  );
}
