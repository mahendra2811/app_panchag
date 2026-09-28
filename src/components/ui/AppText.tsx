import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, textScaleFactor, typeScale, useAppTextScale } from '@/theme';

export type TextVariant = keyof typeof typeScale;
export type TextTone = 'default' | 'muted' | 'primary' | 'sunday' | 'success' | 'error' | 'inverse';

const toneColors: Record<TextTone, string> = {
  default: colors.text,
  muted: colors.muted,
  primary: colors.primary,
  sunday: colors.sunday,
  success: colors.success,
  error: colors.error,
  inverse: colors.surface,
};

export type AppTextProps = TextProps & {
  children?: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
};

export function AppText({
  children,
  variant = 'body',
  tone = 'default',
  weight = '400',
  align,
  style,
  ...rest
}: AppTextProps) {
  const scale = textScaleFactor[useAppTextScale()];
  return (
    <Text
      allowFontScaling
      {...rest}
      style={[typeScale[variant], { fontSize: typeScale[variant].fontSize * scale, lineHeight: typeScale[variant].lineHeight * scale, color: toneColors[tone], fontWeight: weight, textAlign: align }, style]}
    >
      {children}
    </Text>
  );
}
