# VAD & Carotid Support

A free, independent, open-source project to make life after vertebral or carotid artery dissection easier to understand—for patients, families, carers and anyone trying to help.

**Early development. Not a clinical service.** No content in this repository has received clinical approval. The project does not assess symptoms or provide individual diagnosis, treatment or medication instructions. Questions about an individual’s care belong with their treating team. New, sudden signs of stroke need emergency help; do not wait for a routine appointment.

The project begins with lived experience and a simple aim: make trustworthy information and practical support easier to find, whether or not a dissection caused a stroke. It is an independent Hound Foundry community project; it is not a registered charity, healthcare provider or hospital service.

## What we are building

One accessible product for the web, iOS and Android, with a calm, human feel. Planned features include clear, sourced explanations; support for dissection with and without stroke; appointment questions; a private space for notes and saved resources; and a shareable “How to support me” sheet people choose what to share.

The app will point people back to their own care team. It will not diagnose, score symptoms, choose medicines, promise recovery or tell a person when to return to an activity. Country and language settings will be separate. External articles will remain on their publishers’ sites.

The first language set is English, Russian, Ukrainian, Lithuanian, Latvian, Estonian, Spanish, French, Japanese, Simplified Chinese and Traditional Chinese. Only the interface and the project’s short guides are in scope for translation. Clinical translations require review before release.

## Project readiness

This is a starter repository, not a finished app. Clinical and legal review, local emergency contacts, reviewed translations, privacy assessment, app-store declarations and country-by-country release decisions are open work. See the [product brief](docs/PRODUCT.md), [clinical content standards](docs/CLINICAL_CONTENT.md), [literature seed list](docs/RESEARCH.md) and [regulatory screening register](docs/REGULATORY_SCREENING.md).

## Run the starter app

Requires Node.js 24 and npm. From the project directory:

    npm ci
    npm run web

Then open the local Expo address in a browser. To run the native development server, use npm start. iOS device builds and store submissions may require Apple accounts and build credentials; none are included here.

To help find code with the separate Atlas Kit, point its --project option at this checkout. Atlas Kit is an external local development tool and is not bundled with this project. Its existing static architecture checks target Godot projects; this app uses TypeScript checks and a web build in CI.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [clinical content standards](docs/CLINICAL_CONTENT.md) and [privacy principles](docs/PRIVACY.md). Use synthetic examples only. Do not put patient records, personal health information, unpublished clinical material, credentials or private correspondence in issues or pull requests. Never submit an individual’s medical question as a request for advice.

## Licences

Original application code is available under the [MIT licence](LICENSE). Original guides and translations are planned under [Creative Commons Attribution 4.0](CONTENT-LICENSE.md). Each external publication, image, icon, font and other third-party asset retains its own licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Linking to an article does not give us permission to copy or translate it.

## Safety and urgent help

This project is educational and does not replace a person’s doctor or emergency services. If someone has sudden symptoms that could be a stroke, contact emergency services in their location immediately. Country-specific numbers and national help links must be checked before release in that country.

## Contact and security

Use GitHub issues for general project suggestions; do not include health details. Use GitHub’s private vulnerability reporting for security reports. The repository has no medical-advice inbox.
