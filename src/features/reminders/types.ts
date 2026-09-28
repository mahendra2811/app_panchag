import type { CivilDate, RecurrenceRule, ReminderCategory, WallTime } from '@/domain/recurrence';

export type Reminder = {
  id: string;
  title: string;
  notes: string;
  category: ReminderCategory;
  startDate: CivilDate;
  wallTime: WallTime | null;
  timeZone: string;
  recurrence: RecurrenceRule;
  notificationEnabled: boolean;
  revision: number;
  createdAt: string;
  updatedAt: string;
};

export type ReminderInput = Pick<Reminder, 'title' | 'notes' | 'category' | 'startDate' | 'wallTime' | 'timeZone' | 'recurrence' | 'notificationEnabled'>;
export type OccurrenceState = 'completed' | 'skipped';
export type StoredOccurrenceState = {
  reminderId: string;
  occurrenceKey: CivilDate;
  originalDate: CivilDate;
  originalWallTime: WallTime | null;
  state: OccurrenceState;
  changedAt: string;
};
export type ReminderOccurrence = {
  reminder: Reminder;
  occurrenceKey: CivilDate;
  date: CivilDate;
  state: OccurrenceState | null;
};
export type DateNote = {
  id: string;
  civilDate: CivilDate;
  text: string;
  createdAt: string;
  updatedAt: string;
};
