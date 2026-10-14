# T4 retest of repaired artifacts

**Baseline T4 report:** remains locked and unchanged at SHA `72688788cb926af39b9813c38ac830301a0eaeda`.  
**Retest evidence source:** primary-actuated artifacts supplied under `docs/five-tester-audit/root/`.  
**Browser:** no lease; no browser interaction was performed. These are artifact inspections, not an independent replay.

## Medical-card PDF

The supplied actual `medical-repaired.pdf` is one A4 page. Its rendered page and extracted text contain every field from the T4 short fixture: preferred name, about-me text, communication/access needs, help, avoid, emergency contact, clinician/service contact, medicines and allergies. The `HIDDEN_DATE_2030` marker is absent from both `medical-preview.txt` and the PDF extracted text. The selected no-event-date state is therefore consistent with this output.

The PDF includes the separate “Last updated 2026-10-13” label and the safety footer, “Personal information card — not an official medical record or emergency plan.” The extracted content contains no form-filling or return instructions. The preview text also shows the privacy note that files and printouts contain the information shown and copies leave the app’s control. It reports “Unsaved changes” and offers “Save on this device”; this matches the supplied sequence in which the date was changed after saving and then exported. I did not infer that the post-save date selection had been saved.

This resolves the T4-02 date-only second-page issue for the supplied repaired build and fixture: the repaired PDF has one page and the card is legible as a complete page. T4-03’s ambiguity is reduced by the explicit “Last updated” label, but that update date remains visible when no event date is selected. That is correctly distinct in the inspected output; whether users still confuse the dates is a usability judgment, not a demonstrated output error.

## Responsive and delete-confirmation screenshots

`after-home-320-double.jpg` shows the Home page at doubled app text in the narrow view. The Home heading “Guides and tools” is visible within the captured viewport, contrary to the locked baseline report’s statement that it began below the initial viewport. The header wraps and consumes substantial vertical space, and only the beginning of the first tool card is visible at the bottom. `after-home-landscape-double.jpg` shows the title and start of the first tool at doubled text in short landscape; the header occupies multiple rows. These screenshots do not establish clipping or horizontal overflow. They supersede the specific T4-01 claim about the title being below the first view; the remaining extra-scroll concern is a low-severity preference observation.

`after-support-delete-confirm.jpg` shows an in-app confirmation panel for deleting saved preferences, with both “Cancel deletion” and “Confirm deletion” buttons. This corrects the earlier inference that no cancellation control was visible: the primary-actuated evidence shows an accessible in-page choice. The screenshot does not show either choice being activated or the resulting state. Therefore deletion/cancellation outcome behavior remains unverified in this retest; there is no evidence here that the action failed.

## Evidence inspected

- `docs/five-tester-audit/root/medical-preview.txt`
- `docs/five-tester-audit/root/medical-repaired.pdf`
- `docs/five-tester-audit/root/medical-repaired-page1.png`
- `docs/five-tester-audit/root/medical-repaired-extracted.txt`
- `docs/five-tester-audit/root/after-home-320-double.jpg`
- `docs/five-tester-audit/root/after-home-landscape-double.jpg`
- `docs/five-tester-audit/root/after-support-delete-confirm.jpg`

Limits: the root artifacts were produced by another tester’s primary replay. I inspected file contents and rendered images but did not control the browser, reproduce the interaction, click either delete choice, or verify resulting storage state. The locked baseline report remains intact; this addendum records only the supplied retest evidence.
