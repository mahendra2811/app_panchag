# Android release preparation

## Build profiles

`eas.json` defines a development APK, internal preview APK and production AAB. The app ID in `app.json` is `com.pooniya.hinducalendar`, version `1.0.0`, versionCode `1`. Confirm ownership before publishing. Never commit signing credentials.

## Required owner inputs before store publication

- Final launcher name, application ID, original app icon/splash artwork, and support email.
- Publicly hosted privacy-policy URL.
- Play Console account access and signing decision.
- Approval to publish the final listing and binary.

## Evidence still required

- Complete independent Panchang/festival review and an approved 2026–2029 pack, or a revised scope disclosed in the listing.
- Verified official holiday notices for any holiday coverage claimed.
- Android device review of reminders, notifications, background/reboot cases, Hindi layout, TalkBack and high text scaling.
- Release manifest/backup/permission inspection and screenshots from the exact release build.
- Generated APK/AAB checksums and a record of the source revision used.

The project is not marked release ready until these items are resolved. No store submission or production deployment is authorized by this document.
