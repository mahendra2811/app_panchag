// Usage: node scripts/generate-locations/generate.cjs /path/to/cities15000.txt
// Input country names are a pinned ISO 3166-1/Unicode CLDR snapshot, not runtime Intl.
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const input = process.argv[2];
if (!input) throw new Error('Pass the path to the GeoNames cities15000.txt file');
const raw = fs.readFileSync(input);
const countries = require('./countries.json');
const validCountries = new Set(countries.map(([code]) => code));
const ids = new Set();
const rows = [];
let rejected = 0;
for (const line of raw.toString('utf8').split(/\r?\n/)) {
  if (!line) continue;
  const f = line.split('\t');
  const [id, name, ascii] = f;
  const latitude = Number(f[4]), longitude = Number(f[5]);
  const country = f[8], zone = f[17], population = Number(f[14]);
  if (f.length < 19 || !/^\d+$/.test(id) || ids.has(id) || !name || !validCountries.has(country) || !Number.isFinite(latitude) || Math.abs(latitude)>90 || !Number.isFinite(longitude) || Math.abs(longitude)>180 || !zone || !Number.isFinite(population)) { rejected++; continue; }
  ids.add(id);
  // ID, country, name, ASCII search alias, first admin code, lat, lon, zone, population, feature code
  rows.push([id,country,name,ascii === name ? '' : ascii,f[10],latitude,longitude,zone,population,f[7]]);
}
rows.sort((a,b) => a[1].localeCompare(b[1]) || b[8]-a[8] || a[0].localeCompare(b[0]));
const data={version:1,countries,cities:rows};
const out=path.join(__dirname,'../../src/data/world/countries-cities.json');
fs.writeFileSync(out,JSON.stringify(data));
console.log(JSON.stringify({count:rows.length,rejected,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),outputBytes:fs.statSync(out).size}));
