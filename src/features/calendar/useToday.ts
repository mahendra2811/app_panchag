import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { todayInTimezone } from '@/domain/calendar';
import { usePanchangProfile } from '@/features/panchang/usePanchang';

export function useToday() {
  const timezone = usePanchangProfile().timezone;
  const [today, setToday] = useState(() => todayInTimezone(timezone));

  useEffect(() => {
    const update = () => setToday(todayInTimezone(timezone));
    update();
    const timer = setInterval(update, 60_000);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') update(); });
    return () => { clearInterval(timer); subscription.remove(); };
  }, [timezone]);

  return today;
}
