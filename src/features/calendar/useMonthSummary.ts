import { useEffect, useState } from 'react';

import { daysInMonth, formatCivilDate } from '@/domain/calendar';
import { loadPanchangDay, type PanchangDay, type PanchangProfile } from '@/services/panchang';
import type { AppLanguage } from '@/store/preferences';

export function useMonthSummary(year: number, month: number, profile: PanchangProfile | null, language: AppLanguage) {
  const [days, setDays] = useState<Record<string, PanchangDay>>({});
  const [loadedCount, setLoadedCount] = useState(0);
  const totalCount = daysInMonth(year, month);

  useEffect(() => {
    if (!profile || !totalCount) { setDays({}); setLoadedCount(0); return; }
    let cancelled = false;
    setDays({});
    setLoadedCount(0);
    const run = async () => {
      for (let day = 1; day <= totalCount; day++) {
        if (cancelled) break;
        const date = formatCivilDate(year, month, day);
        if (!date) continue;
        const result = await loadPanchangDay(date, profile, language);
        if (cancelled) break;
        if (result.status === 'available') setDays((previous) => ({ ...previous, [date]: result.day }));
        setLoadedCount(day);
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [year, month, profile, language, totalCount]);

  return { days, loadedCount, totalCount, loading: !!profile && loadedCount < totalCount };
}
