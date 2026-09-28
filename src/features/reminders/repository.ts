import { getDatabase } from '@/db';
import {
  isCivilDate,
  isTimeZone,
  isWallTime,
  NO_RECURRENCE,
  occurrenceDates,
  validateRecurrence,
} from '@/domain/recurrence';
import type { CivilDate, ReminderCategory, RecurrenceRule } from '@/domain/recurrence';
import { reconcileNotifications } from '@/services/notifications';
import type { DateNote, Reminder, ReminderInput, ReminderOccurrence, OccurrenceState, StoredOccurrenceState } from './types';

type ReminderRow = {
  id: string; title: string; notes: string; category: ReminderCategory; start_date: string;
  wall_time: string | null; time_zone: string; recurrence_json: string;
  notification_enabled: number; revision: number; created_at: string; updated_at: string;
};
type StateRow = {
  reminder_id: string; occurrence_key: string; original_date: string; original_wall_time: string | null;
  state: OccurrenceState; changed_at: string;
};
type NoteRow = { id: string; civil_date: string; text: string; created_at: string; updated_at: string };
const CATEGORIES: ReminderCategory[] = ['birthday', 'anniversary', 'religious', 'medicine', 'personal', 'work', 'other'];

function localId(): string {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === 'function') globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = [...bytes].map((n) => n.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function toReminder(row: ReminderRow): Reminder {
  return {
    id: row.id, title: row.title, notes: row.notes, category: row.category,
    startDate: row.start_date, wallTime: row.wall_time, timeZone: row.time_zone,
    recurrence: JSON.parse(row.recurrence_json) as RecurrenceRule,
    notificationEnabled: row.notification_enabled === 1, revision: row.revision,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}
function toState(row: StateRow): StoredOccurrenceState {
  return {
    reminderId: row.reminder_id, occurrenceKey: row.occurrence_key, originalDate: row.original_date,
    originalWallTime: row.original_wall_time, state: row.state, changedAt: row.changed_at,
  };
}
function toNote(row: NoteRow): DateNote {
  return { id: row.id, civilDate: row.civil_date, text: row.text, createdAt: row.created_at, updatedAt: row.updated_at };
}
function validateInput(input: ReminderInput): ReminderInput {
  if (!input.title.trim() || input.title.length > 120) throw new Error('Title must be 1–120 characters');
  if (input.notes.length > 5000) throw new Error('Notes must be at most 5,000 characters');
  if (!CATEGORIES.includes(input.category)) throw new Error('Invalid reminder category');
  if (!isCivilDate(input.startDate)) throw new Error('Invalid reminder date');
  if (input.wallTime !== null && !isWallTime(input.wallTime)) throw new Error('Invalid reminder time');
  if (!isTimeZone(input.timeZone)) throw new Error('Invalid reminder timezone');
  validateRecurrence(input.recurrence, input.startDate);
  if (input.notificationEnabled && input.wallTime === null) {
    throw new Error('Choose an alert time before enabling a notification');
  }
  return input;
}

async function tryReconcile(): Promise<void> {
  // The SQLite save remains successful if Android permission or scheduling fails.
  try { await reconcileNotifications(); } catch { /* retry on app resume or next edit */ }
}

export async function createReminder(input: ReminderInput): Promise<Reminder> {
  validateInput(input);
  const db = await getDatabase();
  const id = localId();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO reminders(id,title,notes,category,start_date,wall_time,time_zone,recurrence_json,notification_enabled,revision,created_at,updated_at)
     VALUES(?,?,?,?,?,?,?,?,?,1,?,?)`,
    id, input.title, input.notes, input.category, input.startDate, input.wallTime, input.timeZone,
    JSON.stringify(input.recurrence), input.notificationEnabled ? 1 : 0, now, now,
  );
  await tryReconcile();
  return (await getReminder(id))!;
}

export async function getReminder(id: string): Promise<Reminder | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id);
  return row ? toReminder(row) : null;
}

export async function updateReminder(id: string, changes: Partial<ReminderInput>): Promise<Reminder | null> {
  const db = await getDatabase();
  let updated: Reminder | null = null;
  await db.withExclusiveTransactionAsync(async (tx) => {
    const row = await tx.getFirstAsync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', id);
    if (!row) return;
    const current = toReminder(row);
    const input = validateInput({
      title: changes.title ?? current.title, notes: changes.notes ?? current.notes,
      category: changes.category ?? current.category, startDate: changes.startDate ?? current.startDate,
      wallTime: changes.wallTime === undefined ? current.wallTime : changes.wallTime,
      timeZone: changes.timeZone ?? current.timeZone, recurrence: changes.recurrence ?? current.recurrence,
      notificationEnabled: changes.notificationEnabled ?? current.notificationEnabled,
    });
    const now = new Date().toISOString();
    await tx.runAsync(
      `UPDATE reminders SET title=?,notes=?,category=?,start_date=?,wall_time=?,time_zone=?,recurrence_json=?,
       notification_enabled=?,revision=revision+1,updated_at=? WHERE id=?`,
      input.title, input.notes, input.category, input.startDate, input.wallTime, input.timeZone,
      JSON.stringify(input.recurrence), input.notificationEnabled ? 1 : 0, now, id,
    );
    updated = { ...current, ...input, revision: current.revision + 1, updatedAt: now };
  });
  if (updated) await tryReconcile();
  return updated;
}

export async function deleteReminder(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM reminders WHERE id = ?', id);
  await tryReconcile();
}

export type ReminderFilter = { search?: string; category?: ReminderCategory };
export async function listReminders(filter: ReminderFilter = {}): Promise<Reminder[]> {
  const db = await getDatabase();
  const search = filter.search?.trim().toLowerCase();
  const pattern = search ? `%${search.replace(/[\\%_]/g, '\\$&')}%` : null;
  const rows = await db.getAllAsync<ReminderRow>(
    `SELECT * FROM reminders WHERE (? IS NULL OR category = ?)
     AND (? IS NULL OR LOWER(title) LIKE ? ESCAPE '\\' OR LOWER(notes) LIKE ? ESCAPE '\\')
     ORDER BY start_date ASC, COALESCE(wall_time,'') ASC, title COLLATE NOCASE ASC`,
    filter.category ?? null, filter.category ?? null, pattern, pattern, pattern,
  );
  return rows.map(toReminder);
}

export async function listStoredOccurrenceStates(reminderId?: string): Promise<StoredOccurrenceState[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<StateRow>(
    'SELECT * FROM reminder_occurrences WHERE (? IS NULL OR reminder_id=?) ORDER BY original_date',
    reminderId ?? null, reminderId ?? null,
  );
  return rows.map(toState);
}

export async function listOccurrences(from: CivilDate, through: CivilDate, filter: ReminderFilter = {}): Promise<ReminderOccurrence[]> {
  if (!isCivilDate(from) || !isCivilDate(through) || from > through) throw new Error('Invalid occurrence range');
  const [reminders, states] = await Promise.all([listReminders(filter), listStoredOccurrenceStates()]);
  const stateByKey = new Map(states.map((state) => [`${state.reminderId}:${state.occurrenceKey}`, state.state]));
  const result: ReminderOccurrence[] = [];
  for (const reminder of reminders) {
    const currentDates = reminder.startDate > through
      ? []
      : occurrenceDates(reminder.startDate, reminder.recurrence, from, through, 512);
    const historicalDates = states
      .filter((state) => state.reminderId === reminder.id && state.originalDate >= from && state.originalDate <= through)
      .map((state) => state.occurrenceKey);
    for (const date of new Set([...currentDates, ...historicalDates])) {
      result.push({ reminder, occurrenceKey: date, date, state: stateByKey.get(`${reminder.id}:${date}`) ?? null });
    }
  }
  result.sort((a, b) => a.date.localeCompare(b.date) || (a.reminder.wallTime ?? '').localeCompare(b.reminder.wallTime ?? '') || a.reminder.title.localeCompare(b.reminder.title));
  return result;
}

export async function setOccurrenceState(reminderId: string, occurrenceKey: CivilDate, state: OccurrenceState | null): Promise<void> {
  if (!isCivilDate(occurrenceKey)) throw new Error('Invalid occurrence date');
  const reminder = await getReminder(reminderId);
  if (!reminder) throw new Error('Reminder not found');
  const db = await getDatabase();
  if (state === null) {
    await db.runAsync('DELETE FROM reminder_occurrences WHERE reminder_id=? AND occurrence_key=?', reminderId, occurrenceKey);
  } else {
    if (state !== 'completed' && state !== 'skipped') throw new Error('Invalid occurrence state');
    const valid = occurrenceDates(reminder.startDate, reminder.recurrence, occurrenceKey, occurrenceKey).length === 1;
    if (!valid) throw new Error('Date does not belong to this reminder series');
    await db.runAsync(
      `INSERT INTO reminder_occurrences(reminder_id,occurrence_key,original_date,original_wall_time,state,changed_at)
       VALUES(?,?,?,?,?,?) ON CONFLICT(reminder_id,occurrence_key) DO UPDATE SET state=excluded.state,changed_at=excluded.changed_at`,
      reminderId, occurrenceKey, occurrenceKey, reminder.wallTime, state, new Date().toISOString(),
    );
  }
  await tryReconcile();
}

export async function listNotes(civilDate?: CivilDate): Promise<DateNote[]> {
  if (civilDate !== undefined && !isCivilDate(civilDate)) throw new Error('Invalid note date');
  const db = await getDatabase();
  const rows = await db.getAllAsync<NoteRow>(
    'SELECT * FROM date_notes WHERE (? IS NULL OR civil_date=?) ORDER BY civil_date ASC, created_at ASC',
    civilDate ?? null, civilDate ?? null,
  );
  return rows.map(toNote);
}

export async function saveNote(civilDate: CivilDate, text: string, id?: string): Promise<DateNote> {
  if (!isCivilDate(civilDate)) throw new Error('Invalid note date');
  if (!text.trim() || text.length > 5000) throw new Error('Note must be 1–5,000 characters');
  const db = await getDatabase();
  const now = new Date().toISOString();
  if (id) {
    const result = await db.runAsync('UPDATE date_notes SET civil_date=?,text=?,updated_at=? WHERE id=?', civilDate, text, now, id);
    if (!result.changes) throw new Error('Note not found');
  } else {
    id = localId();
    await db.runAsync('INSERT INTO date_notes(id,civil_date,text,created_at,updated_at) VALUES(?,?,?,?,?)', id, civilDate, text, now, now);
  }
  const row = await db.getFirstAsync<NoteRow>('SELECT * FROM date_notes WHERE id=?', id);
  return toNote(row!);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM date_notes WHERE id=?', id);
}

export { NO_RECURRENCE };
export type { Reminder, ReminderInput, ReminderOccurrence, DateNote, OccurrenceState } from './types';
