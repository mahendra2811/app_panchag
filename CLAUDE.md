# Hindu Calendar - Panchang

## Architecture
Expo SDK 57, React Native, strict TypeScript and Expo Router. Routes live in `src/app`; future domain and services code belong outside routes. The authoritative product and data contracts are in the root master prompt and `docs/`.

## Conventions
- Android first; exactly four tabs: Home, Calendar, Reminders, More.
- Date and Panchang values need verified provenance before display.
- Secrets never enter mobile config or `EXPO_PUBLIC_` variables.

## Commands
- Start: `npm start`
- Android: `npm run android`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Test: `npm test`
- Doctor: `npm run doctor`

## Gotchas
- Use `npx expo install` for SDK packages. Native modules require a development build.
- EAS profiles are prepared; account setup and builds are separate work.
- The current screens are scaffold placeholders.
