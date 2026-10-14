# T5 Independent Walkthrough Report

**Status:** Browser interaction ended early after repeated CUA bridge timeouts. Report locked to the required baseline revision and scoped to observed evidence only. This is a simulated UX/engineering inspection, not real patient feedback, a clinical review, or accessibility certification.

## Perspective and first exploration

The scenario prioritizes efficient recovery information, visible sources, optional milestone tools, comfortable display settings, concise summaries, and neutral milestone wording. It dislikes bright or busy screens, compulsory “survivor” wording, repeated introductions, and unclear output contents.

From Home, the first unhinted choice was **Understand dissection**. The guide landing page immediately offered topic cards, search, a glossary route, and saved guides. Opening the Menu then revealed all nine destinations. No timing was interpreted as a human speed result.

## Strengths

- Home routes make the main tasks easy to identify; all nine menu destinations opened, and browser Back/Forward plus Home/reload returned to expected routes.
- Guide pages have short estimated reading times, distinct sections, related guides, linked sources, and an explicit review state. The fatigue guide is discoverable with a one-word search.
- One-section mode reduced the guide body to a single section and exposed Previous/Next controls.
- The fatigue appointment question was optional; a synthetic note appeared in the preview. An unsaved sheet survived leaving and returning in-app, and an explicitly saved sheet restored its selection and note after reload.
- Saved-guide and sheet screens explain that saved data is local to the device/profile and that exports create separate copies.
- Main pages use a soft sage and cream palette with uncluttered content cards in the captured default desktop view. No compulsory survivor wording appeared in the inspected patient-facing guide copy; a source title in the stroke guide uses “survivors.” Cards were not inspected.

## Frustrations

- Clicking “Read guide aloud” left the control labelled “Read guide aloud”; no visible stop/pause state appeared. Audio output could not be verified, so the start/stop journey remains untested.
- An unavailable route rendered only “Page not found” on a dark blank screen, without the app shell or a return link. Browser Back is the only observed recovery route.
- The appointment export action displayed a generic “Export opened after your request” message, but no browser download event or JavaScript dialog appeared during the observation window. The actual artifact and its contents could not be inspected.
- A browser tooling interruption stopped the rest of the planned work after appointment-sheet review. It is not treated as an app fault.

## First improvement

Make read-aloud state explicit with a visible start/stop indicator, and label each export with its file type and contents before handing it to the browser or another app.

## Scores

| Category | Score (0–2) | Evidence / deduction |
|---|---:|---|
| Navigation | 1 | All nine menu routes and history paths worked; the unavailable route stranded the user on a bare page without an in-app recovery link. |
| Reading/access | 1 | Search and one-section mode worked; read-aloud had no visible state change and audio could not be confirmed. Global display and assistive-technology checks were not completed. |
| Practical usefulness | 2 | The fatigue guide and appointment question/note workflow were useful in the observed scope; cards and support-sheet tools were not completed. |
| Data/output trust | 1 | Save/reload and local-storage disclosures were clear, but export contents and request/log boundaries were not verified. |
| Recovery from interruption | 2 | A search and an unsaved appointment sheet survived in-app navigation; a saved appointment sheet restored after reload. |
| **Total** | **7/10** | No critical fault confirmed; no critical cap applied. Scores describe observed scope and do not hide incomplete coverage. |

## Findings

### T5-01 — Bare unavailable page has no app recovery link

- **Category/severity:** usability-barrier, low.
- **Route:** `/not-a-real-page`.
- **Reproduction:** Directly open the unavailable route and inspect the loaded screen.
- **Expected:** A not-found message with a route back into the app.
- **Actual:** The page contained only “Page not found” on a dark blank screen; no app navigation or link was present. Browser Back is the only observed workaround.
- **Evidence:** `15-unavailable.png`.

### T5-02 — Read-aloud action has no visible start/stop state

- **Category/severity:** usability-barrier, low; audible behavior unverified.
- **Route:** `/guide/understanding-dissection`.
- **Reproduction:** Click “Read guide aloud,” then inspect the button and page state.
- **Expected:** A visible running state and a stop/pause action.
- **Actual:** The button remained “Read guide aloud”; no Stop/Pause/Resume control appeared. This confirms missing visible feedback only; it does not establish whether audio played.
- **Evidence:** `16-g1-start.png`; observed DOM state recorded here.

### T5-03 — Appointment export artifact could not be inspected

