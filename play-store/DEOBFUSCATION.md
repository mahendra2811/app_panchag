# Android release mapping files

Release builds enable R8 minification and resource shrinking through the
`expo-build-properties` plugin in `app.json`. Debug builds remain unminified.
Android Gradle Plugin includes the R8 mapping in the release app bundle so
Google Play can decode Java/Kotlin crash traces.

Build the next release (version code 5):

```sh
npx eas-cli build --platform android --profile production
```

Download the resulting AAB and confirm it contains the mapping:

```sh
unzip -l application.aab | rg 'BUNDLE-METADATA/com.android.tools.build.obfuscation/proguard.map'
```

Test this release on a device before uploading: minification can affect code
accessed through reflection. Check startup, navigation, SQLite, notifications,
and language selection.

Upload the new AAB to Play Console. Google Play automatically reads the mapping
from bundles built with Android Gradle Plugin 4.1 or later. Keep the AAB for each
release. For local native builds, the separate mapping file is normally at
`android/app/build/outputs/mapping/release/mapping.txt`.

The warning for the already uploaded version code 4 is advisory. If that build
was unminified, there is no R8 mapping to upload. If it was minified, only upload
the mapping retained from that exact build via Play Console's app bundle details
and Downloads section. Never attach a newly generated build's mapping to an
older bundle.

References: [Expo build properties](https://docs.expo.dev/versions/latest/sdk/build-properties/)
and [Google Play deobfuscation](https://support.google.com/googleplay/android-developer/answer/9848633).
