# Panchang and location coverage

**Implementation date:** 28 September 2026  
**Release status:** Source calculated; independent review outstanding

## Live offline calculation

The app's `panchang-ts` 5.4.0 adapter calculates a selected Indian city locally, with no account, GPS or network request. The adapter accepts the curated cities in `src/data/cities`, Amanta or Purnimanta month naming, and `all` or one of the engine's supported regional festival filters. All cities use `Asia/Kolkata` and an explicit +330 minute engine offset. Panchang requests are limited to 1900–2100 while Gregorian browsing supports 0001–9999.

Results preserve all engine transitions from sunrise to next sunrise for tithi, nakshatra, yoga and karana. Sunrise/sunset, moonrise/moonset, Rahu Kalam, several Muhurtas, Choghadiya and Hora are retained with true UTC instants and offset-bearing local strings. A missing moonrise/moonset is marked `no_event`. Unknown kshaya month, Parana and government holidays are not invented. Engine festival occurrences are marked `engine_calculated_unverified`; their list is not a guarantee of all community observances.

City coordinates are curated centre points to four decimals. A user-selected city always has its own profile ID containing those coordinates, zone, month system and region. The app does not silently substitute Ujjain for another city. The coordinate list needs a documented, independent source audit before exact timing claims are released.

## Provisional four year pack

`scripts/generate-panchang-data/provisional-output/manifest.json` records 48 Ujjain month files, 1,461 unique civil dates from 2026-01-01 to 2029-12-31, SHA-256 hashes, profile coordinates, engine version, schema version and review status. This is a **candidate reference pack**. The generator intentionally writes outside app assets, and the manifest states `releaseApproved: false`. No provider API response or government holiday calendar was copied into it.

| Coverage item | Status |
|---|---|
| Gregorian calendar, 0001–9999 | Implemented in civil date module |
| Selected city Panchang, 1900–2100 | Offline engine adapter implemented; independent accuracy review pending |
| Ujjain 2026–2029 candidate pack | Generated, 1,461 days; not activated in app |
| Festival/vrat occurrence completeness | Engine calculations present; regional/observance review pending |
| Government holidays by jurisdiction/year | No authoritative source imported; unavailable until official notices are audited |
| Exact timing precision and coordinates | Engine strings preserved; external comparison and coordinate audit pending |

## Remaining release evidence

Compare like-for-like almanac dates and timings for Jodhpur, Jaipur, Delhi, Mumbai, Kolkata and Chennai, including tithi boundaries, leap/adhika months, major festivals and Ekadashi/Parana. Record publication, date, city coordinates, convention, tolerance and discrepancy for each comparison. Audit the provenance and reuse rights of the selected coordinate dataset. Check the engine's festival rule set against independent sources. Only then update the manifest approval and place reviewed assets in the app bundle.

The MIT licence file for the installed engine is `node_modules/panchang-ts/LICENSE`, and package metadata identifies version 5.4.0. The local adapter's provenance links records to that version; redistributing a reviewed pack should preserve its notice.
