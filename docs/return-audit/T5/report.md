# T5 returning-user assessment

**Mode:** Returning T5 perspective; independent assessment of parent-actuated evidence. No browser was used by T5 for this review. This is synthetic UX/technical inspection, not patient feedback, clinical review, or accessibility certification.

**Build:** Frozen revision `8c4087e9fa2764ae3b5cd791c0d5a66834372936`; isolated T5 origin `http://localhost:56684`. No code or other tester report was read. Evidence reviewed from the fresh `return-audit` packet only.

## Numbered journeys

1. **Home → Guides → recovery information — pass.** Home presents four primary tools, saved content, and a concise “what this app can and cannot do” statement. Guides exposes “Recovery, fatigue and quality of life” with a fatigue-focused description and a two-minute estimate. The persistent header offers Home, Menu, Text and display, and Urgent help. This is a clear two-step route to the longer-term recovery topic. Evidence: `T1/01-home.txt`, `T1/02-guides.txt`, `T5/01-recovery.txt`, `menu-coverage.json`.
2. **Return to reading comfort — pass in the tested in-app flow.** T5 selected dark theme and roomier spacing from Text and display, returned to the guide, and resumed at section 2 of 5. The inspected screenshot is dark, legible, and uses a single-section reader with Previous/Next controls. The initial recovery screenshot is light; a light-sensitive returning user must change the display setting before the dark appearance is active. Evidence: `T5/02-dark-resume.txt`, `T5/02-dark-resume.jpg`, `T5/reading-resume.json`.
3. **Read through and inspect review/source limits — pass with a content-density preference.** Sequential captures reach sections 3–5. Section 3 offers practical prompts about fatigue, sleep, concentration, daily activities, and support; section 4 carefully limits what studies establish; section 5 offers optional support for family/carers. The expanded review panel explicitly says clinical and patient/carer reviews are not recorded. Source records show dates and limits. The screen’s source/review and related-guide material is lengthy, and the one-section screenshots still have additional controls and destinations below; a short summary ahead of those details would better fit fluctuating energy. Evidence: `T5/03-review-details.txt`, `T5/03-review-details.jpg`, `T5/recovery-section-3.txt`, `T5/recovery-section-4.txt`, `T5/recovery-section-5.txt`.
4. **Use appointment prompts and return later — mixed.** The appointment sheet includes optional questions about fatigue/energy and an optional note; an unsaved note survived Home → appointment return, and explicit save/reload/export restored the selected question and note. However, after navigating away from one-section reading at section 2, the return capture has no current section indicator, although viewing options remain. That is a reproducible interruption friction for someone who wants to resume at the same place. Evidence: `T2/02-resumed-draft.txt`, `T2/03-saved-export.txt`, `T2/appointment-sheet.txt`, `T2/view-interruption.json`, `T2/view-return.txt`.
5. **Make and share an optional milestone — pass.** Blank defaults use “My milestone”; name, date, and message are optional, and the interface explicitly says “survivor” wording is optional. Preview states that files/printouts contain only the displayed information. Actual PNG, one-page PDF and TXT show the same neutral milestone text and disclaimer. The saved milestone restores; deleting it leaves the separate saved medical card intact. Output checks exclude the hidden date and the medical card’s name/medicine fields from milestone exports, and exclude the milestone text from the practical card. Evidence: `T4/06-milestone-blank.txt`, `T4/07-milestone-preview.txt`, `T4/milestone-restored.txt`, `T4/milestone.png`, `T4/milestone-page1.png`, `T4/milestone.pdf`, `T4/milestone.txt`, `T4/output-checks.json`, `T4/08-separate-saved.txt`.
6. **Look up an unfamiliar term — mixed.** Searching “artery” returns four definitions including CAD, dissection, pseudoaneurysm, and VAD. Searching “MRA” returns zero terms, with routes to the tests-and-terms guide or appointment questions. Those are useful fallbacks, but the absent abbreviation is a concrete lookup gap for efficient report reading. Evidence: `T1/04-glossary-empty.txt`, `T1/glossary-result.txt`.
7. **Find urgent guidance — pass within the generic scope.** The page directs users to local emergency services, says not to wait for the app, and explains why no local number is shown. It is clear but not localized. Evidence: `T1/05-urgent.txt`.
8. **Navigate at narrow width / enlarged app text — pass with scroll friction.** At 320px and 200% app text, menu items wrap and remain keyboard reachable through About and privacy; the short-landscape capture reaches the skip link. Screenshots show a constrained, independently scrolling menu alongside page scrolling, so navigation requires careful scrolling. The unavailable-route shell offers Home and Menu. This is app text scaling, not true browser zoom. Evidence: `T3/02-home-double.txt`, `T3/03-menu-320-double.jpg`, `T3/03-menu-320-double.txt`, `T3/04-landscape-double.jpg`, `T3/04-landscape-double.txt`, `T3/05-unavailable.txt`, `T3/keyboard-menu.json`.

