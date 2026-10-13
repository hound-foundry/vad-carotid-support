# T1 simulated walkthrough report

- **Baseline:** `72688788cb926af39b9813c38ac830301a0eaeda`
- **Origin:** `http://localhost:51068/`
- **Browser:** hidden Codex In-app Browser; normal viewport approximately 1280×720, with temporary checks at 390×844, 320×640, 844×390 and 320×640 at 200% app text.
- **Perspective:** Simulated newly diagnosed adult without stroke, using a phone without an identified access impairment. Wants plain explanations, visible sources and one useful appointment question; prefers calm language and dislikes jargon and repeated notices. This is not patient testimony.

## Outcome

**9/10 — useful and navigable in this simulated path, with one small recovery barrier.** The no-stroke guide is calm and non-predictive, gives a useful follow-up question, and offers a related appointment sheet. Glossary definitions include limits, sources are visible, the review status is clearly disclosed, saved-hub labels are generic, and local storage/export boundaries are unusually explicit. I found no critical or confirmed clinical fault.

The main frustration was the one-click **Delete all saved guides** action: it removed two saved guide entries immediately, without a confirmation or undo. A second, low-impact preference is duplicated disclaimer text in both exported PDFs. At 320px and 200% app text, the appointment heading and header navigation wrap heavily, though the layout had no horizontal overflow.

## Scores

| Category | Score | Reason |
|---|---:|---|
| Navigation | 2/2 | All nine menu destinations, Home, header/footer links, direct routes, reload, Back/Forward, legacy routes and an unavailable route were exercised. |
| Reading/access | 2/2 | Definitions, review disclosures, section pacing, read-aloud controls and display preferences worked. Tested layouts did not overflow horizontally. Actual speech output and assistive technology were not verified. |
| Practical usefulness | 2/2 | The no-stroke guide includes a useful follow-up question; appointment choices and editable notes appear in preview and export. |
| Data/output trust | 2/2 | Local storage and export limits are stated; saved-hub labels are generic; downloaded text, PNG and PDFs contained the expected synthetic content. |
| Recovery from interruption | 1/2 | Saved sheets and cards restored after reload, and cards offered cancelable deletion. “Delete all saved guides” cleared the saved list immediately with no undo. |
| **Total** | **9/10** | No critical cap applied. |

## Findings

### T1-UB-01 — Saved-guide list has no recovery step

- **Category/severity:** Usability barrier / low
- **Route:** `/saved-guides`
- **Steps:** Save two guides, open Saved guides, activate **Delete all saved guides**.
- **Expected:** A chance to cancel or an undo after removing the full list.
- **Actual:** Both entries disappeared immediately. The route then showed the empty-list prompt; no confirmation or undo was exposed.
- **Evidence:** `32-saved-guides.jpg` shows the populated list and control; `54-saved-hub-final.jpg` shows the cleared list after cleanup.
- **Impact:** A mistaken activation can remove a personally useful reading list. The guides can be found and saved again, so this is not a critical lost-data fault.

### T1-PREF-01 — PDF outputs repeat the disclaimer

- **Category/severity:** Preference / low
- **Routes:** `/personal-card`, `/milestone-card`
- **Steps:** Create each synthetic card, download its PDF, inspect the rendered page.
- **Expected:** Keep the safety statement legible without repeating it in the same card.
- **Actual:** The same disclaimer appears beneath the card content and again in the page footer in both one-page PDFs.
- **Evidence:** `pdf-render-1.png`, `pdf-render-2.png`, `output-medical-card.pdf`, `output-milestone.pdf`.
- **Impact:** Minor duplication and lost space; it does not obscure the card content.

## Coverage

All seven guide routes and all nine menu destinations have their own coverage rows in `report.json`. Evidence filenames below are relative to this folder.

## Limits and process notes

This is a simulated UI walkthrough, not patient research, clinical review, or accessibility certification. No external source link was opened and no print job was submitted. The read-aloud button changed to a stop control and back, but audible playback could not be confirmed. Screen readers, actual browser zoom, native phone behavior and real audio output were not tested.

A retry of the appointment-sheet delete control timed out; the earlier same-session cancel/confirm check had succeeded, and the final Saved hub showed no saved appointment item. Test fixtures were synthetic and were removed from device storage. The viewport and display settings were reset and the hidden test tab was closed. Exported synthetic files and screenshots remain only in this evidence folder.

The protocol’s request to read the referenced Tessl rules was attempted, but `C:\Work\.tessl\RULES.md` was unavailable. CUA documentation was refreshed to use its documented screenshot and download APIs; the browser blocked opening a `file:` URL, so PDFs were inspected with the already-bundled PDF runtime instead. This tooling support did not change UX findings.
