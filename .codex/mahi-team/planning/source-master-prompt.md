# MASTER CODEX BUILD PROMPT — Hindu Calendar / Panchang / Reminders Android App

> Give this entire file to Codex in terminal mode inside a new/empty project folder.
>
> Your job as Codex is not to merely scaffold screens. You must build, validate, test, document, and prepare a production-ready Android application that can be taken through final Play Store publishing with minimal manual work.

---

# 0. ROLE

You are the senior engineer, mobile architect, UI/UX engineer, localization engineer, QA engineer, release engineer, and technical researcher for this project.

Build the application end-to-end.

Do not stop after scaffolding.
Do not leave major screens as TODOs.
Do not invent religious/calendar calculations.
Do not hardcode fake Panchang values.
Do not expose API secrets in the Android app.
Do not add a backend unless it is technically required for secure API-key proxying.

When something depends on a changing third-party API, library, Expo version, Android/Play Store requirement, or legal/licensing requirement:

1. Research the latest official documentation.
2. Prefer official documentation and primary sources.
3. Record the decision in `docs/RESEARCH.md`.
4. Implement the best current option.
5. If credentials or an external account are required, continue building everything else and clearly tell me exactly what I need to provide.

Avoid unnecessary questions. Make sensible production-grade decisions yourself.

---

# 1. PRODUCT SUMMARY

Build an Android-first Hindu Calendar / Panchang / Personal Reminder application.

The application should feel like a modern mobile interpretation of a traditional Indian printed Hindu calendar.

The core experience is:

- Open app.
- Immediately see the current Hindu calendar month.
- See Gregorian dates together with useful Hindu calendar information.
- Tap any date to open a detailed day page.
- Browse any month/year.
- View Hindu Panchang information.
- View festivals and vrats.
- View national and state holidays.
- Add personal notes, birthdays, anniversaries, and recurring reminders.
- Use the app without login.
- Use most functionality offline.
- No advertisements.
- No account.
- No social features.
- No unnecessary permissions.
- Hindi and English first.
- Architecture prepared for additional Indian languages before Play Store release.

The app must be especially comfortable for elderly/local users:
- large tap targets,
- readable Hindi typography,
- straightforward navigation,
- simple mode,
- large-font mode,
- no cluttered animations,
- familiar calendar presentation.

---

# 2. PLATFORM

Build only the mobile application.

Primary target:
- Android
- Google Play Store

Do not build a web application.

Use:
- React Native
- Expo
- TypeScript

Use the current stable Expo SDK after checking official Expo documentation.

Prefer Expo managed/prebuild-compatible packages so the project remains easy to build with EAS.

---

# 3. DEFAULT APP IDENTITY

Use these working defaults unless an existing project configuration says otherwise:

App name:
`Hindu Calendar - Panchang`

Short display name:
`Hindu Calendar`

Expo slug:
`hindu-calendar-panchang`

Android package/applicationId:
`com.pooniya.hinducalendar`

Scheme:
`hinducalendar`

Internal project name:
`HinduCalendar`

These must be centralized so they can easily be replaced later.

Use placeholder icon/splash assets for now.
Create clean placeholder branding using a simple Om/calendar concept without copying copyrighted third-party artwork.

Create a `BRANDING_REPLACE.md` file explaining exactly which files should be replaced when final logo/icon assets are supplied.

---

# 4. NON-NEGOTIABLE PRODUCT PRINCIPLES

1. No signup.
2. No login.
3. No account.
4. No advertisements.
5. No analytics SDK unless explicitly enabled later.
6. No Firebase unless a genuinely unavoidable reason is discovered.
7. No backend database.
8. No cloud user profile.
9. User reminders stay on-device.
10. Personal notes stay on-device.
11. Calendar browsing must work offline.
12. Bundled Panchang/calendar data must work offline.
13. API failures must never break the standard calendar.
14. Panchang calculations must come from trusted sources, not AI-generated formulas.
15. Never claim uncertain festival/Panchang data is authoritative.
16. Never silently substitute fabricated values when an API fails.
17. Gregorian calendar browsing should support arbitrary years.
18. Rich Hindu data is bundled for the selected target years.
19. Outside bundled years, allow on-demand Panchang retrieval.
20. Keep dependencies minimal.

---

# 5. PRIMARY TECH STACK

Use the following unless research discovers a strong compatibility problem:

## Core
- React Native
- Expo
- TypeScript with strict mode

## Routing
- Expo Router

## Styling
- NativeWind if it is compatible with the selected Expo SDK and stable
- otherwise use a small typed React Native design-system layer
- do not add a huge UI framework

## State
- Zustand

## Lightweight preferences
- `@react-native-async-storage/async-storage`

## Local structured storage
- `expo-sqlite`

## Notifications
- `expo-notifications`

## Localization
- `i18next`
- `react-i18next`
- `expo-localization`

## Date utilities
- `date-fns` or another lightweight, maintained utility
- use it only for normal Gregorian/date manipulation
- NEVER treat it as a Panchang calculation engine

## Icons
- `lucide-react-native`

## Validation
- Zod, only where useful for API/runtime parsing

## Testing
Choose a stable stack compatible with the current Expo/React Native version:
- Jest
- React Native Testing Library
- targeted integration/unit tests

Do not install libraries only because they are popular.

---

# 6. PROJECT ARCHITECTURE

Use a clean feature-based structure.

Suggested high-level shape:

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    calendar.tsx
    reminders.tsx
    more.tsx
  date/
    [date].tsx
  panchang/
    index.tsx
    choghadiya.tsx
    muhurta.tsx
    astronomy.tsx
  festivals/
    index.tsx
    [id].tsx
  holidays/
    index.tsx
  reminders/
    create.tsx
    [id].tsx
    edit.tsx
  settings/
    index.tsx
    language.tsx
    location.tsx
    appearance.tsx
    calendar.tsx

src/
  components/
    ui/
    calendar/
    panchang/
    reminders/
    festivals/
  features/
    calendar/
    panchang/
    festivals/
    holidays/
    reminders/
    settings/
    localization/
  services/
    panchang/
      PanchangProvider.ts
      PanchangRepository.ts
      providerRegistry.ts
      providers/
        NavamshaProvider.ts
        ProkeralaProvider.ts
        ThirdProvider.ts
    holidays/
    notifications/
    storage/
  db/
    schema.ts
    migrations/
    repositories/
  data/
    bundled/
    holidays/
    cities/
  hooks/
  store/
  theme/
  i18n/
  types/
  utils/

scripts/
  generate-panchang-data/
  validate-panchang-data/
  generate-holiday-data/

