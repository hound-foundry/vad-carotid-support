# Contributing

Thank you for helping make clear, respectful support easier to find. This is a public-interest project in early development; contributions do not make a contributor a clinician, representative of an organisation or authorised publisher.

## Start safely

- Search existing issues before opening one. Describe the product behaviour, not anyone’s diagnosis or care history.
- Use fictional or synthetic examples only. Never attach a patient record, scan, screenshot of care, unpublished clinical document, private message or account identifier.
- Do not use an issue to ask for or provide personal medical advice. We cannot answer clinical emergencies.
- For a content suggestion, link the exact public source and say which audience and claim it affects. A citation is a lead for review, not proof a claim is supported. See the [patient and carer content review guide](docs/USABILITY_REVIEW.md) before arranging usability feedback; do not request private health details or post sensitive feedback publicly.
- For a suspected vulnerability, use private vulnerability reporting rather than a public issue.

## Pull requests

Describe the user problem, the change and how it was checked. Changes to clinical content need source details and an editorial record. Emergency guidance, medicines, diagnosis and activity advice require qualified clinical review before release. Translation changes need language review; machine translation alone is insufficient for release.

Keep features within the documented first-release scope. Avoid accounts, trackers, advertising SDKs and network transmission of personal notes unless that product/privacy decision is reviewed first.

By submitting original code, you offer it under the MIT licence in this repository. By submitting original guide text or translations, you offer them under CC BY 4.0. Do not submit material you do not have rights to contribute.

## Development

Install dependencies with npm ci; start the web version with npm run web. Run npm run typecheck and npm run build:web before requesting review. Keep private files and credentials outside the checkout.
