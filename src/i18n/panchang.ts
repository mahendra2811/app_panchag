import type { AppLanguage } from './languages';

type Paksha = 'SHUKLA' | 'KRISHNA' | null;
type TithiLabelSet = { light: string; dark: string; lightShort: string; darkShort: string; names: string[]; full: string; newMoon: string };

/** Tithi names in the scripts normally used by each language. Names outside this set use the engine's English text. */
const TITHI: Partial<Record<AppLanguage, TithiLabelSet>> = {
  bn: { light: 'শুক্ল', dark: 'কৃষ্ণ', lightShort: 'শু', darkShort: 'কৃ', names: 'প্রতিপদা|দ্বিতীয়া|তৃতীয়া|চতুর্থী|পঞ্চমী|ষষ্ঠী|সপ্তমী|অষ্টমী|নবমী|দশমী|একাদশী|দ্বাদশী|ত্রয়োদশী|চতুর্দশী'.split('|'), full: 'পূর্ণিমা', newMoon: 'অমাবস্যা' },
  mr: { light: 'शुक्ल', dark: 'कृष्ण', lightShort: 'शु', darkShort: 'कृ', names: 'प्रतिपदा|द्वितीया|तृतीया|चतुर्थी|पंचमी|षष्ठी|सप्तमी|अष्टमी|नवमी|दशमी|एकादशी|द्वादशी|त्रयोदशी|चतुर्दशी'.split('|'), full: 'पौर्णिमा', newMoon: 'अमावस्या' },
  te: { light: 'శుక్ల', dark: 'కృష్ణ', lightShort: 'శు', darkShort: 'కృ', names: 'పాడ్యమి|విదియ|తదియ|చవితి|పంచమి|షష్ఠి|సప్తమి|అష్టమి|నవమి|దశమి|ఏకాదశి|ద్వాదశి|త్రయోదశి|చతుర్దశి'.split('|'), full: 'పౌర్ణమి', newMoon: 'అమావాస్య' },
  ta: { light: 'சுக்ல', dark: 'கிருஷ்ண', lightShort: 'சு', darkShort: 'கி', names: 'பிரதமை|துவிதியை|திருதியை|சதுர்த்தி|பஞ்சமி|சஷ்டி|சப்தமி|அஷ்டமி|நவமி|தசமி|ஏகாதசி|துவாதசி|திரயோதசி|சதுர்தசி'.split('|'), full: 'பௌர்ணமி', newMoon: 'அமாவாசை' },
  gu: { light: 'શુક્લ', dark: 'કૃષ્ણ', lightShort: 'શુ', darkShort: 'કૃ', names: 'પ્રતિપદા|દ્વિતીયા|તૃતીયા|ચતુર્થી|પંચમી|ષષ્ઠી|સપ્તમી|અષ્ટમી|નવમી|દશમી|એકાદશી|દ્વાદશી|ત્રયોદશી|ચતુર્દશી'.split('|'), full: 'પૂર્ણિમા', newMoon: 'અમાસ' },
  ur: { light: 'شکلا', dark: 'کرشن', lightShort: 'ش', darkShort: 'ک', names: 'پرتی پدا|دویتیا|تریتیا|چترتھی|پنچمی|ششٹھی|سپتمی|اشٹمی|نومی|دشمی|اکادشی|دوادشی|تریودشی|چتردشی'.split('|'), full: 'پورنیما', newMoon: 'اماوسیا' },
  kn: { light: 'ಶುಕ್ಲ', dark: 'ಕೃಷ್ಣ', lightShort: 'ಶು', darkShort: 'ಕೃ', names: 'ಪ್ರತಿಪದೆ|ದ್ವಿತೀಯ|ತೃತೀಯ|ಚತುರ್ಥಿ|ಪಂಚಮಿ|ಷಷ್ಠಿ|ಸಪ್ತಮಿ|ಅಷ್ಟಮಿ|ನವಮಿ|ದಶಮಿ|ಏಕಾದಶಿ|ದ್ವಾದಶಿ|ತ್ರಯೋದಶಿ|ಚತುರ್ದಶಿ'.split('|'), full: 'ಹುಣ್ಣಿಮೆ', newMoon: 'ಅಮಾವಾಸ್ಯೆ' },
  or: { light: 'ଶୁକ୍ଳ', dark: 'କୃଷ୍ଣ', lightShort: 'ଶୁ', darkShort: 'କୃ', names: 'ପ୍ରତିପଦା|ଦ୍ୱିତୀୟା|ତୃତୀୟା|ଚତୁର୍ଥୀ|ପଞ୍ଚମୀ|ଷଷ୍ଠୀ|ସପ୍ତମୀ|ଅଷ୍ଟମୀ|ନବମୀ|ଦଶମୀ|ଏକାଦଶୀ|ଦ୍ୱାଦଶୀ|ତ୍ରୟୋଦଶୀ|ଚତୁର୍ଦ୍ଦଶୀ'.split('|'), full: 'ପୂର୍ଣ୍ଣିମା', newMoon: 'ଅମାବାସ୍ୟା' },
  ml: { light: 'ശുക്ല', dark: 'കൃഷ്ണ', lightShort: 'ശു', darkShort: 'കൃ', names: 'പ്രതിപദ|ദ്വിതീയ|തൃതീയ|ചതുർത്ഥി|പഞ്ചമി|ഷഷ്ഠി|സപ്തമി|അഷ്ടമി|നവമി|ദശമി|ഏകാദശി|ദ്വാദശി|ത്രയോദശി|ചതുർദശി'.split('|'), full: 'പൗർണമി', newMoon: 'അമാവാസി' },
  pa: { light: 'ਸ਼ੁਕਲ', dark: 'ਕ੍ਰਿਸ਼ਨ', lightShort: 'ਸ਼ੁ', darkShort: 'ਕ੍ਰਿ', names: 'ਪ੍ਰਤਿਪਦਾ|ਦੁਤੀਆ|ਤ੍ਰਿਤੀਆ|ਚੌਥ|ਪੰਚਮੀ|ਛੇਵੀਂ|ਸਪਤਮੀ|ਅਸ਼ਟਮੀ|ਨੌਮੀ|ਦਸਮੀ|ਇਕਾਦਸ਼ੀ|ਦੁਆਦਸ਼ੀ|ਤ੍ਰਿਓਦਸ਼ੀ|ਚਤੁਰਦਸ਼ੀ'.split('|'), full: 'ਪੂਰਨਿਮਾ', newMoon: 'ਮੱਸਿਆ' },
};

