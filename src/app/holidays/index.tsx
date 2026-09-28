import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SourceBadge } from '@/components/panchang';
import { AppText, Button, IconButton, StatusState, TextField } from '@/components/ui';
import { INDIAN_STATES_UTS } from '@/data/cities';
import { todayInTimezone } from '@/domain/calendar';
import { Page } from '@/features/common/Page';
import { localizeDigits } from '@/i18n';
import { usePreferences } from '@/store/preferences';
import { colors, radius, spacing } from '@/theme';

export default function HolidaysScreen() {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const stateId = usePreferences((state) => state.stateId);
  const [year, setYear] = useState(Number(todayInTimezone().slice(0, 4)));
  const [jurisdiction, setJurisdiction] = useState<string | null>(stateId);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');
  useEffect(() => { setJurisdiction(stateId); }, [stateId]);
  const selected = INDIAN_STATES_UTS.find((entry) => entry.id === jurisdiction);
  const matching = useMemo(() => INDIAN_STATES_UTS.filter((entry) =>
    `${entry.name} ${entry.nameHi}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  ), [search]);
  const jurisdictionLabel = selected ? (language === 'hi' ? selected.nameHi : selected.name) : t('allRegions');

  return (
    <Page title={t('holidays')} subtitle={t('officialHolidayUnavailable')}>
      <View style={styles.yearRow}>
        <IconButton label={t('previous')} icon={<ChevronLeft color={colors.primary} size={24} />} onPress={() => setYear((value) => Math.max(1900, value - 1))} disabled={year <= 1900} />
        <AppText variant="title" weight="700">{localizeDigits(year, language, devanagariDigits)}</AppText>
        <IconButton label={t('next')} icon={<ChevronRight color={colors.primary} size={24} />} onPress={() => setYear((value) => Math.min(2100, value + 1))} disabled={year >= 2100} />
      </View>
      <Button title={`${t('state')}: ${jurisdictionLabel}`} onPress={() => setPickerVisible(true)} variant="secondary" fullWidth />
      <SourceBadge label={t('governmentDataUnavailable')} tone="warning" />
      <StatusState title={t('noHoliday')} description={t('holidayCoverageHint')} />
      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)} statusBarTranslucent>
        <View style={styles.backdrop}>
          <View style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.header}>
              <AppText variant="subtitle" weight="700" style={styles.headerTitle}>{t('state')}</AppText>
              <IconButton label={t('close')} icon={<X color={colors.primary} size={22} />} onPress={() => setPickerVisible(false)} />
            </View>
            <TextField label={t('search')} value={search} onChangeText={setSearch} placeholder={t('state')} />
            <ScrollView keyboardShouldPersistTaps="handled">
              <Pressable accessibilityRole="button" accessibilityState={{ selected: jurisdiction === null }} onPress={() => { setJurisdiction(null); setPickerVisible(false); }} style={styles.option}>
                <AppText>{t('allRegions')}</AppText>
              </Pressable>
              {matching.map((entry) => (
                <Pressable key={entry.id} accessibilityRole="button" accessibilityState={{ selected: jurisdiction === entry.id }} onPress={() => { setJurisdiction(entry.id); setPickerVisible(false); }} style={styles.option}>
                  <AppText>{language === 'hi' ? entry.nameHi : entry.name}</AppText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  yearRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay },
  sheet: { maxHeight: '80%', padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1 },
  option: { minHeight: 48, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm },
});
