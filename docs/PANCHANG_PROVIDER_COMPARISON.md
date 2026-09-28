# Free Panchang source comparison

**Reviewed:** 27 September 2026. Public terms and package metadata change; recheck on integration and release.

| Source | Free/technical capability | Permanent 2026–2029 offline pack rights | Fit |
|---|---|---|---|
| [`panchang-ts` 5.4.0](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md) | TypeScript/Hermes claim, five limbs, astronomical events, festival rules, Amanta/Purnimanta, region input; npm metadata shows MIT and zero runtime dependencies | MIT package is promising; inspect tarball contents, generated tables and any embedded third-party data before final approval | **First candidate**, subject to independent validation |
| [Navamsha](https://www.navamsha.in/developers) | Panchang/Muhurta family; launch free tier advertises 10,000 calls/month, 10 req/sec, key authentication ([pricing](https://www.navamsha.in/pricing)) | Public [terms](https://www.navamsha.in/legal/terms) give limited API use during active account and do not specify permanent output redistribution | Optional validation/online candidate only after endpoint and rights checks |
| [Prokerala](https://api.prokerala.com/tos) | Daily Panchang and Amanta/Purnimanta calendars | Standard terms prohibit permanent archive/database and require refreshing permitted cache at least every 24 hours absent exception | Exclude from permanent bundles |
| [AstrologyAPI basic Panchang](https://astrologyapi.com/developers/v1/vedic/basic_panchang) | Documented endpoint | Free quota and redistribution permission not verified | Research only |
| [Astronomy Engine](https://github.com/cosinekitty/astronomy) | Permissive astronomical primitives | Library licence may permit calculations; no Hindu observance system | Independent astronomy cross-check candidate, not a Panchang replacement |

## `panchang-ts` audit snapshot

The current repository is [`ishankgupta95/panchang`](https://github.com/ishankgupta95/panchang), with the TypeScript package at `source/ts`; the earlier `panchang-ts` repository URL redirects there. `source/ts/package.json` declares version `5.4.0`, `MIT`, no `dependencies` field, and `astronomy-engine` only under `devDependencies` ([package manifest](https://github.com/ishankgupta95/panchang/blob/master/source/ts/package.json), [MIT licence](https://github.com/ishankgupta95/panchang/blob/master/LICENSE)). npm registry metadata agreed at review time. The author claims 9,207 tests, Hermes compatibility, and comparisons with published almanacs in the [README](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md); this is not a completed independent project audit.

The README warns that static festival/eclipse/Muhurta subpath tables use Varanasi and that some festival rules are deferred or may drift by a day. It says the `getDailyPanchang` path should be used for festival dating because an instant snapshot omits canonical-time refinements. It also says the default Purnimanta system affects several vrat dates and distinguishes Ujjain traditional reference, a Central Station modern reference and practical input coordinates. These are material semantic rules, so a profile must fix region, month system, ayanamsa, coordinates and algorithm version.

Before bundling, inspect the published tarball to confirm the MIT notice and runtime dependency inventory, and inspect generated static table provenance. Test the actual installed package on the chosen Expo/Hermes build. Run independent city/date comparisons; do not count TypeScript/Go parity as external validation because both share the same algorithm.

## Decision and open evidence

Use source-neutral contracts and investigate local generation first. No external API currently has verified no-cost rights for a permanent four-year pack. No release convention/city has passed this project's independent comparison yet. A keyless app is viable only if the vetted local engine passes that check; otherwise the data release gate remains blocked while Gregorian and personal app features proceed.

For any remote candidate, record exact endpoint and version, schema, request inputs, supported dates/cities/rules, source precision, per-endpoint credits, quota, caching/redistribution, attribution and termination obligations **before** enabling it. A free call allowance is neither permanent pricing nor an offline licence.