- **Category/severity:** untested, low.
- **Route:** `/appointments`.
- **Reproduction:** Click “Export sheet” after saving a synthetic appointment sheet. A pre-click `download` listener timed out after 5,999 ms; `getJsDialog()` returned no dialog.
- **Expected:** An inspectable file or a clearly identified destination flow.
- **Actual:** The app showed “Export opened after your request. The destination app or file is outside this project’s control.” No download or browser JavaScript dialog was observable. The host/browser export destination could not be inspected, so no app export fault is asserted.
- **Evidence:** `40-appointment-export-options.png`; `41-appointment-delete-cancelled.png` was not captured because the browser bridge reset during screenshot capture.

## Task coverage

Status meanings: **pass** = no barrier observed in the tested scope; **fail** = reproduced barrier; **not-tested** = exact named limitation.

| Task / route | Status | Evidence or limitation |
|---|---|---|
| First unhinted Home exploration | pass | `01-home.png`, `02-learn-start.png`; Home description and primary tasks visible. |
| Menu destination: Guides `/learn` | pass | `02-learn-start.png`, `03-menu.png`. |
| Menu destination: Prepare an appointment `/appointments` | pass | `04-appointments.png`, `37-appointment-start.png`. |
| Menu destination: Make a card `/cards` | pass for route only | `05-cards-entry.png`; card workflow not tested. |
| Menu destination: Help someone `/supporting-someone` | pass | `06-supporting.png`. |
| Menu destination: Support preferences `/support-preferences` | pass for route only | `07-support-preferences.png`; sheet interactions not tested. |
| Menu destination: Look up a term `/glossary` | pass | `08-glossary.png`; match and empty states tested later. |
| Menu destination: Resources `/resources` | pass | `09-resources.png`. |
| Menu destination: Saved on this device `/saved` | pass | `10-saved.png` showed empty generic groups before synthetic data was added. |
| Menu destination: About and privacy `/about` | pass | `11-about.png`. |
| Header, footer, Home and urgent help | pass | Home and urgent-help links visible; urgent page captured in `12-urgent-help.png`; footer links present in page observations. |
| Direct route, reload, Back and Forward | pass | `/` opened and reloaded; Back returned from About to Saved and Forward returned to About; `12-urgent-help.png` and route notes. |
| Legacy route fixture `/with-stroke` | pass | Direct coverage fixture only; `13-legacy-with-stroke.png`. Not counted as normal menu discovery. |
| Legacy route fixture `/without-stroke` | pass | Direct coverage fixture only; `14-legacy-without-stroke.png`. Not counted as normal menu discovery. |
| Unavailable route content | pass | `15-unavailable.png` shows the “Page not found” response. |
| Recovery from unavailable route | fail | No app return link or shell; browser Back is a workaround. `15-unavailable.png`. |
| Guide: Understanding cervical artery dissection | pass for content review | Start/end, sections, sources/review status, and expanded review details inspected; `16-g1-start.png`, `18-g1-end.png`. |
| Guide: Tests, scans and unfamiliar terms | pass for content review | Start/end and sources/review status inspected; `21-g2-start.png`, `22-g2-end.png`. |
| Guide: Dissection without a diagnosed stroke | pass for content review | Start/end and sources/review status inspected; `23-g3-start.png`, `24-g3-end.png`. |
| Guide: When dissection is accompanied by stroke | pass for content review | Start/end and sources/review status inspected; `25-g4-start.png`, `26-g4-end.png`. |
| Guide: Recovery, fatigue and quality of life | pass for content review | Start/end and sources/review status inspected; `27-g5-start.png`, `28-g5-end.png`. |
| Guide: Supporting someone after dissection or stroke | pass for content review | Start/end and sources/review status inspected; `29-g6-start.png`, `30-g6-end.png`. |
| Guide: Prepare for a follow-up appointment | pass for content review | Start/end and sources/review status inspected; `31-g7-start.png`, `32-g7-end.png`. |
| Guide review details | pass for one guide; remaining status visible | Expanded on g1; all seven displayed “Clinical review: not recorded” and “Patient/carer review: not recorded” in source sections. |
| Guide search and leave/return | pass | Search for “fatigue” found one guide; in-app visit to Glossary then Back restored `fatigue` and its result. |
| Glossary match/empty search | pass | “stenosis” returned one term; “zzq-no-match” returned 0 terms. |
| Saved guide behavior | pass | g1 showed “Remove from saved guides” and “This guide is saved”; `/saved-guides` listed the title and review status. `36-saved-guide-hub.png`. |
| One-section reading mode | pass | g1 showed “Section 1 of 4,” one section, and Previous/Next controls; `17-g1-one-section.png`. |
| Global simplified reading mode | not-tested | Display controls page not opened before repeated browser-bridge timeouts. |
| Manual read-aloud start/stop | fail for visible state; audio not-tested | Button stayed “Read guide aloud”; no stop control appeared. Audio capture/playback could not be verified. |
| Appointment sheet selection/removal | pass | Count changed 0 → 1 → 0; fatigue question then selected. |
| Appointment notes and preview | pass | Synthetic marker and note appeared in preview; `38-appointment-draft.png`. |
| Appointment leave/return | pass | Unsaved selection and note survived in-app navigation through Support preferences. |
| Appointment save/reload | pass | Saved, reloaded, and restored the selected question and note. |
| Appointment export | not-tested | Download listener timed out after 5,999 ms; no JS dialog; exact output could not be inspected. |
| Appointment delete cancellation and final deletion | not-tested | Delete click opened a confirm dialog; it was dismissed. Post-dismissal DOM/screenshot calls timed out, so retained state and delete behavior were not verified. |
| Support-preferences sheet interactions | not-tested | Route opened; browser interruptions occurred before selecting/removing options, preview, saving, export or deletion checks. |
| Cards: blank defaults, optional fields, milestone wording, hidden dates, separate contents | not-tested | Only `/cards` entry route was opened; card details were not reached. |
| Cards: edit/preview/return/save/reload | not-tested | Browser interaction ended before card workflow. |
| Cards: PDF/TXT/milestone PNG and print layout | not-tested | No card output was generated or inspected; no physical print job was submitted. |
| Display: text scale, spacing, contrast, dark theme, reduced motion | not-tested | Display page was not opened before connection interruption; no display preferences were changed. |
| Saved-hub generic labels | not-tested for populated sheets/cards | Empty `/saved` screen showed generic groups; saved-guide hub exposed the guide title. Sheet/card populated-label behavior was not inspected. |
| Explicit export boundary disclosures | pass for disclosure only | Appointment page stated export sends a separate copy; actual file/destination contents were not inspected. |
| Synthetic marker in visible URL | pass in observed state | After save/reload, visible URL remained `/appointments` without the marker. |
| Synthetic marker in network requests | not-tested | Documented CDP `Network.enable` timed out after 3 seconds. |
| Synthetic marker in console logs | not-tested | No successful developer-log observation before bridge reset. |
| Desktop default view | pass for captured default only | Captures are about 1098×505; no explicit viewport override or app display change was applied. |
| 390px, 320px, short landscape, doubled app text | not-tested | Responsive checks were blocked by CUA bridge resets; no explicit viewport override was applied. |
| Keyboard focus/activation | not-tested | No keyboard navigation or focus-order sequence was exercised. |
| Pointer scrolling | pass for guide content | CUA coordinate scrolling reached guide content end and footer; `18-g1-end.png`, `22-g2-end.png` through `32-g7-end.png`. |
| Browser zoom, screen reader, native device, audio | not-tested | No browser zoom or native-device/screen-reader/audio capture capability was exercised. |

