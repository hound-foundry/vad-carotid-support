# T2 retest addendum: parent-actuated evidence

This is a separate addendum to the locked T2 baseline report. It records only the named evidence supplied by the coordinator from the repaired build and the explicitly supplied baseline guide comparison. These were parent-actuated UI observations, not an independent T2 browser retest. No browser was used for this addendum. The original report and 8/10 score remain unchanged.

## Findings supported by the supplied evidence

**Support-preferences unsaved return:** The coordinator reports using only in-app links for this leave-and-return sequence. In the returned state, the synthetic marker ROOT_SUPPORT_1381 disposable note and one selected preference are visible, along with “You have unsaved changes. Choose Save to keep them on this device.” This supports that these unsaved values remained in the form through the in-app navigation sequence. The supplied snapshot does not preserve the exact links/routes traversed, so I do not add a more detailed route sequence.

**Support-preferences deletion:** after-support-delete-confirm.jpg shows an inline confirmation panel, the notice that deleting clears the sheet and saved copy while downloaded/printed copies remain unchanged, and distinct “Cancel deletion” and “Confirm deletion” actions. support-cancel-reload.txt shows the synthetic marker and selected preference restored after cancel/reload. This supports the cancel-preserves-saved-state path. No supplied evidence confirms the result of choosing Confirm deletion for support preferences; that outcome remains not tested in this addendum.

**Appointment deletion:** appointment-cancel-escape.txt shows the synthetic reminder and selected question still present after Escape was used to cancel the deletion prompt. appointment-cancel-reload.txt shows those values restored after reload. appointment-delete-reload.txt shows zero selected questions, an empty notes field, and “Nothing is saved unless you choose Save on this device” after confirmation and reload. These snapshots support both cancel/Escape preservation and confirmed deletion for the appointment sheet.

**Guide section retention:** The supplied exact repaired-build in-app sequence is repaired-guide-section2.txt → activate “Back to guides” → activate “Tests, scans and unfamiliar terms” → activate “Back to guides” → activate “Understanding cervical artery dissection” → repaired-guide-inapp-return.txt. The final state shows “Section 2 of 4: Why experiences differ.” This supports section retention across that repaired-build in-app sequence. The separately supplied baseline-section-return.txt also shows Section 2 of 4 after a baseline in-app return sequence. My original T2 interruption notes do not establish how I navigated away; therefore the original T2-01 sequence cannot confirm an in-app section-reset fault. The supported evidence here does not reconstruct my original mechanism.

**Unavailable route recovery:** after-unavailable-recovery.jpg shows a “Page not found” page that explains the link is unavailable, says to choose Home or Menu, and includes a Home link. This is evidence of a return path in the supplied repaired-build screenshot. It does not independently establish which URL was requested or a full navigation/reload sequence.

## Scope and limits

- The support and appointment snapshots use disposable synthetic markers.
- Evidence files are snapshots; no independent interaction, timing, URL/network observation, or browser state inspection was performed for this addendum.
- The support confirmation screenshot proves the prompt and its choices are displayed; only the supplied cancel/reload state establishes the cancel result. Support confirm/delete result remains not tested.
- The guide snapshots establish visible Section 2 state after the stated in-app route sequence, but do not establish behavior for direct URL navigation, reload, browser Back, or other exit paths.
- The unavailable-route screenshot establishes visible recovery links only for that supplied state.
- No source material or clinical content was reviewed.
- The original baseline scores and reports remain locked and unchanged.

## Additional supplied outcome evidence: support-preferences confirmation

The coordinator supplied support-confirm-delete-reload.txt after the earlier addendum. The parent reports saving “One question at a time” and the synthetic note ROOT_SUPPORT_CONFIRM_1381, opening Delete, activating Confirm, then reloading. The supplied post-reload snapshot shows 0 preferences selected, a blank note field, an empty review summary, and “Nothing is saved unless you choose Save on this device.” This resolves the previously not-tested support-confirm/delete outcome for the parent-actuated repaired-build flow: confirmed deletion removed the saved support sheet and its note. It does not change the baseline report or score, and it is not an independent T2 retest.
This new outcome evidence supersedes the earlier line in this addendum stating that the support confirm/delete result remained not tested. The cancellation and confirmation paths are now both supported by the supplied repaired-build evidence.
