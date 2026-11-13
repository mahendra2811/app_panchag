import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { INDIAN_STATES_UTS, getCityById, getDistrictsByState } from '@/data/cities';
import { AppText, Button, Screen } from '@/components/ui';
import { DropdownField } from '@/components/ui/DropdownField';
import { colors, radius, spacing } from '@/theme';
import { usePreferences } from '@/store/preferences';
import { APP_LANGUAGES, type AppLanguage } from '@/i18n/languages';
import { COUNTRIES, getWorldCities } from '@/data/world';

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { language, setLanguage } = prefs;
  const [country, setCountry] = useState(prefs.selectedLocation?.countryCode ?? prefs.customLocation?.countryCode ?? 'IN');
  const [worldCity, setWorldCity] = useState(prefs.cityId?.startsWith('gn:') ? prefs.cityId : '');
  const [state, setState] = useState(
    prefs.stateId ??
      INDIAN_STATES_UTS.find((item) => item.name === prefs.customLocation?.state)?.id ??
      '',
  );
  const [district, setDistrict] = useState(
    prefs.cityId ?? (prefs.customLocation?.countryCode === 'IN' ? 'other' : ''),
  );
  const [customState, setCustomState] = useState(prefs.customLocation?.state ?? '');
  const [customDistrict, setCustomDistrict] = useState(prefs.customLocation?.district ?? '');
  const [city, setCity] = useState(prefs.customLocation?.city ?? '');
  const [skipped, setSkipped] = useState<string[]>([]);
  const other = { value: 'other', label: t('other') };
  const countries = COUNTRIES.map(({ code, name }) => ({ value: code, label: name, searchText: code }));
  const isIndia = country === 'IN';
  function skip(field: string) {
    setSkipped((previous) => [...previous, field]);
  }
  function restore(field: string) {
    setSkipped((previous) => previous.filter((item) => item !== field));
  }
  function field(label: string, id: string, filled: boolean, children: ReactNode) {
    return (
      <View style={styles.group}>
        <View style={styles.line}>
          <AppText variant="small" weight="600" style={{ flex: 1 }}>
            {label}
            {filled && !skipped.includes(id) ? '  ✓' : ''}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${skipped.includes(id) ? t('edit') : t('skip')}: ${label}`}
            hitSlop={8}
            onPress={() => (skipped.includes(id) ? restore(id) : skip(id))}
          >
            <AppText variant="small" tone="primary">
              {skipped.includes(id) ? t('edit') : t('skip')}
            </AppText>
          </Pressable>
        </View>
        {!skipped.includes(id) && children}
      </View>
    );
  }
  function input(label: string, value: string, onChange: (text: string) => void) {
    return (
      <TextInput
        accessibilityLabel={label}
        placeholder={label}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChange}
        style={[styles.input, language === 'ur' && { textAlign: 'right', writingDirection: 'rtl' }]}
        maxLength={100}
      />
    );
  }
  function complete() {
    if (worldCity && !skipped.includes('country')) {
      prefs.setLocation(worldCity, '');
    } else if (skipped.includes('country') || skipped.includes('state') || skipped.includes('district')) {
      prefs.setLocation('ujjain', 'MP');
    } else if (isIndia && state && district && district !== 'other') {
      prefs.setLocation(district, state);
    } else if (country && (customState.trim() || state || customDistrict.trim() || city.trim())) {
      prefs.setLocation('ujjain', 'MP');
    } else {
      prefs.setLocation('ujjain', 'MP');
    }
    prefs.finishOnboarding();
    router.replace('/(tabs)');
  }
  return (
    <Screen contentStyle={styles.content}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.form}
      >
        <AppText variant="subtitle" align="center" weight="700">
          {t('onboardingSetup')}
        </AppText>
        {field(
          t('language'),
          'language',
          true,
          <DropdownField
            label={t('chooseLanguage')}
            value={language}
            options={APP_LANGUAGES.map((item) => ({
              value: item.code,
              label: item.nativeName,
              searchText: item.englishName,
            }))}
            onChange={(value) => setLanguage(value as AppLanguage)}
          />,
        )}
        {field(
          t('country'),
          'country',
          !!country,
          <DropdownField
            label={t('country')}
            value={country}
            options={countries}
            onChange={(value) => {
              setCountry(value);
              setWorldCity('');
              setState('');
              setDistrict('');
              setCustomState('');
              setCustomDistrict('');
              setCity('');
              setSkipped((items) =>
                items.filter((item) => !['state', 'district', 'city'].includes(item)),
              );
            }}
          />,
        )}
        {!skipped.includes('country') && (
          <View style={styles.group}>
            <AppText variant="small" weight="600">{t('city')}</AppText>
            <DropdownField label={t('city')} value={worldCity}
              options={getWorldCities(country).map((item) => ({ value: `gn:${item.id}`, label: `${item.name}${item.adminCode ? ` (${item.adminCode})` : ''} · ${item.timezone}`, searchText: item.asciiName }))}
              onChange={(value) => { setWorldCity(value); setState(''); setDistrict(''); }} />
            <AppText variant="small" tone="muted">Choose a major city here, or use the Indian state and district fields below. If no location is selected, Ujjain, India is used.</AppText>
          </View>
        )}
        {isIndia && field(
          t('state'),
          'state',
          !!(isIndia ? state : customState.trim()),
          isIndia ? (
            <DropdownField
              label={t('state')}
              value={state}
              disabled={skipped.includes('country')}
              options={INDIAN_STATES_UTS.map((item) => ({
                value: item.id,
                label: language === 'hi' ? item.nameHi : item.name,
                searchText: `${item.name} ${item.nameHi}`,
              }))}
              onChange={(value) => {
                setWorldCity('');
                setState(value);
                setDistrict('');
                setCustomDistrict('');
              }}
            />
          ) : (
            input(t('enterState'), customState, setCustomState)
          ),
        )}
        {isIndia && field(
          t('district'),
          'district',
          !!(isIndia && district !== 'other' ? district : customDistrict.trim()),
          <>
            {isIndia && (
              <DropdownField
                label={t('district')}
                value={district}
                disabled={!state || skipped.includes('state') || skipped.includes('country')}
                options={[
                  ...getDistrictsByState(state).map((item) => ({
                    value: item.id,
                    label: language === 'hi' ? item.nameHi : item.name,
                    searchText: item.aliases.join(' '),
                  })),
                  ...(district && district !== 'other' && getCityById(district)?.kind === 'city'
                    ? [{ value: district, label: getCityById(district)!.name }]
                    : []),
                  other,
                ]}
                onChange={(value) => {
                  setDistrict(value);
                  setCustomDistrict('');
                }}
              />
            )}
            {(!isIndia || district === 'other') &&
              input(t('enterDistrict'), customDistrict, setCustomDistrict)}
          </>,
        )}
        {isIndia && district === 'other' &&
          field(t('city'), 'city', !!city.trim(), input(t('enterCity'), city, setCity))}
        {field(
          t('appearance'),
          'appearance',
          true,
          <View style={styles.line}>
            <View style={{ flex: 1 }}>
              <Button
                title={t('simpleMode')}
                variant={prefs.simpleMode ? 'primary' : 'secondary'}
                onPress={() => prefs.setSimpleMode(true)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title={t('detailedMode')}
                variant={!prefs.simpleMode ? 'primary' : 'secondary'}
                onPress={() => prefs.setSimpleMode(false)}
              />
            </View>
          </View>,
        )}
        <AppText variant="small" tone="muted">If a location cannot be selected, Ujjain, India (Asia/Kolkata) is used. Change it any time in settings.</AppText>
        <Button title={t('start')} fullWidth onPress={complete} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  form: { gap: spacing.sm },
  group: { gap: 4 },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
});