docs/
```

Adjust if necessary, but preserve separation between:
- UI,
- domain models,
- storage,
- API provider adapters,
- bundled data,
- translations.

---

# 7. BOTTOM NAVIGATION

There are exactly four primary bottom tabs:

1. Home
2. Calendar
3. Reminders
4. More

Hindi:
- होम
- कैलेंडर
- रिमाइंडर
- अधिक

Icons:
- Home
- CalendarDays
- Bell
- Menu or Grid/MoreHorizontal

Keep tabs large and readable.

---

# 8. HOME SCREEN — PRIMARY EXPERIENCE

The Home screen must be calendar-first.

Default view:
`Month`

Also support:
- Today
- Week
- Month

The user can switch views.
Remember the last selected home view.

The visual identity should be inspired by traditional Hindi/Hindu printed calendars:
- information-rich date cells,
- saffron/Bhagwa and warm yellow/golden accents,
- warm cream background,
- clear Sunday/holiday treatment,
- Hindu lunar information visible where space allows.

Do not directly copy Prokerala or any other site's copyrighted visual design.
Use the idea/information density, not copied assets or exact layout.

## Home month header

Show:
- Hindu month name
- Vikram Samvat if available
- Gregorian month/year
- previous month button
- next month button
- Today button
- month/year picker

Example concept:

```text
ॐ  आश्विन • विक्रम संवत 2083
September 2026

‹        आज        ›
```

## Calendar grid

7 columns.

Localized weekday labels.

Each day cell should be able to display:

Required:
- Gregorian date
- tithi or concise Hindu date indicator when available

Optional when data/space allows:
- paksha marker
- nakshatra
- festival/vrat badge
- Purnima/Amavasya/Ekadashi marker
- reminder dot
- holiday marker

Avoid unreadable microtext.

Create two density modes:

### Simple
- large Gregorian date
- tithi
- important festival/vrat marker
- reminder indicator

### Detailed
- Gregorian date
- tithi
- compact nakshatra or Hindu month context
- festival/vrat marker
- reminder indicator

Allow user to choose Simple/Detailed.
Default should favor readability.

## Current day
Use a strong Bhagwa treatment:
- saffron border/fill
- adequate contrast
- do not rely only on color

## Sundays
Use a traditional warm red accent carefully.

## Festival dates
Use subtle icons/badges.

---

# 9. HOME TODAY VIEW

Today view must be extremely easy for elderly users.

Display:

- weekday
- full Gregorian date
- Hindu date
- tithi
- paksha
- masa
- important vrat/festival
- sunrise/sunset if known
- Rahu Kaal if locally available
- today's reminders
- upcoming festivals

Provide:
`पूरा पंचांग देखें / View full Panchang`

---

# 10. HOME WEEK VIEW

Show seven days.

Each day should include:
- Gregorian date
- weekday
- tithi
- key festival/vrat
- reminder indicator

If Hindu data is not bundled/cached, offer explicit loading.
Do not trigger large unintended API requests simply because the user swipes.

---

# 11. CALENDAR TAB

This is the explorer.

Support:
- arbitrary Gregorian month/year browsing
- fast year picker
- month picker
- jump to today
- date search
- Hindi/English numeric/date formatting where appropriate

Important:
The Gregorian calendar is always locally generated and never dependent on Panchang API.

For bundled years, enrich cells with local Panchang data.

Outside bundled years:
- still show full normal calendar
- allow explicit "Load Hindu Panchang" for a date/week/month

Do NOT automatically call APIs on every fast month swipe.

---

# 12. DATE DETAIL PAGE

Tapping any day opens:

`/date/YYYY-MM-DD`

The date page should work in levels.

## Level 1 — immediate basic information

Display locally bundled/cached data first.

Sections:

### Header
- Gregorian date
- weekday
- Hindu date

### Hindu calendar
- tithi
- tithi start/end if available
- paksha
- Hindu masa
- Vikram Samvat
- Shaka Samvat
- regional calendar details where relevant

### Panchang
- nakshatra
- nakshatra ending time
- yoga
- karana
- vara

### Sun/Moon
Show if bundled/cached:
- sunrise
- sunset
- moonrise
- moonset
- moon sign
- sun sign if relevant

### Festival/Vrat
- festival names
- vrat names
- type
- short description where curated

### Personal
- reminders for this date
- notes
- add reminder button

## Level 2 — explicit detailed/location-based Panchang

At the bottom show a clear button:

Hindi:
`स्थान के अनुसार विस्तृत पंचांग`

English:
`View detailed Panchang for location`

This performs an online API fetch only when needed.

It should retrieve, normalize, cache, and show:
- precise local sunrise/sunset
- moonrise/moonset if available
- tithi transitions
- nakshatra transitions
- Rahu Kaal
- Yamaganda
- Gulika
- Abhijit Muhurta
- Choghadiya
- Hora
- Brahma Muhurta
- Amrit Kaal
- other reliable provider-supported timings

Do not label it "latest" in a way that implies offline data is obsolete.
Describe it as location-specific / online detailed Panchang.

---

# 13. REMINDERS TAB

A fully functional local reminder manager.

No backend.

Use SQLite for user-created reminder/event data.

Support:

## Fields
- id
- title
- description/note
- date
- optional time
- category
- recurrence
- notification enabled
- createdAt
- updatedAt

## Categories
- Birthday
- Anniversary
- Religious
- Medicine
- Personal
- Work
- Other

Localize names.

## Recurrence
- none
- daily
- weekly
- monthly
- yearly

Architect the recurrence model so Hindu-tithi-based recurrence can be added cleanly.

If reliable enough, implement Hindu recurrence types:
- every Ekadashi
- every Purnima
- every Amavasya
- yearly by selected Hindu tithi

Do not implement unreliable recurrence using guessed math.

## Notifications
Use local notifications.

Ask notification permission only when the user enables a reminder notification or when contextually necessary.
Do not ask on first launch without explanation.

Handle Android notification channel correctly.

Support:
- upcoming reminders
- completed/past reminders
- search
- category filter
- edit
- delete
- enable/disable notification

---

# 14. MORE TAB

Organize into clear sections.

## Panchang
- Today's Panchang
- Full Panchang
- Choghadiya
- Muhurta
- Astronomy
- Sunrise/Sunset
- Moon information

## Vrat and Festivals
- All Festivals
- Ekadashi
- Purnima
- Amavasya
- Pradosh
- Sankashti Chaturthi
- Masik Shivratri
- Navratri
- other supported categories

## Holidays
- National holidays
- State holidays
- Regional holidays

## Calendar
- Hindu calendar settings
- calendar density
- calendar tradition
- location

## Personalization
- language
- font size
- simple mode
- theme
- first day of week if appropriate

## About
- privacy
- data sources
- app version
- disclaimer
- open-source licenses
- feedback/contact placeholder

---

# 15. FESTIVALS

Create a festival list and festival detail experience.

Monthly festival list:
- date
- festival name
- category
- short context

Festival detail page can contain:
- name
- date
- relevant tithi
- timing/muhurat when verified
- short significance
- concise observance/puja notes if data is curated from a permitted source
- regional notes where known

Do not scrape copyrighted prose and ship it.
Write original concise descriptions or use properly licensed/public data.

Never invent puja timings.

---

# 16. HOLIDAYS

Keep holiday data conceptually separate from Panchang.

Types:
1. Hindu/religious festivals
2. National public holidays
3. State holidays
4. Regional/local holidays

Create state-selection support.

Initial country:
India

Support all Indian states and union territories structurally.

Create bundled static/curated data files for national/state holidays.

Verify current holiday data from official or authoritative sources when generating it.

Do not assume every festival is a government holiday.

---

# 17. LOCATION

Do not require GPS.

Default location experience:
- ask user to select State
- select City

Bundle a lightweight city dataset containing:
- city name
- state
- latitude
- longitude
- timezone

India defaults to `Asia/Kolkata` where appropriate.

Store location preference locally.

Optional location permission may be considered later, but do not require it.

No `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` should be present unless a genuine user-enabled location feature is intentionally added.

---

# 18. THEME / DESIGN SYSTEM

Visual identity:

`Traditional Hindu calendar × clean modern Android app`

Primary theme:
Bhagwa / saffron + yellow/golden + cream.

Do not make the entire UI saturated orange.

Suggested semantic palette:
- primary saffron/Bhagwa
- golden secondary/accent
- warm cream background
- ivory/white cards
- muted gold borders
- dark brown/charcoal body text
- deep warm red for Sunday/special warnings
- green only for positive/status semantics where needed

Implement colors as semantic tokens.

Support light mode first.

Optional dark mode only if it can be polished properly.
Do not let dark mode delay core functionality.

## Motion
Only subtle transitions:
- 150–250ms
- selected date
- card state
- tab changes
- sheets/modals
- month transitions

No heavy animation libraries unless needed.
No decorative spinning religious graphics.

---

# 19. ACCESSIBILITY / ELDERLY MODE

Implement Simple Mode.

Simple Mode should:
- increase typography
- increase tap targets
- reduce information density
- hide advanced data by default
- retain today's tithi/festival/reminders prominently

Font size controls:
- Small
- Default
- Large
- Extra Large

Use accessible contrast.
Add accessibility labels to important controls.
Support screen-reader basics.

Avoid essential interactions that depend only on swipe gestures.

---

# 20. LOCALIZATION

Stage 1:
- English
- Hindi

Complete the full app using both.

No hardcoded UI strings inside components.

Use translation keys from the beginning.

Example:
- `calendar.today`
- `panchang.tithi`
- `reminders.add`
- `festival.diwali`

Architect so Stage 2 can add:

- Gujarati
- Marathi
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Odia
- Assamese

Potentially Sanskrit later, only if appropriate.

Do not auto-translate sacred/calendar terms incorrectly.
Maintain a normalized canonical domain value and translation maps.

Example:

```ts
type TithiId =
  | "PRATIPADA"
  | "DVITIYA"
  | "TRITIYA"
  ...
  | "EKADASHI"
  | "DVADASHI"
