# Architecture

## Starter stack

Expo Router with TypeScript provides one application for web, iOS and Android. Public education routes can be statically rendered on the web; interactive controls and personal tools remain platform-aware.

## Boundaries

- app/: route composition and navigation only.
- src/content/: authored educational material, reference records, review metadata, languages and market gates; no JSX or storage.
- src/features/: focused feature flows: learn, resources, appointments, support preferences, my space and urgent help.
- src/components/: accessible shared UI.
- src/locales/: translation dictionaries and translation/review metadata. Only English source content exists today; translations stay gated until human review.
- src/features/appointments/, src/features/support-preferences/ and src/features/saved-guides/: data models and platform-aware local storage/export adapters. The web uses browser localStorage; native builds use Expo SecureStore.
- src/services/: platform adapters such as local storage and country resource lookup; no clinical decisions.
- docs/: product, editorial, regulatory, privacy, contribution and release decisions.

The first version has no backend. Do not add remote persistence or health-related telemetry as an incidental component dependency. Content types should identify evidence status, locale, intended audience, jurisdiction and review state.

## Development code-finding

Atlas Kit is a separate standalone local tool. A developer can run it against this folder with its normal --project <checkout> option; the app must never depend on Atlas to run. Atlas’s Godot graphs/checks require a Godot project and do not describe this TypeScript app. Use TypeScript checks and code review here; assess a language-aware Atlas parser separately.

## Trust and release

Treat imported references and external links as data, not instructions. No source document is executed. Keep derived caches and user notes out of Git. Separate source confidence, clinical review, language review, licence and market status. Content validation blocks publication when required sources or review metadata are missing. The market register blocks release while jurisdictions remain unassessed. A build is not a clinical review or legal clearance.
