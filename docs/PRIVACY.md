# Privacy principles and build requirements

This is a design specification, not a privacy notice, data protection impact assessment or legal opinion. No production privacy review has been completed.

The initial product is intended to collect as little information as possible. No account, advertising, behavioural analytics, third-party health SDK, remote note sync or message board is in scope. Appointment notes, saved resources and the “How to support me” sheet should remain on the device until the user explicitly exports or shares them.

Before implementing storage, document each data item, device and browser backup behaviour, purpose, retention, delete/export behaviour, operating system access and all network destinations. Sensitive content must not enter URLs, referrers, browser logs, analytics, crash dumps or share links. Do not claim local storage alone ensures privacy.

The website can still generate server logs and expose visitors to external-link tracking when they leave the site. Review hosting, DNS/CDN, error handling, dependency and store data disclosures. Link out with clear destination labels; do not embed third-party pages. Avoid cookies and device storage unless required and assessed under applicable rules.

Before launch, determine the real operator/controller, contact route, lawful bases, special-category conditions where relevant, records, rights handling, breach response, vendor agreements, international transfers and any required regulator fee or registration. A free or volunteer project is not automatically exempt from data protection law.
