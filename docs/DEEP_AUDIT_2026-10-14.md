# Deep assurance audit

Audit date: 14 October 2026  
Revision reviewed: `d3252da` plus the external-link, semantic-form, responsive-row and long-control repairs made during this audit
Scope: exported English web preview, shared Expo UI, content/review gates, local data boundaries, card journeys and dependency report

This is an engineering and usability audit. It does not certify clinical accuracy, legal clearance, WCAG conformance, or real patient/carer usefulness.

## Evidence completed

- All 28 exported routes were opened in a disposable preview tab or covered by the route matrix. Every checked route had a page heading, the shared Menu, the persistent medical-help link, the four-item navigation dock and no horizontal overflow at the available desktop viewport.
- The unavailable route showed an accessible “Page not found” shell with Home, Menu and medical-help access.
- The Menu exposed a labelled navigation region and Escape closed it while returning focus to the trigger.
- The personal-card journey was exercised with synthetic text: words → optional extras → design gallery → review. Returning to an earlier step retained the unsaved description. The review showed the selected wording, safety label and export controls.
- The personal gallery exposed eight practical designs; the milestone gallery exposed eight separate designs. Practical and milestone safety labels remained distinct.
- Urgent help retained generic emergency wording, B.E. F.A.S.T., the doctor/medical-professional boundary, the instruction to call even if signs stop, and the statement that the app is not a medical service.
- `npm test` passed all 101 tests, including storage failure handling, output filtering, card separation, photo boundaries, review metadata, content, native configuration and privacy checks.
- TypeScript, static export, 35-artifact route validation, design validation and the low-risk web-preview release gate passed.
- The browser audit exercised only invented values. No user saved data was opened, cleared or changed.
- Fresh route sweeps at 320px, 390px, 844×390px landscape and 1120px desktop found no horizontal overflow after the input and phone-header repairs.
- All eight practical and eight milestone designs were selected through the live creator at 320px with 200% app text. Each remained within the viewport; accessibility settings were reset afterwards.
- A full 320px sweep with 200% app text found and repaired flex-row intrinsic-width failures in saved rows, guide rows and appointment question rows. The same sweep then reported no visible non-skip-link overflow across the main route matrix.
- Long source disclosure controls were shortened visually to “Source details” while retaining the full resource title in the accessible label. The compact draft notice now uses “Draft · review pending” while preserving its full accessible name.

## Confirmed findings and repairs

| Severity | Finding | Evidence | Disposition |
|---|---|---|---|
| High / release maintenance | `npm audit --omit=dev` reports 18 affected package nodes, grouped around unresolved `braces` and `node-forge` advisories in Expo/Metro build and signing tooling. | Audit run on 14 October 2026; existing dependency note identifies the same upstream groups. | Keep the dependency gate visible, avoid `npm audit fix --force`, update only through tested Expo releases, and recheck before distribution. This is primarily a build-chain risk; it is not evidence that local card fields are sent to those packages. |
| Medium · repaired | External source and repository destinations were implemented as React Native `Pressable` elements with `accessibilityRole="link"` and `Linking.openURL`, rather than ordinary web anchors. | `app/about.tsx`, `app/urgent-help.tsx`, `app/glossary.tsx`, `app/guide/[slug].tsx`, `app/resources.tsx`. | `ExternalLink` now renders a real web anchor with `target="_blank"` and `rel="noopener noreferrer"`, while retaining native Linking behavior. The rebuilt preview verified those attributes on resource links. |
| Medium · repaired | Text inputs did not consistently expose meaningful HTML `name`/`autocomplete` metadata on the web. A follow-up browser check also caught React Native numeric line-height being interpreted as a 486px multiplier on the guide search field. | Appointment, support, glossary, guide search and card fields use the shared React Native `TextInput`. | The web branch now renders semantic input/textarea elements with stable names, labels and autocomplete `off`, converts numeric line-height and padding to CSS-safe values, and was verified at a 52px search-field height. Autofill and screen-reader verification remain follow-up checks. |
| Medium · repaired | At 320–390px, the full header utility labels wrapped into cramped pills and the subtitle truncated mid-word. | Fresh 320px and 390px route sweeps showed the visual labels breaking while the underlying links remained reachable. | The phone shell now uses compact visual labels and an icon below 480px while keeping complete accessible names. All public routes were rechecked with no horizontal overflow. |
| Medium · repaired | At 200% app text and 320px, flex rows for saved-item status, guide arrows and appointment question text exceeded their visual containers even though the document scroll width stayed at 320px. | Bounding-box scan at 320px/200% showed right edges beyond the viewport; the saved row and appointment option were visibly clipped candidates. | Added `minWidth: 0`, explicit container widths and non-shrinking checkbox/arrow affordances to the affected rows. Rebuilt and repeated the full 320px/200% matrix with no remaining visible overflow. |
| Low · repaired | At 200% app text, long source-disclosure titles and the compact draft label created unnecessarily tall controls and increased reading effort. | 320px/200% visual scan showed source titles wrapping into very tall buttons. | Use concise visible labels with full accessible names; keep the full source title in the disclosure content and accessibility tree. |
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
