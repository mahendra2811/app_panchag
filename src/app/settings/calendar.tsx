import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Card, Chip, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { usePreferences, type HomeView } from '@/store/preferences';
import { spacing } from '@/theme';

const VIEWS: HomeView[] = ['month', 'week', 'today'];

export default function CalendarSettingsScreen() {
  const { t } = useTranslation();
  const { weekStart, monthSystem, homeView, setWeekStart, setMonthSystem, setHomeView } = usePreferences();
  return (
    <Page title={t('calendarSettings')}>
      <Card style={styles.card}>
        <SectionHeader title={t('weekStartsOn')} />
        <View style={styles.choices}>
          <Chip label={t('sunday')} selected={weekStart === 0} onPress={() => setWeekStart(0)} />
          <Chip label={t('monday')} selected={weekStart === 1} onPress={() => setWeekStart(1)} />
        </View>
      </Card>
      <Card style={styles.card}>
        <SectionHeader title={t('monthSystem')} />
        <View style={styles.choices}>
          <Chip label={t('purnimanta')} selected={monthSystem === 'purnimanta'} onPress={() => setMonthSystem('purnimanta')} />
          <Chip label={t('amanta')} selected={monthSystem === 'amanta'} onPress={() => setMonthSystem('amanta')} />
        </View>
        <AppText variant="small" tone="muted">{t('monthSystemHint')}</AppText>
      </Card>
      <Card style={styles.card}>
        <SectionHeader title={t('homeView')} />
        <View style={styles.choices}>
          {VIEWS.map((view) => <Chip key={view} label={t(view)} selected={homeView === view} onPress={() => setHomeView(view)} />)}
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.md }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
