# T3 independent walkthrough

Status: locked. This is a simulated UX and engineering review using invented, disposable fixtures. It is not patient testimony, a clinical review, an accessibility certification, or a claim that I experienced a disability.

## Perspective and expectations

Low-vision and limited-hand-movement simulation focused on large text, keyboard access, optional read-aloud, strong contrast, visible focus, labelled generous controls, no clipped text, and complete action reachability. This perspective is an evaluation lens only.

## Environment

- Frozen revision: `72688788cb926af39b9813c38ac830301a0eaeda`.
- Origin: `http://localhost:51070` (origin-scoped disposable browser storage). No visit was made to `localhost:4173`.
- Browser: Codex in-app browser, hidden tab. Default desktop viewport was used for most checks; responsive captures used 390×844, 320×600, and 568×320. The explicit viewport override was reset and the tab closed.
- App text: 100% for baseline; 200% for enlarged-text checks. Clear-all returned the app to 100%; reduced motion remained selected as a default. Final Home was captured at default display and viewport.
- No physical print job was submitted. No external login, upload, or social media was used. All entered content was synthetic.

## Scores

| Dimension | Score | Evidence and deduction |
| --- | ---: | --- |
| Navigation | 2/2 | All nine menu destinations, header/footer links, Home, urgent help, direct/reloaded routes, history, legacy route fixtures, and an unavailable route were exercised. Sequential keyboard navigation reached the menu and page links. |
| Reading/access | 1/2 | 100–200% app text, spacing, contrast, dark theme, reduced motion, simplified reading, and visible keyboard focus were exercised. At 200% app text and 390/320 px widths, the Home heading splits a word mid-word. Browser zoom and native screen-reader behavior remain untested. |
| Practical usefulness | 2/2 | Seven guides, both sheets, both distinct cards, glossary, save flows, and real synthetic exports were exercised. Guide/source metadata and output contents were inspected. No claim is made about clinical accuracy or approval. |
| Data/output trust | 2/2 | Saved hub used generic labels; real TXT/PDF/PNG contents were inspected; synthetic marker was absent from the URL, observed network event stream, and console log collection. Saved text labels described local storage/export boundaries. |
| Recovery from interruption | 1/2 | Card edit/return and explicit card deletion cancel/confirm worked. Appointment sheet deletion removed saved data immediately without a confirmation/cancel path. Card print preview cancellation could not be verified. |
| Total | 8/10 | No confirmed critical fault; no critical cap applied. |

## Strengths

- The primary actions and menu destinations have text labels, generous target areas, and visible focus during sequential keyboard navigation. Space, Enter, Escape, and reverse Tab behavior were exercised on the menu/navigation.
- App text scale includes 100–200%, with spacing, high-contrast, dark-theme, reduced-motion and simplified-reading controls. The 200% setting retained vertically reachable content at narrow sizes.
- Saved hub labels reveal categories and generic saved status rather than fixture names. About and tool pages explain local browser storage, exposure limits, and that exports/backups are outside app control.
- Guide pages identify drafts as not approved for patient use and show review fields. All seven guides were read from their opening content through their source/review footer; stable top and end screenshots and full DOM snapshots are saved per guide.
- Both card types kept distinct content. Real PDF/TXT files were inspected, and the milestone PNG was visually inspected. The visible card content matched chosen synthetic values; optional event dates were set to No date.

## Frustrations

- At 200% app text on small widths, “Information” in the Home heading is broken inside the word. The page still scrolls, but this harms reading continuity for large-text use.
- Deleting an appointment sheet took effect immediately; there was no confirmation, cancel, or undo surface. The sheet can be recreated, but accidental loss is avoidable.
- Card print-preview content appeared, but its accessible snapshot did not expose in-view Print/Cancel controls and Escape did not close the preview. No print job was sent; cancellation remains unverified.
- AX/DOM snapshots and a button state change do not establish that read-aloud audio was audible. Actual browser zoom, native screen readers, and native-device storage were not available in this run.

## First improvement

Keep the Home H1 words intact at 200% text across narrow widths. Then add an explicit confirm/cancel step for deleting a saved appointment sheet, matching the card deletion flow.

## Findings

### F-01 — Mid-word heading wrap at 200% app text

