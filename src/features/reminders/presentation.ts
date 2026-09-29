import { addCivilDays, isCivilDate, occurrenceDates } from '@/domain/recurrence';
import type { CivilDate, RecurrenceRule } from '@/domain/recurrence';
import type { Reminder } from './types';
import { intlLocale, type AppLanguage } from '@/i18n/languages';

export function deviceCivilDate(): CivilDate {
  const now = new Date();
  return `${now.getFullYear().toString().padStart(4, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
}

export function formatReminderDate(date: CivilDate, language: AppLanguage, time?: string | null): string {
  if (!isCivilDate(date)) return date;
  const formatted = new Intl.DateTimeFormat(intlLocale(language), {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
  return time ? `${formatted} · ${time}` : formatted;
}

export function previewDates(reminder: Reminder, from = deviceCivilDate(), limit = 5): CivilDate[] {
  // Leap-day yearly reminders may need 20 years for a five-date preview.
  const through = addCivilDays(from, 366 * 21);
  return occurrenceDates(reminder.startDate, reminder.recurrence, from, through, limit);
}

export function nextOccurrenceDate(reminder: Reminder, from = deviceCivilDate()): CivilDate | null {
  return previewDates(reminder, from, 1)[0] ?? null;
}

export function recurrenceLabel(rule: RecurrenceRule, t: (key: string) => string): string {
  return rule.frequency === 'none' ? t('noRepeat') : t(rule.frequency);
}
