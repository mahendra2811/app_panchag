import { getDailyPanchang } from 'panchang-ts';
import { addCivilDays, civilDateToISTNoon, compareCivilDates, parseCivilDate, type CivilDate } from '../../domain/calendar';
import { getCityById, type City } from '../../data/cities';
import { engineLanguage, type AppLanguage } from '../../i18n/languages';

export type MonthSystem = 'purnimanta' | 'amanta';
export type FestivalRegion = 'all' | 'tamil-nadu' | 'kerala' | 'karnataka' | 'andhra-pradesh' | 'telangana' |
  'west-bengal' | 'odisha' | 'assam' | 'bihar' | 'jharkhand' | 'gujarat' | 'maharashtra' | 'goa' |
  'rajasthan' | 'punjab' | 'haryana' | 'himachal-pradesh' | 'uttarakhand' | 'uttar-pradesh' | 'madhya-pradesh';
export interface PanchangProfile { cityId: string; monthSystem: MonthSystem; region: FestivalRegion }
export type Availability = 'available' | 'not_loaded' | 'not_supported' | 'no_event' | 'outside_coverage' | 'expired' | 'invalid';
export interface PanchangPeriod {
  id: string;
  name: string;
  index: number | null;
  startsAt: string | null;
  endsAt: string | null;
  startsLocal: string | null;
  endsLocal: string | null;
  isActiveAtSunrise?: boolean;
  paksha?: 'SHUKLA' | 'KRISHNA' | null;
  quality?: 'auspicious' | 'inauspicious' | 'neutral';
  segment?: 'day' | 'night';
}
export interface PanchangObservance {
  id: string;
  canonicalId: string;
  name: string;
  category: string;
  region: FestivalRegion;
  reviewStatus: 'engine_calculated_unverified';
}
export interface PanchangProvenance {
  providerId: 'panchang-ts';
  sourceVersion: '5.4.0';
  schemaVersion: 1;
  profileId: string;
  retrievedAt: string;
  licencePolicyId: 'panchang-ts-mit-local-v1';
  validUntil: null;
  calculationStatus: 'engine_calculated_unverified';
  coordinateStatus: 'curated_city_centre' | 'postal_district_approximation';
  ayanamsa: 'lahiri';
  observanceRuleSet: 'panchang-ts-5.4.0-default';
}
export interface PanchangDay {
  date: CivilDate;
  contentLanguage: 'en' | 'hi';
  cityId: string;
  cityName: string;
  timezone: 'Asia/Kolkata';
  profile: PanchangProfile;
  provenance: PanchangProvenance;
  summaryAtSunrise: {
    tithiId: string | null;
    tithiName: string | null;
    pakshaId: 'SHUKLA' | 'KRISHNA' | null;
    masaId: string | null;
    masaName: string | null;
    monthSystem: MonthSystem;
    isAdhika: boolean | null;
    isKshaya: boolean | null;
    vikramSamvat: number | null;
    shakaSamvat: number | null;
  };
  limbs: {
    varaId: string;
    varaName: string;
    tithi: PanchangPeriod[];
    nakshatra: PanchangPeriod[];
    yoga: PanchangPeriod[];
    karana: PanchangPeriod[];
  };
  astronomy: {
    sunrise: { status: Availability; instant?: string; local?: string };
    sunset: { status: Availability; instant?: string; local?: string };
    nextSunrise: { status: Availability; instant?: string; local?: string };
    moonrise: { status: Availability; instant?: string; local?: string };
    moonset: { status: Availability; instant?: string; local?: string };
  };
  namedPeriods: Record<string, PanchangPeriod[]>;
  observances: PanchangObservance[];
  observanceOccurrenceIds: string[];
  fieldAvailability: Record<string, Availability>;
}
export type PanchangLoadResult =
  | { status: 'available'; day: PanchangDay }
  | { status: 'invalid' | 'outside_coverage' | 'not_supported'; day: null; reason: string };

