# Third-party notices

The app uses these direct runtime dependencies. Versions and licence identifiers were read from the installed package metadata on 28 September 2026. Full licence texts are in each installed package's licence file and must remain available in release compliance records.

| Package | Version | Licence | Purpose |
|---|---:|---|---|
| panchang-ts | 5.4.0 | MIT | Local Panchang calculation |
| Expo / Expo Router | 57.0.25 / 57.0.23 | MIT | Android app runtime and navigation |
| expo-sqlite | 57.0.3 | MIT | Local reminder and note database |
| expo-notifications | 57.0.21 | MIT | Local notification scheduling |
| expo-localization | 57.0.2 | MIT | Device language preference |
| React / React Native | 19.2.3 / 0.86.3 | MIT | UI runtime |
| Zustand | 5.0.15 | MIT | Local preference state |
| i18next / react-i18next | 26.4.2 / 17.0.15 | MIT | Hindi and English UI text |
| date-fns | 4.4.0 | MIT | Date utility dependency |
| lucide-react-native | 1.48.0 | ISC | Icons |
| Zod | 4.6.5 | MIT | Data validation dependency |
| AsyncStorage | 2.2.0 | MIT | Preference persistence |

This direct-dependency inventory is not a substitute for a generated full transitive dependency notice at release time. The app does not bundle Swiss Ephemeris or redistribute a paid Panchang API response.

## Postal district data

`src/data/cities/postal-districts.json` is a compact offline derivative of [All India Pincode JSON API](https://aniket-thapa.github.io/india-pincode-api/) © 2026 Aniket Thapa, licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The app copied district names and calculated one approximate representative coordinate per district from post-office coordinates. The original licence text is in [`src/data/cities/POSTAL_DATA_LICENSE.txt`](../src/data/cities/POSTAL_DATA_LICENSE.txt). This noncommercial licence is a release restriction for any commercial distribution.
