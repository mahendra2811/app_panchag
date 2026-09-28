import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, LoadingState, SectionHeader, StatusState } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { getNotificationStatus, reconcileNotifications, requestReminderPermission, type NotificationStatus } from '@/services/notifications';
import { usePreferences } from '@/store/preferences';
import { colors, spacing } from '@/theme';

export default function NotificationSettingsScreen() {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const enabled = usePreferences((state) => state.notificationsEnabled);
  const setEnabled = usePreferences((state) => state.setNotificationsEnabled);
  const [status, setStatus] = useState<NotificationStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    try { setStatus(await getNotificationStatus()); setError(false); }
    catch { setError(true); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const toggle = async (next: boolean) => {
    setEnabled(next);
    setBusy(true);
    try {
      if (next) await requestReminderPermission();
      else await reconcileNotifications({ language, enabled: false });
      await refresh();
    } catch { setError(true); }
    finally { setBusy(false); }
  };
  const permissionLabel = status?.permission === 'granted' ? t('permissionGranted') : status?.permission === 'denied' ? t('permissionDeniedStatus') : t('permissionUndetermined');
  return (
    <Page title={t('notifications')} subtitle={t('notificationHint')}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.label}>
            <AppText weight="700">{t('enableNotifications')}</AppText>
            <AppText variant="small" tone="muted">{t('notificationHint')}</AppText>
          </View>
          <Switch accessibilityLabel={t('enableNotifications')} value={enabled} onValueChange={(value) => { void toggle(value); }} disabled={busy} trackColor={{ true: colors.primaryTint, false: colors.border }} thumbColor={enabled ? colors.primary : colors.muted} />
        </View>
      </Card>
      {busy && !status ? <LoadingState label={t('loading')} /> : null}
      {error ? <StatusState title={t('dataUnavailable')} actionLabel={t('retry')} onAction={() => { void refresh(); }} /> : null}
      {status ? (
        <Card style={styles.card}>
          <SectionHeader title={t('status')} action={<Button title={t('retry')} onPress={() => { void refresh(); }} variant="ghost" />} />
          <AppText variant="small">{permissionLabel}</AppText>
          {!status.channelEnabled ? <AppText variant="small" tone="error">{t('channelDisabled')}</AppText> : null}
          <AppText variant="small">{t('scheduledCount')}: {status.scheduledCount}</AppText>
          {status.failedCount > 0 ? <AppText variant="small" tone="error">{t('failedCount')}: {status.failedCount}</AppText> : null}
          {status.scheduledThrough ? <AppText variant="small" tone="muted">{t('scheduledThrough')}: {status.scheduledThrough}</AppText> : null}
          <AppText variant="small" tone="muted">{t('scheduleHorizon')}</AppText>
          {status.limitReached ? <AppText variant="small" tone="error">{t('limitReached')}</AppText> : null}
        </Card>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, label: { flex: 1 } });
