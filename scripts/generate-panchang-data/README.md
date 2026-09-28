# Provisional reference pack

Run `node scripts/generate-panchang-data/index.mjs` to create 48 monthly JSON files for 2026–2029 and a SHA-256 manifest in `provisional-output/`. The generator uses `panchang-ts` 5.4.0, Ujjain city-centre coordinates, IST, Purnimanta month naming, the engine's default observance rules and its `all` regional filter.

The output is **not included in the app** and is marked `releaseApproved: false`. The engine's MIT licence is in `node_modules/panchang-ts/LICENSE`; an independent comparison against published almanacs, coordinate source audit, and festival rule review are still needed before activating a release pack. The app can calculate local city days offline through `src/services/panchang` while this review is open. No government holiday data is inferred from festivals.
