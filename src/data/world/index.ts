import data from './countries-cities.json';

export interface WorldCity {
  id: string;
  countryCode: string;
  name: string;
  asciiName: string;
  adminCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  featureCode: string;
}

type Row = [string, string, string, string, string, number, number, string, number, string];
export const COUNTRIES = (data.countries as [string, string][]).map(([code, name]) => ({ code, name }));
const rows = data.cities as Row[];
export const TIME_ZONES = [...new Set(rows.map((row) => row[7]))].sort();
const byId = new Map(rows.map((row) => [row[0], row]));
const byCountry = new Map<string, Row[]>();
for (const row of rows) {
  const list = byCountry.get(row[1]) ?? [];
  list.push(row);
  byCountry.set(row[1], list);
}
function unpack(row: Row): WorldCity {
  const [id, countryCode, name, asciiName, adminCode, latitude, longitude, timezone, population, featureCode] = row;
  return { id, countryCode, name, asciiName, adminCode, latitude, longitude, timezone, population, featureCode };
}
export function getWorldCity(id: string): WorldCity | null {
  const row = byId.get(id.replace(/^gn:/, ''));
  return row ? unpack(row) : null;
}
export function getWorldCities(countryCode: string): WorldCity[] {
  return (byCountry.get(countryCode) ?? []).map(unpack);
}