```

Then localize display text separately.

---

# 21. DATA COVERAGE STRATEGY

The application must support arbitrary Gregorian dates.

However, rich Hindu calendar data should be bundled for:

- 2026
- 2027
- 2028
- 2029

Priority richness:
- 2026 through approximately mid-2027: richest curated user experience
- rest of 2027: full standard Panchang
- 2028: full standard Panchang
- 2029: full standard Panchang

Do not manually type thousands of dates.

Create data-generation scripts.

---

# 22. BUNDLED PANCHANG DATA GENERATION

Build a dedicated script under:

`scripts/generate-panchang-data/`

The script should:

1. Read provider credentials from environment variables.
2. Fetch data from a trusted Panchang provider.
3. Normalize provider-specific responses into our internal schema.
4. Generate files by year/month.
5. Validate required fields.
6. Detect missing dates.
7. Retry safely.
8. Respect provider rate limits.
9. Store generation metadata:
   - provider
   - generatedAt
   - source version if known
   - location/reference convention
10. Never silently generate placeholder Panchang values.

Preferred bundled file structure:

```text
src/data/bundled/panchang/
  2026/
    01.json
    02.json
    ...
    12.json
  2027/
  2028/
  2029/
```

Compress/minify where reasonable without making maintenance difficult.

---

# 23. VERY IMPORTANT — LOCATION DEPENDENCE

Understand that many Panchang values depend on:
- latitude
- longitude
- timezone
- local sunrise
- tradition/convention

Therefore distinguish:

## Location-independent / reference-calendar data
Can be bundled under an explicitly documented reference convention.

## Location-dependent precise timings
Fetch on demand for the user's chosen city.

Do NOT show Jodhpur sunrise/Rahu Kaal as if it applies throughout India.

Every bundled dataset must state its reference location/convention.

Choose a reasonable reference convention only after research.
Document it in:
`docs/PANCHANG_DATA_POLICY.md`

---

# 24. PANCHANG PROVIDER ABSTRACTION

Never tightly couple UI code to one external provider.

Create:

```ts
interface PanchangProvider {
  id: string;
  getBasicDay(input: PanchangDayRequest): Promise<NormalizedPanchangDay>;
  getDetailedDay(input: PanchangDayRequest): Promise<NormalizedDetailedPanchangDay>;
  healthCheck?(): Promise<boolean>;
}
```

Create a repository/service that handles:
- bundled data
- local cache
- API provider chain
- retries
- errors
- normalization

UI calls only the repository.

---

# 25. PROVIDER ORDER / RESEARCH

As of the initial project planning, investigate these providers using current official documentation:

## Provider A — Navamsha
Candidate primary provider.

Known characteristics to verify before implementation:
- Panchang full endpoint
- tithi
- nakshatra
- yoga
- karana
- vara
- sunrise/sunset related endpoints
- Choghadiya
- Hora
- Rahu Kaal/Gulika/Yamaganda
- Abhijit
- free developer allowance may be generous
- takes date/location/timezone

Use only after verifying current:
- pricing
- terms
- commercial usage
- attribution requirements
- rate limits
- reliability
- response schema

## Provider B — Prokerala
Candidate secondary provider / comparison source.

Verify:
- Daily Panchang
- Detailed Panchang
- regional calendar endpoints
- Hindi support
- pricing/credits
- auth flow
- terms
- commercial mobile-app permission
- redistribution/bundling restrictions

IMPORTANT:
Do not assume API terms allow permanent redistribution of bulk-generated data.
Read terms before generating and shipping 2026–2029 datasets.
If redistribution is restricted, do not violate it.

## Provider C
Research a third credible provider, for example:
- Vedic Rishi / AstrologyAPI
- Divine API
- another reputable documented provider

Select it only if:
- commercially usable,
- documented,
- suitable for Panchang,
- stable,
- useful as fallback or validation.

Record provider comparison in:
`docs/PANCHANG_PROVIDER_COMPARISON.md`

Include:
- data coverage
- accuracy-related capabilities
- languages
- endpoint costs
- rate limits
- auth
- licensing
- caching permission
- redistribution permission
- fallback suitability

---

# 26. API FALLBACK STRATEGY

Desired runtime behavior:

```text
Bundled data
   ↓
SQLite cache
   ↓
Primary provider
   ↓ fails
Secondary provider
   ↓ fails
Tertiary provider
   ↓
