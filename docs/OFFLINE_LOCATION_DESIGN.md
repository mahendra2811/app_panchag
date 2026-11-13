# Offline worldwide location design

## Goal

Replace runtime country-name generation that crashes onboarding, and let users choose an offline location with an IANA time zone and coordinates for Panchang calculations.

## Proposed approach

- Generate a compact, versioned JSON dataset from the supplied GeoNames `cities15000.txt`, a pinned ISO 3166-1 alpha-2 list, and pinned English Unicode CLDR territory names. Record source versions, checksums, and required licence and attribution notices. Keep city GeoNames IDs, names, country codes, admin codes, coordinates, populations, feature codes, and IANA zones; deduplicate by GeoNames ID. Validate every record and report skipped rows. Include capitals in the supplied file and retain the supplied major-city coverage; the file is not a complete list of all cities or necessarily all capitals.
- Bundle the generated data through the Expo/Metro application asset system and load it in TypeScript, which is the architecture already used by this app. The native Android directory is generated and ignored in Git; a Kotlin asset loader would add a native bridge and a regeneration burden. The bundled data must be available without network access.
- Provide searchable country and city selection in onboarding and location settings. Preserve the existing Indian state, city and district choices and saved user preferences. Countries with no suitable city may be saved by name, but must be shown as lacking a calculable location until coordinates and a time zone are provided; a country can have multiple time zones and a country name cannot reliably identify either.
- Persist the selected country code, GeoNames ID, latitude, longitude and IANA time zone. Keep legacy Indian IDs readable and migrate them without silently changing users' locations. Show enough administrative context to distinguish cities with identical names.
- Use the selected zone for the local calendar date and calculations instead of hard-coded Asia/Kolkata. The bundled Panchang engine accepts a time-zone name but resolves one offset for each calculation; its documentation notes that a sunrise-to-sunrise day crossing a daylight-saving transition can have shifted local times. Resolve and test that limitation before claiming worldwide accuracy, and avoid silently presenting unreliable times. Include the location and zone in cache keys.
- Test dataset integrity, first-run onboarding without `Intl.DisplayNames`, saved Indian locations, duplicate names, time zones on both sides of UTC and DST transitions. Verify an actual release build offline on Android.

## Alternatives

1. **Expo/Metro JSON (recommended):** Fits the current React Native code and survives native regeneration; requires measuring startup and memory with the chosen dataset.
2. **Native Android asset with Kotlin/Moshi:** Matches the original native proposal but needs a maintained bridge, config plugin and native regeneration for an app whose UI and calculations are TypeScript.
3. **Country-only time-zone mapping:** Smaller, but incorrect for countries with multiple zones and cannot supply accurate city coordinates; unsuitable for automatic Panchang calculations.

## Known inputs and limits

The supplied file contains 34,215 lines. It does not itself provide the complete ISO country list or CLDR names, so those inputs must be obtained and pinned. The present app's `panchang-ts` dependency documents a DST transition-day limitation. Data freshness depends on future bundled releases; offline does not mean automatic time-zone law updates.
