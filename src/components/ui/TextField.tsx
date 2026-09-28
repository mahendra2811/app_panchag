import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, minimumTouchTarget, radius, spacing, textScaleFactor, typeScale, useAppTextScale } from '@/theme';
import { AppText } from './AppText';

export type TextFieldProps = TextInputProps & { label: string; error?: string; hint?: string };

export function TextField({ label, error, hint, style, multiline, ...rest }: TextFieldProps) {
  const scale = textScaleFactor[useAppTextScale()];
  return (
    <View style={styles.field}>
      <AppText variant="small" weight="700">{label}</AppText>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
        allowFontScaling
        multiline={multiline}
        placeholderTextColor={colors.mutedLight}
        style={[styles.input, { fontSize: typeScale.body.fontSize * scale, lineHeight: typeScale.body.lineHeight * scale }, multiline && styles.multiline, error && styles.inputError, style]}
      />
      {error ? <AppText variant="small" tone="error">{error}</AppText> : hint ? <AppText variant="caption" tone="muted">{hint}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({ field: { gap: spacing.xs }, input: { minHeight: minimumTouchTarget, backgroundColor: colors.surface, borderColor: colors.borderStrong, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.text, fontSize: typeScale.body.fontSize }, inputError: { borderColor: colors.error }, multiline: { minHeight: 112, textAlignVertical: 'top' } });
