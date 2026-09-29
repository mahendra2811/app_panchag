# Hindu Calendar — Panchang

Hindi/English Android calendar built with Expo Router, React Native and TypeScript. The app offers Gregorian month/week/today views, selected-city offline Panchang, calculated festivals and vrats, local notes, reminders, and optional local notifications. It does not require an account, GPS, or a Panchang API key.

## Start the app

Requires Node.js 22.13+ and npm. Install dependencies with `npm ci`, then run `npm start` for Metro or `npm run android` to build and open on an Android device or emulator. This project targets Android; Expo may still print a `w` shortcut, but the browser bundle is not a supported app target. The default QR code opens an installed Android development build. For the Expo Go app, run `npm run start:go` and scan its new `exp://` QR code. The `panchang-ts` dependency uses the checked local tarball in `vendor/`, so installation does not need that package's registry listing. The app starts with an empty `.env`; no online service is required. `eas.json` contains development/preview APK and production AAB profiles.

On some Ubuntu setups Expo prints a React Native DevTools `chrome-sandbox` warning at startup. Metro continues running and Android bundling is unaffected. `npm run start:quiet` skips this optional debugger shell preparation, but does not show the interactive QR/shortcut menu; use normal `npm start` when that menu is needed. Do not change the cached Chromium helper to setuid root just to run the app.

## Product choices

- Four tabs: Home, Calendar, Reminders, More.
- Choose a state and district during onboarding, or a listed city for a more precise location. District Panchang timings use an approximate point derived from postal office coordinates in `Asia/Kolkata`; listed cities use curated centre coordinates.
- Choose Hindi or English, Purnimanta or Amanta month names, Sunday/Monday week start, simple/detailed view, and text size.
- Panchang is calculated locally by MIT licensed `panchang-ts@5.4.0`. The current adapter supports selected-city dates from 1900–2100; ordinary Gregorian navigation supports 0001–9999.
- Personal reminders and notes use SQLite. Notifications are local, optional and scheduled on a rolling 90-day horizon.
- Government holiday data is unavailable until official year-specific notices are sourced. Festival calculations are never labelled as government holidays.

## Data and release status

The 2026–2029 Ujjain/Purnimanta candidate pack is at `scripts/generate-panchang-data/provisional-output`. Its manifest contains 1,461 dates and `releaseApproved:false`; it is deliberately outside app assets pending independent accuracy and source review. The app calculates selected-city days offline without that pack. See [coverage](docs/DATA_COVERAGE.md), [data policy](docs/PANCHANG_DATA_POLICY.md), [limitations](docs/RELEASE_LIMITATIONS.md), and the [master plan](HINDU_CALENDAR_CODEX_MASTER_PROMPT.md).

The offline location picker includes 754 named postal districts across 36 states and union territories, copied as a compact derived snapshot from [All India Pincode JSON API](https://aniket-thapa.github.io/india-pincode-api/). Its source also contains a synthetic `NA` record, which is excluded. To regenerate from a local copy, run `python3 scripts/generate-postal-districts.py "/path/to/india-pincode-api"`. The source is [CC BY-NC 4.0](src/data/cities/POSTAL_DATA_LICENSE.txt); district coordinates are approximate and postal records can have spelling or coordinate errors. Commercial distribution needs a separate licensed or permissive replacement dataset.

The Play Store listing and release checklist are drafts under `play-store/`. Publication requires final identity, support contact, hosted privacy policy, reviewed data, Android device evidence, and explicit owner approval. The user asked to defer tests and browser testing during this implementation pass; no test or browser result should be inferred from the source tree.

## Main source directories

- `src/app`: Expo Router screens.
- `src/domain/calendar`, `src/domain/recurrence`: civil dates and reminder recurrence.
- `src/services/panchang`, `src/services/notifications`: local calculations and notification reconciliation.
- `src/db`, `src/features/reminders`: SQLite records and personal tools.
- `src/data/cities`, `src/i18n`, `src/components`, `src/theme`, `src/store`: city catalog, translations, UI and preferences.

See [architecture](docs/ARCHITECTURE.md), [privacy draft](PRIVACY_POLICY.md), and [third-party notices](docs/THIRD_PARTY_NOTICES.md).
