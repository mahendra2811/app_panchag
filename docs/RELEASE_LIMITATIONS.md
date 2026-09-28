# Current release limitations and open gates

1. The generated Ujjain/Purnimanta 2026–2029 reference pack has 1,461 dates but is marked `releaseApproved:false`. It is not bundled into the app until independent date, timing, festival and city-coordinate review is complete. The app itself can calculate supported selected-city Panchang days offline using `panchang-ts@5.4.0`.
2. The engine documents some missing festival emissions, including Krishna Janmashtami in Mumbai in 2026. Festival listings are labelled as locally calculated and are not presented as a complete authoritative schedule.
3. No official government holiday notices are bundled. The Holiday screen distinguishes unavailable official data from a day with no holiday.
4. Local reminder alarms are scheduled up to 90 days ahead and renewed when the app opens or resumes. Delivery after longer inactivity is not guaranteed by this implementation. Android device verification, including reboot and permission behaviour, remains to be done when testing resumes.
5. The app has not been given a production support contact, final app identity approval, or a hosted privacy-policy URL. Play Store publication awaits those owner inputs and explicit publication approval.
6. User-requested tests and browser checks were deferred. The compiler/build may be used to establish that code packages, but Android behaviour and content accuracy must be reviewed before describing the app as release ready.
