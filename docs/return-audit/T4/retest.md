# T4 focused repair retest

This note covers only the assigned root-actuated browser retest on the repaired working tree (`http://localhost:51360`, based on `8c4087e`). It is a simulated carer perspective. It adds no whole-product score and does not revise the original T4 report or findings.

## Results

- **Resolved — early review and return to choices.** On the support sheet, the first section shows the selected-count group and a keyboard-accessible “Review your sheet” action before the full preference list. Activating it focuses the “Support sheet preview”; the preview gives a clear “Back to choices” action. Appointment review follows the same pattern. The preview says changes are unsaved and keeps Save and Export as explicit actions, so review did not silently save or share anything. Evidence: `03-support-review.txt/.jpg`, `01-appointment-review.txt/.jpg`.
- **Resolved — Escape cancels card deletion and restores focus.** The milestone-card confirmation closes on Escape and focus returns to “Delete saved card”; the saved story remains. The practical-card snapshot likewise shows the confirmation closed with focus on “Delete saved card”. Later explicit deletion leaves the milestone form blank. Evidence: `card-escape-check.json`, `04-card-escape.txt/.jpg`, `practical-escape.txt`, `milestone-deleted.txt`.
- **Preserved — explicit saving and export controls.** The reviewed appointment and support sheets retain separate “Save on this device” and Export actions, and both preview states explicitly say there are unsaved changes. This retest did not click Save or Export or regenerate files. The original T4 actual export/PDF/text evidence remains separate and unchanged; this focused capture verifies the review controls and no-auto-save state.
- **Responsive checks in assigned interaction log.** The log records 320 px with 200% app text for the appointment sheet, sequential keyboard access to all nine menu items, and 844×320 landscape menu traversal to Skip to main content. These are recorded browser actions, not true browser zoom or screen-reader evidence.

## Status and limits

| Check | Status | Basis |
|---|---|---|
| Review selected support preferences early | Resolved | Review action is available at the first section; keyboard activation focuses preview. |
| Return from preview to choices | Resolved | “Back to choices” is visible in support and appointment previews. |
| Avoid save/export on review alone | Resolved | Unsaved status remains and Save/Export are separate actions. |
| Cancel practical and milestone card deletion with Escape | Resolved | Confirmation closes and focus returns to Delete saved card; story retained. |
| Explicit save/export output content in this retest | Partial | Controls and unsaved message are present; no new export click or file was part of this focused capture. Prior T4 output artifacts remain the output evidence. |
| Whole-product score | Not assessed | This focused repair pass does not rescore the product. |

OS print dialog and cancellation, native accessibility tools, audible speech, screen-reader behavior, and independent human use remain untested. Browser interaction captures do not establish patient/carer experience or clinical approval.

## Addendum: focus after returning to choices

The additional Enter-key captures close the earlier evidence gap: “Back to choices” moves focus to the `Appointment choices` group and the `Support choices` group, where the selected count, Clear selections, and Review action are available. Appointment focus was captured at 320 px with 200% app text; support focus at 390 px. The prior unsaved support fixture was correctly discarded after a full reload; this step selected one synthetic preference again before reviewing and returning. No save or export occurred. Evidence: `../retest/08-back-to-choices.txt/.jpg`, `../retest/09-support-back.txt/.jpg`, `../retest/interactions.json`. This remains assisted browser evidence with no new whole-product score.
