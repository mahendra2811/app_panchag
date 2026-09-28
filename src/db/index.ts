import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'hindu-calendar.db';
let opening: Promise<SQLite.SQLiteDatabase> | null = null;

async function initialize(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((version?.user_version ?? 0) > 1) {
    throw new Error('The local database was created by a newer version of this app');
  }
  if ((version?.user_version ?? 0) < 1) {
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS reminders (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          notes TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL,
          start_date TEXT NOT NULL,
          wall_time TEXT,
          time_zone TEXT NOT NULL,
          recurrence_json TEXT NOT NULL,
          notification_enabled INTEGER NOT NULL DEFAULT 0,
          revision INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(start_date);
        CREATE INDEX IF NOT EXISTS idx_reminders_category ON reminders(category);
        CREATE TABLE IF NOT EXISTS reminder_occurrences (
          reminder_id TEXT NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
          occurrence_key TEXT NOT NULL,
          original_date TEXT NOT NULL,
          original_wall_time TEXT,
          state TEXT NOT NULL CHECK(state IN ('completed', 'skipped')),
          changed_at TEXT NOT NULL,
          PRIMARY KEY(reminder_id, occurrence_key)
        );
        CREATE INDEX IF NOT EXISTS idx_occurrences_date ON reminder_occurrences(original_date);
        CREATE TABLE IF NOT EXISTS notification_schedules (
          reminder_id TEXT NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
          occurrence_key TEXT NOT NULL,
          fingerprint TEXT NOT NULL,
          native_id TEXT,
          scheduled_instant TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('pending', 'scheduled', 'permission_denied', 'channel_disabled', 'failed')),
          error TEXT,
          revision INTEGER NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY(reminder_id, occurrence_key)
        );
        CREATE INDEX IF NOT EXISTS idx_schedules_status ON notification_schedules(status);
        CREATE TABLE IF NOT EXISTS date_notes (
          id TEXT PRIMARY KEY NOT NULL,
          civil_date TEXT NOT NULL,
          text TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_notes_date ON date_notes(civil_date);
        PRAGMA user_version = 1;
      `);
    });
  }
  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!opening) opening = initialize().catch((error) => {
    opening = null;
    throw error;
  });
  return opening;
}
