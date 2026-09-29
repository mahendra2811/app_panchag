import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { DatePickerField } from '@/components/calendar';
import { Button } from '@/components/ui';

export type PanchangDateChooserProps = {
  date: string;
  label: string;
  todayLabel?: string;
  onSelect: (date: string) => void;
  onToday?: () => void;
};

export function PanchangDateChooser({ date, label, todayLabel, onSelect, onToday }: PanchangDateChooserProps) {
  return (
    <View style={styles.wrapper}>
      <DatePickerField date={date} label={label} onSelect={onSelect} />
      {onToday && todayLabel ? <View style={styles.actions}><Button title={todayLabel} onPress={onToday} variant="ghost" /></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrapper: { gap: spacing.sm }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
