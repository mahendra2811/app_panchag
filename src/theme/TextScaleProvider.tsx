import { createContext, useContext, type ReactNode } from 'react';

export type AppTextScale = 'small' | 'default' | 'large' | 'extraLarge';

const TextScaleContext = createContext<AppTextScale>('default');

export function TextScaleProvider({ value, children }: { value: AppTextScale; children: ReactNode }) {
  return <TextScaleContext.Provider value={value}>{children}</TextScaleContext.Provider>;
}

export function useAppTextScale(): AppTextScale { return useContext(TextScaleContext); }

export const textScaleFactor: Record<AppTextScale, number> = {
  small: 0.9,
  default: 1,
  large: 1.15,
  extraLarge: 1.3,
};
