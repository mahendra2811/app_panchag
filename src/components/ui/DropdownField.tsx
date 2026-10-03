import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';

export type DropdownOption = { value: string; label: string; searchText?: string };
export function DropdownField({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = options.filter(
    (option) =>
      option.value === 'other' ||
      `${option.label} ${option.searchText ?? ''}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => {
          setQuery('');
          setOpen(true);
        }}
        style={[styles.field, disabled && { opacity: 0.45 }]}
      >
        <AppText numberOfLines={1} style={{ flex: 1 }} tone={value ? 'default' : 'muted'}>
          {options.find((option) => option.value === value)?.label ?? t('select')}
        </AppText>
        <AppText tone="primary">⌄</AppText>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel={t('close')}
            onPress={() => setOpen(false)}
          />
          <View style={styles.dialog} accessibilityViewIsModal>
            <View style={styles.heading}>
              <AppText weight="700" style={{ flex: 1 }}>
                {label}
              </AppText>
              <Pressable accessibilityRole="button" onPress={() => setOpen(false)}>
                <AppText tone="primary">{t('close')}</AppText>
              </Pressable>
            </View>
            <TextInput
              accessibilityLabel={t('search')}
              placeholder={t('search')}
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              style={styles.field}
            />
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filtered}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: value === item.value }}
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <AppText style={{ flex: 1 }}>{item.label}</AppText>
                  {value === item.value && <AppText tone="primary">✓</AppText>}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  field: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    color: colors.text,
  },
  overlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', padding: spacing.lg },
  dialog: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: '75%',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexShrink: 1,
  },
  heading: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  option: {
    minHeight: 48,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