Graceful unavailable state
```

However:
Do not fire multiple paid APIs unnecessarily.

Fallback is only for:
- network error
- timeout
- invalid response
- provider outage
- quota/rate-limit response where fallback is allowed

Normalize all outputs.

Record which provider produced cached data.

Never merge incompatible provider fields blindly.

---

# 27. API SECRET SECURITY

This is critical.

Do not embed private paid API credentials in:
- source code
- Expo public config
- Android resources
- bundled JS
- AAB/APK

If a provider requires a private secret, create a tiny serverless proxy.

Preferred options:
- Cloudflare Worker
- Vercel/Netlify serverless function only if appropriate
- another minimal secure edge function

The proxy must:
- contain provider secrets server-side
- validate allowed request shape
- rate limit basic abuse
- avoid storing user personal data
- return normalized/safe provider response if practical

No user account/database is needed.

Create proxy code in a clearly separated folder if required:

```text
serverless/
  panchang-proxy/
```

Add deployment instructions.

If an API supports a mobile-safe public key with domain/app restrictions, verify official guidance before considering direct use.

---

# 28. CACHE STRATEGY

Use SQLite.

Two levels:
- BASIC
- DETAILED

Cache key must include at least:
- date
- location or rounded latitude/longitude
- timezone
- calendar/tradition if it affects result
- provider/schema version as needed

Store:
- normalized JSON
- provider id
- fetchedAt
- data version

Never repeatedly fetch already cached immutable historical data unless user explicitly refreshes or schema/provider policy requires it.

---

# 29. INITIAL CACHE BEHAVIOR

For runtime/API years outside bundled coverage, follow:

- previous 10 days
- today
- next 30 days

But do not block first render waiting for all 41 days.

Use progressive/background-safe loading while app is active.

Important:
"Ensure date range is available" instead of blindly refetching.

Pseudo behavior:

```ts
ensureBasicPanchangRange(start, end) {
  const cached = db.getDates(start, end)
  const missing = determineMissing(cached)
  fetchOnly(missing)
  persist()
  return combined
}
```

For bundled 2026–2029 dates, no API should be needed for basic data.

---

# 30. EXPLICIT RANGE LOADING

Hindu Day view:
- ensure 1 date

Hindu Week view:
- ensure selected 7 dates
- fetch only missing

Hindu Month view:
- ensure selected calendar month
- fetch only missing

Normal Gregorian month swipe:
- zero Panchang API calls by default

Provide explicit user action when Hindu data isn't locally available.

---

# 31. NORMALIZED DAY MODEL

Create a well-designed internal schema similar to:

```ts
interface PanchangDay {
  schemaVersion: number;

  gregorianDate: string;
  timezone: string;

  reference: {
    type: "bundled" | "cached" | "live";
    provider?: string;
    referenceCity?: string;
    latitude?: number;
    longitude?: number;
    generatedAt?: string;
  };

  hinduDate?: {
    masaId?: string;
    masaDisplay?: string;
    pakshaId?: "SHUKLA" | "KRISHNA";
    tithiId?: string;
    tithiNumber?: number;
    vikramSamvat?: number;
    shakaSamvat?: number;
    amantaMonthId?: string;
    purnimantaMonthId?: string;
  };

  panchang?: {
    varaId?: string;
    tithi?: PanchangPeriod;
    nakshatra?: PanchangPeriod;
    yoga?: PanchangPeriod;
    karana?: PanchangPeriod[];
  };

  astronomy?: {
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    moonSignId?: string;
    sunSignId?: string;
  };

  auspicious?: {
    abhijit?: TimeRange[];
    brahmaMuhurta?: TimeRange[];
    amritKaal?: TimeRange[];
    choghadiya?: ChoghadiyaEntry[];
    hora?: HoraEntry[];
  };

  inauspicious?: {
    rahuKaal?: TimeRange[];
    yamaganda?: TimeRange[];
    gulika?: TimeRange[];
  };

