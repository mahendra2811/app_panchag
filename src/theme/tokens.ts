/** Shared visual tokens. Sizes are density independent pixels. */
export const colors = {
  primary: '#A83E0C',
  primaryPressed: '#823007',
  primaryTint: '#FBE9DD',
  gold: '#E8B44A',
  goldTint: '#FFF1C9',
  background: '#FFF8EC',
  surface: '#FFFFFF',
  surfaceWarm: '#FFFCF6',
  border: '#E8DCC9',
  borderStrong: '#AD9275',
  text: '#2B2118',
  muted: '#665545',
  mutedLight: '#816F5D',
  sunday: '#A52D2D',
  sundayTint: '#FDEBEC',
  success: '#246341',
  successTint: '#E5F3EA',
  warning: '#795405',
  warningTint: '#FFF4D1',
  error: '#9A2F2F',
  errorTint: '#FBEAEA',
  disabled: '#A99A8B',
  overlay: 'rgba(43, 33, 24, 0.52)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typeScale = {
  caption: { fontSize: 12, lineHeight: 19 },
  small: { fontSize: 14, lineHeight: 22 },
  body: { fontSize: 16, lineHeight: 25 },
  subtitle: { fontSize: 18, lineHeight: 28 },
  title: { fontSize: 22, lineHeight: 33 },
  display: { fontSize: 30, lineHeight: 42 },
} as const;

export const minimumTouchTarget = 48;
