# Deep assurance audit

Audit date: 14 October 2026  
Revision reviewed: `d3252da` plus the external-link and semantic-form repairs made during this audit
Scope: exported English web preview, shared Expo UI, content/review gates, local data boundaries, card journeys and dependency report

This is an engineering and usability audit. It does not certify clinical accuracy, legal clearance, WCAG conformance, or real patient/carer usefulness.

## Evidence completed

- All 18 public routes were opened in a disposable preview tab. Every route had a page heading, the shared Menu, the persistent medical-help link, the four-item navigation dock and no horizontal overflow at the available 912px viewport.
- The unavailable route showed an accessible “Page not found” shell with Home, Menu and medical-help access.
- The Menu exposed a labelled navigation region and Escape closed it while returning focus to the trigger.
- The personal-card journey was exercised with synthetic text: words → optional extras → design gallery → review. Returning to an earlier step retained the unsaved description. The review showed the selected wording, safety label and export controls.
- The personal gallery exposed eight practical designs; the milestone gallery exposed eight separate designs. Practical and milestone safety labels remained distinct.
- Urgent help retained generic emergency wording, B.E. F.A.S.T., the doctor/medical-professional boundary, the instruction to call even if signs stop, and the statement that the app is not a medical service.
- `npm test` passed all 101 tests, including storage failure handling, output filtering, card separation, photo boundaries, review metadata, content, native configuration and privacy checks.
- TypeScript, static export, 35-artifact route validation, design validation and the low-risk web-preview release gate passed.
- The browser audit exercised only invented values. No user saved data was opened, cleared or changed.

## Confirmed findings and repairs

| Severity | Finding | Evidence | Disposition |
|---|---|---|---|
| High / release maintenance | `npm audit --omit=dev` reports 18 affected package nodes, grouped around unresolved `braces` and `node-forge` advisories in Expo/Metro build and signing tooling. | Audit run on 14 October 2026; existing dependency note identifies the same upstream groups. | Keep the dependency gate visible, avoid `npm audit fix --force`, update only through tested Expo releases, and recheck before distribution. This is primarily a build-chain risk; it is not evidence that local card fields are sent to those packages. |
| Medium · repaired | External source and repository destinations were implemented as React Native `Pressable` elements with `accessibilityRole="link"` and `Linking.openURL`, rather than ordinary web anchors. | `app/about.tsx`, `app/urgent-help.tsx`, `app/glossary.tsx`, `app/guide/[slug].tsx`, `app/resources.tsx`. | `ExternalLink` now renders a real web anchor with `target="_blank"` and `rel="noopener noreferrer"`, while retaining native Linking behavior. The rebuilt preview verified those attributes on resource links. |
| Medium · repaired | Text inputs did not consistently expose meaningful HTML `name`/`autocomplete` metadata on the web. | Appointment, support, glossary, guide search and card fields use the shared React Native `TextInput`. | The web branch now renders semantic input/textarea elements with stable names, labels and autocomplete `off`; autofill and screen-reader verification remain follow-up checks. |
| Low | In-memory guide/library filters are not reflected in the URL. | Search and audience filters reset on reload and are retained only by the reading-session provider. | This protects privacy and keeps URLs clean, but it reduces shareable return links. Decide deliberately per filter; do not put card, appointment or support values in URLs. |

## Unresolved release gates

- Clinical claim ledger, emergency wording and source limits still require qualified clinician review.
- Patient/carer usefulness sessions have not been run with people; simulated agents and synthetic browser journeys are not substitutes.
- NVDA, VoiceOver, TalkBack, manual browser zoom, physical printing and native iOS/Android behavior remain untested here.
- Jurisdiction screening remains blocked. The preview uses generic emergency wording and no country-specific numbers, accounts, backend, analytics or paid features.
- Browser localStorage, IndexedDB photos, downloads, printed cards, browser backups and hosting logs remain outside the app's complete control; the privacy notices state those limits.

## Stop-ship assessment

The current revision is suitable for continued development and a narrow English static preview. It is not ready to be described as clinically reviewed, globally legally cleared, accessible-certified or native-release ready. The confirmed focus issue found in this audit was corrected in `src/components/webStyles.ts`: the main region used by the skip link now has a visible focus outline in light and dark themes.

## Next audit actions

1. Re-run external-link and input metadata checks in a production-hosted build.
2. Re-run the route matrix at 320px, 390px, 200% browser zoom and a short landscape viewport.
3. Run assisted-technology sessions and clinical, lived-experience, legal and translation reviews before changing the release status.
