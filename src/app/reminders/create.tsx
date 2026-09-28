import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { isCivilDate } from '@/domain/recurrence';
import { ReminderForm } from '@/features/reminders/ReminderForm';
import { createReminder } from '@/features/reminders';

export default function CreateReminderScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ date?: string }>();
  const prefilledDate = typeof params.date === 'string' && isCivilDate(params.date) ? params.date : undefined;
  return <ReminderForm title={t('newReminder')} initial={{ startDate: prefilledDate }} onSubmit={async (input) => { await createReminder(input); }} />;
}
