# Panchang data policy

**Date:** 27 September 2026  
**Status:** Implementation contract; release profile, generated pack and independent accuracy remain unapproved.

## Profile selection

The user delegated the calendar convention to the broadest **verified** free source. The leading candidate is `panchang-ts` 5.4.0 local computation. Its documented default month system is Purnimanta, with Amanta also supported; its documented default reference frame is Ujjain, while its static precomputed tables are for Varanasi ([source README](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md)). These defaults do not establish a universal Indian observance convention. Ujjain/Purnimanta is a trial reference profile, not a chosen release promise.

Choose the approved profile after a comparison matrix checks (a) source rights, (b) all five limbs and month metadata, (c) festival rules and region support, (d) precision and credible independent evidence, (e) selected-city native runtime viability and (f) 2026–2029 pack generation. Record exact coordinates, IANA timezone, ayanamsa, month system, observation rule set, region selection and source version in `docs/DATA_COVERAGE.md`. A chosen city has its own profile even if its timezone matches the reference city.

## Rights matrix

| Source class | Runtime display | Persistent cache | Permanent redistribution | Current status |
|---|---|---|---|---|
| Generated output from vetted MIT local engine | Candidate | Candidate | Candidate | Engine MIT terms permit software redistribution; complete package/data origin and output rights must be audited before release |
| Navamsha launch free API | Candidate with key/proxy | Unverified | **Unverified** | Public terms grant API use during account term but give no express four-year pack grant ([terms](https://www.navamsha.in/legal/terms)) |
| Prokerala API | Only per applicable terms | 24-hour refresh unless exception | **Restricted by standard terms** | No permanent archive/database without documented exception ([terms](https://api.prokerala.com/tos)) |
| Official holiday and almanac publications | Reading/verification | Source-specific | Source-specific | Public availability does not itself grant republication |

No Navamsha or Prokerala response may enter a permanent bundled asset under current evidence. Do not use prohibited source data indirectly as generated fixture content. Store a citation or private permission reference for every source without checking private agreements into the repository.

## Field and availability contract

- Required per approved complete day: civil date, profile, sunrise context, Vara and all tithi/nakshatra/yoga/karana intervals intersecting its Hindu day, Hindu month system and source provenance. Store null with a reason where the physical event genuinely does not occur.
- Optional fields such as moonrise, Choghadiya, Hora, named Muhurtas and festival timings have field-level states: `available`, `not_loaded`, `not_supported`, `no_event`, `outside_coverage`, `expired`, `invalid`.
- Festivals are occurrences with a canonical event ID, profile, region, rule/selection provenance and review status. Ekadashi fast and Parana are separate. Published government holidays are an independent layer with jurisdiction and publication status.
- Full UTC instants and local offset strings or deterministic timezone rendering are required. Do not treat a noon snapshot as sunrise. Do not fill a missing time with midnight or a guessed time.

## Reference and local presentation

For the selected city, show only matching validated data as local. A reference pack may appear in the month grid with the reference city plainly named; detail timing groups repeat the reference label. Selected-city engine output gets its own profile and accuracy status. Never silently migrate a cached result from one city or month system to another. On city change, reload matching records or show unavailable; preserve reminders and notes.

## Pack and update policy

The initial pack target is 2026–2029 inclusive, **1,461 distinct dates per approved reference profile**. Generate versioned monthly assets and a manifest carrying source/version, profile, schema, generator, field coverage, attribution, review status, checksums and record count. Use atomic activation for later imports. Pack integrity, licence status and comparison report are production build gates. Fixture records in tests are clearly labelled and excluded from production assets.

`readDay` and `readRange` are local only. User-initiated `loadDay`, `loadRange` or `refreshDetails` may use an approved API through a secret-bearing proxy, with bounded requests and quota. Cache retention is dictated by that source's terms, regardless of an astronomical calculation's age. Expired restricted data stops displaying if terms require refresh. Cache clearing does not erase personal data. Never call remote providers on launch, ordinary swipes or search typing.

## Accuracy review

Use independent published values for selected dates/cities to compare like conventions. Sample equinoxes/solstices, leap day, tithi boundaries near sunrise, moonrise absence, adhika/kshaya cases, major festivals and Ekadashi/Parana across Jodhpur, Jaipur, Delhi, Mumbai, Kolkata and Chennai where references permit. Compare each field at its source precision; record profile mismatch and legitimate regional differences separately from computation errors. The engine author's README and its internal test suite are useful leads, not independent validation by this project. Unresolved material discrepancies block the affected record/profile.

Retain an audit record of source URL, access date, source method/version, reviewer, samples, tolerances explained by source precision and discrepancy disposition. Future engine upgrades regenerate and revalidate affected packs. Do not claim verified four-year coverage until the manifest and comparison report prove it.
