# Privacy principles and build requirements

This is a design specification, not a privacy notice, data protection impact assessment or legal opinion. No production privacy review has been completed.

The initial product is intended to collect as little information as possible. No account, advertising, behavioural analytics, third-party health SDK, remote note sync or message board is in scope. The appointment sheet stores only selected prompt IDs and an optional note after the user presses Save. The app does not currently save a resource list or a “How to support me” sheet.

The web build uses the current browser profile’s `localStorage`. This storage is not encrypted by the app and may be accessible to people or software that can use the profile or device; browser backup and sync settings vary. Native builds use Expo SecureStore and the platform keychain/keystore; operating-system backup and device access behavior still varies. Neither storage method guarantees privacy. Notes are limited to 500 characters. Export occurs only after an explicit button press: the web build downloads a text file and native builds invoke the operating-system share sheet. Copies sent to another app, shared destination, or backup are outside this app’s deletion control.

The source has no analytics, network sync, account, or backend. Static content and references are bundled at build time; external publishers are contacted only when a user opens their link. This must be rechecked against the final hosting, DNS/CDN, dependency and distribution setup.

Sensitive content must not enter URLs, referrers, browser logs, analytics, crash dumps or share URLs. Do not claim local storage alone ensures privacy. The app code contains no logging of appointment content. Review this property again if logging, crash reporting, sync, hosting or third-party SDKs are introduced.

The website can still generate server logs and expose visitors to external-link tracking when they leave the site. Review hosting, DNS/CDN, error handling, dependency and store data disclosures. Link out with clear destination labels; do not embed third-party pages. Use no cookies and keep device storage limited to the appointment sheet behavior documented above; assess the applicable storage rules before release.

Before launch, determine the real operator/controller, contact route, lawful bases, special-category conditions where relevant, records, rights handling, breach response, vendor agreements, international transfers and any required regulator fee or registration. A free or volunteer project is not automatically exempt from data protection law.
