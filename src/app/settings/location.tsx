import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Card, SectionHeader, StatusState, TextField } from '@/components/ui';
import { INDIAN_CITIES, getCityById, getStateById } from '@/data/cities';
import { MenuRow, Page } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';

const normalize = (value: string) => value.normalize('NFKD').toLocaleLowerCase().replace(/\p{M}/gu, '').trim();

export default function LocationSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const cityId = usePreferences((state) => state.cityId);
  const setLocation = usePreferences((state) => state.setLocation);
  const [query, setQuery] = useState('');
  const current = cityId ? getCityById(cityId) : null;
  const matching = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return INDIAN_CITIES;
    return INDIAN_CITIES.filter((city) => {
      const state = getStateById(city.stateId);
      return [city.name, city.nameHi, ...city.aliases, state?.name ?? '', state?.nameHi ?? ''].some((value) => normalize(value).includes(needle));
    });
  }, [query]);
  return (
    <Page title={t('selectCity')} subtitle={t('locationIntro')}>
      {current ? (
        <Card style={{ gap: spacing.xs }}>
          <SectionHeader title={t('chosenCity')} />
          <AppText tone="primary" weight="700">{language === 'hi' ? current.nameHi : current.name}</AppText>
        </Card>
      ) : null}
      <TextField label={t('searchCity')} placeholder={t('searchCity')} value={query} onChangeText={setQuery} autoCapitalize="none" />
      {matching.length === 0 ? <StatusState title={t('noCityFound')} /> : matching.map((city) => {
        const state = getStateById(city.stateId);
        return (
          <MenuRow
            key={city.id}
            title={`${language === 'hi' ? city.nameHi : city.name}${city.id === cityId ? ` · ${t('selected')}` : ''}`}
            subtitle={state ? language === 'hi' ? state.nameHi : state.name : undefined}
            onPress={() => { setLocation(city.id, city.stateId); router.back(); }}
          />
        );
      })}
    </Page>
  );
}
