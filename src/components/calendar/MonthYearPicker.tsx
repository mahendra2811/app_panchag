import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, IconButton } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export type MonthYearPickerProps = {
  visible: boolean;
  year: number;
  month: number;
  monthLabels: readonly string[];
  title: string;
  closeLabel: string;
  previousYearLabel: string;
  nextYearLabel: string;
  minYear?: number;
  maxYear?: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
};

export function MonthYearPicker({ visible, year, month, monthLabels, title, closeLabel, previousYearLabel, nextYearLabel, minYear = 1900, maxYear = 2100, onSelect, onClose }: MonthYearPickerProps) {
  const [displayYear, setDisplayYear] = useState(year);
  useEffect(() => { if (visible) setDisplayYear(year); }, [visible, year]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <AppText variant="subtitle" weight="700" style={styles.headerTitle}>{title}</AppText>
            <IconButton label={closeLabel} icon={<X size={22} color={colors.primary} />} onPress={onClose} />
          </View>
          <View style={styles.yearRow}>
            <IconButton label={previousYearLabel} disabled={displayYear <= minYear} icon={<ChevronLeft size={24} color={colors.primary} />} onPress={() => setDisplayYear((value) => value - 1)} />
            <AppText variant="title" weight="700">{displayYear}</AppText>
            <IconButton label={nextYearLabel} disabled={displayYear >= maxYear} icon={<ChevronRight size={24} color={colors.primary} />} onPress={() => setDisplayYear((value) => value + 1)} />
          </View>
          <ScrollView contentContainerStyle={styles.months}>
            {Array.from({ length: 12 }, (_, index) => (
              <View key={index} style={styles.monthCell}>
                <Button
                  title={monthLabels[index] ?? String(index + 1)}
                  variant={displayYear === year && index + 1 === month ? 'primary' : 'secondary'}
                  onPress={() => { onSelect(displayYear, index + 1); onClose(); }}
                  fullWidth
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg },
  sheet: { maxHeight: '80%', backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1 },
  yearRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  months: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: spacing.md },
  monthCell: { width: '50%', padding: spacing.xs },
});