## Limits and evidence boundaries

- Fixture text is synthetic: `T5-SYNTHETIC-PRIVATE-4829 fatigue fluctuates; ask about pacing resources.` It was entered only into the assigned local test origin on port 51072.
- No source code, dependency, Git diff, prior audit, or other tester folder was inspected before report preparation.
- CUA listed only Brave Browser as an extension browser; IAB was unavailable. Creating a hidden IAB failed with “Browser is not available: iab”; the hidden visibility option failed with “Capability is not available: visibility.” The root authorized use of a visible Brave tab at `http://localhost:51072` as a fallback.
- `Network.enable` timed out after 3 seconds. Subsequent control/snapshot calls timed out, and CUA reset twice. A final new-tab attempt also timed out. These bridge failures are not app findings.
- No browser zoom, screen reader, native device, actual audio output, print job, or external source-page content was tested. No external site was logged into or sent data.
- No explicit viewport or display preference was changed; reset was not needed. Request/log observation and remaining tasks are reported as not tested rather than inferred.

## Evidence index

Screenshots are saved in this folder with route/state-specific names. Core captures: `01-home.png`, `03-menu.png`, `12-urgent-help.png`, `13-legacy-with-stroke.png`, `14-legacy-without-stroke.png`, `15-unavailable.png`, guide start/end images `16-g1-start.png` through `32-g7-end.png`, `36-saved-guide-hub.png`, `37-appointment-start.png`, `38-appointment-draft.png`, and `40-appointment-export-options.png`.


## Lock and cleanup

Report locked on 2026-10-13. No viewport or display preference was changed. The blank owned tab 471604288 was closed. Closing owned app tabs 471604286 and 471604287 timed out on the CUA bridge; root was asked to close them after restoring browser control. This is recorded as a tooling limitation.

