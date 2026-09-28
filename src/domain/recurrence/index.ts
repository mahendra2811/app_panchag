/** Gregorian recurrence. Civil dates are ISO YYYY-MM-DD strings, independent of device zone. */
export type CivilDate = string;
export type WallTime = string;
export type ReminderCategory =
  | 'birthday'
  | 'anniversary'
  | 'religious'
  | 'medicine'
  | 'personal'
  | 'work'
  | 'other';
export type RepeatFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurrenceRule = {
  version: 1;
  frequency: RepeatFrequency;
  interval: number;
  untilDate: CivilDate | null;
};
export const NO_RECURRENCE: RecurrenceRule = {
  version: 1,
  frequency: 'none',
  interval: 1,
  untilDate: null,
};

export type Occurrence = {
  key: CivilDate;
  date: CivilDate;
  wallTime: WallTime | null;
  instant: Date | null;
};

export function isCivilDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return false;
  const parsed = new Date(0);
  parsed.setUTCHours(0, 0, 0, 0);
  parsed.setUTCFullYear(year, month - 1, day);
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
}

export function isWallTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function parts(date: CivilDate): [number, number, number] {
  const values = date.split('-').map(Number);
  return [values[0]!, values[1]!, values[2]!];
}

function utcWallNumber(year: number, month: number, day: number, hour = 0, minute = 0): number {
  const result = new Date(0);
  result.setUTCHours(hour, minute, 0, 0);
  result.setUTCFullYear(year, month - 1, day);
  return result.getTime();
}

export function civilDayNumber(date: CivilDate): number {
  const [year, month, day] = parts(date);
  return Math.floor(utcWallNumber(year, month, day) / 86400000);
}

export function civilFromDayNumber(dayNumber: number): CivilDate {
  return new Date(dayNumber * 86400000).toISOString().slice(0, 10);
}

export function addCivilDays(date: CivilDate, days: number): CivilDate {
  return civilFromDayNumber(civilDayNumber(date) + days);
}

function monthDistance(start: CivilDate, target: CivilDate): number {
  const [sy, sm] = parts(start);
  const [ty, tm] = parts(target);
  return (ty - sy) * 12 + tm - sm;
}

function isDue(anchor: CivilDate, candidate: CivilDate, rule: RecurrenceRule): boolean {
  if (candidate < anchor || (rule.untilDate && candidate > rule.untilDate)) return false;
  if (rule.frequency === 'none') return candidate === anchor;
  const days = civilDayNumber(candidate) - civilDayNumber(anchor);
  if (rule.frequency === 'daily') return days % rule.interval === 0;
  if (rule.frequency === 'weekly') return days % (7 * rule.interval) === 0;
  const [ay, am, ad] = parts(anchor);
  const [cy, cm, cd] = parts(candidate);
  if (rule.frequency === 'monthly') return cd === ad && monthDistance(anchor, candidate) % rule.interval === 0;
  return cm === am && cd === ad && (cy - ay) % rule.interval === 0;
}

export function validateRecurrence(rule: RecurrenceRule, anchor: CivilDate): void {
  if (!isCivilDate(anchor)) throw new Error('Invalid reminder date');
  if (rule.version !== 1 || !['none', 'daily', 'weekly', 'monthly', 'yearly'].includes(rule.frequency)) {
    throw new Error('Unsupported recurrence rule');
  }
  if (!Number.isInteger(rule.interval) || rule.interval < 1 || rule.interval > 999) {
    throw new Error('Recurrence interval must be between 1 and 999');
  }
  if (rule.untilDate && (!isCivilDate(rule.untilDate) || rule.untilDate < anchor)) {
    throw new Error('End date must be on or after the reminder date');
  }
}

/** Inclusive finite range. Monthly and yearly rules skip dates absent from a month or year. */
export function occurrenceDates(
  anchor: CivilDate,
  rule: RecurrenceRule,
  from: CivilDate,
  through: CivilDate,
  limit = 512,
): CivilDate[] {
  validateRecurrence(rule, anchor);
  if (!isCivilDate(from) || !isCivilDate(through) || from > through) throw new Error('Invalid date range');
  if (!Number.isInteger(limit) || limit < 1 || limit > 4096) throw new Error('Invalid occurrence limit');
  if (rule.frequency === 'none') return anchor >= from && anchor <= through ? [anchor] : [];
  const result: CivilDate[] = [];
  const end = Math.min(civilDayNumber(through), rule.untilDate ? civilDayNumber(rule.untilDate) : Infinity);
  for (let day = Math.max(civilDayNumber(from), civilDayNumber(anchor)); day <= end; day++) {
    const date = civilFromDayNumber(day);
    if (isDue(anchor, date, rule)) {
      result.push(date);
      if (result.length >= limit) break;
    }
  }
  return result;
}

type ZonedParts = { year: number; month: number; day: number; hour: number; minute: number };
const formatterCache = new Map<string, Intl.DateTimeFormat>();
function zonedParts(instant: number, timeZone: string): ZonedParts {
  let formatter = formatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    });
    formatterCache.set(timeZone, formatter);
  }
  const values = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((part) => [part.type, Number(part.value)]));
  return values as ZonedParts;
}

/** DST overlap: earlier instant. DST gap: first valid minute after the requested wall time. */
export function wallTimeToInstant(date: CivilDate, time: WallTime, timeZone: string): Date {
  if (!isCivilDate(date) || !isWallTime(time) || !isTimeZone(timeZone)) throw new Error('Invalid local date, time, or timezone');
  const [year, month, day] = parts(date);
  const [hour, minute] = time.split(':').map(Number);
  const target = utcWallNumber(year, month, day, hour, minute);
  // Sample offsets on both sides of the possible instant. Usually this resolves in three Intl calls.
  const offsets = new Set<number>();
  for (const sample of [target - 14 * 3600000, target, target + 13 * 3600000]) {
    const local = zonedParts(sample, timeZone);
    offsets.add(utcWallNumber(local.year, local.month, local.day, local.hour, local.minute) - sample);
  }
  const candidates = [...offsets].map((offset) => target - offset).sort((a, b) => a - b);
  for (const instant of candidates) {
    const local = zonedParts(instant, timeZone);
    if (utcWallNumber(local.year, local.month, local.day, local.hour, local.minute) === target) {
      return new Date(instant); // Earlier instant wins if a clock moves back.
    }
  }
  // A spring clock jump erased this wall time. Find the first later valid wall minute.
  const start = Math.min(...candidates);
  const end = Math.max(...candidates) + 3 * 3600000;
  for (let instant = start; instant <= end; instant += 60000) {
    const local = zonedParts(instant, timeZone);
    const wall = utcWallNumber(local.year, local.month, local.day, local.hour, local.minute);
    if (wall > target) return new Date(instant);
  }
  throw new Error('Could not resolve local reminder time');
}

export function occurrencePreview(
  anchor: CivilDate,
  time: WallTime | null,
  timeZone: string,
  rule: RecurrenceRule,
  from: CivilDate,
  through: CivilDate,
  limit = 5,
): Occurrence[] {
  return occurrenceDates(anchor, rule, from, through, limit).map((date) => ({
    key: date,
    date,
    wallTime: time,
    instant: time ? wallTimeToInstant(date, time, timeZone) : null,
  }));
}
