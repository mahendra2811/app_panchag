import { APP_LANGUAGES } from '../src/i18n/languages';
import { onboardingTranslations } from '../src/i18n/onboarding';
import { usePreferences } from '../src/store/preferences';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

test('custom locations clear previously selected calculation coordinates', () => {
  usePreferences.getState().setLocation('delhi', 'DL');
  const location = { countryCode: 'GB', state: 'England', district: 'London', city: 'London' };
  usePreferences.getState().setCustomLocation(location);
  expect(usePreferences.getState().cityId).toBeNull();
  expect(usePreferences.getState().stateId).toBeNull();
  expect(usePreferences.getState().customLocation).toEqual(location);
  usePreferences.getState().setLocation('jaipur', 'RJ');
  expect(usePreferences.getState().customLocation).toBeNull();
});

test('onboarding can finish with location skipped', () => {
  usePreferences.getState().setCustomLocation(null);
  usePreferences.getState().finishOnboarding();
  expect(usePreferences.getState().onboardingComplete).toBe(true);
  expect(usePreferences.getState().cityId).toBeNull();
});

test.each(APP_LANGUAGES.map((item) => item.code))('new form labels are present in %s', (code) => {
  for (const key of [
    'country',
    'other',
    'skip',
    'onboardingSetup',
    'enterState',
    'enterDistrict',
    'enterCity',
  ]) {
    expect(onboardingTranslations[code][key]).toEqual(expect.any(String));
  }
});
