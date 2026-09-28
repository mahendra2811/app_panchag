/** A validated proleptic Gregorian date from 0001-01-01 through 9999-12-31. */
export type CivilDate = string & { readonly __civilDate: unique symbol };
export type WeekStart = 0 | 1; // 0 = Sunday, 1 = Monday
export interface CivilParts { year: number; month: number; day: number }
export interface MonthCell { date: CivilDate | null; inMonth: boolean; weekday: number; day: number | null }
export interface MonthGrid { year: number; month: number; weekStart: WeekStart; weeks: MonthCell[][] }

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999 || !Number.isInteger(month) || month < 1 || month > 12) return 0;
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function formatCivilDate(year: number, month: number, day: number): CivilDate | null {
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) return null;
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` as CivilDate;
}

export function parseCivilDate(value: string): CivilParts | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  return formatCivilDate(year, month, day) === value ? { year, month, day } : null;
}

/** Accept Devanagari numerals at text-input boundaries; stored dates remain ISO/ASCII. */
export function normalizeDateDigits(value: string): string {
  return value.replace(/[०-९]/g, (digit) => String('०१२३४५६७८९'.indexOf(digit)));
}

export function isValidCivilDate(value: string): value is CivilDate { return parseCivilDate(value) !== null; }

// Julian day number for the Gregorian calendar. This is civil arithmetic, independent of timezone/DST.
function toDayNumber({ year, month, day }: CivilParts): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function fromDayNumber(jdn: number): CivilDate | null {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return formatCivilDate(100 * b + d - 4800 + Math.floor(m / 10), m + 3 - 12 * Math.floor(m / 10), e - Math.floor((153 * m + 2) / 5) + 1);
}

export function addCivilDays(date: CivilDate | string, days: number): CivilDate | null {
  const parts = parseCivilDate(date);
  return parts && Number.isSafeInteger(days) ? fromDayNumber(toDayNumber(parts) + days) : null;
}

/** 0 = Sunday, ... 6 = Saturday. */
export function getWeekday(date: CivilDate | string): number | null {
  const parts = parseCivilDate(date);
  return parts ? (toDayNumber(parts) + 1) % 7 : null;
}

export function compareCivilDates(a: CivilDate | string, b: CivilDate | string): number {
  if (!isValidCivilDate(a) || !isValidCivilDate(b)) throw new RangeError('Invalid civil date');
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getMonthGrid(year: number, month: number, weekStart: WeekStart = 0): MonthGrid {
  const first = formatCivilDate(year, month, 1);
  if (!first || (weekStart !== 0 && weekStart !== 1)) throw new RangeError('Invalid month or week start');
  const firstWeekday = getWeekday(first)!;
  const leading = (firstWeekday - weekStart + 7) % 7;
  const count = Math.ceil((leading + daysInMonth(year, month)) / 7) * 7;
  const weeks: MonthCell[][] = [];
  for (let i = 0; i < count; i += 7) {
    const week: MonthCell[] = [];
    for (let j = 0; j < 7; j++) {
      const offset = i + j - leading;
      const date = addCivilDays(first, offset);
      const parts = date ? parseCivilDate(date) : null;
      week.push({ date, inMonth: parts?.year === year && parts.month === month, weekday: (weekStart + j) % 7, day: parts?.day ?? null });
    }
    weeks.push(week);
  }
  return { year, month, weekStart, weeks };
}

/** The civil date in the requested IANA zone; never the device's implicit timezone. */
export function todayInTimezone(timezone = 'Asia/Kolkata', instant = new Date()): CivilDate {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant);
  const field = (type: string) => Number(parts.find(part => part.type === type)?.value);
  const date = formatCivilDate(field('year'), field('month'), field('day'));
  if (!date) throw new RangeError('Unable to resolve date in timezone');
  return date;
}

/** Explicit UTC instant for noon IST, avoiding JavaScript's local Date constructor and 0–99 year rule. */
export function civilDateToISTNoon(date: CivilDate | string): Date | null {
  const parts = parseCivilDate(date);
  if (!parts) return null;
  const instant = new Date(0);
  instant.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  instant.setUTCHours(6, 30, 0, 0);
  return instant;
}
