import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getDatabase } from '@/db';
import { addCivilDays, occurrenceDates, wallTimeToInstant } from '@/domain/recurrence';
import type { RecurrenceRule } from '@/domain/recurrence';
import i18n from '@/i18n';
import type { AppLanguage } from '@/i18n/languages';

const CHANNEL_ID = 'calendar-reminders';
const OWNER = 'hindu-calendar-reminder';
/** Future native alarms are replenished when the app starts or resumes. */
export const SCHEDULE_HORIZON_DAYS = 90;
export const MAX_SCHEDULED_ALARMS = 256;
type Language = AppLanguage;
type ReminderRow = {
  id: string; title: string; start_date: string; wall_time: string | null; time_zone: string;
  recurrence_json: string; notification_enabled: number; revision: number;
};
type StateRow = { reminder_id: string; occurrence_key: string };
type ScheduleRow = {
  reminder_id: string; occurrence_key: string; fingerprint: string; native_id: string | null;
  scheduled_instant: string; status: ScheduleStatus; error: string | null; revision: number; updated_at: string;
};
export type ScheduleStatus = 'pending' | 'scheduled' | 'permission_denied' | 'channel_disabled' | 'failed';
export type NotificationStatus = {
  permission: 'granted' | 'denied' | 'undetermined';
  channelEnabled: boolean;
  scheduledCount: number;
  failedCount: number;
  scheduledThrough: string | null;
  horizonDays: number;
  limitReached: boolean;
};
type Desired = {
  reminderId: string; key: string; title: string; instant: Date; revision: number;
  fingerprint: string; language: Language;
};

let reconciliationTail: Promise<NotificationStatus | void> = Promise.resolve();
let currentOptions: { language: Language; enabled: boolean } = { language: 'en', enabled: true };
let handlerInstalled = false;

function notificationKey(reminderId: string, occurrenceKey: string): string {
  return `${reminderId}:${occurrenceKey}`;
}

function ownRequest(request: Notifications.NotificationRequest): boolean {
  return request.content.data?.owner === OWNER;
}

function requestKey(request: Notifications.NotificationRequest): string {
  return notificationKey(String(request.content.data?.reminderId ?? ''), String(request.content.data?.occurrenceKey ?? ''));
}

export function initializeReminderNotifications(): void {
  if (handlerInstalled) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  handlerInstalled = true;
}

async function ensureChannel(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const channel = await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Calendar reminders',
    description: 'Personal calendar reminders saved on this device',
    importance: Notifications.AndroidImportance.DEFAULT,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
  });
  return !!channel && channel.importance !== Notifications.AndroidImportance.NONE;
}

function permissionLabel(response: { granted: boolean; status: string }): NotificationStatus['permission'] {
  return response.granted ? 'granted' : response.status === 'undetermined' ? 'undetermined' : 'denied';
}

/** Call only in response to an explicit user action enabling reminder alerts. */
export async function requestReminderPermission(): Promise<NotificationStatus['permission']> {
  await ensureChannel();
  const response = await Notifications.requestPermissionsAsync();
  await reconcileNotifications();
  return permissionLabel(response);
}

async function desiredSchedules(language: Language, now: Date): Promise<{ items: Desired[]; limitReached: boolean }> {
  const db = await getDatabase();
  const reminders = await db.getAllAsync<ReminderRow>(
    'SELECT id,title,start_date,wall_time,time_zone,recurrence_json,notification_enabled,revision FROM reminders WHERE notification_enabled=1 AND wall_time IS NOT NULL',
  );
  const states = await db.getAllAsync<StateRow>('SELECT reminder_id,occurrence_key FROM reminder_occurrences');
  const completed = new Set(states.map((item) => notificationKey(item.reminder_id, item.occurrence_key)));
  // UTC dates bound all global timezones, with one extra day on either side.
  const start = addCivilDays(now.toISOString().slice(0, 10), -1);
  const end = addCivilDays(start, SCHEDULE_HORIZON_DAYS + 2);
  const items: Desired[] = [];
  for (const reminder of reminders) {
    const rule = JSON.parse(reminder.recurrence_json) as RecurrenceRule;
    for (const date of occurrenceDates(reminder.start_date, rule, start, end, SCHEDULE_HORIZON_DAYS + 3)) {
      if (completed.has(notificationKey(reminder.id, date))) continue;
      const instant = wallTimeToInstant(date, reminder.wall_time!, reminder.time_zone);
      if (instant.getTime() <= now.getTime() + 30000) continue;
      if (instant.getTime() > now.getTime() + SCHEDULE_HORIZON_DAYS * 86400000) continue;
      const fingerprint = JSON.stringify([reminder.revision, instant.toISOString(), language, reminder.title]);
      items.push({ reminderId: reminder.id, key: date, title: reminder.title, instant, revision: reminder.revision, fingerprint, language });
    }
  }
  items.sort((a, b) => a.instant.getTime() - b.instant.getTime() || a.reminderId.localeCompare(b.reminderId));
  return { items: items.slice(0, MAX_SCHEDULED_ALARMS), limitReached: items.length > MAX_SCHEDULED_ALARMS };
}