  festivals?: CalendarEventRef[];
  vrats?: CalendarEventRef[];
  holidays?: CalendarEventRef[];
}
```

Refine based on real API data.

Do not store localized display strings as the only source of truth.
Store canonical IDs where possible.

---

# 32. FESTIVAL / EVENT MODEL

Create canonical event IDs.

Example:
- DIWALI
- HOLI
- JANMASHTAMI
- MAHA_SHIVARATRI
- RAM_NAVAMI
- HANUMAN_JAYANTI
- GANESH_CHATURTHI
- RAKSHA_BANDHAN
- DUSSEHRA
- MAKAR_SANKRANTI
- AKSHAYA_TRITIYA
- KARWA_CHAUTH
- EKADASHI_<NAME>
- PRADOSH
- PURNIMA
- AMAVASYA

Keep:
- canonical id
- localized name
- date
- category
- verified timings if available
- region scope
- source metadata

---

# 33. EKADASHI / VRAT RULES

Do NOT derive religious observance dates by simplistic "if tithi = Ekadashi" logic unless a trusted source explicitly defines it that way.

Ekadashi observance and Parana timing may depend on rules and sunrise transitions.

Therefore:
- use trusted provider/source fields where available,
- store verified Ekadashi event data,
- do not invent Parana timings,
- show unavailable state if precise timing is not verified.

Same principle for:
- Janmashtami
- Shivaratri
- Diwali Lakshmi Puja timing
- Karwa Chauth
- Pradosh
- Sankashti
- other observance-specific rules.

---

# 34. DATA ACCURACY VALIDATION

Build a validation workflow.

Create:
`scripts/validate-panchang-data/`

Validate:
- every bundled Gregorian date exists
- no duplicate dates
- no impossible tithi values
- expected enum fields
- parseable timings
- chronological time ranges
- months cover all dates
- source metadata exists

Also perform cross-source spot checking.

Create a human-review fixture list containing important dates:
- Diwali
- Holi
- Janmashtami
- Maha Shivaratri
- major Ekadashi dates
- Purnima
- Amavasya
- Navratri boundaries
- Raksha Bandhan
- Dussehra
- Makar Sankranti

Use several cities:
- Jodhpur
- Jaipur
- Delhi
- Mumbai
- Kolkata
- Chennai

Do not claim mathematical equivalence between different traditions/providers when they legitimately differ.
Document differences.

---

# 35. OFFLINE BEHAVIOR

Must work offline for:

- app launch
- bundled calendar years
- normal calendar browsing
- reminders
- notes
- previously cached Panchang
- previously cached detailed Panchang
- bundled holidays/festivals

When requested data is not available offline:

Show friendly message:
Hindi:
`इस तारीख का विस्तृत पंचांग अभी ऑफलाइन उपलब्ध नहीं है। इंटरनेट से जुड़कर इसे लोड किया जा सकता है।`

English equivalent.

Provide explicit retry button.

Do not blank the screen.

---

# 36. SEARCH

Add calendar search.

Support:
- exact date
- month/year
- festival name
- vrat name
- "Diwali 2027"
- "दिवाली 2027"
- "Ekadashi"
- known holiday name

Search local bundled/indexed data first.

Do not call APIs for each keystroke.

---

# 37. SETTINGS

Settings should include:

## General
- language
- state
- city
- calendar tradition if supported

## Calendar
- Simple/Detailed density
- home default view: Today/Week/Month
- show/hide festival markers
- show/hide state holidays
- show/hide reminders in calendar
- English/Hindi numerals if desired

## Accessibility
- font size
- Simple Mode

## Notifications
- notification preferences
- category toggles

## Storage
- cached data info
- clear downloaded online Panchang cache
- never delete bundled app data

## About
- sources
- privacy
- version
- licenses

---

# 38. PRIVACY

Design for minimal data collection.

The application should not send:
- reminders
- notes
- birthdays
- anniversaries
- personal event titles

to any Panchang API.

Only send the minimum parameters required:
- date/time
- lat/lon or selected city coordinates
- timezone
- language if provider requires it

Create:
- `PRIVACY_POLICY.md`
- `docs/DATA_FLOW.md`

The privacy policy should accurately reflect actual behavior.

Do not falsely claim zero network access because Panchang APIs exist.

---

# 39. PERMISSIONS

Aim for minimal Android permissions.

Likely:
- notifications (runtime on modern Android)

Avoid:
- contacts
- phone
- SMS
- microphone
- camera
- storage/media
- precise location

unless a later explicitly requested feature genuinely needs it.

Audit final Android manifest before release.

---

# 40. DATABASE

Use Expo SQLite.

Create migrations.

Suggested tables:

## reminders
- id
- title
- notes
- category
- start_date
- time
- recurrence_type
- recurrence_json
- notification_enabled
- notification_identifier
- created_at
- updated_at

## personal_events
Could be combined with reminders if cleanly modeled.

## panchang_cache
- cache_key
- date
- location_key
- detail_level
- provider
- payload_json
- schema_version
- fetched_at

## preferences
Prefer AsyncStorage for simple settings unless centralizing in SQLite is cleaner.

Add indexes where useful.

---

# 41. NOTIFICATION SCHEDULING

Implement robust local notification scheduling.

Requirements:
- create
- reschedule after edit
- cancel after delete
- handle yearly recurrence
- handle monthly/weekly/daily
- timezone-safe behavior
- persist native notification ID

Test:
- notification disabled
- reminder without time
- DST-safe architecture for global users
- device restart behavior according to Expo/Android capabilities

Document platform limitations.

---

# 42. PERFORMANCE

Target a smooth experience on lower/mid-range Android phones.

Requirements:
- avoid rendering huge lists unnecessarily
- memoize calendar cells where useful
- avoid recalculating month arrays excessively
- lazy-load detail sections
- avoid giant JSON parse on every launch
- load bundled month files only as needed
- index SQLite
- virtualize long festival/reminder lists
- minimize bundle size

No premature micro-optimization, but keep architecture lean.

---

# 43. RELIABILITY / ERROR HANDLING

Implement:
- Error Boundary
- network timeout
- retry with backoff
- provider fallback
- malformed API response handling
- SQLite migration error handling
- clear empty states

Never expose raw technical errors to elderly users.

Add optional developer logging in development only.

---

# 44. API RATE LIMITING

Respect providers.

Implement:
- request deduplication
- in-flight request sharing
- cache-first behavior
- max concurrent calls
- provider-specific throttling if necessary

The bulk generation script must honor rate limits.

Never brute-force APIs.

---

# 45. NO UNINTENTIONAL API CALLS

These interactions must NOT automatically trigger network calls:
- opening Settings
- swiping normal Gregorian months
- opening Reminders
- typing into search
- changing font size
- changing Simple Mode

Network calls are allowed when:
- explicit Panchang data is needed
- explicit online detailed Panchang is requested
- missing Hindu range is intentionally loaded
- bundled-data updater is intentionally implemented

---

# 46. OPTIONAL DATA UPDATE SYSTEM

Architect an optional "calendar data pack update" system.

Goal:
When 2030 data is ready, we should be able to publish/download a new data pack without redesigning the app.

Possible design:
- signed/static JSON manifest
- versioned data packs
- downloaded to app-local storage
- checksum validation
- schema validation

Do NOT implement unsafe remote code loading.

Only data files.

If this introduces too much scope, implement the interfaces and documentation now and keep first release bundled + API fallback.

---

# 47. HOME MONTH DATA UX

For bundled years:
- instant Hindu details

For non-bundled years:
- show normal Gregorian month
- if cached Hindu data exists, overlay it
- otherwise show a small action:
  `Load Hindu Panchang for this month`

When tapped:
- estimate needed dates
- fetch only missing
- show loading progress
- allow cancellation if practical
- cache results

Do not obscure standard calendar while loading.

---

# 48. FESTIVAL MARKERS

Use visually restrained markers.

Examples:
- lamp icon / saffron indicator for major festival
- moon marker for Purnima/Amavasya
- folded hands for vrat
- dot for user reminder

Do not overload each cell.

On tap, date page provides full detail.

---

# 49. MONTHLY FESTIVAL SECTION

Below Home month calendar, show:
`This Month's Festivals & Vratas`

In Hindi:
`इस माह के व्रत एवं त्योहार`

Each row/card:
- date
- name
- short type
- tap → date/festival detail

Keep it compact.

---

# 50. TRADITIONAL CALENDAR FEEL

Use familiar conventions:
- Hindi weekday labels
- visible Hindu month
- Vikram Samvat
- tithi
- festival emphasis
- Sunday distinction
- warm saffron/yellow header

But make it mobile-readable.

Do not reproduce a printed calendar's tiny density exactly.

---

# 51. COMPONENTS

Create reusable components, for example:

```text
components/ui/
  AppText
  Button
  Card
  IconButton
  SectionHeader
  Chip
  Divider
  EmptyState
  ErrorState
  LoadingState
  BottomSheet
  Modal

components/calendar/
  CalendarHeader
  MonthGrid
  CalendarDayCell
  WeekStrip
  TodayCard
  MonthYearPicker
  FestivalMarker
  ReminderMarker

components/panchang/
  PanchangSummary
  PanchangSection
  TimeRangeRow
  TithiRow
  NakshatraRow
  SourceBadge

components/reminders/
  ReminderCard
  ReminderForm
  RecurrencePicker
```

Do not over-engineer component abstraction.

---

# 52. SOURCE TRANSPARENCY

On detailed Panchang page, optionally show a subtle source line:

`Panchang source: <provider> • Location: Jodhpur`

Do not make provider branding visually dominant unless terms require attribution.

Comply with attribution requirements.

Add a "Data sources" page under About.

---

# 53. TESTS

At minimum test:

## Calendar logic
- leap years
- month start positions
- month length
- year transitions
- current-day selection

## Reminders
- create
- edit
- delete
- recurrence serialization
- notification ID persistence

## Data repository
- bundled data wins
- SQLite cache fallback
- primary provider
- secondary fallback
- invalid provider response
- offline failure

## Localization
- English render
- Hindi render
- missing key fallback

## Panchang normalization
Provider response fixtures → normalized schema.

