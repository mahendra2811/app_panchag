import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CalendarHeader, MonthYearPicker } from '@/components/calendar';
import { FestivalCard } from '@/components/festivals';
import { SourceBadge, formatPanchangDate } from '@/components/panchang';
import { AppText, Button, Chip, IconButton, LoadingState, StatusState, TextField } from '@/components/ui';
import { INDIAN_STATES_UTS, getCityById } from '@/data/cities';
import { daysInMonth, formatCivilDate, todayInTimezone } from '@/domain/calendar';
import { Page } from '@/features/common/Page';
import { usePanchangProfile } from '@/features/panchang/usePanchang';
import { MONTH_NAMES, localizeDigits } from '@/i18n';
import { loadPanchangRange, type FestivalRegion, type PanchangObservance } from '@/services/panchang';
import { usePreferences } from '@/store/preferences';
import { colors, radius, spacing } from '@/theme';
import { X } from 'lucide-react-native';

type Occurrence = { date: string; observance: PanchangObservance };
const REGION_STATES: readonly [FestivalRegion, string][] = [
  ['andhra-pradesh', 'AP'], ['assam', 'AS'], ['bihar', 'BR'], ['goa', 'GA'], ['gujarat', 'GJ'],
  ['haryana', 'HR'], ['himachal-pradesh', 'HP'], ['jharkhand', 'JH'], ['karnataka', 'KA'],
  ['kerala', 'KL'], ['madhya-pradesh', 'MP'], ['maharashtra', 'MH'], ['odisha', 'OD'],
  ['punjab', 'PB'], ['rajasthan', 'RJ'], ['tamil-nadu', 'TN'], ['telangana', 'TS'],
  ['uttar-pradesh', 'UP'], ['uttarakhand', 'UK'], ['west-bengal', 'WB'],
];

