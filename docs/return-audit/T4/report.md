# T4 first-use assessment

This is a simulated first-use perspective for a busy family carer who wants practical help while respecting the person’s choices. It is an independent assessment of the recorded T4 evidence; the parent actuated the isolated browser journey. Locator-driven actions establish that a destination or control worked, not that a new user would discover it. No completion-time claim is made. This is not patient/carer testimony or clinical approval.

## Goals and journeys

1. **Offer help without taking over.** From Home, “Help someone” presents three practical choices: ask what helps, prepare an appointment question, or make a communication card. “Choose one small step together” and the explicit privacy text fit this perspective well. See `01-help-entry.jpg` and `.txt`.
2. **Choose and share a support preference.** Selected a communication preference and a synthetic note, left and returned in-app, explicitly saved, reloaded, and exported. The note and selected preference returned after reload; the downloaded `support-sheet.txt` contained only those choices and the plain-language boundary that preferences are not a care or emergency plan. See `02-support-saved.txt`, `support-sheet.txt`, and `support-return.txt`.
3. **Make a practical card.** Started with blank defaults, chose optional content, previewed it, then saved and reloaded. The preview explains what will be downloaded or printed and offers Edit, PDF, text alternative, save, and privacy details. See `03-card-blank.txt`, `04-card-preview.txt`, `05-saved-list.txt`, and `card-restored.txt`. A saved-card edit was not exercised after the initial preview.
4. **Keep a personal milestone separate.** Entered fictional content, previewed it without the medical-card fields, and confirmed the optional date could be omitted. Saved/reloaded output kept the milestone separate from the practical card; deleting it left the practical card saved. See `06-milestone-blank.txt`, `07-milestone-preview.txt`, `milestone-restored.txt`, `08-separate-saved.txt`, and `card-deletion.json`.
5. **Export and verify what leaves the app.** The support sheet text and both card PDFs/text alternatives were generated and inspected. The one-page practical card includes only entered card content, a safety label, and the generated “Last updated” date; hidden date/story markers are absent. The milestone output contains only its own story fields and label. The PNG previews are legible, with large open space below the content. See `output-checks.json`, `practical-card.txt`, `practical-card-pdf.txt`, `practical-card-page1.png`, `milestone.txt`, `milestone-pdf.txt`, and `milestone-page1.png`.

## Wider recorded coverage

- Shared menu capture covers all nine menu destinations; each has an observed destination heading and persistent Urgent Help link (`../menu-coverage.json`). Guide DOM coverage includes seven full rendered guides and visible source/review status, with clinical review pending (`../guide-coverage.json`). These are DOM coverage samples, not five independent user explorations or content approval.
- Shared observations include an MRA glossary search with no term match, a clear urgent-help destination that directs people to local emergency services without inventing a local number, and a guide that resumes at its prior section after a display change and return (`../T1/04-glossary-empty.txt`, `../T1/05-urgent.txt`, `../T5/02-dark-resume.txt`, `../T5/reading-resume.json`).
- The appointment flow separately demonstrates in-app draft return, explicit save/reload/export, and deletion; T3 records keyboard menu movement at 320 px with 200% app text, short landscape, an unknown-route shell, and Home/back/forward/reload recovery (`../T2/view-interruption.json`, `../T3/keyboard-menu.json`, `../T3/recovery-navigation.json`). These are shared recordings, not T4 actions.

## Rubric

| Area | Score | Evidence-based judgment |
|---|---:|---|
| Navigation | 2/2 | Practical entry points are plainly named; the shared menu reaches all nine destinations. Discovery confidence is limited because T4 steps were parent actuated. |
| Reading and access | 1/2 | The cards and support sheet use readable headings and plain language; shared 200% app-text and keyboard evidence is encouraging. The glossary misses “MRA”; true zoom, screen reader, and speech were not tested. |
| Practical usefulness | 2/2 | Optional preferences and card fields produce reviewable, printable or exportable material; the carer can keep their own questions separate. |
| Data and output trust | 2/2 | Save state is explicit, previews show included content, outputs were checked for hidden fields, and local storage/export limits are explained. PDFs are untagged; native print was not tested. |
| Interruption recovery | 1/2 | In-app return and reload restore expected saved content, and delete confirmation is understandable. Escape did not dismiss the milestone-card confirmation, unlike the sheet confirmation behavior. |

**Total: 8/10.** No confirmed critical failure; the critical-issue cap of 4 does not apply. Confidence is limited to the captured browser evidence and the scoped perspective above.

## Confirmed barriers and preferences

- **Barrier:** the support sheet presents fourteen checkbox choices across three sections before the note and review/export controls. Grouping and “select all” help, but a busy carer may benefit from an early review/skip action or a small starting set.
- **Barrier:** Escape leaves the card deletion confirmation open (`card-deletion.json`; `09-card-escape.jpg`). The focused Cancel deletion button works by click and cancellation preserves the saved card, so this is an inconsistency rather than a blocked path.
- **Preference met:** help is phrased as asking first and letting the person choose; personal fields and sharing are optional.
- **Preference met:** saved-list labels do not expose names or medicine details. Privacy text says browser-profile storage is not encrypted by the app, device access may expose it, and exports/backups remain outside app control.
- **Useful feature:** preview, PDF, text alternative, and export let a carer check the content before sharing. Both card models keep their own fields and outputs; hidden date markers did not leak into tested exports.

## Recommendations and limits

1. Let Escape cancel the card deletion confirmation, matching the support-sheet behavior, while keeping Cancel and Confirm visible.
2. Offer a clear early “review what I chose” path on the support sheet so a short task does not require scanning every preference first.
3. Add common clinical abbreviations such as MRA to the glossary or state that a term is not listed and link to the relevant guide.

Not tested: true browser zoom, NVDA or another screen reader, audible speech, OS print dialog/cancellation, malformed browser storage, and an edit to an already saved card. The PDFs are not tagged. These results do not establish clinical accuracy, real-carer experience, or release readiness.
