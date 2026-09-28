# Hindu Calendar — Privacy Policy (release draft)

Last updated: 28 September 2026

Hindu Calendar is designed to work without an account. The app calculates Panchang on your device for the city you choose. It does not ask for GPS location.

## Information saved on your device

The app stores your selected city, language, calendar preferences, reminders, notes, and local notification schedule in its app storage. Reminder titles and notes are not sent to a server by the app. Clearing the Panchang calculation cache does not delete reminders or notes. Uninstalling the app or clearing its app data can remove this local information.

## Notifications

If you enable reminder alerts, the app asks Android for notification permission and schedules local notifications. Android controls whether and when these appear. Reminder titles may be visible on a lock screen depending on device settings. The app does not register for remote push notifications.

## Network and third parties

The current release design has no user account, advertising, analytics SDK, or online Panchang request. Panchang calculations use the MIT licensed `panchang-ts` library bundled with the app. The app does not send your notes or reminders to that library's publisher.

The Android package is configured with `allowBackup: false` to request that Android exclude app data from standard backup. Device manufacturers and operating system features can behave differently; this statement is subject to release manifest review.

## Your choices

You can change city and language in Settings, disable notifications in the app or Android settings, and delete individual reminders and notes. You can clear calculated Panchang cache separately. The current version has no cloud export or recovery service.

## Contact and publication status

This is the in-repository release draft. A real support contact and hosted privacy-policy URL must be supplied before a Play Store listing is published. Do not publish this text with a placeholder contact.
