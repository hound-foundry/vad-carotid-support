# T4 independent walkthrough

**Status:** locked independent report  
**Baseline:** `72688788cb926af39b9813c38ac830301a0eaeda`  
**Origin:** `http://localhost:51071`

## Perspective

This is a simulated busy partner/family carer without a persistent access impairment, often interrupted and looking for practical support while respecting the person's choices. This perspective values printable questions, communication preferences and clear privacy boundaries; it dislikes long reading lists before useful actions, patronising instructions, and pressure to disclose another person's details. Every value entered was invented for this disposable test. This is not real patient/carer feedback or clinical/accessibility approval.

## First-use experience

Home put practical routes such as preparing for appointments and making a card in view, so I could start with an action instead of reading a long list. The development-preview and review-pending language set expectations. The navigation provided routes back to Home, urgent help and the supporting information. A carer can make useful question and communication-preference artifacts without filling in another person's identity or contact details.

The main interruption costs were uneven. Unsaved sheet content survived leaving and returning within the current session, while a reload cleared it; explicit save restored it. Cards and a saved guide link also survived reload. Those distinct rules were not always prominent at the moment of entry. Native confirmation handling was inconclusive in this browser: the appointment was eventually observed deleted after a confirmation action, but cancellation could not be tested; later support-sheet and clear-all confirmations left no inspectable dialog or dependable post-action state. I stopped repeating timeout-prone actions.

## Scores

| Dimension | Score | Reason |
|---|---:|---|
| Navigation | 2/2 | All nine menu destinations, direct loads/reloads, header/footer paths, urgent route, history controls and legacy routes were usable. |
| Reading access | 1/2 | Reading modes, app text sizing, spacing, contrast, themes and keyboard entry were available. At 200% app text in a 320px viewport, the header occupied many lines and the page title fell below the initial viewport; true browser zoom and screen-reader support were not tested. |
| Practical usefulness | 2/2 | Appointment questions, communication preferences, guides, cards and useful exports were reachable and editable with synthetic details. |
| Data/output trust | 1/2 | Local save and privacy indicators were clear, but medical-card PDF export used a second date-only page, and a “No event date” card still printed an update date. |
| Recovery from interruption | 1/2 | In-session sheet return, explicit saves and reload recovery worked in supported cases, but unsaved sheets did not survive reload and native confirmation outcomes could not be consistently inspected. |

**Total: 7/10. Confirmed critical cap: none (cap not applied).** No critical failure was established from the observed sessions. Scores are a simulated single-tester assessment.

## Strengths

- Practical tools were easy to reach from Home and did not require a long reading sequence first.
- Appointment and support-preference sheets let me select, remove, annotate and preview useful content.
- Optional details and invented values were sufficient for card previews and exports; phone numbers and another person's real details were not needed.
- Explicit local saving, generic saved-item labels, and privacy wording made it reasonably clear what was stored on this device.
- Guide review status, sources and limitations were visible, alongside simplified/one-section reading and manual read-aloud controls.
- Actual TXT, PDF and milestone PNG files were downloaded and inspected; the milestone document outputs represented its no-event-date state cleanly.

## Frustrations

- At doubled app text on the 320px layout, the wrapped header pushed the main title below the first view and added scrolling.
- The medical-card PDF put only the update date and footer on page two, wasting a page when a user wants to print or share the card.
- Choosing “No event date” still led to an update date in the medical card preview and both exported formats; it is a separate date, but may be mistaken for the event date without a clear label.
- Reloading an unsaved sheet cleared its content, unlike leaving and returning during the same session. The save point should be prominent before a user expects reload recovery.
- Print actions reported that a print view opened, but this browser exposed no inspectable print surface or cancellation state, so the print layout could not be checked.

## First improvement

Make the medical-card PDF fit the actual card on one page, and keep “Last updated” clearly separate from the event-date choice. This directly improves the printable, shareable artifact a busy carer can prepare without entering personal contact details.

## Findings

1. **T4-01 — Preference, low, `/` at 320px and 200% app text.** After setting app text to 200% and the viewport to 320×568, the header wrapped across many lines and the Home title began below the initial viewport. `documentElement.scrollWidth` remained 320px, so no horizontal overflow or text clipping was established; the observed cost is extra vertical scrolling. Evidence: `layout-320-doubled.png`; related 390px and short-landscape captures: `layout-390-doubled.png`, `layout-landscape-844x360.png`.
2. **T4-02 — Usability barrier, low, `/personal-card` PDF export.** With a synthetic medical card saved, the actual exported PDF had two pages: page one contained the card and page two contained only “Last updated 2026-10-13” and a footer. Reproduce by filling the optional card fields, saving, exporting PDF, and inspecting both pages. Evidence: `medical-card-export.pdf`, `medical-card-export-page1.png`, `medical-card-export-page2.png`, `medical-card-export-extracted.txt`.
3. **T4-03 — Preference, low, `/personal-card` date choice.** The card had no event date selected, yet preview, TXT and PDF included “Last updated 2026-10-13.” This is an update date, not a false event date, but it needs a clear label so a recipient does not confuse them. Evidence: `medical-card-preview-saved.png`, `medical-card-export.txt`, `medical-card-export-extracted.txt`.
4. **T4-U1 — Untested, not rated, sheet delete/cancel and clear-all confirmation outcomes.** Appointment deletion was eventually visible in the UI after invoking Delete; the native confirmation itself was not exposed through the supported browser API, so its Cancel path was not exercised. Support-sheet deletion and clear-all were likewise interrupted at native JavaScript confirmation boundaries and their resulting states were not reliably inspectable. No repeated confirmation attempts were made. Evidence: `about-privacy-clear.png`, `support-preferences-saved.png`; appointment post-action state was observed in the UI but no separate capture was accepted as definitive cancellation evidence.
5. **T4-U2 — Untested, not rated, native print layout.** Medical and milestone card actions displayed an in-app status saying a print view opened and to choose Print or Cancel, but no inspectable print-preview surface or browser cancellation control was available in the IAB. No physical print job was submitted. Evidence: `medical-card-print-view.png`, `milestone-card-print-view.png`.

