# VAD & Carotid Support

A free, independent, open-source project to make life after vertebral or carotid artery dissection easier to understand—for patients, families, carers and anyone trying to help.

**Early development. Not a clinical service.** No content in this repository has received clinical approval. The project does not assess symptoms or provide individual diagnosis, treatment or medication instructions. Questions about an individual’s care belong with their treating team. New, sudden signs of stroke need emergency help; do not wait for a routine appointment.

The project begins with lived experience and a simple aim: make trustworthy information and practical support easier to find, whether or not a dissection caused a stroke. It is an independent Hound Foundry community project; it is not a registered charity, healthcare provider or hospital service.

## What we are building

The shared Expo project is web-first and remains structured for later iOS and Android builds. The home has four actions: understand dissection, prepare an appointment, make a card and help someone. The preview includes seven sourced English guide drafts, a glossary, appointment and support sheets, separate practical and milestone cards, local saved items, text/display preferences, read-aloud guide controls, external resources and urgent help on every route. Cards have a short form, separate preview, explicit save, designed PDF/PNG downloads where offered, card-only print and a text alternative. See the [design case study](docs/DESIGN_CASE_STUDY.md), [website design](docs/WEBSITE_DESIGN.md) and [app parity](docs/APP_PARITY.md). Each guide and glossary definition is clearly marked as unapproved pending clinical and patient/carer review.

The app will point people back to their own care team. It will not diagnose, score symptoms, choose medicines, promise recovery or tell a person when to return to an activity. Country and language settings will be separate. External articles will remain on their publishers’ sites. Users can delete each local sheet or clear all saved sheets and guide links from the About page; exported copies and device backups are outside the app’s control.

The first language set is English, Russian, Ukrainian, Lithuanian, Latvian, Estonian, Spanish, French, Japanese, Simplified Chinese and Traditional Chinese. Only the interface and the project’s short guides are in scope for translation. Clinical translations require review before release.

## Project readiness

The English static web preview is intended for broad access as an education and appointment-preparation resource. It is not a clinical service or a claim of legal clearance in every country. The register contains 249 country-or-area records as a watchlist for country-specific features; those records do not prevent this low-risk web preview from being published. Clinical review, reviewed translations, privacy assessment, app-store declarations, dependency security review and local emergency contacts remain gates for the relevant content or distribution change. See the [product brief](docs/PRODUCT.md), [clinical content standards](docs/CLINICAL_CONTENT.md), [literature seed list](docs/RESEARCH.md), [dependency security review](docs/DEPENDENCY_SECURITY.md) and [regulatory screening register](docs/REGULATORY_SCREENING.md).

## Run the starter app

Requires Node.js 24 and npm. From the project directory:

    npm ci
    npm test
    npm run typecheck
    npm run build:web
    npm run preview:web

`npm run build:web` creates a local static preview. `npm run release:web` checks the low-risk web scope and builds the static release. It does not represent country-by-country legal clearance. Country-specific emergency numbers, medical claims, translations, hosted data, paid features and native app-store releases require their own review before activation.

Open http://localhost:4173/ for the exported preview; clean card URLs also work on reload. For live Expo web development use `npm run web`, and for the native development server use `npm start`. iOS device builds and store submissions may require Apple accounts and build credentials; none are included here.

To help find code with the separate Atlas Kit, point its --project option at this checkout. Atlas Kit is an external local development tool and is not bundled with this project. Its existing static architecture checks target Godot projects; this app uses TypeScript checks and a web build in CI.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [clinical content standards](docs/CLINICAL_CONTENT.md) and [privacy principles](docs/PRIVACY.md). Use synthetic examples only. Do not put patient records, personal health information, unpublished clinical material, credentials or private correspondence in issues or pull requests. Never submit an individual’s medical question as a request for advice.

## Licences

Original application code is available under the [MIT licence](LICENSE). Original guides and translations are planned under [Creative Commons Attribution 4.0](CONTENT-LICENSE.md). Each external publication, image, icon, font and other third-party asset retains its own licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Linking to an article does not give us permission to copy or translate it.

## Safety and urgent help

This project is educational and does not replace a person’s doctor or emergency services. If someone has sudden symptoms that could be a stroke, contact emergency services in their location immediately. Country-specific numbers and national help links must be checked before release in that country.

## Contact and security

Use GitHub issues for general project suggestions; do not include health details. Use GitHub’s private vulnerability reporting for security reports. The repository has no medical-advice inbox.
