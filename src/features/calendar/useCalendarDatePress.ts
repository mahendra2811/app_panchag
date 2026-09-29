import { useCallback, useRef } from 'react';

const DOUBLE_TAP_MS = 350;

/** Single press selects a date; a second quick press on that date opens details. */
export function useCalendarDatePress(onSelectDate: (date: string) => void, onOpenDetails: (date: string) => void) {
  const lastPress = useRef<{ date: string; at: number } | null>(null);

  return useCallback((date: string) => {
    const now = Date.now();
    const previous = lastPress.current;
    if (previous?.date === date && now - previous.at <= DOUBLE_TAP_MS) {
      lastPress.current = null;
      onOpenDetails(date);
      return;
    }
    lastPress.current = { date, at: now };
    onSelectDate(date);
  }, [onSelectDate, onOpenDetails]);
}
