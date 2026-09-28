import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { normalizeDateDigits, parseCivilDate } from '@/domain/calendar';
import { spacing } from '@/theme';
import { Button, TextField } from '@/components/ui';

export type PanchangDateChooserProps = {
  date: string;
  label: string;
  buttonLabel: string;
  invalidDateLabel: string;
  todayLabel?: string;
  onSelect: (date: string) => void;
  onToday?: () => void;
};

export function PanchangDateChooser({ date, label, buttonLabel, invalidDateLabel, todayLabel, onSelect, onToday }: PanchangDateChooserProps) {
  const [draft, setDraft] = useState(date);
  const [error, setError] = useState(false);
  useEffect(() => { setDraft(date); setError(false); }, [date]);
  const submit = () => {
    const normalized = normalizeDateDigits(draft.trim());
    if (!parseCivilDate(normalized)) { setError(true); return; }
    setError(false);
    onSelect(normalized);
  };
  return (
    <View style={styles.wrapper}>
      <TextField
        label={label}
        value={draft}
        onChangeText={(value) => { setDraft(value); if (error) setError(false); }}
        onSubmitEditing={submit}
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
        maxLength={10}
        placeholder="YYYY-MM-DD"
        error={error ? invalidDateLabel : undefined}
      />
      <View style={styles.actions}>
        <Button title={buttonLabel} onPress={submit} variant="secondary" />
        {onToday && todayLabel ? <Button title={todayLabel} onPress={onToday} variant="ghost" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ wrapper: { gap: spacing.sm }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
