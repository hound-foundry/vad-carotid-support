# T2 UX and technical audit (locked)

Frozen revision: 72688788cb926af39b9813c38ac830301a0eaeda
Origin: http://localhost:51069
Perspective: Simulated UX/technical inspection from the perspective of a person recovering after stroke with memory and attention difficulties who values short steps, clear progress, and easy return after interruption. This is not patient feedback or disability simulation; preferences are not universal.

## Verdict and scores

Generally useful for finding guides and preparing shareable sheets/cards, with avoidable recovery and deletion risks for this perspective.

| Dimension | Score |
|---|---:|
| Navigation | 1/2 |
| Reading and access | 2/2 |
| Practical usefulness | 2/2 |
| Data and output trust | 2/2 |
| Recovery from interruption | 1/2 |
| **Total** | **8/10** |

No confirmed critical fault was found; the critical cap was not applied. Scores are independent judgments for this synthetic perspective, not population findings.

## Strengths

- Home presents several plainly named tasks and an urgent-help link.
- Guide headings, read estimates, draft/review notices, sources and review-status details are visible; one-section mode is available.
- Sheets and cards let the user choose content, review it, save explicitly, and inspect local exports. Real PDF/TXT/PNG output was inspected and matched the synthetic previews.
- Saved hub uses generic categories and states that names/notes/health details appear only after opening each tool.
- The app explains browser-profile/local storage, lack of encryption, local-only state and export-copy boundaries. The synthetic save generated no observed network or console event in the scoped observation window.
- Keyboard focus was visible and Enter activated the menu; responsive Home views had no horizontal overflow at the tested widths.

## Frustrations

- Returning to a one-section guide after interruption reset it to the first section.
- Delete saved preferences acted immediately, with no confirmation or undo in the tested flow.
- The unavailable-route page offers no in-app Home link.

First improvement: Preserve the current guide section when leaving and returning, and make the return state explicit. This directly reduces the need to remember reading progress; follow with confirmation/undo for saved-sheet deletion.

## Findings

### T2-01: One-section reading did not resume at the last section (usability-barrier, moderate)

- Route: /guide/understanding-dissection
- Steps: Turn on “Read one section at a time”. Advance the guide to Section 2 of 4. Leave for /learn, search for a different guide, and return to the first guide.
- Expected: Resume at the previously reached section or clearly show a saved reading position.
- Actual: The guide reopened at Section 1 of 4; I had to recall and advance back to the prior section.
- Evidence: [evidence/05-guide-one-section.png](evidence/05-guide-one-section.png), [evidence/11-guide-mid.png](evidence/11-guide-mid.png), [evidence/guide-understanding-simplified.txt](evidence/guide-understanding-simplified.txt)
- Impact: For the stated perspective, interruption makes the reader repeat steps and remember where they stopped. This was observed once in this flow; no human timing or clinical inference.

### T2-02: Delete immediately removed the saved sheet without a confirmation or undo (usability-barrier, moderate)

- Route: /support-preferences
- Steps: Open the saved synthetic support preferences sheet. Activate “Delete saved preferences”.
- Expected: Provide a clear confirmation or an immediate recovery option before saved choices and note disappear.
- Actual: Saved selections and note cleared on activation. There was no active dialog or visible cancel/undo; status said the saved preferences were deleted from device storage. The click API timed out, but the resulting UI state confirmed deletion.
- Evidence: [evidence/support-delete-before.png](evidence/support-delete-before.png), [evidence/support-delete-after-timeout.png](evidence/support-delete-after-timeout.png)
- Impact: A mistaken activation can remove a prepared sheet with no in-app recovery; only synthetic values were used.

### T2-03: Unavailable page has no in-app return path (usability-barrier, minor)

- Route: /t2-unavailable-route
- Steps: Navigate to the unavailable route used for the route check.
- Expected: Show a clear Home or back-to-content link.
- Actual: The page was black and contained only “Page not found”; returning required browser Back.
- Evidence: [evidence/36-unavailable-route.png](evidence/36-unavailable-route.png), [evidence/unavailable-route-dom.txt](evidence/unavailable-route-dom.txt)
- Impact: A person following a stale link may need to recover through browser controls; this check does not imply that any listed menu route is broken.