/** Stable semantic key. Provider version remains in provenance, so engine updates can replace a compatible result. */
export function createProfileId(profile: PanchangProfile): string | null {
  const city = getCityById(profile.cityId);
  if (!city || !isMonthSystem(profile.monthSystem) || !isFestivalRegion(profile.region)) return null;
  return `in:${city.id}:${city.latitude.toFixed(4)},${city.longitude.toFixed(4)}:Asia_Kolkata:${profile.monthSystem}:${profile.region}:lahiri:engine-default`;
}

const REGIONS: readonly FestivalRegion[] = ['all','tamil-nadu','kerala','karnataka','andhra-pradesh','telangana',
  'west-bengal','odisha','assam','bihar','jharkhand','gujarat','maharashtra','goa','rajasthan','punjab','haryana',
  'himachal-pradesh','uttarakhand','uttar-pradesh','madhya-pradesh'];
function isMonthSystem(value: string): value is MonthSystem { return value === 'purnimanta' || value === 'amanta'; }
function isFestivalRegion(value: string): value is FestivalRegion { return REGIONS.includes(value as FestivalRegion); }

const cache = new Map<string, PanchangDay>();
const MAX_CACHED_DAYS = 400;
export function getCachedPanchangDay(date: CivilDate | string, profile: PanchangProfile, language: AppLanguage = 'en'): PanchangDay | null {
  const id = createProfileId(profile);
  return id ? cache.get(`${id}:${date}:${engineLanguage(language)}`) ?? null : null;
}
export function clearPanchangCache(): void { cache.clear(); }
export function getPanchangCacheSize(): number { return cache.size; }

function paksha(value: string): 'SHUKLA' | 'KRISHNA' | null {
  const normalized = value.toLowerCase();
  return normalized.includes('shukla') || normalized.includes('शुक्ल') ? 'SHUKLA'
    : normalized.includes('krishna') || normalized.includes('कृष्ण') ? 'KRISHNA' : null;
}
function instant(value: Date | null | undefined): string | null { return value instanceof Date && Number.isFinite(value.getTime()) ? value.toISOString() : null; }
function period(id: string, name: string, index: number | null, start: Date | null, end: Date | null,
  startLocal: string | null, endLocal: string | null, extra: Partial<PanchangPeriod> = {}): PanchangPeriod {
  return { id, name, index, startsAt: instant(start), endsAt: instant(end), startsLocal: startLocal ?? null, endsLocal: endLocal ?? null, ...extra };
}