const MASA: Partial<Record<AppLanguage, string[]>> = {
  bn: 'চৈত্র|বৈশাখ|জ্যৈষ্ঠ|আষাঢ়|শ্রাবণ|ভাদ্রপদ|আশ্বিন|কার্তিক|মার্গশীর্ষ|পৌষ|মাঘ|ফাল্গুন'.split('|'),
  mr: 'चैत्र|वैशाख|ज्येष्ठ|आषाढ|श्रावण|भाद्रपद|आश्विन|कार्तिक|मार्गशीर्ष|पौष|माघ|फाल्गुन'.split('|'),
  te: 'చైత్రం|వైశాఖం|జ్యేష్ఠం|ఆషాఢం|శ్రావణం|భాద్రపదం|ఆశ్వయుజం|కార్తీకం|మార్గశిరం|పుష్యం|మాఘం|ఫాల్గుణం'.split('|'),
  ta: 'சைத்ர|வைசாக|ஜ்யேஷ்ட|ஆஷாட|ஸ்ராவண|பாத்ரபத|ஆஸ்வின|கார்த்திக|மார்கசீர்ஷ|பௌஷ|மாக|பால்குண'.split('|'),
  gu: 'ચૈત્ર|વૈશાખ|જેઠ|અષાઢ|શ્રાવણ|ભાદરવો|આસો|કારતક|માગશર|પોષ|મહા|ફાગણ'.split('|'),
  ur: 'چیترا|ویشاکھ|جیشٹھ|آشاڑھ|شراون|بھادراپد|اشون|کارتک|مارگ شِرش|پوش|ماگھ|پھالگن'.split('|'),
  kn: 'ಚೈತ್ರ|ವೈಶಾಖ|ಜ್ಯೇಷ್ಠ|ಆಷಾಢ|ಶ್ರಾವಣ|ಭಾದ್ರಪದ|ಆಶ್ವಯುಜ|ಕಾರ್ತಿಕ|ಮಾರ್ಗಶಿರ|ಪುಷ್ಯ|ಮಾಘ|ಫಾಲ್ಗುಣ'.split('|'),
  or: 'ଚୈତ୍ର|ବୈଶାଖ|ଜ୍ୟେଷ୍ଠ|ଆଷାଢ଼|ଶ୍ରାବଣ|ଭାଦ୍ରପଦ|ଆଶ୍ୱିନ|କାର୍ତ୍ତିକ|ମାର୍ଗଶୀର୍ଷ|ପୌଷ|ମାଘ|ଫାଲ୍ଗୁନ'.split('|'),
  ml: 'ചൈത്രം|വൈശാഖം|ജ്യേഷ്ഠം|ആഷാഢം|ശ്രാവണം|ഭാദ്രപദം|ആശ്വിനം|കാർത്തികം|മാർഗശീർഷം|പൗഷം|മാഘം|ഫാൽഗുനം'.split('|'),
  pa: 'ਚੇਤ|ਵੈਸਾਖ|ਜੇਠ|ਹਾੜ੍ਹ|ਸਾਵਣ|ਭਾਦੋਂ|ਅੱਸੂ|ਕੱਤਕ|ਮੱਘਰ|ਪੋਹ|ਮਾਘ|ਫੱਗਣ'.split('|'),
};

