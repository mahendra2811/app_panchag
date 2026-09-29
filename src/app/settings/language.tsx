import { useTranslation } from 'react-i18next';
import { Card, Chip, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { APP_LANGUAGES } from '@/i18n/languages';
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
        {APP_LANGUAGES.map((option) => (
          <Chip key={option.code} label={`${option.nativeName} · ${option.englishName}`}
            selected={language === option.code} onPress={() => setLanguage(option.code)} />
        ))}
      </Card>
    </Page>
  );
}
