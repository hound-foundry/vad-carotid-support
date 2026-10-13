# T2 provenance errata

This addendum clarifies test provenance and coverage meaning for the locked T2 report. It does not change the original reports, scores, or findings.

## Reading interruption sequence

The retained observation states that I enabled “Read one section at a time” on the Understanding cervical artery dissection guide, advanced to Section 2 of 4, left for /learn, searched for “fatigue”, opened a different guide, and then returned to the Understanding guide. It reopened at Section 1 of 4 rather than Section 2. The retained notes do not specify whether the move to /learn was activated through an in-app link, browser Back, or direct tab navigation, and do not preserve exact CUA calls for those steps. I cannot reliably provide a more exact navigation/API sequence; no mechanism is inferred here. The captured mid-guide and return-state observations are in evidence/11-guide-mid.png and evidence/guide-understanding-simplified.txt.

## Meaning of coverage statuses

The coverage table’s “pass” for one-section resume/interruption means the scenario was exercised and evidence was collected; it does not mean the expected resume behavior succeeded. T2-01 records the observed restart at Section 1 as a usability barrier.

The coverage table’s “pass” for saved-sheet deletion/cancellation likewise means deletion behavior was exercised. It does not mean cancellation/undo was available: the support-preferences delete action cleared the synthetic saved values immediately, without an active dialog or visible cancel/undo. T2-02 records this barrier. The appointment sheet was also deleted during its synthetic lifecycle, without a confirmation or cancellation UI in the retained observation. No card delete/cancel action was exercised.

## Leave/return, unsaved data, optional fields, and dates

- Appointment sheet: choices and a synthetic note were edited, explicit save was used, and reload restored the saved choices and note. A separate leave-route-while-unsaved and return test is not established by retained evidence. Optional viewing modes (one section at a time and selected questions only) were exercised; closing/toggling them did not trap section navigation in the observed test.
- Support-preferences sheet: choices and a synthetic note were edited, explicit save was used, and reload restored them. A separate leave-route-while-unsaved and return test is not established by retained evidence. Its optional viewing modes were exercised. Delete was exercised on synthetic values and immediately cleared the saved sheet; no cancel/undo path was observed.
- Personal/medical card: optional controls were expanded and the retained evidence records preferred name, communication/access text, a “what helps” entry, and a selected write-things-down statement. Other optional inputs (description, avoid, emergency contact, clinician/service contact, medicines, allergies) were inspected as available fields; entering values into each of them is not established. The date field defaulted to “No date”; a specific date, 4 October 2026, was entered and shown in preview. Preview-to-edit/return, explicit save, reload, and actual PDF/TXT export were exercised. A separate route-leave-before-save/return test and card delete/cancel test are not established.
- Milestone card: optional title/name/message and “survivor” wording controls were exercised with synthetic text. The default hidden date was confirmed as no date; later a year-only value, 2026, was selected and previewed. Explicit save, reload, actual PNG/PDF/TXT exports were exercised. Other date modes beyond no-date and year-only were not exercised. A separate route-leave-before-save/return and card delete/cancel test are not established.
- In both cards, preview/edit/return means movement within the card flow; it should not be read as evidence that unsaved card state survived leaving the route or closing/reloading the app.

## Privacy observation scope

The synthetic marker was T2-privacy-marker-07 in the optional support-preferences note, on http://localhost:51069/support-preferences. I enabled the documented CDP Network, Runtime, and Log domains and observed Network.requestWillBeSent, Runtime.consoleAPICalled, and Log.entryAdded; I also read the tab’s captured console logs with a 100-entry limit. At local route load, the observed requests were GETs for the local support-preferences document and local Expo entry script. After entering and saving the marker with the visible “Save on this device” control, the observation window contained no additional matching request or log events, and tab.dev.logs returned an empty list. No external destination was opened. This is a scoped observation only; request bodies, every app lifecycle, storage internals, and all possible runtime activity were not inspected. See evidence/privacy-observation.txt and evidence/privacy-marker-saved.png.

## Clear-all scope correction

The locked report marks clear-all as not tested. Its original explanation that I avoided it to protect other testers’ possible fixtures reflected a mistaken setup assumption. The coordinator clarified that the five test origins have separate origin-scoped localStorage, so clearing my assigned origin would not clear other origins. I did not activate or observe the clear-all control, so its coverage remains not tested and no behavior is asserted. Preserve the original 8/10 score; this correction does not add or remove a finding.

## Rejected evidence

The initial guide screenshots with 11,328-byte files (for example, evidence/guide-with-stroke.png) were unstable captures showing only a narrow header and no guide content. They are rejected and must not be cited as accepted screenshot evidence. The later evidence/guide-*-stable.png captures were taken after visiting the observed /guide/ routes and confirming the guide content in the accessibility state. No report finding relies on the unstable images.
