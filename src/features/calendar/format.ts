import { getWeekday, parseCivilDate } from '@/domain/calendar';
import { localizeDigits, MONTH_NAMES, WEEKDAY_NAMES } from '@/i18n';
import { compactTithiName, pakshaAbbreviation } from '@/i18n/panchang';
import type { PanchangDay } from '@/services/panchang';
import type { AppLanguage } from '@/store/preferences';

type TithiSummary = Pick<PanchangDay['summaryAtSunrise'], 'tithiId' | 'tithiName' | 'pakshaId'>;

export function compactTithiParts(summary: TithiSummary, language: AppLanguage, devanagari = false): { label: string; firstLine: string; secondLine: string } | undefined {
  if (!summary.tithiName) return undefined;
  const index = Number(summary.tithiId?.match(/^tithi:(\d+)$/)?.[1]);
  const pakshaId = summary.pakshaId ?? (Number.isInteger(index) && index >= 0 && index < 30
    ? index < 15 ? 'SHUKLA' : 'KRISHNA' : null);
  if (!pakshaId) return undefined;
  const ordinal = Number.isInteger(index) && index >= 0 && index < 30
    ? localizeDigits((index % 15) + 1, language, devanagari) : '';
  const prefix = pakshaAbbreviation(pakshaId, language);
  const name = compactTithiName(summary.tithiId, pakshaId, summary.tithiName, language);
  const firstLine = [prefix, ordinal].filter(Boolean).join(' ');
  return { label: [firstLine, name].filter(Boolean).join(' '), firstLine, secondLine: name };
}

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
