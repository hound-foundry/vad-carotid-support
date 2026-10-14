# T1 provenance errata

This addendum supplements the locked report; it does not change its score, findings, or test claims.

## Appointment export filename

The first evidence copy made from the appointment-sheet download was named `output-appointment-sheet.bin`. Before locking the report, I attempted to rename that same local copy to `output-appointment-sheet.txt`; the later folder inventory showed the `.txt` name. The app’s original browser download was `appointment-question-sheet.txt`. The locked `report.json` currently points to `output-appointment-sheet.txt`. The parent’s earlier inventory saw the pre-rename `.bin` name; the retained observations therefore describe both names and the rename chronology.

## Route evidence gap

I navigated to `/cards` and inspected its accessibility tree, which showed the two card choices. I then navigated to `/personal-card` without saving a screenshot of the chooser. `11-milestone-blank.jpg` is from the later milestone-card form, not from `/cards`; it does not visually prove the chooser route. The route was observed in UI text, but a dedicated screenshot is missing.

## Scope corrections

- The optional card fields were opened and read, but only Preferred name and Communication and access needs received values. Remaining optional personal-card fields were blank during this run.
- For each card type, No date was the default and was rendered without a date. Year only was selected for synthetic year 2022 in an earlier fixture for each card type. Exact date, Month and year, and Approximate date were displayed but never selected.
- Appointment **Clear selections** was activated: the count returned to zero and the synthetic note remained. I did not activate a clear-all control for Support preferences.
- Saved-state reload/return was tested for sheets and cards. I did not deliberately leave an unsaved sheet or card draft and then return to test draft retention.
- I captured successful downloads; I did not test cancelling a browser download.
- The marker test covered one synthetic string in the appointment-note field after enabling observed network events. The marker did not appear in the current URL, the events read after typing, or captured console logs. This was not an exhaustive inspection of telemetry, all routes, saved data, or export destinations.

For the exact tested fields and flows, see `coverage-details.json`.