## Database migrations
Basic migration coverage.

---

# 54. MANUAL QA CHECKLIST

Create:
`docs/QA_CHECKLIST.md`

Include:

- fresh install
- Hindi onboarding
- English onboarding
- choose Rajasthan/Jodhpur
- Home Month view
- switch Simple/Detailed
- select date
- create reminder
- receive notification
- offline mode
- provider outage simulation
- browse 2026
- browse 2027
- browse 2028
- browse 2029
- browse 2035
- load online Panchang
- restart app
- cache persists
- change language
- large font
- small-screen Android
- back navigation
- deep link if implemented

---

# 55. ONBOARDING

Keep onboarding very short.

Suggested:

## Screen 1
Language:
- हिन्दी
- English

## Screen 2
Select state/city:
- State
- City
Explain:
`Used to show location-based Panchang timings. GPS is not required.`

## Screen 3
Optional:
- choose Simple or Detailed calendar

Then Home.

Do not force notification permission during onboarding.

---

# 56. DEFAULTS

For India-oriented first release:

- language: infer device; if Hindi device use Hindi, otherwise English
- timezone: device timezone
- country: India
- location: ask city
- home view: Month
- density: Simple
- theme: Bhagwa light
- state holidays: enabled after state selected
- notifications: off until user creates/enables reminder

---

# 57. CITY DATA

Bundle a practical city database for India.

At least:
- major cities
- district-level usefulness if reasonable

Start with robust coverage of Indian states.

Use canonical:
- id
- city name
- state
- latitude
- longitude
- timezone

Allow search.

Keep data lightweight.

---

# 58. HINDI UX

Hindi should not feel like an afterthought.

Use high-quality Devanagari-compatible system/font strategy.

Verify:
- no clipped matras
- no line-height problems
- calendar cells support Devanagari
- Hindi numerals if enabled
- text scales cleanly

Do not use decorative fonts that reduce readability.

---

# 59. STAGE 2 LANGUAGES

After Stage 1 is complete and tests pass:

Add translation files for:
- Gujarati
- Marathi
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Odia
- Assamese

Do this without changing business logic.

For religious terms:
- build reviewed canonical mappings
- do not use blind machine translations where the traditional term differs

If full translation review is impossible before build completion:
- prepare language architecture
- include machine-assisted drafts clearly marked for review in internal docs
- do not claim they are linguistically verified.

---

# 60. RELEASE CONFIGURATION

Prepare:
- `app.json` or `app.config.ts`
- adaptive icon
- splash
- scheme
- Android package
- version
- versionCode strategy
- EAS config
- release build profile

Use `eas.json`.

Suggested profiles:
- development
- preview
- production

Ensure Android AAB production build is supported.

---

# 61. APP VERSIONING

Use semantic app version plus integer Android versionCode.

Example initial:
- version: `1.0.0`
- versionCode: `1`

Document release increment procedure.

---

# 62. PLAY STORE READINESS

Create a folder:

`play-store/`

Include drafts/templates:

- `short-description.txt`
- `full-description.txt`
- `release-notes.txt`
- `privacy-policy.md`
- `data-safety-notes.md`
- `store-listing-checklist.md`
- `screenshots-plan.md`

Do not fabricate legal guarantees.

Research current Google Play requirements before finalizing.

Document:
- target SDK requirement
- Android App Bundle
- Data Safety form considerations
- notification permission
- privacy policy requirement
- content rating considerations
- app access (no login)
- ads = No
- data collection behavior

---

# 63. DATA SAFETY

Expected design:
- no account
- no ads
- no selling data
- no user personal reminder content transmitted
- external Panchang request may transmit selected location/date

Accurately document this.

If serverless proxy logs requests by default, determine provider/platform logging behavior and configure minimal retention where possible.

---

# 64. BUILD COMMANDS

At completion, ensure README includes exact commands similar to:

```bash
npm install
npx expo start
npx expo run:android
eas build --platform android --profile preview
eas build --platform android --profile production
```

Use the package manager actually selected by the project.

Do not put obsolete commands in README.

---

# 65. ENVIRONMENT CONFIGURATION

Create:
`.env.example`

Potential entries:

```text
PANCHANG_PROVIDER_PRIMARY=navamsha
PANCHANG_PROXY_URL=
NAVAMSHA_API_KEY=
PROKERALA_CLIENT_ID=
PROKERALA_CLIENT_SECRET=
THIRD_PROVIDER_API_KEY=
```

Only server-side env vars may hold secrets.

For app:
only expose safe public values.

Document exactly where each value goes.

---

# 66. PROVIDER HEALTH/FALLBACK

Create provider error categories:
- network
- timeout
- auth
- quota
- rate limit
- malformed response
- unsupported date
- provider unavailable

Fallback only where sensible.

If auth is misconfigured, do not repeatedly try other providers forever.

Use finite retry logic.

---

# 67. RESEARCH TASKS CODEX MUST COMPLETE

Before final provider integration, research and document:

1. Current Expo stable SDK.
2. Current Expo Router guidance.
3. Current Expo Notifications limitations on Android.
4. Current Google Play target API requirement.
5. Current Navamsha API documentation, pricing, terms.
6. Current Prokerala API docs, pricing, terms.
7. Third provider candidate.
8. Whether each provider permits caching.
9. Whether each provider permits bulk pre-generation.
10. Whether each provider permits redistribution of generated data in an app.
11. Attribution requirements.
12. Supported date ranges.
13. Location/timezone input rules.
14. Hindi/multilingual output support.
15. Commercial/free-plan restrictions.

Put conclusions in docs.
Do not rely on assumptions from this prompt when current docs disagree.

---

# 68. IMPORTANT CURRENT PROVIDER CONTEXT

The planning information available when this prompt was written suggested:

Navamsha:
- Panchang endpoint family
- approximately 10,000 free calls/month during launch
- location-aware calculations
- very low per-endpoint credit cost
- no SLA on free plan

Prokerala:
- free plan with monthly credits
- Daily Panchang and Calendar APIs
- Hindi support for several Panchang endpoints
- credit-based billing
- multiple traditional calendar systems

These details may change.

Verify all of them before coding provider assumptions.

---

# 69. API REDISTRIBUTION WARNING

This project wants pre-generated 2026–2029 calendar data.

DO NOT assume an API subscription automatically grants the right to:
- bulk download data
- permanently bundle it
- redistribute it to every app user

Check terms.

If a provider's licensing does not allow this:

Choose one of these legal architectures:
1. another source/provider with suitable rights,
2. open-source astronomical library + verified rules/data where legally appropriate,
3. on-demand API cache without redistribution,
4. manually curated/public-domain holiday/festival datasets plus API timings.

Document the chosen legal basis.

Do not violate API terms just to satisfy the requested architecture.

---

# 70. OPEN-SOURCE OPTION

Research whether a reputable open-source Panchang/astronomical project could safely provide some base calculations.

Requirements:
- maintained
- permissive license compatible with commercial Play Store app
- deterministic
- documented
- suitable for Indian Panchang
- acceptable accuracy

