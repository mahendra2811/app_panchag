import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingState, StatusState } from '@/components/ui';
import { getReminder, updateReminder } from '@/features/reminders';
import { ReminderForm } from '@/features/reminders/ReminderForm';
import type { Reminder } from '@/features/reminders';
import { Page } from '@/features/common/Page';

export default function EditReminderScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    let active = true;
    if (typeof params.id === 'string') {
      void getReminder(params.id).then((result) => { if (active) setReminder(result); })
        .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : String(caught)); })
        .finally(() => { if (active) setLoading(false); });
    } else setLoading(false);
    return () => { active = false; };
  }, [params.id]));

  if (loading) return <Page title={t('editReminder')}><LoadingState label={t('loading')} /></Page>;
  if (!reminder) return <Page title={t('editReminder')}><StatusState title={error || t('noResults')} /></Page>;
  return <ReminderForm title={t('editReminder')} initial={reminder} onSubmit={async (input) => { await updateReminder(reminder.id, input); }} />;
}
