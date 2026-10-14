# T1 repair retest

This is a supplemental evidence review of the primary-actuated repaired-build artifacts supplied under `docs/five-tester-audit/root`. It does not change T1's locked baseline report, score, or original observations. No browser interaction or fresh application testing was performed for this retest.

## T1-UB-01 — saved-guide deletion recovery

**Judgment: Resolved for the supplied flow.** The retained screenshot `root/after-guides-delete-confirm.jpg` shows the one saved “Understanding cervical artery dissection” guide alongside a confirmation panel, explanatory removal text, and separate “Cancel deletion” and “Confirm deletion” buttons. The supplied `root/saved-guides-cancel-reload.txt` records that after choosing cancel and reloading, the guide remains and the count is one. `root/saved-guides-delete-reload.txt` records that after confirming and reloading, the empty state says “No guides are saved yet.” This addresses the original finding that deletion happened immediately without a recovery choice.

**Limits:** This is evidence for one primary-actuated guide and the supplied reload sequence only. It does not establish behavior with multiple saved guides, across devices or browser profiles, or after storage changes. No undo after confirmed deletion was demonstrated; the tested protection is the preceding confirmation with a cancel path.

## T1-PREF-01 — duplicate disclaimer in card PDFs

**Judgment: Partially resolved / scope-limited.** The supplied actual `root/medical-repaired.pdf` contains the warning “Personal information card — not an official medical record or emergency plan.” exactly once in extracted page text, at the end of the page. The supplied rendered `root/medical-repaired-page1.png` shows that same single footer at the bottom; no duplicate body disclaimer is visible. This resolves the personal/medical-card instance for this supplied output.

**Limits:** No repaired milestone-card PDF or rendered milestone page was supplied. The original T1 finding covered both personal and milestone card outputs, so the overall two-output finding cannot be marked fully resolved from this evidence. No fresh download or browser interaction was performed.

## Evidence reviewed

- `docs/five-tester-audit/root/after-guides-delete-confirm.jpg`
- `docs/five-tester-audit/root/saved-guides-cancel-reload.txt`
- `docs/five-tester-audit/root/saved-guides-delete-reload.txt`
- `docs/five-tester-audit/root/medical-repaired.pdf` (one page; extracted text inspected)
- `docs/five-tester-audit/root/medical-repaired-page1.png` (rendered output visually inspected)

## Addendum — T1-PREF-01 milestone-card output

**Updated judgment: Resolved for the supplied parent-actuated outputs.** The newly supplied `root/milestone-supported.pdf` is one page. Its extracted text contains “Personal story/milestone — not medical advice or proof of diagnosis.” exactly once at the end, with no duplicate body disclaimer. The accompanying `root/milestone-supported-preview.txt` also shows the disclaimer once in the preview content. Together with the previously inspected medical PDF, this verifies one footer disclaimer and no duplicate body disclaimer in both supplied repaired card PDFs.

**Scope:** This is artifact inspection of outputs generated in the parent-actuated repaired-build workflow, not an independent browser retest. It covers these supplied files only; no new download, repeated generation, or other export format was tested. This addendum supersedes the earlier limitation that the milestone PDF had not yet been supplied.
