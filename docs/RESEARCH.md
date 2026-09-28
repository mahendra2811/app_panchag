# Source and platform research register

**Checked:** 27 September 2026. These are public-source findings, not a completed integration, accuracy certification or legal opinion. Recheck volatile facts when dependencies are installed and before release.

| Topic | Primary source | Verified finding | Still to verify |
|---|---|---|---|
| Expo baseline | [SDK table](https://docs.expo.dev/versions/latest/) | SDK 57 maps to React Native 0.86, React 19.2.3, Node 22.13.x minimum, Android compile/target 36 | Exact patched versions, local Android toolchain and generated manifest |
| Expo Router | [official SDK documentation](https://docs.expo.dev/versions/latest/sdk/router/) | SDK 56+ routes app navigation imports through Expo Router rather than external `@react-navigation/*` imports | Installed version/API compatibility |
| Offline engine repository | [`ishankgupta95/panchang`](https://github.com/ishankgupta95/panchang) | TypeScript package `panchang-ts`; repo declares MIT and its own ephemeris; old package repo URL redirects | Complete third-party data/code origin audit |
| Engine package | [package manifest](https://github.com/ishankgupta95/panchang/blob/master/source/ts/package.json), [licence](https://github.com/ishankgupta95/panchang/blob/master/LICENSE) | 5.4.0; `MIT`; no runtime `dependencies` in the source manifest; `astronomy-engine` is a dev dependency. `npm view` agreed on version/licence at review time | Inspect exact npm tarball, bundled files and resolved dependency tree after install |
| Engine calculation contract | [TypeScript README](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md) | `getDailyPanchang` returns five limbs, month/Samvat, sun/moon, periods and festival data; location required; defaults include traditional Ujjain reference and Purnimanta month system; Amanta option documented | Native Hermes result/performance, selected-city cases, schema mapper |
| Engine table caveat | [TypeScript README](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md) | Static subpath tables are generated for Varanasi; author documents several deferred festival refinements and changes to festival selection in v5.4 | Provenance and independent date accuracy, particularly disputed observances |
| Engine accuracy claims | [TypeScript README accuracy section](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md) | Author reports 9,207 tests, reference-almanac comparisons and timings tolerances | Reproduce comparisons independently using permitted published values; authored tests are not independent evidence |
| Navamsha capability | [Developer hub](https://www.navamsha.in/developers) | Panchang/Muhurta family and API key header documented | Exact endpoint response, month/observance rules, date limits and sample quality; no key used |
| Navamsha free tier | [Pricing](https://www.navamsha.in/pricing) | Advertises 10,000 monthly calls and 10 req/sec during launch with no credit card; explicitly says limits can change | Per-endpoint credit weights and account-specific terms |
| Navamsha rights | [Terms, updated 14 June 2026](https://www.navamsha.in/legal/terms) | Limited API use while account active; no explicit permanent output redistribution clause found | Written no-cost pack permission if it is ever considered for bundled data |
| Prokerala rights | [API terms](https://api.prokerala.com/tos) | Standard terms ban creating a permanent database/archive of output and generally require refresh of cached data every 24 hours | Any separately documented exception; none assumed |
| AstrologyAPI | [Basic Panchang reference](https://astrologyapi.com/developers/v1/vedic/basic_panchang) | Endpoint documentation exists | Free allowance, convention mapping, caching and redistribution rights |
| Astronomy Engine | [repository and licence](https://github.com/cosinekitty/astronomy) | Astronomical primitives under a permissive licence | Suitability for independent sun/moon spot checks; not an observance source |
| Play API target | [Google Play target policy](https://support.google.com/googleplay/android-developer/answer/11926878) | Master plan records target API 36 requirement from 31 August 2026 | Recheck at AAB submission |

## Validation plan that resolves the open data question

1. Lock exact `panchang-ts` npm tarball; inspect `npm pack` contents, licences and dependencies. Confirm source tables or static data do not embed restricted copied content.
2. Compute a small sample in a script for Ujjain, Jodhpur, Jaipur, Delhi, Mumbai, Kolkata and Chennai, with explicit month system and region. Inspect all required intervals and metadata.
3. Compare independently published almanac values for matching city, date, ayanamsa and day-selection rules. Use a dated comparison ledger and distinguish field discrepancy, convention mismatch and source rounding. Include 2026–2029 sample dates and cases with near-sunrise transitions.
4. Evaluate Purnimanta and Amanta as separately named profiles; choose the broadest verified profile by evidence. Do not set Ujjain/Purnimanta as final solely because it is a package default.
5. Generate and validate all 1,461 days for the chosen reference profile. Audit festival rules separately from five-limb calculations. Run the same sample on Android/Hermes before claiming selected-city runtime support.

No live authenticated API call, full data generation or Android device comparison occurred in this research pass. Those are explicit build-phase tasks and release gates.
