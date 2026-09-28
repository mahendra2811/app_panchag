# ADR-001: Local computation as first offline source candidate

**Date:** 27 September 2026  
**Status:** Provisional pending independent accuracy and package audit  
**Decision authority:** Approved master plan permits selecting the broadest verified free convention.

## Context

The app promises 2026–2029 Panchang coverage without paid data or licensed API redistribution. The user chose free sources only. A runtime API alone cannot meet the offline pack requirement. Calendar day assignment and festival observance depend on location and rules.

## Options

| Option | Benefit | Cost or risk |
|---|---|---|
| `panchang-ts` 5.4.0 local calculation, **candidate** | MIT repository, zero published runtime dependencies, daily five limbs, timings, festivals and region/month options; no ongoing API quota | Project accuracy not yet independently reproduced here; package contents, source tables and native behavior need audit |
| Navamsha free API | Panchang and Muhurta endpoint family, launch free calls | No verified perpetual offline redistribution grant; free tier can change; secret-bearing proxy needed |
| Prokerala API | Broad named calendar capability | Standard terms bar a permanent local database and require frequent cache refresh absent exception |

## Decision

Proceed with a source-neutral repository and generator contract. Prototype `panchang-ts` as the first local adapter. Start comparisons with actual selected-city calculations and test both Purnimanta and Amanta where comparable sources publish rules. Ujjain with Purnimanta is a **candidate reference profile only**; choose the release profile after comparing location/rule coverage, rights and independent accuracy. Do not copy the library's Varanasi static tables into a differently labelled city pack.

Generate 2026–2029 packs only after verifying the installed tarball's licence, source and transitive inventory, output shape and sampled results. Attribute the engine and retain its MIT notice. Official/public almanacs can be read for comparison, but their content cannot be bulk-copied without rights. Record independent validation samples and unresolved differences per field and convention.

## Consequences

The Gregorian/personal app can be built independently. The app's data release gate stays open until 1,461 records per promised profile and accuracy checks pass. If the engine fails verification, evaluate another permissively licensed engine or obtain no-cost written rights; do not substitute Prokerala/Navamsha output into a permanent pack. Revisit this ADR on an engine version change, major correction, new source terms, or material comparison discrepancy.

Sources: [`panchang-ts` README](https://github.com/ishankgupta95/panchang/blob/master/source/ts/README.md), [repository licence](https://github.com/ishankgupta95/panchang/blob/master/LICENSE), [Navamsha terms](https://www.navamsha.in/legal/terms), [Prokerala terms](https://api.prokerala.com/tos).
