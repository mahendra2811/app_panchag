import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, Button, Card, SectionHeader, StatusState, TextField } from '@/components/ui';
import { INDIAN_STATES_UTS, getCityById, getDistrictsByState, getStateById, searchCities } from '@/data/cities';
import { MenuRow } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';
import { COUNTRIES, TIME_ZONES, getWorldCities } from '@/data/world';
import { DropdownField } from '@/components/ui/DropdownField';
import { useEffectiveLocation } from '@/features/location/useEffectiveLocation';

const normalize = (value: string) => value.normalize('NFKD').toLocaleLowerCase().replace(/\p{M}/gu, '').trim();

export function LocationPicker({ onSelected }: { onSelected: () => void }) {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const cityId = usePreferences((state) => state.cityId);
  const stateId = usePreferences((state) => state.stateId);
  const setLocation = usePreferences((state) => state.setLocation);
  const setZoneOverride = usePreferences((state) => state.setTimeZoneOverride);
  const [country, setCountry] = useState(() => (cityId ? getCityById(cityId)?.countryCode : null) ?? 'IN');
  const [selectedState, setSelectedState] = useState(stateId ?? '');
  const [stateQuery, setStateQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [locationMode, setLocationMode] = useState<'district' | 'city'>('district');
  const { city: current, timezone, fallback, reason } = useEffectiveLocation();
  const currentState = current ? getStateById(current.stateId) : null;
  const selectedStateName = selectedState ? getStateById(selectedState) : null;
  const states = useMemo(() => INDIAN_STATES_UTS.filter((state) =>
    [state.name, state.nameHi].some((name) => normalize(name).includes(normalize(stateQuery)))), [stateQuery]);
  const districts = useMemo(() => selectedState ? getDistrictsByState(selectedState, districtQuery) : [], [selectedState, districtQuery]);
  const cities = useMemo(() => selectedState ? searchCities(cityQuery, selectedState) : [], [selectedState, cityQuery]);

  function chooseLocation(id: string) {
    if (!selectedState) return;
    setLocation(id, selectedState);
    onSelected();
  }

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title={t('country')} />
      <DropdownField label={t('country')} value={country}
        options={COUNTRIES.map((item) => ({ value: item.code, label: item.name, searchText: item.code }))}
        onChange={setCountry} />
      <>
        <SectionHeader title={`${t('city')} · GeoNames`} />
        <DropdownField label={t('city')} value={cityId ?? ''}
          options={getWorldCities(country).map((item) => ({ value: `gn:${item.id}`, label: `${item.name}${item.adminCode ? ` (${item.adminCode})` : ''} · ${item.timezone}`, searchText: item.asciiName }))}
          onChange={(id) => { setLocation(id, ''); onSelected(); }} />
        <AppText variant="small" tone="muted">Choose a city to apply the new location. Until then, the current location shown below remains active.</AppText>
        <Button title="Use Ujjain, India instead" variant="secondary" onPress={() => { setLocation('ujjain', 'MP'); onSelected(); }} />
      </>
      <SectionHeader title={t('timeZone')} />
      <DropdownField label={t('timeZone')} value={timezone}
        options={TIME_ZONES.map((zone) => ({ value: zone, label: zone }))}
        onChange={(zone) => { setZoneOverride(zone); }} />
      <AppText variant="small" tone="muted">Changing the time zone does not change the selected coordinates.</AppText>
      {fallback && <StatusState title="Ujjain, India (fallback)" description={`${reason} Using ${timezone}. Choose another location above.`} />}
      {current ? (
        <Card style={{ gap: spacing.xs }}>
          <SectionHeader title={t('chosenCity')} />
          <AppText tone="primary" weight="700">{language === 'hi' ? current.nameHi : current.name}</AppText>
          {currentState ? <AppText variant="small" tone="muted">{language === 'hi' ? currentState.nameHi : currentState.name}</AppText> : null}
          {current.kind === 'district' ? <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText> : null}
        </Card>
      ) : null}

      {country === 'IN' && <>
      <SectionHeader title={t('state')} />
      {selectedStateName ? (
        <Button title={`${language === 'hi' ? selectedStateName.nameHi : selectedStateName.name} · ${t('changeState')}`}
          variant="secondary" onPress={() => { setSelectedState(''); setDistrictQuery(''); setCityQuery(''); }} />
      ) : (
        <>
          <TextField label={t('state')} placeholder={t('state')} value={stateQuery} onChangeText={setStateQuery} autoCapitalize="none" />
          {states.length === 0 ? <StatusState title={t('noResults')} /> : states.map((state) => (
            <MenuRow key={state.id} title={language === 'hi' ? state.nameHi : state.name}
              onPress={() => { setSelectedState(state.id); setStateQuery(''); }} />
          ))}
        </>
      )}

      {selectedStateName ? (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <Button title={t('district')} variant={locationMode === 'district' ? 'primary' : 'secondary'} onPress={() => setLocationMode('district')} compact />
            <Button title={t('knownCityOptional')} variant={locationMode === 'city' ? 'primary' : 'secondary'} onPress={() => setLocationMode('city')} compact />
          </View>
          {locationMode === 'district' ? (
            <>
              <TextField label={t('searchDistrict')} placeholder={t('searchDistrict')} value={districtQuery} onChangeText={setDistrictQuery} autoCapitalize="none" />
              <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText>
              {districts.length === 0 ? <StatusState title={t('noDistrictFound')} /> : districts.map((district) => (
                <MenuRow key={district.id} title={`${district.name}${district.id === cityId ? ` · ${t('selected')}` : ''}`}
                  onPress={() => chooseLocation(district.id)} />
              ))}
            </>
          ) : (
            <>
              <TextField label={t('searchCity')} placeholder={t('searchCity')} value={cityQuery} onChangeText={setCityQuery} autoCapitalize="none" />
              {cities.length === 0 ? <StatusState title={t('noCityFound')} /> : cities.map((city) => (
                <MenuRow key={city.id} title={`${language === 'hi' ? city.nameHi : city.name}${city.id === cityId ? ` · ${t('selected')}` : ''}`}
                  onPress={() => chooseLocation(city.id)} />
              ))}
            </>
          )}
        </>
      ) : null}
      </>}
    </View>
  );
}
