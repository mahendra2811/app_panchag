import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { todayInTimezone } from '@/domain/calendar';

export function useToday() {
  const [today, setToday] = useState(() => todayInTimezone('Asia/Kolkata'));

  useEffect(() => {
    const update = () => setToday(todayInTimezone('Asia/Kolkata'));
    const timer = setInterval(update, 60_000);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') update(); });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);

  return today;
}
