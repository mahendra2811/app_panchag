import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, textScaleFactor, typeScale, useAppTextScale } from '@/theme';
import { usePreferences } from '@/store/preferences';

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
  const isUrdu = usePreferences((state) => state.language === 'ur');
  return (
    <Text
      allowFontScaling
      {...rest}
      style={[typeScale[variant], { fontSize: typeScale[variant].fontSize * scale, lineHeight: typeScale[variant].lineHeight * scale, color: toneColors[tone], fontWeight: weight, textAlign: align ?? (isUrdu ? 'right' : undefined), writingDirection: isUrdu ? 'rtl' : 'ltr' }, style]}
    >
      {children}
    </Text>
  );
}