Do not switch away from trusted APIs merely to avoid cost unless accuracy remains strong.

Use APIs as validation even if open-source calculations are adopted.

---

# 71. CONTENT / COPYRIGHT

Do not copy:
- Prokerala textual descriptions
- calendar images
- festival articles
- illustrations
- proprietary datasets

We may use the linked site only as inspiration for:
- traditional calendar information density
- category ideas
- user expectations

Create original UI and original concise content.

---

# 72. APP SHOULD NOT BECOME AN ASTROLOGY APP

Primary scope:
- calendar
- Panchang
- festivals
- vrats
- holidays
- reminders
- date information

Do not add:
- horoscope
- kundli
- matchmaking
- tarot
- predictions
- paid astrology
- chat with astrologer

unless explicitly requested later.

---

# 73. FEATURES TO AVOID FOR V1

Do not add:
- social feed
- account/profile
- cloud sync
- contacts import
- complicated widgets before core is stable
- AI chatbot
- e-commerce
- subscription
- ads
- excessive analytics
- location tracking

---

# 74. NICE-TO-HAVE AFTER CORE

Only after the complete required app is stable, consider:

- Android home screen widget for today's tithi
- shareable daily Panchang card
- export reminder to device calendar
- downloadable future-year packs
- favorite festivals
- custom theme variants
- print/share month calendar

Keep these optional.

Do not let them delay core.

---

# 75. STATE-WISE EXPERIENCE

When user chooses state:

Example:
`Rajasthan`

Enable:
- Rajasthan state holidays
- regional observances if verified
- relevant festival markers

Keep state as a data layer, not hardwired conditionals in UI.

---

# 76. EVENT LAYERS

A calendar day can have multiple independent layers:

```text
Gregorian date
+
Hindu Panchang
+
Hindu festival/vrat
+
National holiday
+
State holiday
+
Personal reminder
+
Personal note
```

Build the UI/model to combine layers cleanly.

---

# 77. MONTH/YEAR PICKER

Do not force endless swipe navigation.

Provide:
- tap month/year header
- month selector
- year input/list
- Today shortcut

Support quick jump to:
- 2026
- 2027
- 2028
- 2029
- arbitrary year

---

# 78. DATE FORMAT

Respect language.

English example:
`Sunday, 27 September 2026`

Hindi:
`रविवार, 27 सितंबर 2026`

Optionally support Devanagari digits as a setting, not necessarily default.

---

# 79. EMPTY STATES

Examples:

No reminder:
`आज कोई रिमाइंडर नहीं है।`

No festival:
`इस दिन कोई प्रमुख त्योहार दर्ज नहीं है।`

No detailed Panchang cached:
`स्थान के अनुसार विस्तृत पंचांग लोड करें।`

Keep friendly and concise.

---

# 80. LOADING STATES

Never show a blocking full-screen spinner for routine cached navigation.

Use:
- skeleton/compact loading
- inline progress
- retain calendar while extra data loads

---

# 81. SOURCE PRIORITY

Repository lookup order:

For basic day:

1. bundled data pack
2. downloaded future-year data pack
3. SQLite API cache
4. primary API
5. secondary API
6. tertiary API
7. graceful no-data response

For detailed location data:

1. SQLite detailed cache
2. primary API
3. secondary
4. tertiary

---

# 82. CACHE REFRESH

Most Panchang data for a fixed date/location is immutable.

Do not refresh constantly.

Provide manual:
`Refresh online details`

only if useful.

If provider source/version changes, support cache version invalidation.

---

# 83. USER NOTES

Allow a lightweight note on a date.

Examples:
- family event
- पूजा note
- personal note

Store locally.
No cloud.

Could reuse reminder model with notification off, but keep UX clear.

---

# 84. REMINDER FROM DATE PAGE

Date page must have:
`+ Add reminder`

Pre-fill selected date.

User can add:
- title
- time
- recurrence
- note
- notification

---

# 85. UPCOMING SECTION

Home Today view:
- next reminders
- next important festivals

Keep maximum initial rows small.
Provide `View all`.

---

# 86. PANCHANG MORE SCREEN

A standalone Panchang screen can provide:

- selected date
- selected city
- Panchang five limbs
- sun/moon
- auspicious periods
- inauspicious periods
- Choghadiya
- Hora
- astronomy

Each section collapsible.

Default remains readable.

---

# 87. CHOGHADIYA SCREEN

If provider supports it:

Display:
- day Choghadiya
- night Choghadiya
- time range
- type
- localized name

Do not use unsupported color claims without clear semantics.

---

# 88. MUHURTA SCREEN

Do not invent "best time" recommendations.

Show only verified provider-derived named periods such as:
- Abhijit
- Brahma Muhurta
- Amrit Kaal

If future specific marriage/griha-pravesh muhurta tools are added, they require dedicated trusted data/rules.

---

# 89. ASTRONOMY SCREEN

Can show provider-supported factual info:
- sunrise
- sunset
- moonrise
- moonset
- moon phase
- sun/moon sign if provider defines it

Keep it informative, not predictive.

---

# 90. SIMPLE MODE HOME

Simple Mode should resemble:

```text
रविवार
27 सितंबर

आज की तिथि
एकादशी

आज का त्योहार
...

सूर्योदय 06:xx
सूर्यास्त 18:xx

आज के रिमाइंडर
...
```

Large typography.
Minimal advanced terminology.

---

# 91. DETAILED MODE HOME

Detailed mode can show:
- month grid
- more compact tithi
- nakshatra/festival marker
- lunar month context
- detailed month festival list

Still keep legibility.

---

# 92. ERROR POLICY FOR RELIGIOUS DATA

If uncertain:
- show "Unavailable"
- never guess

If providers disagree:
- prefer configured primary convention
- optionally note that Panchang dates/timings can vary by location/tradition
- do not silently combine conflicting values

---

# 93. DISCLAIMER

Add a concise factual disclaimer:

Panchang/festival timings may vary by location, tradition, and source.
Location-based online details use the selected city and configured provider.

Do not overstate accuracy beyond the source.

---

# 94. CODE QUALITY

Requirements:
- TypeScript strict
- no `any` unless justified
- lint
- format
- no dead code
- no giant components
- no duplicated API parsing
- no magic strings for tithi/festival IDs
- no API keys in repo
- useful comments only
- no excessive comments

---

# 95. TOOLING

Set up:
- ESLint
- Prettier if compatible
- typecheck script
- test script
- data validation script

Package scripts:
- `start`
- `android`
- `lint`
- `typecheck`
- `test`
- `validate:data`
- `generate:panchang`
- `build:preview`
- `build:production` where practical

---

# 96. README

Create an excellent `README.md`.

Include:
- app overview
- stack
- folder structure
- setup
- environment
- run
- tests
- API provider configuration
- data generation
- serverless proxy
- build AAB
- Play Store checklist
- replacing branding
- known limitations

---

# 97. DOCUMENTATION FILES

Create at least:

