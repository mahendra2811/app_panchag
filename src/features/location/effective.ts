import { getCityById } from '../../data/cities';
import { isTimeZone } from '../../domain/recurrence';

/** One source of truth for both calculations and labels, including damaged saved settings. */
export function resolveEffectiveLocation(cityId: string | null, override: string | null) {
  const saved = cityId ? getCityById(cityId) : null;
  const invalidCity = !!cityId && !saved;
  const zone = override ?? saved?.timezone ?? 'Asia/Kolkata';
  const invalidZone = !isTimeZone(zone);
  const fallback = !saved || invalidZone;
  const city = invalidCity || invalidZone || !saved ? getCityById('ujjain')! : saved;
  // A deliberate override can be used with the default location, but a broken saved
  // city or invalid zone must not be presented as a usable selected location.
  const timezone = invalidCity || invalidZone ? 'Asia/Kolkata' : zone;
  return { city, timezone, fallback, reason: invalidCity ? 'The saved city is unavailable.' : invalidZone ? 'The saved time zone is unavailable.' : !saved ? 'No city was selected.' : null };
}
