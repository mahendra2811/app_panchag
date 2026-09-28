import {
  addCivilDays as addDomainCivilDays,
  daysInMonth,
  formatCivilDate,
  getWeekday,
  parseCivilDate,
} from '@/domain/calendar';

/** Presentation helpers delegate all Gregorian arithmetic to the domain calendar. */
export function toIsoDate(year: number, month: number, day: number): string {
  const date = formatCivilDate(year, month, day);
  if (!date) throw new Error('Civil date is outside the supported Gregorian range');
  return date;
}

export function fromIsoDate(iso: string): { year: number; month: number; day: number } {
  const date = parseCivilDate(iso);
  if (!date) throw new Error(`Invalid civil date: ${iso}`);
  return date;
}

export function addCivilDays(iso: string, count: number): string {
  const date = addDomainCivilDays(iso, count);
  if (!date) throw new Error('Civil date is outside the supported Gregorian range');
  return date;
}

export function dayOfWeek(iso: string): number {
  const weekday = getWeekday(iso);
  if (weekday === null) throw new Error(`Invalid civil date: ${iso}`);
  return weekday;
}

export function daysInCivilMonth(year: number, month: number): number {
  const count = daysInMonth(year, month);
  if (count === 0) throw new Error('Civil month is outside the supported Gregorian range');
  return count;
}
