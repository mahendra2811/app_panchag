import { StyleSheet, View } from 'react-native';
import { AppText, Chip } from '@/components/ui';
import { spacing } from '@/theme';

export type RecurrenceChoice = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type RecurrencePickerProps = {
  title: string;
  value: RecurrenceChoice;
  onChange: (value: RecurrenceChoice) => void;
  labels: Record<RecurrenceChoice, string>;
  includeCustom?: boolean;
};

export function RecurrencePicker({ title, value, onChange, labels, includeCustom = true }: RecurrencePickerProps) {
  const choices: RecurrenceChoice[] = includeCustom ? ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'] : ['none', 'daily', 'weekly', 'monthly', 'yearly'];
  return (
    <View style={styles.wrapper}>
      <AppText variant="body" weight="700">{title}</AppText>
      <View style={styles.choices}>
        {choices.map((choice) => <Chip key={choice} label={labels[choice]} selected={value === choice} onPress={() => onChange(choice)} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ wrapper: { gap: spacing.sm }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
