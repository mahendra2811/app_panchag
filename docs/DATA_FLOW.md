# Data flow and storage

| Data | Origin | Stored | Leaves the device in app code? |
|---|---|---|---|
| City and state choice | User selection from bundled catalog | AsyncStorage preferences | No |
| Language, view, appearance | User settings | AsyncStorage preferences | No |
| Panchang day | `panchang-ts` local calculation for selected city | Bounded in-memory cache | No |
| Provisional 2026–2029 reference pack | Local generator | Development artifact outside app assets | No; not shipped while unapproved |
| Reminders and completion | User | SQLite | No |
| Personal date notes | User | SQLite | No |
| Local notification requests | Reminder scheduler | Android notification service and SQLite scheduling rows | Remains on device; displayed by Android |

The app does not request GPS, contacts, camera, microphone, SMS, phone, broad storage, or device calendar access for its core flows. It does not register an Expo push token or call a provider API. Android notifications are requested only when a user enables an alert.

The Expo configuration sets `android.allowBackup` to `false`. Release validation must inspect the merged Android manifest and backup rules; this document does not claim encryption of SQLite or immunity from all OEM/device-transfer behaviour.

Government holiday declarations are not inferred from religious festival calculations. The current UI shows official holiday data as unavailable until an official, year-specific notice can be included with provenance.