## Coverage

| Scope | Result | Evidence / boundary |
|---|---|---|
| Home, first-use usefulness | Pass | `01-home.png` |
| All 9 menu destinations; header/footer links; urgent route; direct load/reload; Back/Forward | Pass | `menu-appointments.png`, `menu-cards.png`, `menu-supporting.png`, `menu-support-preferences.png`, `menu-glossary.png`, `menu-resources.png`, `menu-saved.png`, `menu-about.png`, `02-guides.png`, `urgent-help.png`; direct routes `/`, all nine menu paths and `/urgent-help`; history tested between About and urgent help. |
| Legacy `/with-stroke`, `/without-stroke`; unknown route | Pass | `guide-with-stroke.png`, `guide-without-stroke.png`; `/not-a-page` showed Page not found. |
| All 7 guides: open, read to review/source, saved link, reading modes, manual speech controls, interruption/return | Pass | `03-guide-understanding.png`, `04-review-details.png`, `guide-tests-and-terms.png`, `guide-without-stroke.png`, `guide-with-stroke.png`, `guide-recovery-quality.png`, `guide-supporting-someone.png`, `guide-follow-up-questions.png`, `13-guide-saved.png`, `14-saved-hub.png`, `11-one-section-mode.png`, `12-manual-speech-state.png`, `simplified-guide.png`. Manual speech control state changed correctly; audible output was not evaluated. Saved guide reopened and reloaded. |
| Glossary matching and empty state | Pass | Search `stenosis` returned a match; nonsense query returned zero results and a hint. `glossary-initial.png`. |
| Appointment sheet: select/remove, invented note, preview, leave/return, explicit save/reload, TXT export | Pass | `appointment-initial.png`, `appointment-invented-preview.png`, `appointment-one-section.png`, `appointment-unsaved.png`, `appointment-saved-stable.png`; actual file `appointment-export.txt` inspected. Unsaved values survived in-session leave/return; explicit save survived reload. |
| Appointment sheet: cancel-delete and delete | Untested / partial | Delete action ultimately showed “Saved sheet deleted from this app’s device storage”; native cancel path not exposed, so cancellation untested. No retry after dialog boundary. |
| Support preferences sheet: select/remove, invented note, preview, leave/return, explicit save/reload, TXT export | Pass | `support-preferences-initial.png`, `support-preferences-preview.png`, `support-preferences-one-section.png`, `support-preferences-saved.png`; actual `support-preferences-export.txt` inspected. |
| Support preferences sheet: cancel-delete and delete | Untested | Confirmation boundary interrupted the supported API; final state not reliably inspectable, so delete/cancel remain unknown. |
| Medical card: blank/default statements, optional fields, edit-preview-return, save/reload, no date, separate fields, PDF/TXT | Pass | `medical-card-blank.png`, `medical-card-filled.png`, `medical-card-preview.png`, `medical-card-saved-reload-edit.png`, `medical-card-preview-saved.png`; actual `medical-card-export.pdf` and `.txt` inspected and PDF rendered. |
| Medical card milestone: blank/default, optional fields, edit-preview-return, save/reload, no date, separate fields, PDF/TXT/PNG | Pass | `milestone-card-blank.png`, `milestone-card-preview.png`; actual `milestone-card-export.pdf`, `.txt`, `.png` inspected/rendered. No event date appeared in milestone outputs. |
| Saved hub labels/privacy markers | Pass | `saved-hub-both-cards.png`, `about-privacy-clear.png`; generic labels and local-storage/privacy statements observed. A single synthetic save/reload window showed no marker in URL, outgoing requests, or console logs; not a comprehensive network audit. |
| Print/cancel-delete/card delete/clear-all | Untested / partial | Print surfaces and native cancellation were not available to inspect; no physical print. Clear-all confirm returned no inspectable dialog/result. Card-delete panel and action availability observed, but action not invoked. Evidence: both `*-print-view.png`, `about-privacy-clear.png`. |
| Display text, spacing, themes, contrast, motion, simplified reading; reset | Pass | `accessibility-initial.png`, `display-200-spacing-contrast-dark.png`, `simplified-guide.png`, `display-reset.png`; each setting changed and was reset. |
| Responsive 390px, 320px, short landscape at doubled app text; keyboard focus/activation | Pass | `layout-390-doubled.png`, `layout-320-doubled.png`, `layout-landscape-844x360.png`, `keyboard-focus.png`, `keyboard-activation.png`; no horizontal overflow observed. Keyboard moved focus to skip link and activated it. |
| True browser zoom, NVDA/screen reader, native devices | Not tested | Unsupported in this IAB setup. |

## Evidence and limitations

Screenshots show stable loaded UI states. Actual exported files were inspected rather than relying on success messages. The initial `appointment-saved.png` was rejected as an unstable narrow-header capture; `appointment-saved-stable.png` is the replacement accepted for the saved/reloaded state. One browser session and synthetic local data cannot establish clinical safety, patient/carer approval, broad privacy guarantees, screen-reader quality, or native print behavior. Audible speech output was not evaluated. No physical print job, external upload, Facebook, login, or patient-specific AI timing workflow was used. Temporary display and viewport settings were reset and only T4’s tabs were closed before releasing the browser.
