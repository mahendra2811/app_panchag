import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { isAppLanguage, type AppLanguage } from '@/i18n/languages';
import { getCityById } from '@/data/cities';

export type { AppLanguage } from '@/i18n/languages';
export type HomeView = 'month' | 'week' | 'today';
export type MonthSystem = 'purnimanta' | 'amanta';
export type TextSize = 'small' | 'default' | 'large' | 'extraLarge';

export interface CustomLocation {
  countryCode: string;
  state: string;
  district: string;
  city: string;
}

export interface PreferencesState {
  selectedLocation: { countryCode: string; geographicId: string | null; latitude: number; longitude: number; timezone: string } | null;
  timeZoneOverride: string | null;
  setTimeZoneOverride: (zone: string | null) => void;
  customLocation: CustomLocation | null;
  setCustomLocation: (location: CustomLocation | null) => void;
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

const deviceLanguage = getLocales()[0]?.languageCode;
const initialLanguage: AppLanguage = isAppLanguage(deviceLanguage) ? deviceLanguage : 'en';

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      selectedLocation: null,
      timeZoneOverride: null,
      setTimeZoneOverride: (timeZoneOverride) => {
        const cityId = get().cityId;
        // Repair an unavailable saved city before applying a deliberate time-zone change.
        if (cityId && !getCityById(cityId)) get().setLocation('ujjain', 'MP');
        set({ timeZoneOverride });
      },
      language: initialLanguage,
      customLocation: null,
      setCustomLocation: (customLocation) => set({ customLocation, cityId: null, stateId: null, selectedLocation: null, timeZoneOverride: null }),
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
      setLocation: (cityId, stateId) => {
        const city = getCityById(cityId);
        const resolvedStateId = city?.geoId && city.countryCode === 'IN' ? city.stateId : stateId;
        set({ cityId, stateId: resolvedStateId, customLocation: null, timeZoneOverride: null,
          selectedLocation: city ? { countryCode: city.countryCode ?? 'IN', geographicId: city.geoId ?? null,
            latitude: city.latitude, longitude: city.longitude, timezone: city.timezone } : null });
      },
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
        customLocation: state.customLocation,
        selectedLocation: state.selectedLocation,
        timeZoneOverride: state.timeZoneOverride,
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
