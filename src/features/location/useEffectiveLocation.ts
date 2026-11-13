import { useMemo } from 'react';
import { usePreferences } from '@/store/preferences';
import { resolveEffectiveLocation } from './effective';

export function useEffectiveLocation() {
  const cityId = usePreferences((state) => state.cityId);
  const override = usePreferences((state) => state.timeZoneOverride);
  return useMemo(() => resolveEffectiveLocation(cityId, override), [cityId, override]);
}