type EngineDay = NonNullable<ReturnType<typeof getDailyPanchang>>;
function normalizeDay(date: CivilDate, city: City, profile: PanchangProfile, profileId: string, language: 'en' | 'hi', source: EngineDay): PanchangDay {
  const tithi = source.angas.tithis.map(entry => period(`tithi:${entry.index}`, entry.name, entry.index, entry.startTime, entry.endTime, entry.startTimeLocal, entry.endTimeLocal, { isActiveAtSunrise: entry.isActiveAtSunrise, paksha: paksha(entry.paksha) }));
  const nakshatra = source.angas.nakshatras.map(entry => period(`nakshatra:${entry.index}`, entry.name, entry.index, entry.startTime, entry.endTime, entry.startTimeLocal, entry.endTimeLocal, { isActiveAtSunrise: entry.isActiveAtSunrise }));
  const yoga = source.angas.yogas.map(entry => period(`yoga:${entry.index}`, entry.name, entry.index, entry.startTime, entry.endTime, entry.startTimeLocal, entry.endTimeLocal, { isActiveAtSunrise: entry.isActiveAtSunrise }));
  const karana = source.angas.karanas.map(entry => period(`karana:${entry.index}`, entry.name, entry.index, entry.startTime, entry.endTime, entry.startTimeLocal, entry.endTimeLocal, { isActiveAtSunrise: entry.isActiveAtSunrise }));
  const timed = (id: string, name: string, sourcePeriod: {start: Date; end: Date; startLocal: string; endLocal: string} | null) => sourcePeriod ?
    [period(id,name,null,sourcePeriod.start,sourcePeriod.end,sourcePeriod.startLocal,sourcePeriod.endLocal)] : [];
  const namedPeriods: Record<string,PanchangPeriod[]> = {
    rahuKalam: timed('rahu-kalam','Rahu Kalam',source.inauspicious.rahuKalam),
    gulikaKalam: timed('gulika-kalam','Gulika Kalam',source.inauspicious.gulikaKalam),
    yamaganda: timed('yamaganda','Yamaganda',source.inauspicious.yamaganda),
    abhijit: timed('abhijit','Abhijit Muhurta',source.muhurtas.abhijit),
    brahma: timed('brahma','Brahma Muhurta',source.muhurtas.brahma),
    vijaya: timed('vijaya','Vijaya Muhurta',source.muhurtas.vijaya),
    godhuli: timed('godhuli','Godhuli',source.muhurtas.godhuli),
    nishita: timed('nishita','Nishita',source.muhurtas.nishita),
    durMuhurta: source.inauspicious.durMuhurta.map((entry,i) => period(`dur-muhurta:${i}`,'Dur Muhurta',i,entry.start,entry.end,entry.startLocal,entry.endLocal,{segment:entry.segment})),
    varjyam: source.inauspicious.varjyam.map((entry,i) => period(`varjyam:${i}`,'Varjyam',i,entry.start,entry.end,entry.startLocal,entry.endLocal)),
    amritKala: source.muhurtas.amritKala.map((entry,i) => period(`amrit-kala:${i}`,'Amrit Kala',i,entry.start,entry.end,entry.startLocal,entry.endLocal)),
    choghadiyaDay: source.periods.choghadiya.day.map((entry,i) => period(`choghadiya:day:${i}`,entry.name,entry.index,entry.start,entry.end,entry.startLocal,entry.endLocal,{quality:entry.quality,segment:'day'})),
    choghadiyaNight: source.periods.choghadiya.night.map((entry,i) => period(`choghadiya:night:${i}`,entry.name,entry.index,entry.start,entry.end,entry.startLocal,entry.endLocal,{quality:entry.quality,segment:'night'})),
    horaDay: source.periods.hora.day.map((entry,i) => period(`hora:day:${i}`,entry.planet,entry.planetIndex,entry.start,entry.end,entry.startLocal,entry.endLocal,{segment:'day'})),
    horaNight: source.periods.hora.night.map((entry,i) => period(`hora:night:${i}`,entry.planet,entry.planetIndex,entry.start,entry.end,entry.startLocal,entry.endLocal,{segment:'night'})),
  };
  const observances: PanchangObservance[] = source.festivals.map((entry,i) => ({
    id: `${profileId}:${date}:${entry.key}:${i}`, canonicalId: entry.key, name: entry.name,
    category: entry.type, region: profile.region, reviewStatus: 'engine_calculated_unverified',
  }));
  const maybeTime = (dateValue: Date | null, localValue: string | null) => dateValue ?
    { status: 'available' as const, instant: instant(dateValue)!, local: localValue ?? undefined } : { status: 'no_event' as const };
  const activeTithi = source.angas.tithis.find(entry => entry.isActiveAtSunrise) ?? source.angas.tithis[0];
  return {
    date, contentLanguage: language, cityId: city.id, cityName: city.name, timezone: city.timezone, profile,
    provenance: { providerId: 'panchang-ts', sourceVersion: '5.4.0', schemaVersion: 1, profileId,
      retrievedAt: new Date().toISOString(), licencePolicyId: 'panchang-ts-mit-local-v1', validUntil: null,
      calculationStatus: 'engine_calculated_unverified',
      coordinateStatus: city.kind === 'district' ? 'postal_district_approximation' : 'curated_city_centre',
      ayanamsa: 'lahiri', observanceRuleSet: 'panchang-ts-5.4.0-default' },
    summaryAtSunrise: { tithiId: activeTithi ? `tithi:${activeTithi.index}` : null,
      tithiName: activeTithi?.name ?? null, pakshaId: activeTithi ? paksha(activeTithi.paksha) : null,
      masaId: `masa:${source.calendar.chandramasa.index}`, masaName: source.calendar.chandramasa.name,
      monthSystem: profile.monthSystem, isAdhika: source.calendar.chandramasa.isAdhika, isKshaya: null,
      vikramSamvat: source.calendar.samvat.vikramSamvat, shakaSamvat: source.calendar.samvat.shakaSamvat },
    limbs: { varaId: `vara:${source.angas.vara.index}`, varaName: source.angas.vara.name, tithi, nakshatra, yoga, karana },
    astronomy: { sunrise: maybeTime(source.sun.rise,source.sun.riseLocal), sunset: maybeTime(source.sun.set,source.sun.setLocal),
      nextSunrise: maybeTime(source.sun.nextRise,source.sun.nextRiseLocal), moonrise: maybeTime(source.moon.rise,source.moon.riseLocal),
      moonset: maybeTime(source.moon.set,source.moon.setLocal) },
    namedPeriods, observances, observanceOccurrenceIds: observances.map(entry => entry.id),
    fieldAvailability: { tithi:'available',nakshatra:'available',yoga:'available',karana:'available',vara:'available',
      sunrise:'available',sunset:'available',moonrise:source.moon.rise?'available':'no_event',
      moonset:source.moon.set?'available':'no_event',festivals:'available',
      isKshaya:'not_supported',parana:'not_supported',governmentHolidays:'not_loaded' },
  };
}

