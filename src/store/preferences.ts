import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppLanguage = 'hi' | 'en';
export type HomeView = 'month' | 'week' | 'today';
export type MonthSystem = 'purnimanta' | 'amanta';
export type TextSize = 'small' | 'default' | 'large' | 'extraLarge';

export interface PreferencesState {
  language: AppLanguage;
  cityId: string | null;
  stateId: string | null;
  homeView: HomeView;
  monthSystem: MonthSystem;
  weekStart: 0 | 1;
  simpleMode: boolean;
  textSize: TextSize;
  devanagariDigits: boolean;
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
  hydrated: boolean;
  setLanguage: (language: AppLanguage) => void;
  setLocation: (cityId: string, stateId: string) => void;
  setHomeView: (view: HomeView) => void;
  setMonthSystem: (system: MonthSystem) => void;
  setWeekStart: (day: 0 | 1) => void;
  setSimpleMode: (enabled: boolean) => void;
  setTextSize: (size: TextSize) => void;
  setDevanagariDigits: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  finishOnboarding: () => void;
  setHydrated: () => void;
}

const initialLanguage: AppLanguage = getLocales()[0]?.languageCode === 'hi' ? 'hi' : 'en';

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      language: initialLanguage,
      cityId: null,
      stateId: null,
      homeView: 'month',
      monthSystem: 'purnimanta',
      weekStart: 0,
      simpleMode: true,
      textSize: 'default',
      devanagariDigits: false,
      notificationsEnabled: false,
      onboardingComplete: false,
      hydrated: false,
      setLanguage: (language) => set({ language }),
      setLocation: (cityId, stateId) => set({ cityId, stateId }),
      setHomeView: (homeView) => set({ homeView }),
      setMonthSystem: (monthSystem) => set({ monthSystem }),
      setWeekStart: (weekStart) => set({ weekStart }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
      setTextSize: (textSize) => set({ textSize }),
      setDevanagariDigits: (devanagariDigits) => set({ devanagariDigits }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      finishOnboarding: () => set({ onboardingComplete: true }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'hindu-calendar-preferences-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        cityId: state.cityId,
        stateId: state.stateId,
        homeView: state.homeView,
        monthSystem: state.monthSystem,
        weekStart: state.weekStart,
        simpleMode: state.simpleMode,
        textSize: state.textSize,
        devanagariDigits: state.devanagariDigits,
        notificationsEnabled: state.notificationsEnabled,
        onboardingComplete: state.onboardingComplete,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