```text
README.md
PRIVACY_POLICY.md
BRANDING_REPLACE.md

docs/
  ARCHITECTURE.md
  PANCHANG_DATA_POLICY.md
  PANCHANG_PROVIDER_COMPARISON.md
  DATA_FLOW.md
  RESEARCH.md
  QA_CHECKLIST.md
  RELEASE.md
  LOCALIZATION.md
  DATA_GENERATION.md
  KNOWN_LIMITATIONS.md
```

---

# 98. CI

If straightforward, add GitHub Actions for:
- install
- lint
- typecheck
- tests

Do not store secrets in workflow files.

---

# 99. PRODUCTION BUILD VALIDATION

Before calling the project complete:

1. install dependencies cleanly
2. lint
3. typecheck
4. tests
5. Expo config validation
6. launch app
7. test core navigation
8. validate SQLite migration
9. verify bundled data loader
10. verify offline mode
11. verify provider adapter with fixtures
12. produce preview Android build if environment permits
13. fix errors
14. repeat until clean

Do not stop at "code written".

---

# 100. PLAY STORE FINALIZATION

Prepare the app so I only need to:

1. replace final logo/icon if desired
2. provide API credentials/proxy deployment secrets
3. confirm app name/package if changing
4. generate signing/build through EAS
5. upload AAB
6. add screenshots
7. paste store listing
8. complete Play Console forms using your prepared notes

Explain every final manual step.

---

# 101. EXPECTED QUESTIONS TO ASK ME ONLY IF NECESSARY

Do not ask trivial questions.

Ask only when blocked by something I uniquely must decide/provide, such as:

- final app name
- final logo
- whether to keep `com.pooniya.hinducalendar`
- Navamsha API key
- Prokerala credentials
- third provider credentials
- chosen legal data source if API redistribution terms prohibit bundling
- Play Console credentials (do not request passwords)
- final privacy-policy hosting URL

Until then, use sensible placeholders and continue.

---

# 102. DEVELOPMENT PHASES

Execute in this order.

## Phase 1 — Research and architecture
- latest Expo
- provider research
- licensing
- schema design
- UI system
- folder structure

## Phase 2 — Core shell
- Expo project
- tabs
- theme
- Hindi/English
- onboarding
- settings

## Phase 3 — Gregorian calendar
- month/week/today
- date details
- year/month navigation

## Phase 4 — Storage
- SQLite
- preferences
- reminders
- notes

## Phase 5 — Notifications
- recurrence
- scheduling
- edit/delete behavior

## Phase 6 — Panchang domain layer
- normalized schema
- repository
- cache
- provider interface
- adapters

## Phase 7 — Bundled data pipeline
- generators
- validation
- 2026–2029 integration if legal and credentials available

## Phase 8 — Panchang UI
- day details
- month overlays
- full Panchang
- Choghadiya
- astronomy

## Phase 9 — Festivals/holidays
- festival list
- state holidays
- regional layers

## Phase 10 — Polish
- Simple Mode
- accessibility
- performance
- offline UX

## Phase 11 — QA
- automated tests
- manual checklist
- fix failures

## Phase 12 — Release
- EAS
- Play Store assets/text/checklists
- privacy/data safety docs

Do not skip phases simply because screens render.

---

# 103. DEFINITION OF DONE

The project is done only when:

- Android app boots successfully
- four tabs work
- Hindi works
- English works
- onboarding works
- selected location persists
- Home month calendar works
- Today works
- Week works
- arbitrary Gregorian calendar works
- date page works
- reminders CRUD works
- recurrence works
- notifications are wired
- bundled Panchang loader works
- 2026–2029 architecture works
- provider API adapter works or is ready pending only credentials
- fallback architecture works with fixtures/adapters
- offline behavior works
- state holiday layer works
- Simple Mode works
- accessibility basics work
- tests pass
- lint passes
- typecheck passes
- no secrets are committed
- production EAS config exists
- Play Store documentation exists
- README explains everything
- no fake Panchang values are presented as real

---

# 104. IMPORTANT UX REFERENCE

Use this conceptual direction:

Traditional Hindi Hindu calendar:
- saffron/yellow header
- Hindu month prominent
- Gregorian month/year
- compact tithi inside date cells
- festival/vrat markers
- rich month information

But create an original mobile interface.

The Home screen must visibly feel like a Hindu calendar immediately.
Do not make it look like a generic task manager with Panchang hidden somewhere.

---

# 105. CURRENT PRODUCT DECISIONS — DO NOT REOPEN WITHOUT GOOD REASON

Locked:
- React Native
- Expo
- TypeScript
- Android-only initially
- no login
- no account
- no ads
- no backend database
- local reminders
- SQLite
- Hindi + English first
- more Indian languages later
- Bhagwa/yellow/cream theme
- four bottom tabs
- Month as primary Home experience
- traditional Hindu calendar-inspired month cells
- 2026–2029 targeted rich data architecture
- API-backed trusted Panchang
- provider abstraction/fallback
- online detailed Panchang on explicit action
- minimal permissions
- Play Store readiness

Do not replace these with Flutter, native Kotlin, Firebase, or a web wrapper unless a critical blocker is discovered and documented.

---

# 106. FIRST ACTIONS WHEN YOU RECEIVE THIS PROMPT

You are running in Codex terminal mode inside the project folder.

Do the following immediately:

1. Inspect folder contents.
2. If empty, initialize the correct Expo TypeScript application.
3. Check installed Node/npm tooling.
4. Research current stable Expo requirements.
5. Create `docs/RESEARCH.md`.
6. Research the Panchang providers and licensing before bulk data generation.
7. Write a concise implementation plan into `docs/ARCHITECTURE.md`.
8. Begin implementation.
9. Keep going through tests and release configuration.
10. Do not stop merely to give me a plan.

If you encounter a credential-only blocker:
- build the adapter,
- create `.env.example`,
- implement fixtures/tests,
- continue the rest of the app,
- then clearly tell me which credential is needed.

---

# 107. FINAL RESPONSE EXPECTED FROM CODEX

When finished, give me:

## Completed
A concise list of implemented areas.

## Run locally
Exact commands.

## Android build
Exact preview and production AAB commands.

## Credentials still needed
Only if applicable.

## Manual replacements
Logo/app name/etc.

## Panchang source decision
Provider order, licensing/caching decision, bundled data policy.

## Verification
Lint/typecheck/tests/build status.

## Play Store
Exact remaining steps.

Do not just say "done".

---

# 108. QUALITY BAR

This should feel like a real Play Store product, not a coding-demo app.

Optimize for:

- correctness
- trust
- offline usefulness
- simplicity
- elder friendliness
- Indian/Hindi usability
- low API cost
- low maintenance
- small codebase
- clean architecture
- AI-maintainable code
- production release readiness

When forced to choose between:
- fancy animation and correctness → choose correctness
- more features and readability → choose readability
- custom Panchang math and trusted provider → choose trusted provider
- repeated API calls and cache → choose cache
- clever architecture and simple maintainable architecture → choose simple maintainable architecture

Build the best complete version you can.
