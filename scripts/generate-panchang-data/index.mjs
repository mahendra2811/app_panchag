#!/usr/bin/env node
/**
 * Generate an auditable, PROVISIONAL Ujjain/Purnimanta reference pack.
 * The generated output is intentionally outside app assets until an independent
 * accuracy review, coordinate review and rights audit approve its release.
 * Run: node scripts/generate-panchang-data/index.mjs [output-directory]
 */
import { createHash } from 'node:crypto';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDailyPanchang } from 'panchang-ts';

const root = path.resolve(process.argv[2] ?? 'scripts/generate-panchang-data/provisional-output');
const temp = `${root}.tmp-${process.pid}`;
const location = { latitude: 23.1765, longitude: 75.7885 };
const profile = {
  cityId: 'ujjain', cityName: 'Ujjain', coordinates: location,
  timezone: 'Asia/Kolkata', timezoneOffsetMinutes: 330,
  monthSystem: 'purnimanta', region: 'all', ayanamsa: 'lahiri',
  observanceRuleSet: 'panchang-ts-5.4.0-default',
};
const sha256 = value => createHash('sha256').update(value).digest('hex');
const iso = (year, month, day) => `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
const instant = value => value instanceof Date ? value.toISOString() : null;
const normalizeInterval = (value, id, name, index = null) => ({
  id, name, index, startsAt: instant(value.start), endsAt: instant(value.end),
  startsLocal: value.startLocal ?? null, endsLocal: value.endLocal ?? null,
});
const normalizeAnga = (items, kind) => items.map(item => ({
  id: `${kind}:${item.index}`, index: item.index, name: item.name,
  startsAt: instant(item.startTime), endsAt: instant(item.endTime),
  startsLocal: item.startTimeLocal ?? null, endsLocal: item.endTimeLocal ?? null,
  isActiveAtSunrise: item.isActiveAtSunrise,
  ...(kind === 'tithi' ? { paksha: item.paksha, number: item.number } : {}),
}));

function normalizeDay(date, result) {
  const lunar = result.calendar.chandramasa;
  const samvat = result.calendar.samvat;
  return {
    date,
    sunrise: { instant: instant(result.sun.rise), local: result.sun.riseLocal },
    sunset: { instant: instant(result.sun.set), local: result.sun.setLocal },
    nextSunrise: { instant: instant(result.sun.nextRise), local: result.sun.nextRiseLocal },
    moonrise: { instant: instant(result.moon.rise), local: result.moon.riseLocal, status: result.moon.rise ? 'available' : 'no_event' },
    moonset: { instant: instant(result.moon.set), local: result.moon.setLocal, status: result.moon.set ? 'available' : 'no_event' },
    vara: { id: `vara:${result.angas.vara.index}`, name: result.angas.vara.name },
    tithi: normalizeAnga(result.angas.tithis, 'tithi'),
    nakshatra: normalizeAnga(result.angas.nakshatras, 'nakshatra'),
    yoga: normalizeAnga(result.angas.yogas, 'yoga'),
    karana: normalizeAnga(result.angas.karanas, 'karana'),
    lunarMonth: { id: `masa:${lunar.index}`, name: lunar.name, isAdhika: lunar.isAdhika, isKshaya: null, system: lunar.system },
    samvat: { vikram: samvat.vikramSamvat, shaka: samvat.shakaSamvat },
    rahuKalam: normalizeInterval(result.inauspicious.rahuKalam,'rahu-kalam','Rahu Kalam'),
    observances: result.festivals.map((festival,index) => ({
      occurrenceId: `ujjain-purnimanta-all:${date}:${festival.key}:${index}`,
      canonicalId: festival.key, name: festival.name, category: festival.type,
      reviewStatus: 'engine_calculated_unverified',
    })),
  };
}

async function main() {
  await rm(temp, { recursive: true, force: true });
  await mkdir(temp, { recursive: true });
  const files = [];
  let count = 0;
  const seen = new Set();
  for (let year = 2026; year <= 2029; year++) {
    for (let month = 1; month <= 12; month++) {
      const days = new Date(Date.UTC(year,month,0)).getUTCDate();
      const records = [];
      for (let day = 1; day <= days; day++) {
        const date = iso(year,month,day);
        if (seen.has(date)) throw new Error(`Duplicate date ${date}`);
        seen.add(date);
        // Noon in India, explicitly represented in UTC; never use host local time.
        const requestedInstant = new Date(Date.UTC(year,month - 1,day,6,30));
        const result = getDailyPanchang(requestedInstant,location,
          { timezone:330,masaSystem:'purnimanta',region:'all',ayanamsa:'lahiri',language:'en' });
        if (!result) throw new Error(`No sunrise-to-sunrise Panchang for ${date}`);
        records.push(normalizeDay(date,result));
        count++;
      }
      const filename = `${year}/${String(month).padStart(2,'0')}.json`;
      const content = `${JSON.stringify({ schemaVersion:1,profile,year,month,reviewStatus:'provisional_unverified',days:records })}\n`;
      await mkdir(path.join(temp,String(year)),{recursive:true});
      await writeFile(path.join(temp,filename),content);
      files.push({ file:filename, days:records.length, sha256:sha256(content) });
    }
  }
  if (count !== 1461 || seen.size !== 1461 || files.length !== 48) throw new Error('Four-year coverage is incomplete');
  const manifest = {
    schemaVersion:1, generator:'scripts/generate-panchang-data/index.mjs', generatorVersion:1,
    engine:{id:'panchang-ts',version:'5.4.0',licence:'MIT'}, profile,
    dateStart:'2026-01-01',dateEnd:'2029-12-31',uniqueDateCount:count,monthFileCount:files.length,
    reviewStatus:'provisional_unverified',releaseApproved:false,
    caveats:['Independent accuracy review pending','City-centre coordinates pending source audit',
      'Festival rules and occurrences require independent review','Government holidays are not included'],
    files,
  };
  await writeFile(path.join(temp,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);
  await rm(root,{recursive:true,force:true});
  await rename(temp,root);
  process.stdout.write(`Generated ${count} provisional days in 48 month files at ${root}\n`);
}

main().catch(async error => { await rm(temp,{recursive:true,force:true}); console.error(error); process.exitCode = 1; });