async function upsertSchedule(item: Desired, status: ScheduleStatus, nativeId: string | null, error: string | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO notification_schedules(reminder_id,occurrence_key,fingerprint,native_id,scheduled_instant,status,error,revision,updated_at)
     VALUES(?,?,?,?,?,?,?,?,?)
     ON CONFLICT(reminder_id,occurrence_key) DO UPDATE SET fingerprint=excluded.fingerprint,native_id=excluded.native_id,
     scheduled_instant=excluded.scheduled_instant,status=excluded.status,error=excluded.error,revision=excluded.revision,updated_at=excluded.updated_at`,
    item.reminderId, item.key, item.fingerprint, nativeId, item.instant.toISOString(), status, error,
    item.revision, new Date().toISOString(),
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 300) : String(error).slice(0, 300);
}

async function doReconcile(language: Language, enabled: boolean): Promise<NotificationStatus> {
  initializeReminderNotifications();
  const now = new Date();
  const db = await getDatabase();
  const { items, limitReached } = enabled ? await desiredSchedules(language, now) : { items: [], limitReached: false };
  const desired = new Map(items.map((item) => [notificationKey(item.reminderId, item.key), item]));
  const [allNative, oldRows] = await Promise.all([
    Notifications.getAllScheduledNotificationsAsync(),
    db.getAllAsync<ScheduleRow>('SELECT * FROM notification_schedules'),
  ]);
  const ownNative = allNative.filter(ownRequest);
  const validNative = new Map<string, Notifications.NotificationRequest>();

  // Native requests are the authority for what Android currently holds. This also cleans up
  // requests orphaned by a crash after a database edit, including deleted series.
  for (const request of ownNative) {
    const key = requestKey(request);
    const target = desired.get(key);
    if (!target || request.content.data?.fingerprint !== target.fingerprint || validNative.has(key)) {
      await Notifications.cancelScheduledNotificationAsync(request.identifier);
    } else {
      validNative.set(key, request);
    }
  }
  for (const row of oldRows) {
    if (!desired.has(notificationKey(row.reminder_id, row.occurrence_key))) {
      await db.runAsync('DELETE FROM notification_schedules WHERE reminder_id=? AND occurrence_key=?', row.reminder_id, row.occurrence_key);
    }
  }

  const channelEnabled = await ensureChannel();
  const permission = await Notifications.getPermissionsAsync();
  const permissionState = permissionLabel(permission);
  if (!permission.granted || !channelEnabled) {
    for (const request of validNative.values()) await Notifications.cancelScheduledNotificationAsync(request.identifier);
    validNative.clear();
  }
  let scheduledCount = 0;
  let failedCount = 0;
  let scheduledThrough: string | null = null;

  for (const item of items) {
    const key = notificationKey(item.reminderId, item.key);
    let nativeId: string | null = validNative.get(key)?.identifier ?? null;
    let status: ScheduleStatus = 'pending';
    let error: string | null = null;
    if (!enabled) status = 'pending';
    else if (!permission.granted) status = permissionState === 'denied' ? 'permission_denied' : 'pending';
    else if (!channelEnabled) status = 'channel_disabled';
    else if (nativeId) status = 'scheduled';
    else {
      try {
        nativeId = await Notifications.scheduleNotificationAsync({
          identifier: `hc-${item.reminderId}-${item.key}-${item.revision}-${item.language}`,
          content: {
            title: item.title,
            body: i18n.t('reminderNotificationBody', { lng: item.language }),
            data: { owner: OWNER, reminderId: item.reminderId, occurrenceKey: item.key, fingerprint: item.fingerprint },
            sound: 'default',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: item.instant, channelId: CHANNEL_ID },
        });
        status = 'scheduled';
      } catch (caught) {
        status = 'failed';
        error = errorMessage(caught);
      }
    }
    if (status === 'scheduled') {
      scheduledCount++;
      scheduledThrough = item.key;
    }
    if (status === 'failed') failedCount++;
    await upsertSchedule(item, status, nativeId, error);
  }
  return {
    permission: permissionState, channelEnabled, scheduledCount, failedCount,
    scheduledThrough, horizonDays: SCHEDULE_HORIZON_DAYS, limitReached,
  };
}

/** Idempotent repair, safe to call on startup, resume, edits, locale and permission changes. */
export function reconcileNotifications(options: { language?: Language; enabled?: boolean } = {}): Promise<NotificationStatus> {
  currentOptions = { ...currentOptions, ...options };
  const run = reconciliationTail.then(
    () => doReconcile(currentOptions.language, currentOptions.enabled),
    () => doReconcile(currentOptions.language, currentOptions.enabled),
  );
  reconciliationTail = run;
  return run;
}

export async function getNotificationStatus(reminderId?: string): Promise<NotificationStatus & { schedules: ScheduleRow[] }> {
  const db = await getDatabase();
  const [permission, channelEnabled, schedules, desired] = await Promise.all([
    Notifications.getPermissionsAsync(), ensureChannel(),
    db.getAllAsync<ScheduleRow>(
      'SELECT * FROM notification_schedules WHERE (? IS NULL OR reminder_id=?) ORDER BY scheduled_instant',
      reminderId ?? null, reminderId ?? null,
    ),
    desiredSchedules(currentOptions.language, new Date()),
  ]);
  const scheduled = schedules.filter((row) => row.status === 'scheduled');
  return {
    permission: permissionLabel(permission), channelEnabled,
    scheduledCount: scheduled.length, failedCount: schedules.filter((row) => row.status === 'failed').length,
    scheduledThrough: scheduled.at(-1)?.occurrence_key ?? null, horizonDays: SCHEDULE_HORIZON_DAYS,
    limitReached: desired.limitReached, schedules,
  };
}

/** Keep future finite schedules current after the app returns to foreground. */
export function startReminderReconciliation(getOptions: () => { language?: Language; enabled?: boolean } = () => ({})): () => void {
  void reconcileNotifications(getOptions()).catch(() => undefined);
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') void reconcileNotifications(getOptions()).catch(() => undefined);
  });
  return () => subscription.remove();
}