## Coverage

| Task/route | Status | Evidence or reason |
|---|---|---|
| Home independent first exploration; header, Home and footer | pass | [evidence/01-home.png](evidence/01-home.png) |
| Menu destination Guides (/learn) | pass | [evidence/menu-guides.txt](evidence/menu-guides.txt), [evidence/02-learn-start.png](evidence/02-learn-start.png) |
| Menu destination Prepare an appointment (/appointments) | pass | [evidence/menu-appointments.txt](evidence/menu-appointments.txt), [evidence/18-appointment-sheet-start.png](evidence/18-appointment-sheet-start.png) |
| Menu destination Make a card (/cards) | pass | [evidence/menu-cards.txt](evidence/menu-cards.txt), [evidence/25-card-chooser.png](evidence/25-card-chooser.png) |
| Menu destination Help someone (/supporting-someone) | pass | [evidence/menu-help-someone.txt](evidence/menu-help-someone.txt), [evidence/32-supporting-someone.png](evidence/32-supporting-someone.png) |
| Menu destination Support preferences (/support-preferences) | pass | [evidence/menu-support-preferences.txt](evidence/menu-support-preferences.txt), [evidence/24-support-preferences-start.png](evidence/24-support-preferences-start.png) |
| Menu destination Look up a term (/glossary) | pass | [evidence/menu-glossary.txt](evidence/menu-glossary.txt), [evidence/16-glossary.png](evidence/16-glossary.png) |
| Menu destination Resources (/resources) | pass | [evidence/menu-resources.txt](evidence/menu-resources.txt), [evidence/33-resources.png](evidence/33-resources.png) |
| Menu destination Saved on this device (/saved) | pass | [evidence/menu-saved.txt](evidence/menu-saved.txt), [evidence/saved-hub-final.png](evidence/saved-hub-final.png) |
| Menu destination About and privacy (/about) | pass | [evidence/menu-about.txt](evidence/menu-about.txt), [evidence/34-about.png](evidence/34-about.png) |
| Urgent help and return/back-forward behavior | pass | [evidence/35-urgent-help.png](evidence/35-urgent-help.png), [evidence/about-page.txt](evidence/about-page.txt) |
| Direct/reloaded routes | pass | [evidence/legacy-with-stroke.txt](evidence/legacy-with-stroke.txt), [evidence/legacy-without-stroke.txt](evidence/legacy-without-stroke.txt), [evidence/appointment-reloaded.txt](evidence/appointment-reloaded.txt), [evidence/personal-card-reloaded.txt](evidence/personal-card-reloaded.txt) |
| Legacy fixture /with-stroke | pass | [evidence/legacy-with-stroke.png](evidence/legacy-with-stroke.png), [evidence/legacy-with-stroke.txt](evidence/legacy-with-stroke.txt); Route was supplied as a fixture by the coordinator; it is not a menu-discovery success. |
| Legacy fixture /without-stroke | pass | [evidence/legacy-without-stroke.png](evidence/legacy-without-stroke.png), [evidence/legacy-without-stroke.txt](evidence/legacy-without-stroke.txt); Route was supplied as a fixture by the coordinator; it is not a menu-discovery success. |
| Unavailable route | fail | [evidence/36-unavailable-route.png](evidence/36-unavailable-route.png), [evidence/unavailable-route-dom.txt](evidence/unavailable-route-dom.txt) |
| Guides index and library review/source disclosure | pass | [evidence/02-learn-start.png](evidence/02-learn-start.png), [evidence/03-library-review-details.png](evidence/03-library-review-details.png) |
| Guide /guide/understanding-dissection and sources/review | pass | [evidence/guide-understanding-dissection.txt](evidence/guide-understanding-dissection.txt), [evidence/guide-understanding-dissection-stable.png](evidence/guide-understanding-dissection-stable.png) |
| Guide /guide/tests-and-terms and sources/review | pass | [evidence/guide-tests-and-terms.txt](evidence/guide-tests-and-terms.txt), [evidence/guide-tests-and-terms-stable.png](evidence/guide-tests-and-terms-stable.png) |
| Guide /guide/without-stroke and sources/review | pass | [evidence/guide-without-stroke.txt](evidence/guide-without-stroke.txt), [evidence/guide-without-stroke-stable.png](evidence/guide-without-stroke-stable.png) |
| Guide /guide/with-stroke and sources/review | pass | [evidence/guide-with-stroke.txt](evidence/guide-with-stroke.txt), [evidence/guide-with-stroke-stable.png](evidence/guide-with-stroke-stable.png) |
| Guide /guide/recovery-and-quality-of-life and sources/review | pass | [evidence/guide-recovery-and-quality-of-life.txt](evidence/guide-recovery-and-quality-of-life.txt), [evidence/guide-recovery-and-quality-of-life-stable.png](evidence/guide-recovery-and-quality-of-life-stable.png) |
| Guide /guide/supporting-someone and sources/review | pass | [evidence/guide-supporting-someone.txt](evidence/guide-supporting-someone.txt), [evidence/guide-supporting-someone-stable.png](evidence/guide-supporting-someone-stable.png) |
| Guide /guide/follow-up-questions and sources/review | pass | [evidence/guide-follow-up-questions.txt](evidence/guide-follow-up-questions.txt), [evidence/guide-follow-up-questions-stable.png](evidence/guide-follow-up-questions-stable.png) |
| Guide search matching and empty state; interrupted reading/search | pass | [evidence/06-guide-search-fatigue.png](evidence/06-guide-search-fatigue.png), [evidence/guide-empty-search-final.png](evidence/guide-empty-search-final.png), [evidence/guide-understanding-simplified.txt](evidence/guide-understanding-simplified.txt) |
| Saved guide and saved hub generic labels | pass | [evidence/15-saved-hub.png](evidence/15-saved-hub.png), [evidence/saved-hub-final.png](evidence/saved-hub-final.png) |
| Dedicated /saved-guides route | not-tested | Saved-guide checkbox and generic saved-hub entry were tested, but the separate /saved-guides destination was not opened before browser release. |
| Glossary matching and empty search | pass | [evidence/glossary.txt](evidence/glossary.txt), [evidence/glossary-empty-search.txt](evidence/glossary-empty-search.txt), [evidence/17-glossary-empty.png](evidence/17-glossary-empty.png) |
| One-section mode; resume after interruption; read-aloud start/stop | pass | [evidence/05-guide-one-section.png](evidence/05-guide-one-section.png), [evidence/11-guide-mid.png](evidence/11-guide-mid.png), [evidence/guide-understanding-simplified.txt](evidence/guide-understanding-simplified.txt) |
| Appointment sheet select/remove, note, view options, save/reload/export/delete | pass | [evidence/appointment-edited.txt](evidence/appointment-edited.txt), [evidence/appointment-reloaded.txt](evidence/appointment-reloaded.txt), [evidence/appointment-export.txt](evidence/appointment-export.txt), [evidence/23-print-button-after-timeout.png](evidence/23-print-button-after-timeout.png) |
| Support preference sheet select/remove, note, view options, save/reload/export/delete | pass | [evidence/support-preferences-edited.txt](evidence/support-preferences-edited.txt), [evidence/support-preferences-reloaded.txt](evidence/support-preferences-reloaded.txt), [evidence/support-preferences-export.txt](evidence/support-preferences-export.txt), [evidence/support-delete-after-timeout.png](evidence/support-delete-after-timeout.png) |
| Both sheets: explicit delete/cancellation state | pass | [evidence/support-delete-before.png](evidence/support-delete-before.png), [evidence/support-delete-after-timeout.png](evidence/support-delete-after-timeout.png); Delete executed without an active browser dialog; it immediately cleared the synthetic saved sheet. No cancel/undo control appeared. |
| Personal card blank defaults, optional fields, preview/edit/save/reload, hidden date | pass | [evidence/personal-card-start.txt](evidence/personal-card-start.txt), [evidence/personal-card-fields.txt](evidence/personal-card-fields.txt), [evidence/personal-card-preview.txt](evidence/personal-card-preview.txt), [evidence/personal-card-reloaded.txt](evidence/personal-card-reloaded.txt) |
| Milestone card blank defaults, optional date, preview/edit/save/reload | pass | [evidence/milestone-card-start.txt](evidence/milestone-card-start.txt), [evidence/milestone-card-preview.txt](evidence/milestone-card-preview.txt), [evidence/milestone-card-preview-year.txt](evidence/milestone-card-preview-year.txt), [evidence/milestone-card-reloaded.txt](evidence/milestone-card-reloaded.txt) |
| Separate card contents and actual PDF/TXT/PNG output inspection | pass | [evidence/personal-card-export.pdf](evidence/personal-card-export.pdf), [evidence/personal-card-export.txt](evidence/personal-card-export.txt), [evidence/personal-card-page-1.png](evidence/personal-card-page-1.png), [evidence/milestone-card-export.pdf](evidence/milestone-card-export.pdf), [evidence/milestone-card-export.png](evidence/milestone-card-export.png), [evidence/milestone-card-export.txt](evidence/milestone-card-export.txt), [evidence/milestone-card-page-1.png](evidence/milestone-card-page-1.png) |
| Print preview without submitting a print job | not-tested | The supported print-button click timed out before a preview could be observed; no print job was submitted. Exported PDF layouts were rendered and inspected. |
| Export cancel state | not-tested | Local downloads completed through the documented download event; no separate app-level cancel state was exposed during this inspection. |
| Display preferences: 200% app text, roomier, contrast, dark, reduced motion, simplified; reset | pass | [evidence/08-accessibility.png](evidence/08-accessibility.png), [evidence/09-display-settings-on.png](evidence/09-display-settings-on.png), [evidence/10-simplified-guide.png](evidence/10-simplified-guide.png), [evidence/37-display-reset.png](evidence/37-display-reset.png) |
| Privacy/storage statements and synthetic marker request/console observation | pass | [evidence/about-page.txt](evidence/about-page.txt), [evidence/privacy-observation.txt](evidence/privacy-observation.txt), [evidence/privacy-marker-saved.png](evidence/privacy-marker-saved.png) |
| Explicit clear-all saved data | not-tested | Individual synthetic sheet deletion was tested; bulk clear-all was not activated to avoid clearing other testers’ possible local fixtures in the shared browser profile. |
| Desktop, 390px, 320px, short landscape and 200% app text | pass | [evidence/01-home.png](evidence/01-home.png), [evidence/390-home.png](evidence/390-home.png), [evidence/320-home.png](evidence/320-home.png), [evidence/844x390-home.png](evidence/844x390-home.png), [evidence/09-display-settings-on.png](evidence/09-display-settings-on.png) |
| Keyboard focus and activation; pointer scrolling | pass | [evidence/keyboard-first-focus.png](evidence/keyboard-first-focus.png), [evidence/keyboard-menu-focus.png](evidence/keyboard-menu-focus.png), [evidence/keyboard-menu-open.png](evidence/keyboard-menu-open.png) |
| True browser zoom, screen reader/NVDA and native device behavior | not-tested | No true browser-zoom, screen-reader or native-device interface was available through the authorized browser tooling; app text scaling was tested separately. |

