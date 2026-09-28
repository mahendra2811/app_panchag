import { StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Card, Chip, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { usePreferences, type TextSize } from '@/store/preferences';
import { colors, spacing } from '@/theme';

const SIZES: TextSize[] = ['small', 'default', 'large', 'extraLarge'];

export default function AppearanceSettingsScreen() {
  const { t } = useTranslation();
  const { simpleMode, textSize, devanagariDigits, setSimpleMode, setTextSize, setDevanagariDigits } = usePreferences();
  const enableSimpleMode = (enabled: boolean) => {
    setSimpleMode(enabled);
    if (enabled && (textSize === 'small' || textSize === 'default')) setTextSize('large');
  };
  return (
    <Page title={t('appearance')}>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <AppText weight="700">{t('simpleMode')}</AppText>
            <AppText variant="small" tone="muted">{t('simpleModeHint')}</AppText>
          </View>
          <Switch accessibilityLabel={t('simpleMode')} value={simpleMode} onValueChange={enableSimpleMode} trackColor={{ true: colors.primaryTint, false: colors.border }} thumbColor={simpleMode ? colors.primary : colors.muted} />
        </View>
      </Card>
      <Card style={styles.card}>
        <SectionHeader title={t('textSize')} />
        <View style={styles.choices}>
          {SIZES.map((size) => <Chip key={size} label={t(size)} selected={textSize === size} onPress={() => setTextSize(size)} />)}
        </View>
      </Card>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <AppText weight="700" style={styles.switchText}>{t('devanagariDigits')}</AppText>
          <Switch accessibilityLabel={t('devanagariDigits')} value={devanagariDigits} onValueChange={setDevanagariDigits} trackColor={{ true: colors.primaryTint, false: colors.border }} thumbColor={devanagariDigits ? colors.primary : colors.muted} />
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.md }, switchRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, switchText: { flex: 1 }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
