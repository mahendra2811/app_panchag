import { getWeekday, parseCivilDate } from '@/domain/calendar';
import { localizeDigits, MONTH_NAMES, WEEKDAY_NAMES } from '@/i18n';
import type { AppLanguage } from '@/store/preferences';

export function monthLabel(year: number, month: number, language: AppLanguage, devanagari = false): string {
  return `${MONTH_NAMES[language][month - 1] ?? ''} ${localizeDigits(year, language, devanagari)}`;
}

export function dateLabel(date: string, language: AppLanguage, devanagari = false): string {
  const parts = parseCivilDate(date);
  if (!parts) return date;
  const dayName = WEEKDAY_NAMES[language][getWeekday(date) ?? 0];
  return `${dayName}, ${localizeDigits(parts.day, language, devanagari)} ${MONTH_NAMES[language][parts.month - 1]} ${localizeDigits(parts.year, language, devanagari)}`;
}

export function clockLabel(local: string | null | undefined): string | undefined {
  if (!local) return undefined;
  const match = local.match(/(?:^|[ T])(\d{1,2}:\d{2})(?::\d{2})?/);
  return match?.[1] ?? local;
}
