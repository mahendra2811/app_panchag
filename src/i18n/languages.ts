/** The ten additional languages follow Census of India 2011 scheduled-language speaker order. */
export const APP_LANGUAGES = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number]['code'];

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return APP_LANGUAGES.some((item) => item.code === value);
}

export function languageName(language: AppLanguage): string {
  return APP_LANGUAGES.find((item) => item.code === language)?.nativeName ?? 'English';
}

/** The calculation engine offers English and Hindi only. */
export function engineLanguage(language: AppLanguage): 'en' | 'hi' {
  return language === 'hi' ? 'hi' : 'en';
}

export function intlLocale(language: AppLanguage): string {
  return `${language}-IN-u-nu-latn`;
}