## General assessment

Current evidence fits several declared preferences: dark and roomier reading controls are available; the recovery guide addresses fluctuating fatigue directly; questions and milestone tools are optional; source status and review limits are visible; and milestone exports have clear, matching contents. It does not establish that the product is better than a prior experience because this review does not compare a matched prior interaction set.

The exact displayed milestone title and message stay neutral. A source publication title includes “survivors,” but the user is not required to adopt that wording. No evidence establishes that dark mode prevents migraine, light sensitivity, PTSD symptoms, or other harm.

The T4 output checks report one-page PDF/TXT/PNG outputs, safety labels, no hidden dates or cross-populated card fields, and no form instructions. PDFs are not tagged, and native print was not tested. The request capture did not contain the synthetic marker in requests or logs; it does not prove browser storage behavior or general privacy beyond the captured journey.

The interface patterns could be carried into an Expo mobile design: a clear route to recovery, optional section-by-section reading, persisted display preferences, generic saved-item labels, preview-before-export, and separate card types. This is a design-fit assessment only. The current evidence does not establish native Expo behavior; native navigation, dynamic type, focus announcements, offline persistence, sharing, and print/export require device testing.

## Findings, preferences, limits, and interventions

- **Reproduced friction:** appointment one-section progress is absent after in-app departure/return. The draft data remains available. This is not a task-blocking failure, but it weakens resumption.
- **Content gap:** “MRA” has no glossary match. The app provides a related-guide and appointment-question fallback.
- **Preference:** source/review detail and related destinations lengthen an otherwise short recovery guide. Offer a concise “key points” summary while keeping sources available.
- **Preference:** at 320px/200% app text, the menu is independently scrollable and visually crowded. Keep large-text wrapping/reflow, but reduce competing scroll regions if feasible.
- **Positive evidence:** no compulsory survivor wording appears in the milestone editor/preview; export content is clearly previewed and separated by card type.
- **Not tested:** true browser zoom; NVDA or another native screen reader; native app behavior; audible speech; OS print dialog or cancel; malformed browser storage; human comprehension or completion time; clinical accuracy/approval; migraine/PTSD prevention.
- **Interventions:** parent selected the paths and captured the UI. T5 made no in-app intervention. T3 records a corrected locator after an automation selector mismatch; this is test-setup handling, not a product fault.

## Scores

| Dimension | Score | Deduction and confidence |
| --- | ---: | --- |
| Navigation | 2/2 | Home, guides, nine menu destinations, urgent help, and unavailable-page recovery are exposed. High confidence for observed web routes. |
| Reading and access | 1/2 | Dark/roomier preferences and one-section reading suit the stated preference; dense supplemental material and nested scrolling at 320px/200% add effort. Medium confidence; no screen-reader or true zoom evidence. |
| Practical usefulness | 1/2 | Recovery prompts and optional tools are relevant; the zero-result MRA lookup limits efficient term help. Medium confidence from a small set of journeys. |
| Data/output trust | 2/2 | Previewed contents match actual card exports, hidden/cross-card fields are excluded, and limitations are disclosed. Medium confidence; local storage and native print are outside evidence. |
| Interruption recovery | 1/2 | Recovery guide resumes at section 2 after display settings; appointment content draft persists, but its one-section position does not. Medium confidence. |

**Total: 7/10. Confirmed critical barrier cap:** not triggered; no critical barrier was confirmed in the tested scope. Scores describe this evidence packet, not a user study or accessibility certification.

**Evidence and scope:** all observations are parent-actuated captures/files from the frozen build, not direct T5 browser actions. Seven full guide DOM samples show rendered content and review state; they do not prove that people understood it.

9. **Clear all for one saved practical card — pass within the exact fixture scope.** In the isolated T4 browser state, a practical card was the only populated category. Cancel preserved that card after reload; confirming clear removed it, and the previously downloaded PDF remained on disk. Other categories were already absent, so this evidence does not establish clearing behavior for all categories. Evidence: `clear-all.json`, `T4/10-clear-all.txt`, `T4/10-clear-all.jpg`.

