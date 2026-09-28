import { useCallback, useEffect, useMemo, useState } from 'react';

import { getCityById } from '@/data/cities';
import { loadPanchangDay, type FestivalRegion, type PanchangLoadResult, type PanchangProfile } from '@/services/panchang';
import { usePreferences } from '@/store/preferences';

const REGIONS: Record<string, FestivalRegion> = {
  AP: 'andhra-pradesh', AS: 'assam', BR: 'bihar', GA: 'goa', GJ: 'gujarat', HR: 'haryana',
  HP: 'himachal-pradesh', JH: 'jharkhand', KA: 'karnataka', KL: 'kerala', MP: 'madhya-pradesh',
  MH: 'maharashtra', OD: 'odisha', PB: 'punjab', RJ: 'rajasthan', TN: 'tamil-nadu',
  TS: 'telangana', UP: 'uttar-pradesh', UK: 'uttarakhand', WB: 'west-bengal',
};

export function usePanchangProfile(): PanchangProfile | null {
  const { cityId, stateId, monthSystem } = usePreferences();
  return useMemo(() => cityId && getCityById(cityId)
    ? { cityId, monthSystem, region: REGIONS[stateId ?? ''] ?? 'all' }
    : null, [cityId, stateId, monthSystem]);
}

export function usePanchangDay(date: string) {
  const profile = usePanchangProfile();
  const language = usePreferences((state) => state.language);
  const [result, setResult] = useState<PanchangLoadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    if (!profile) { setLoading(false); return; }
    setLoading(true);
    void loadPanchangDay(date, profile, language).then((next) => {
      if (!cancelled) { setResult(next); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [date, profile, language, revision]);

  return { profile, result, day: result?.status === 'available' ? result.day : null, loading, reload };
}
