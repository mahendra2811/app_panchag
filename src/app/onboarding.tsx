import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { INDIAN_STATES_UTS, getCityById, getDistrictsByState, getStateById, searchCities } from '@/data/cities';
import { AppText, Button, Card, Chip, Screen, SectionHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import { usePreferences } from '@/store/preferences';
import { APP_LANGUAGES } from '@/i18n/languages';

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage, cityId, stateId, setLocation, simpleMode, setSimpleMode, finishOnboarding } = usePreferences();
  const [step, setStep] = useState(0);
  const [stateQuery, setStateQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [locationMode, setLocationMode] = useState<'district' | 'city'>('district');
  const states = useMemo(() => INDIAN_STATES_UTS.filter((item) =>
    `${item.name} ${item.nameHi}`.toLocaleLowerCase().includes(stateQuery.toLocaleLowerCase())), [stateQuery]);
  const districts = useMemo(() => stateId ? getDistrictsByState(stateId, districtQuery) : [], [districtQuery, stateId]);
  const cities = useMemo(() => stateId ? searchCities(cityQuery, stateId) : [], [cityQuery, stateId]);
  const selectedLocation = cityId ? getCityById(cityId) : null;

  function complete() {
    if (!cityId || !stateId) return;
    finishOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="small" tone="primary" weight="700">{step + 1} / 3</AppText>
        {step === 0 ? <Image source={require('../../assets/images/logo_without_background.png')} style={styles.welcomeMark} resizeMode="contain" accessibilityLabel={t('appName')} /> : null}
        <AppText variant="display" weight="700">{step === 0 ? t('onboardingWelcome') : step === 1 ? t('selectCity') : t('appearance')}</AppText>
        <AppText tone="muted">{step === 0 ? t('onboardingDescription') : step === 1 ? t('locationIntro') : t('simpleModeHint')}</AppText>
      </View>

      {step === 0 && (
        <View style={styles.section}>
          <SectionHeader title={t('chooseLanguage')} />
          {APP_LANGUAGES.map((option) => (
            <Card key={option.code} onPress={() => setLanguage(option.code)} accessibilityLabel={`${option.nativeName}, ${option.englishName}`}>
              <View style={styles.choice}>
                <AppText variant="subtitle" weight="700">{option.nativeName}</AppText>
                <Chip label={language === option.code ? t('selected') : option.englishName}
                  selected={language === option.code} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {step === 1 && (
        <View style={styles.section}>
          <SectionHeader title={t('state')} />
          {stateId ? (
            <Button title={`${getStateById(stateId)?.[language === 'hi' ? 'nameHi' : 'name'] ?? stateId} · ${t('changeState')}`} variant="secondary" onPress={() => { setLocation('', ''); setStateQuery(''); setDistrictQuery(''); setCityQuery(''); }} />
          ) : (
            <>
              <TextInput style={[styles.input, language === 'ur' && styles.rtlInput]} value={stateQuery} onChangeText={setStateQuery} placeholder={t('state')} placeholderTextColor={colors.mutedLight} accessibilityLabel={t('state')} />
              {states.map((item) => (
                <Pressable key={item.id} onPress={() => { setLocation('', item.id); setDistrictQuery(''); setCityQuery(''); }} style={styles.row} accessibilityRole="button">
                  <AppText weight="600">{language === 'hi' ? item.nameHi : item.name}</AppText>
                </Pressable>
              ))}
            </>
          )}
          {!!stateId && (
            <>
              {selectedLocation ? (
                <Card style={{ gap: spacing.sm }}>
                  <SectionHeader title={t('chosenCity')} />
                  <AppText tone="primary" weight="700">{language === 'hi' ? selectedLocation.nameHi : selectedLocation.name}</AppText>
                  {selectedLocation.kind === 'district' ? <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText> : null}
                  <Button title={t('changeCity')} variant="secondary" onPress={() => setLocation('', stateId)} />
                </Card>
              ) : (
                <>
                  <View style={styles.modeChoices}>
                    <Button title={t('district')} variant={locationMode === 'district' ? 'primary' : 'secondary'} onPress={() => setLocationMode('district')} />
                    <Button title={t('knownCityOptional')} variant={locationMode === 'city' ? 'primary' : 'secondary'} onPress={() => setLocationMode('city')} />
                  </View>
                  {locationMode === 'district' ? (
                    <>
                      <SectionHeader title={t('district')} />
                      <TextInput style={[styles.input, language === 'ur' && styles.rtlInput]} value={districtQuery} onChangeText={setDistrictQuery} placeholder={t('searchDistrict')} placeholderTextColor={colors.mutedLight} accessibilityLabel={t('searchDistrict')} />
                      <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText>
                      {districts.length === 0 && <AppText tone="muted">{t('noDistrictFound')}</AppText>}
                      {districts.map((district) => (
                        <Pressable key={district.id} onPress={() => setLocation(district.id, district.stateId)} style={styles.row} accessibilityRole="button">
                          <AppText weight="600">{district.name}</AppText>
                        </Pressable>
                      ))}
                    </>
                  ) : (
                    <>
                      <SectionHeader title={t('knownCityOptional')} />
                      <TextInput style={[styles.input, language === 'ur' && styles.rtlInput]} value={cityQuery} onChangeText={setCityQuery} placeholder={t('searchCity')} placeholderTextColor={colors.mutedLight} accessibilityLabel={t('searchCity')} />
                      {cities.length === 0 && <AppText tone="muted">{t('noCityFound')}</AppText>}
                      {cities.map((city) => (
                        <Pressable key={city.id} onPress={() => setLocation(city.id, city.stateId)} style={styles.row} accessibilityRole="button">
                          <AppText weight="600">{language === 'hi' ? city.nameHi : city.name}</AppText>
                        </Pressable>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <SectionHeader title={t('appearance')} />
          <Card onPress={() => setSimpleMode(true)}><View style={styles.choice}><AppText weight="600">{t('simpleMode')}</AppText><Chip label={simpleMode ? t('selected') : t('select')} selected={simpleMode} /></View></Card>
          <Card onPress={() => setSimpleMode(false)}><View style={styles.choice}><AppText weight="600">{t('detailedMode')}</AppText><Chip label={!simpleMode ? t('selected') : t('select')} selected={!simpleMode} /></View></Card>
        </View>
      )}

      <View style={styles.actions}>
        {step > 0 && <Button title={t('back')} variant="secondary" onPress={() => setStep(step - 1)} />}
        <Button title={step === 2 ? t('start') : t('continue')} onPress={() => step === 2 ? complete() : setStep(step + 1)} disabled={step === 1 && !cityId} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, paddingVertical: spacing.xxl },
  welcomeMark: { width: 82, height: 82, alignSelf: 'center' },
  section: { gap: spacing.md, marginBottom: spacing.xxl },
  choice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  modeChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, minHeight: 50, paddingHorizontal: spacing.lg, color: colors.text, fontSize: 16 },
  rtlInput: { textAlign: 'right', writingDirection: 'rtl' },
  row: { backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: 'auto' },
});
