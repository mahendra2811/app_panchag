import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatCivilDate, getMonthGrid, parseCivilDate } from '@/domain/calendar';
import { localizeDigits, MONTH_NAMES, WEEKDAY_SHORT_NAMES } from '@/i18n';
import { usePreferences } from '@/store/preferences';
import { colors, minimumTouchTarget, radius, spacing } from '@/theme';
import { AppText, Button, IconButton } from '@/components/ui';

type Step = 'year' | 'month' | 'day';

export type DatePickerFieldProps = {
  date: string;
  label: string;
  placeholder?: string;
  fallbackDate?: string;
  onSelect: (date: string) => void;
};

export function DatePickerField({ date, label, placeholder, fallbackDate, onSelect }: DatePickerFieldProps) {
  const { t } = useTranslation();
  const { language, devanagariDigits, weekStart } = usePreferences();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('year');
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(1);
  const [yearPage, setYearPage] = useState(() => Math.floor((new Date().getFullYear() - 1) / 12) * 12 + 1);
  const selected = parseCivilDate(date);
  const digits = (value: number) => localizeDigits(value, language, devanagariDigits);

  useEffect(() => {
    if (!visible) return;
    const initial = parseCivilDate(date) ?? parseCivilDate(fallbackDate ?? '');
    const initialYear = initial?.year ?? new Date().getFullYear();
    setYear(initialYear);
    setMonth(initial?.month ?? 1);
    setYearPage(Math.floor((initialYear - 1) / 12) * 12 + 1);
    setStep('year');
  }, [visible, date, fallbackDate]);

  function chooseDay(day: number) {
    const next = formatCivilDate(year, month, day);
    if (!next) return;
    setVisible(false);
    onSelect(next);
  }

  const weekdays = WEEKDAY_SHORT_NAMES[language];
  const heading = step === 'year' ? t('chooseYear') : step === 'month' ? t('chooseMonth') : t('chooseDate');

  return (
    <View style={styles.field}>
      <AppText variant="small" weight="700">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${date || placeholder || t('chooseDate')}`}
        accessibilityHint={t('chooseDate')}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <CalendarDays size={20} color={colors.primary} />
        <AppText style={styles.triggerText} tone={selected ? 'default' : 'muted'}>{selected ? `${digits(selected.day)} ${MONTH_NAMES[language][selected.month - 1]} ${digits(selected.year)}` : placeholder || date || t('chooseDate')}</AppText>
        <ChevronRight size={20} color={colors.primary} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)} statusBarTranslucent>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <AppText variant="subtitle" weight="700" style={styles.headerTitle}>{heading}</AppText>
              <IconButton label={t('close')} icon={<X size={22} color={colors.primary} />} onPress={() => setVisible(false)} />
            </View>

            {step === 'year' && (
              <>
                <View style={styles.navigation}>
                  <IconButton label={t('previous')} disabled={yearPage <= 1} icon={<ChevronLeft size={24} color={colors.primary} />} onPress={() => setYearPage((value) => Math.max(1, value - 12))} />
                  <AppText weight="700">{digits(yearPage)}–{digits(Math.min(yearPage + 11, 9999))}</AppText>
                  <IconButton label={t('next')} disabled={yearPage + 12 > 9999} icon={<ChevronRight size={24} color={colors.primary} />} onPress={() => setYearPage((value) => value + 12)} />
                </View>
                <View style={styles.grid}>
                  {Array.from({ length: 12 }, (_, index) => yearPage + index).filter((value) => value <= 9999).map((value) => (
                    <PickerCell key={value} label={digits(value)} selected={value === year} width="33.333%" onPress={() => { setYear(value); setStep('month'); }} />
                  ))}
                </View>
              </>
            )}

            {step === 'month' && (
              <>
                <AppText tone="muted" align="center">{digits(year)}</AppText>
                <View style={styles.grid}>
                  {MONTH_NAMES[language].map((name, index) => (
                    <PickerCell key={name} label={name} selected={year === selected?.year && index + 1 === selected.month} width="33.333%" onPress={() => { setMonth(index + 1); setStep('day'); }} />
                  ))}
                </View>
                <Button title={t('back')} variant="ghost" onPress={() => setStep('year')} />
              </>
            )}

            {step === 'day' && (
              <>
                <AppText tone="muted" align="center">{MONTH_NAMES[language][month - 1]} {digits(year)}</AppText>
                <ScrollView contentContainerStyle={styles.dayContent}>
                  <View style={styles.grid}>
                    {Array.from({ length: 7 }, (_, index) => (
                      <View key={index} style={styles.dayCell}>
                        <AppText variant="small" tone="muted" align="center" numberOfLines={1}>{weekdays[(index + weekStart) % 7]}</AppText>
                      </View>
                    ))}
                    {getMonthGrid(year, month, weekStart).weeks.flat().map((cell, index) => (
                      cell.inMonth && cell.day ? (
                        <PickerCell key={cell.date ?? index} label={digits(cell.day)} selected={cell.date === date} width="14.2857%" onPress={() => chooseDay(cell.day!)} />
                      ) : <View key={`empty-${index}`} style={styles.dayCell} />
                    ))}
                  </View>
                </ScrollView>
                <Button title={t('back')} variant="ghost" onPress={() => setStep('month')} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PickerCell({ label, selected, width, onPress }: { label: string; selected: boolean; width: '33.333%' | '14.2857%'; onPress: () => void }) {
  return (
    <View style={{ width }}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress}
        style={({ pressed }) => [styles.cell, selected && styles.selectedCell, pressed && styles.pressed]}>
        <AppText variant="small" weight={selected ? '700' : '400'} tone={selected ? 'inverse' : 'default'} align="center" numberOfLines={1}>{label}</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs, width: '100%' },
  trigger: { minHeight: minimumTouchTarget, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  triggerText: { flex: 1 },
  backdrop: { flex: 1, justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg },
  sheet: { alignSelf: 'center', width: '100%', maxWidth: 380, maxHeight: '85%', backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1 },
  navigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { minHeight: 44, margin: 2, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  selectedCell: { backgroundColor: colors.primary },
  dayContent: { paddingBottom: spacing.xs },
  dayCell: { width: '14.2857%', minHeight: 44, justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
