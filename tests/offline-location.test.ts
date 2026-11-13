import { COUNTRIES, getWorldCities, getWorldCity } from '../src/data/world';
import { getCityById } from '../src/data/cities';
import { createProfileId, loadPanchangDay } from '../src/services/panchang';
import { resolveEffectiveLocation } from '../src/features/location/effective';
import { shouldFollowToday } from '../src/features/calendar/followToday';

test('the offline dataset covers the ISO country list and preserves unique GeoNames IDs', () => {
  expect(COUNTRIES).toHaveLength(249);
  expect(new Set(COUNTRIES.map((country) => country.code)).size).toBe(249);
  expect(COUNTRIES.find((country) => country.code === 'IN')?.name).toBe('India');
  const cities = getWorldCities('US');
  const newYork = cities.find((city) => city.id === '5128581');
  expect(newYork).toMatchObject({ name: 'New York City', countryCode: 'US', timezone: 'America/New_York' });
  expect(getWorldCity('gn:5128581')).toEqual(newYork);
  expect(getCityById('gn:5128581')).toMatchObject({ geoId: '5128581', timezone: 'America/New_York' });
  expect(new Set(cities.map((city) => city.id)).size).toBe(cities.length);
});

test('Indian GeoNames cities are selectable in the same dataset as global cities', () => {
  const india = getWorldCities('IN');
  const delhi = india.find((city) => city.id === '1273294');
  expect(delhi).toMatchObject({ countryCode: 'IN', timezone: 'Asia/Kolkata' });
  expect(getCityById(`gn:${delhi!.id}`)?.name).toBe(delhi!.name);
  expect(getCityById('gn:1264527')?.stateId).toBe('TN'); // Chennai
  expect(getCityById('gn:1275339')?.stateId).toBe('MH'); // Mumbai
});

test('invalid saved location and time zone resolve consistently to a visible India fallback', () => {
  expect(resolveEffectiveLocation('gn:999999999', 'America/New_York')).toMatchObject({ city: { id: 'ujjain' }, timezone: 'Asia/Kolkata', fallback: true });
  expect(resolveEffectiveLocation('gn:5128581', 'not-a-timezone')).toMatchObject({ city: { id: 'ujjain' }, timezone: 'Asia/Kolkata', fallback: true });
  expect(resolveEffectiveLocation(null, 'America/New_York')).toMatchObject({ city: { id: 'ujjain' }, timezone: 'America/New_York', fallback: true });
  expect(resolveEffectiveLocation('gn:5128581', null)).toMatchObject({ city: { id: 'gn:5128581' }, timezone: 'America/New_York', fallback: false });
});

test('a local-date change follows today without overriding deliberate date navigation', () => {
  expect(shouldFollowToday('2026-01-31', '2026-01-31', '2026-02-01')).toBe(true);
  expect(shouldFollowToday('2026-01-15', '2026-01-31', '2026-02-01')).toBe(false);
  expect(shouldFollowToday('2026-01-31', '2026-01-31', '2026-01-31')).toBe(false);
});

test('Panchang cache identities include timezone and guard DST transition days', async () => {
  const base = { cityId: 'gn:5128581', monthSystem: 'purnimanta' as const, region: 'all' as const };
  expect(createProfileId({ ...base, timezone: 'America/New_York' })).not.toEqual(createProfileId({ ...base, timezone: 'Asia/Kolkata' }));
  const result = await loadPanchangDay('2026-03-08', { ...base, timezone: 'America/New_York' });
  expect(result.status).toBe('not_supported');
  if (result.status === 'not_supported') expect(result.reason).toMatch(/daylight saving/i);
  const ordinary = await loadPanchangDay('2026-02-08', { ...base, timezone: 'America/New_York' });
  expect(ordinary.status).toBe('available');
  if (ordinary.status === 'available') expect(ordinary.day.timezone).toBe('America/New_York');
});
