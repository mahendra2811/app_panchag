import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, SectionHeader, StatusState, TextField } from '@/components/ui';
import { INDIAN_STATES_UTS, getCityById, getDistrictsByState, getStateById, searchCities } from '@/data/cities';
import { MenuRow, Page } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';

const normalize = (value: string) => value.normalize('NFKD').toLocaleLowerCase().replace(/\p{M}/gu, '').trim();

export default function LocationSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const cityId = usePreferences((state) => state.cityId);
  const stateId = usePreferences((state) => state.stateId);
  const setLocation = usePreferences((state) => state.setLocation);
  const [selectedState, setSelectedState] = useState(stateId ?? '');
  const [stateQuery, setStateQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [locationMode, setLocationMode] = useState<'district' | 'city'>('district');
  const current = cityId ? getCityById(cityId) : null;
  const selectedStateName = selectedState ? getStateById(selectedState) : null;
  const states = useMemo(() => INDIAN_STATES_UTS.filter((state) =>
    [state.name, state.nameHi].some((name) => normalize(name).includes(normalize(stateQuery)))), [stateQuery]);
  const districts = useMemo(() => selectedState ? getDistrictsByState(selectedState, districtQuery) : [], [selectedState, districtQuery]);
  const cities = useMemo(() => selectedState ? searchCities(cityQuery, selectedState) : [], [selectedState, cityQuery]);

  function chooseLocation(id: string) {
    setLocation(id, selectedState);
    router.back();
  }

  return (
    <Page title={t('selectCity')} subtitle={t('locationIntro')}>
      {current ? (
        <Card style={{ gap: spacing.xs }}>
          <SectionHeader title={t('chosenCity')} />
          <AppText tone="primary" weight="700">{language === 'hi' ? current.nameHi : current.name}</AppText>
          {current.kind === 'district' ? <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText> : null}
        </Card>
      ) : null}
      <SectionHeader title={t('state')} />
      {selectedStateName ? (
        <Button title={`${language === 'hi' ? selectedStateName.nameHi : selectedStateName.name} · ${t('changeState')}`} variant="secondary" onPress={() => { setSelectedState(''); setDistrictQuery(''); setCityQuery(''); }} />
      ) : (
        <>
          <TextField label={t('state')} placeholder={t('state')} value={stateQuery} onChangeText={setStateQuery} autoCapitalize="none" />
          {states.map((state) => <MenuRow key={state.id} title={language === 'hi' ? state.nameHi : state.name} onPress={() => { setSelectedState(state.id); setStateQuery(''); }} />)}
        </>
      )}
      {selectedStateName ? (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <Button title={t('district')} variant={locationMode === 'district' ? 'primary' : 'secondary'} onPress={() => setLocationMode('district')} />
            <Button title={t('knownCityOptional')} variant={locationMode === 'city' ? 'primary' : 'secondary'} onPress={() => setLocationMode('city')} />
          </View>
          {locationMode === 'district' ? (
            <>
              <SectionHeader title={t('district')} />
              <TextField label={t('searchDistrict')} placeholder={t('searchDistrict')} value={districtQuery} onChangeText={setDistrictQuery} autoCapitalize="none" />
              <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText>
              {districts.length === 0 ? <StatusState title={t('noDistrictFound')} /> : districts.map((district) => (
                <MenuRow key={district.id} title={`${district.name}${district.id === cityId ? ` · ${t('selected')}` : ''}`} onPress={() => chooseLocation(district.id)} />
              ))}
            </>
          ) : (
            <>
              <SectionHeader title={t('knownCityOptional')} />
              <TextField label={t('searchCity')} placeholder={t('searchCity')} value={cityQuery} onChangeText={setCityQuery} autoCapitalize="none" />
              {cities.length === 0 ? <StatusState title={t('noCityFound')} /> : cities.map((city) => (
                <MenuRow key={city.id} title={`${language === 'hi' ? city.nameHi : city.name}${city.id === cityId ? ` · ${t('selected')}` : ''}`} onPress={() => chooseLocation(city.id)} />
              ))}
            </>
          )}
        </>
      ) : null}
    </Page>
  );
}