export function localizeMasa(id: string | null | undefined, fallback: string | null | undefined, language: AppLanguage): string {
  const index = Number(id?.match(/^masa:(\d+)$/)?.[1]);
  if (!Number.isInteger(index) || index < 0 || index >= 12) return fallback ?? '';
  return MASA[language]?.[index] ?? fallback ?? '';
}

export function pakshaLabel(paksha: Paksha, language: AppLanguage): string {
  if (!paksha) return '';
  const set = TITHI[language];
  if (set) return `${paksha === 'SHUKLA' ? set.light : set.dark} ${language === 'ur' ? 'پکش' : language === 'ta' ? 'பட்சம்' : language === 'te' ? 'పక్షం' : language === 'ml' ? 'പക്ഷം' : language === 'bn' ? 'পক্ষ' : language === 'gu' ? 'પક્ષ' : language === 'kn' ? 'ಪಕ್ಷ' : language === 'or' ? 'ପକ୍ଷ' : language === 'pa' ? 'ਪੱਖ' : 'पक्ष'}`;
  return paksha === 'SHUKLA' ? (language === 'hi' ? 'शुक्ल पक्ष' : 'Shukla Paksha') : (language === 'hi' ? 'कृष्ण पक्ष' : 'Krishna Paksha');
}

export function pakshaAbbreviation(paksha: Paksha, language: AppLanguage): string {
  if (!paksha) return '';
  const set = TITHI[language];
  if (set) return paksha === 'SHUKLA' ? set.lightShort : set.darkShort;
  return paksha === 'SHUKLA' ? language === 'hi' ? 'शु' : 'Shu' : language === 'hi' ? 'कृ' : 'Kri';
}

export function localizeTithi(id: string | null | undefined, paksha: Paksha, englishOrHindiName: string | null | undefined, language: AppLanguage): string {
  const fallback = englishOrHindiName ?? '';
  const set = TITHI[language];
  const index = Number(id?.match(/^tithi:(\d+)$/)?.[1]);
  if (!set || !Number.isInteger(index) || index < 0 || index >= 30 || !paksha) return fallback;
  const ordinal = index % 15;
  const name = ordinal === 14 ? (paksha === 'SHUKLA' ? set.full : set.newMoon) : set.names[ordinal];
  if (!name) return fallback;
  return ordinal === 14 ? name : `${paksha === 'SHUKLA' ? set.light : set.dark} ${name}`;
}

export function compactTithiName(id: string | null | undefined, paksha: Paksha, name: string, language: AppLanguage): string {
  const localized = localizeTithi(id, paksha, name, language);
  const set = TITHI[language];
  if (set) return localized.replace(new RegExp(`^(${set.light}|${set.dark})\\s+`, 'u'), '').trim();
  return localized.replace(/^(?:शुक्ल|कृष्ण|Shukla|Krishna)\s+/iu, '').trim();
}

export function adhikaMasaLabel(language: AppLanguage): string {
  const labels: Partial<Record<AppLanguage, string>> = { bn: 'অধিক মাস', mr: 'अधिक मास', te: 'అధిక మాసం', ta: 'அதிக மாதம்', gu: 'અધિક માસ', ur: 'ادھک ماس', kn: 'ಅಧಿಕ ಮಾಸ', or: 'ଅଧିକ ମାସ', ml: 'അധിക മാസം', pa: 'ਅਧਿਕ ਮਹੀਨਾ' };
  return labels[language] ?? (language === 'hi' ? 'अधिक मास' : 'Adhika Masa');
}