## Limits and evidence notes

- All inputs were synthetic. No actual patient, carer or clinician feedback was gathered.
- The guide screenshot files captured before the parent’s evidence-quality intervention are rejected; stable `*-stable.png` captures were saved and inspected instead. The intervention concerned capture quality, not app behavior.
- A transient route-guessing mistake used `/learn/<slug>`; these paths were not treated as app findings. Guide routes were then read from the visible `/learn` link list and all seven `/guide/<slug>` routes were captured successfully.
- PDFs were extracted and rendered with the bundled Python PDF support; screenshots and exact downloaded bytes are local evidence.
- CDP observation was scoped to one local synthetic marker save. It observed only local document/script requests at route load, no request/log events after save, and no console logs; it does not prove all runtime behavior.
- No Facebook group, external source, external upload, sign-in or print job was opened or submitted.
- Print preview click timed out before preview; PDF layout was inspected in its place. True browser zoom, screen readers and native devices were not available and were marked not tested.
- The independent scores use the protocol’s 0–2 scale. No confirmed critical fault was found; critical cap not applied.

Capture-quality intervention: the parent rejected the initial 11,328-byte guide captures because they showed only a narrow header. Those files are excluded as guide screenshot evidence; each guide was recaptured at its observed /guide/ route with a stable viewport screenshot. This was not treated as a product finding.