/** Local-only compute. A short yield lets React paint a loading state before the synchronous engine runs. */
export async function loadPanchangDay(date: CivilDate | string, profile: PanchangProfile, language: AppLanguage = 'en'): Promise<PanchangLoadResult> {
  const parts = parseCivilDate(date);
  if (!parts) return { status: 'invalid', day: null, reason: 'Invalid Gregorian date' };
  if (parts.year < 1900 || parts.year > 2100) return { status: 'outside_coverage', day: null, reason: 'Panchang calculation is limited to 1900–2100; Gregorian browsing remains available.' };
  const city = getCityById(profile.cityId);
  const profileId = createProfileId(profile);
  if (!city || !profileId) return { status: 'not_supported', day: null, reason: 'Choose a supported city, month system and region.' };
  const calculationLanguage = engineLanguage(language);
  const cached = getCachedPanchangDay(date,profile,calculationLanguage);
  if (cached) return { status: 'available', day: cached };
  await new Promise<void>(resolve => setTimeout(resolve,0));
  try {
    const instant = civilDateToISTNoon(date)!;
    const result = getDailyPanchang(instant,{latitude:city.latitude,longitude:city.longitude},
      {timezone:330,masaSystem:profile.monthSystem,region:profile.region,ayanamsa:'lahiri',language:calculationLanguage});
    if (!result) return { status: 'not_supported', day: null, reason: 'The engine could not form a sunrise-to-sunrise day for this location.' };
    const day = normalizeDay(date as CivilDate,city,profile,profileId,calculationLanguage,result);
    cache.set(`${profileId}:${date}:${calculationLanguage}`,day);
    if (cache.size > MAX_CACHED_DAYS) cache.delete(cache.keys().next().value!);
    return { status: 'available', day };
  } catch (error) {
    return { status: 'invalid', day: null, reason: error instanceof Error ? error.message : 'Panchang calculation failed.' };
  }
}

/** Inclusive range, capped to a single visible month plus adjacent cells. */
export async function loadPanchangRange(start: CivilDate | string, end: CivilDate | string, profile: PanchangProfile, language: AppLanguage = 'en'): Promise<PanchangLoadResult[]> {
  if (!parseCivilDate(start) || !parseCivilDate(end) || compareCivilDates(start,end) > 0) throw new RangeError('Invalid date range');
  const results: PanchangLoadResult[] = [];
  let cursor: CivilDate | null = start as CivilDate;
  while (cursor && compareCivilDates(cursor,end) <= 0) {
    if (results.length >= 42) throw new RangeError('Range exceeds 42 days');
    results.push(await loadPanchangDay(cursor,profile,language));
    cursor = addCivilDays(cursor,1);
  }
  return results;
}