- Category: usability-barrier. Severity: moderate. Route: `/`.
- Reproduction: open Text and display, select 200%, return Home, set viewport to 390×844 or 320×600.
- Expected: heading words wrap at spaces while remaining readable and reachable.
- Actual: “Information” splits mid-word at both narrow widths (for example, `Informatio`/`n` at 390 px and `Informat`/`ion` at 320 px). Remaining content is vertically scrollable.
- Evidence: `28-home-200.png`, `29-home-200-390.png`, `30-home-200-320.png`, `31-home-200-landscape.png`.

### F-02 — Appointment sheet deletion has no cancellation step

- Category: usability-barrier. Severity: moderate. Route: `/appointments`.
- Reproduction: save a disposable synthetic appointment sheet and activate Delete saved sheet.
- Expected: a confirmation with a safe cancel path or an undo opportunity before removing saved data.
- Actual: the saved sheet was removed immediately; a “Saved sheet deleted…” status appeared, with no confirmation or cancel UI observed.
- Evidence: `03-appointment-selected.png`, `05-sheet-deleted.png`.

### F-03 — Card print cancellation is unverified

- Category: untested. Severity: not assessed. Routes: personal and milestone cards.
- Reproduction: open the in-app print preview and attempt Escape/cancel.
- Expected: a supported way to return without printing.
- Actual: preview content was present; no Print/Cancel control appeared in the exposed accessibility snapshot, and Escape did not dismiss it. A full OS print dialog was not verified.
- Evidence: `20-card-print-attempt.png`, `23-milestone-print.png`, `personal-card.pdf-page1.png`, `milestone-card.pdf-page1.png`.

## Numbered journey steps

1. Started on Home with no UI hints and mapped primary cards, saved tools, urgent help, and the draft notice (`01-home.png`, `observations.txt`).
2. Opened all nine menu destinations; followed header/footer, Home, and urgent-help links; checked direct/reloaded routes, Back/Forward, legacy `/with-stroke` and `/without-stroke`, and an unavailable route.
3. Used sequential Tab through the Home controls and Shift+Tab in reverse; expanded/collapsed Menu with Enter, Space, and Escape. Focus stayed visible on observed navigation/settings controls.
4. Read all seven guides from first section through all source/review entries; each has a full text snapshot and stable top/end captures. Sources were inspected as in-app records, not opened on external publisher sites.
5. Searched the glossary for a matching term and a no-match term; saved/reloaded a guide and checked the saved hub. Tested one-section navigation, the global simplified-reading preference, and read-aloud button start/stop state.
6. Exercised appointment and support-preference selection, removal, synthetic notes, preview, optional display settings, explicit save/reload observations where artifacts remain, and real TXT export. Appointment deletion removed data immediately; support-sheet deletion was confirmed, while its cancel path is unverified.
7. Exercised both card blank forms, statements/optional fields, preview/edit/return, save/reload, hidden dates, distinct contents, real PDF/TXT outputs, milestone PNG, and card delete cancel/confirm. Print previews were inspected without submitting a print job.
8. Changed display options and checked 200% text at desktop and narrow/landscape viewports. F-01 was recorded from stable responsive screenshots.
9. Saved a disposable unique marker on the appointment sheet, observed URL, request/response event stream, and console logs, then used clear-all on origin 51070. The saved hub showed no saved items/cards and accessibility preferences returned to defaults.
10. Reset the viewport, captured default Home, closed the owned IAB tab, and confirmed no IAB tabs remained.

## Coverage and evidence

`coverage.json` contains 69 task/route rows. It identifies each of the seven guides individually, records evidence filenames, and gives precise limitations for incomplete checks. Every evidence filename listed there was checked to exist in this folder before lock.

## Limits and uncertainty

- This was a simulated interface review, not testing with a person with low vision, limited hand movement, stroke, or dissection. It is not an accessibility standard audit or clinical content approval.
- Screen reader/NVDA, actual browser zoom, native-device behavior, and physical printing were not tested in the available browser setup.
- Read-aloud start/stop control state was observed, but audible playback was not verified.
- Card print preview was visible; a supported cancel path and OS dialog behavior were not verified. No print job was submitted.
- Appointment selection, note, preview and export were evidenced; a contemporaneous save/reload observation artifact did not remain in the evidence folder, so persistence is not claimed in coverage.
- Network observation was scoped to the synthetic marker save action: CDP reported zero request/response events after save, and the console log collection was empty. No request body existed to inspect. The page Performance API was unavailable in the read-only evaluator.
- Review/source fields and notes were inspected in-app; source publisher content and clinical accuracy were not independently evaluated.

## Lock

`locked=true` — all completed checks are recorded and remaining unsupported or unsubstantiated checks have specific limits. No app, code, dependency, or shared report was edited.
