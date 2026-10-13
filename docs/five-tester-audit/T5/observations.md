# T5 Observation Notes

Date: 2026-10-13
Baseline under audit: `72688788cb926af39b9813c38ac830301a0eaeda`
Origin: `http://localhost:51072` only. Fixture marker: `T5-SYNTHETIC-PRIVATE-4829`.

## Tool and setup

- `cua.createBrowserTab("iab", "http://localhost:51072", {visible:false})` returned `Browser is not available: iab`.
- CUA inventory listed only Brave Browser, extension type, id `1`. `visible:false` returned `Capability is not available: visibility`.
- Root authorized the visible Brave fallback at the assigned port. The initial browser tab opened Home and was named “T5 VAD walkthrough”. Screenshots show a default viewport around 1098×505; no override or display preference was applied.
- After requesting documented CDP `Network.enable`, the command timed out after 3 seconds. A subsequent checkbox interaction timed out on `Runtime.evaluate`; legacy AX observation timed out on `Emulation.setFocusEmulationEnabled`; rebinding the tab timed out and reset the CUA kernel.
- A fresh tab restored ordinary DOM actions. After the Delete saved sheet button opened a JavaScript confirm, `getJsDialog()` identified a confirm and `dismiss()` removed it. Post-dismissal DOM/screenshot calls timed out, followed by a CUA reset. A final fresh-tab attempt timed out. No app fault is inferred from those bridge errors.

## Numbered journey and backtracking

1. At Home, read the top-level purpose and selected “Understand dissection” without UI hints. The guide index exposed search, seven guides, glossary and saved-guide links.
2. Opened Menu and visited the nine destinations: Guides; Prepare an appointment; Make a card; Help someone; Support preferences; Look up a term; Resources; Saved on this device; About and privacy. A duplicate Saved link also appeared in the main page footer, so the menu action was scoped to “All pages”.
3. Visited Home, urgent help, direct `/`, reload, Back/Forward, both technical legacy routes, and `/not-a-real-page`. The two legacy routes loaded their content. The unavailable route displayed only “Page not found”.
4. Inspected all seven guides from beginning to end, including source links and review status; source publisher pages were not opened. On the first guide, expanded review details, toggled one-section mode, attempted Read guide aloud, and saved the guide. The one-section view showed section 1 of 4 and Previous/Next. “Read guide aloud” remained the same visible button; no Stop/Pause/Resume label appeared.
5. Returned to the guide list using the in-app “Back to guides” link and searched “fatigue” (one result). Opened Glossary from the in-app link, searched “stenosis” (one term) and “zzq-no-match” (zero terms). Browser Back returned to `/learn` with “fatigue” and the matching result still present.
6. Verified the first guide had become saved; its control read “Remove from saved guides,” and the saved-guide page listed its title and review state.
7. On the appointment sheet, selected one question (count 1), removed it (count 0), selected the fatigue/concentration question (count 1), entered the synthetic marker plus a short invented note, and confirmed both appeared in the preview.
8. Left the unsaved sheet through Menu → Support preferences → Menu → Prepare an appointment. The selected question and note returned, with unsaved changes still indicated.
9. Saved the appointment sheet and reloaded the route. The selected question and synthetic note were restored; the URL remained `/appointments` and did not visibly include the marker.
10. Clicked Export sheet. The page said “Export opened after your request. The destination app or file is outside this project’s control.” A download listener started before a follow-up click timed out after 5,999 ms; `getJsDialog()` returned no JavaScript dialog. No actual output could be inspected.
11. Clicked Delete saved sheet. The browser presented a JavaScript confirmation. The confirmation was dismissed. The browser bridge then stopped responding before I could verify retained state, export a final file, delete the synthetic fixture, or bulk clear.

## Key UI observations

- Guide sources/review status were present on each guide. All guide pages stated clinical and patient/carer review were not recorded; displayed review date was not recorded on the first guide.
- The saved-guide page explained that the list may reveal topic interest to anyone with device/profile access and that saving does not send the list to the project.
- The appointment sheet said notes are optional, preview updated live, saving was explicit, local storage was not encrypted by the app, and exports are separate copies outside the app’s control.
- No external page was opened, no login used, no physical print job submitted, and no marker data sent to another destination.
- Read-aloud audio, marker in network requests/logs, populated saved-sheet labels, sheet final deletion/clear, cards, display controls, responsive widths, keyboard focus, browser zoom, screen readers and native devices remain unverified.

## Cleanup and report lock

Report was locked after browser work ended. No viewport or display preference had been changed. I closed the blank tab 471604288; attempts to close the two owned app tabs 471604286 and 471604287 timed out on the browser bridge. Root was asked to close those tabs with restored control. The report treats this as a tooling limitation, not an app finding.