export default function FestivalsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = usePanchangProfile();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const now = todayInTimezone();
  const [year, setYear] = useState(Number(now.slice(0, 4)));
  const [month, setMonth] = useState(Number(now.slice(5, 7)));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [regionPickerVisible, setRegionPickerVisible] = useState(false);
  const [region, setRegion] = useState<FestivalRegion>('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [revision, setRevision] = useState(0);
  const regionStateId = REGION_STATES.find(([code]) => code === region)?.[1];
  const regionState = INDIAN_STATES_UTS.find((entry) => entry.id === regionStateId);
  const selectedProfile = useMemo(() => profile ? { ...profile, region } : null, [profile, region]);

  useEffect(() => { if (profile) setRegion(profile.region); }, [profile]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedProfile) { setItems([]); setLoading(false); return; }
    const start = formatCivilDate(year, month, 1);
    const end = formatCivilDate(year, month, daysInMonth(year, month));
    if (!start || !end) return;
    setLoading(true);
    setLoadError(false);
    void loadPanchangRange(start, end, selectedProfile, language).then((results) => {
      if (cancelled) return;
      const next: Occurrence[] = [];
      for (let index = 0; index < results.length; index += 1) {
        const result = results[index];
        if (result?.status === 'available') {
          for (const observance of result.day.observances) next.push({ date: result.day.date, observance });
        }
      }
      setItems(next);
      setLoadError(results.every((result) => result.status !== 'available'));
      setLoading(false);
    }).catch(() => { if (!cancelled) { setLoadError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [year, month, selectedProfile, language, revision]);

  const categories = useMemo(() => [...new Set(items.map((item) => item.observance.category))].sort(), [items]);
  const filtered = useMemo(() => items.filter((item) =>
    (category === 'all' || item.observance.category === category) &&
    (!search.trim() || `${item.observance.name} ${item.observance.canonicalId} ${item.date}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  ), [items, category, search]);
  const moveMonth = (change: number) => {
    const next = year * 12 + month - 1 + change;
    const nextYear = Math.floor(next / 12);
    if (nextYear < 1900 || nextYear > 2100) return;
    setYear(nextYear);
    setMonth(next % 12 + 1);
  };
  const goToday = () => { const today = todayInTimezone(); setYear(Number(today.slice(0, 4))); setMonth(Number(today.slice(5, 7))); };
  const title = `${MONTH_NAMES[language][month - 1]} ${localizeDigits(year, language, devanagariDigits)}`;

  return (
    <Page title={t('festivals')} subtitle={profile ? t('calculated', { city: getCityById(profile.cityId)?.name ?? profile.cityId }) : undefined}>
      <CalendarHeader
        monthLabel={title}
        onPrevious={() => moveMonth(-1)}
        onNext={() => moveMonth(1)}
        onPickMonth={() => setPickerVisible(true)}
        onToday={goToday}
        labels={{ previous: t('previous'), next: t('next'), pickMonth: t('chooseMonth'), today: t('today'), week: t('week'), month: t('month') }}
      />
      <MonthYearPicker
        visible={pickerVisible}
        year={year}
        month={month}
        monthLabels={MONTH_NAMES[language]}
        title={t('chooseMonth')}
        closeLabel={t('close')}
        previousYearLabel={t('previous')}
        nextYearLabel={t('next')}
        minYear={1900}
        maxYear={2100}
        onSelect={(nextYear, nextMonth) => { setYear(nextYear); setMonth(nextMonth); }}
        onClose={() => setPickerVisible(false)}
      />
      {!profile ? <StatusState title={t('locationNeeded')} actionLabel={t('selectCity')} onAction={() => router.push('/settings/location')} /> : (
        <>
          <TextField label={t('search')} placeholder={t('festivalSearch')} value={search} onChangeText={setSearch} />
          <Button title={`${t('state')}: ${regionState ? (language === 'hi' ? regionState.nameHi : regionState.name) : t('allRegions')}`} variant="secondary" onPress={() => setRegionPickerVisible(true)} fullWidth />
          <AppText variant="small" weight="700">{t('reminderCategory')}</AppText>
          <View style={styles.filters}>
            <Chip label={t('allCategories')} selected={category === 'all'} onPress={() => setCategory('all')} />
            {categories.map((entry) => <Chip key={entry} label={t(entry, { defaultValue: entry })} selected={category === entry} onPress={() => setCategory(entry)} />)}
          </View>
          <SourceBadge label={t('calculationUnverified')} tone="warning" />
          {loading ? <LoadingState label={t('loading')} /> : loadError ? (
            <StatusState title={t('dataUnavailable')} actionLabel={t('retry')} onAction={() => setRevision((value) => value + 1)} />
          ) : filtered.length === 0 ? (
            <StatusState title={search || category !== 'all' ? t('noResults') : t('noFestivalsInMonth')} description={t('sourceHint')} />
          ) : filtered.map(({ date, observance }) => (
            <FestivalCard
              key={observance.id}
              title={observance.name}
              dateLabel={formatPanchangDate(date, language, devanagariDigits)}
              categoryLabel={t(observance.category, { defaultValue: observance.category })}
              regionLabel={region === 'all' ? undefined : language === 'hi' ? regionState?.nameHi : regionState?.name}
              onPress={() => router.push({ pathname: '/festivals/[eventId]', params: { eventId: observance.id, date, region } })}
            />
          ))}
          <Modal visible={regionPickerVisible} transparent animationType="fade" onRequestClose={() => setRegionPickerVisible(false)} statusBarTranslucent>
            <View style={styles.backdrop}>
              <View style={styles.sheet} accessibilityViewIsModal>
                <View style={styles.regionHeader}>
                  <AppText variant="subtitle" weight="700" style={styles.regionHeaderTitle}>{t('state')}</AppText>
                  <IconButton label={t('close')} icon={<X color={colors.primary} size={22} />} onPress={() => setRegionPickerVisible(false)} />
                </View>
                <ScrollView>
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: region === 'all' }} onPress={() => { setRegion('all'); setRegionPickerVisible(false); }} style={styles.regionOption}>
                    <AppText>{t('allRegions')}</AppText>
                  </Pressable>
                  {REGION_STATES.map(([code, id]) => {
                    const entry = INDIAN_STATES_UTS.find((item) => item.id === id);
                    return entry ? (
                      <Pressable key={code} accessibilityRole="button" accessibilityState={{ selected: region === code }} onPress={() => { setRegion(code); setRegionPickerVisible(false); }} style={styles.regionOption}>
                        <AppText>{language === 'hi' ? entry.nameHi : entry.name}</AppText>
                      </Pressable>
                    ) : null;
                  })}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay },
  sheet: { maxHeight: '80%', padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, gap: spacing.sm },
  regionHeader: { flexDirection: 'row', alignItems: 'center' },
  regionHeaderTitle: { flex: 1 },
  regionOption: { minHeight: 48, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm },
});
