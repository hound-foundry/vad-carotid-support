# T1 returning-user assessment — revision 8c4087e

Mode: returning. This is an independent assessment of fresh, parent-actuated evidence, not a browser journey personally completed by T1. My declared priorities were calm plain-language guidance with visible sources, one useful appointment question, safe return after interruption, and low tolerance for jargon, alarm, or repeated notices. The interactions used synthetic fixture markers; this is simulated feedback, not patient testimony.

## Score

| Dimension | Score | Evidence and deduction |
|---|---:|---|
| Navigation | 2/2 | Home offers four clear starting actions and saved items. Shared captures cover all nine menu destinations, with Urgent help persistent. At 320px and doubled app text, the menu remains keyboard reachable; crowding is scored under reading/access. |
| Reading and access | 1/2 | Definitions explain cervical artery dissection, VAD and CAD in plain language; the MRA no-result state offers a guide and appointment path. Deduct 1 for the cramped, nested-scroll menu and clipped/wrapped label appearance at 320px with 200% app text. The links remain in the DOM and keyboard traversal reaches them. |
| Practical usefulness | 2/2 | Guide questions lead to an appointment sheet; one selected question and a synthetic note survived in-app return, explicit save/reload and export. Support preferences and separate medical and milestone cards provide useful choices. |
| Data and output trust | 2/2 | Save and export are explicit; privacy text explains browser-profile storage and copy limits. Actual one-page PDF/text outputs contain selected content, omit hidden dates and the other card’s fields, and show one safety label each. T4’s captured request/log scope showed no synthetic marker. |
| Interruption recovery | 1/2 | Appointment and support drafts returned after in-app navigation; saved sheets/cards reloaded, and deletion had separate cancel and confirm paths. Deduct 1 for inconsistent Escape behavior: it cancelled the appointment deletion flow but did not dismiss the card deletion prompt. T2 evidence shows one-section mode and section position reset to all-sections after return; only the Escape inconsistency is scored. |

**Total: 8/10.** No critical failure was confirmed. The deductions are limited to the observed 320px/200% menu presentation and card-deletion keyboard inconsistency; neither made the core flows unusable in the supplied evidence.

## Numbered journey and coverage

1. Fresh Home at 390px with no fixtures. The first viewport shows Understand dissection, Prepare an appointment, Make a card, Help someone, and a saved-items link. The home copy says guides are drafts awaiting review.
2. Opened Guides from Menu, returned to Home, then opened Understanding cervical artery dissection. Its page defines the neck arteries and CAD/VAD, gives appointment questions, explains limits, and links dated sources. The page also marks clinical/patient review as not recorded.
3. Searched the glossary for artery, which returns four matching terms; clearing shows eight terms. Searching MRA returns zero, with a calm “No matching term” message, a tests-and-terms guide link, and an appointment-question link.
4. Opened Urgent help from the persistent header. It directs the reader to local emergency services without a country-specific number, explains that the app cannot assess symptoms, and says not to wait for the app.
5. Shared primary coverage records all nine menu destinations and seven guide DOM samples. These are route/content captures across the shared test, not nine independent explorations or proof that a person read or understood every guide. T1’s captured guide page was inspected; the seven-guide manifest is not a human reading test.
6. In the appointment flow, one question and a synthetic note were present on return from Home. The supplied records show preview, explicit save, reload, actual text export, cancel path and confirmed deletion. Deletion cleared the selection and note after reload.
7. In the support-preferences flow, one preference and a synthetic note were retained through in-app return, then explicitly saved, reloaded and exported. Deletion and blank-after-reload were recorded. Individual checkbox deselection was not separately evidenced.
8. Medical-card evidence shows optional blank fields, a selected communication need, preview/edit, save and reload. Milestone-card evidence shows optional name/message/date wording, a separate preview and independent saved state. A hidden-date fixture was excluded from outputs; medical and milestone contents stayed separate.
9. Output checks and direct artifact inspection confirm one-page practical-card and milestone PDFs, corresponding text outputs, and a milestone PNG. Each PDF has its safety disclaimer once at the bottom and no duplicate body disclaimer. The captured medical-card UI offered PDF and print; no medical-card PNG was evidenced.
10. At 320px and 200% app text, all menu links remain present and keyboard traversal reaches About and privacy, then Skip to main content. The screenshot looks crowded and uses an inner scrolling menu. In 844×320 landscape at 200%, focus continues beyond the last menu item to Skip to main content. The app’s high-contrast and doubled-text settings were also captured.
11. A separate guide reading capture resumed section 2 after in-app Home/Back navigation. T2’s appointment reading-view capture shows that one-section mode and its section position reset to all-sections after in-app return; the section marker was absent. This is recorded as a scope observation and adds no score deduction.

## Strengths, frictions and recommendations

The strongest fit for this perspective is the practical link between a plain definition, “what to ask” prompts and the appointment builder. Glossary explanations state what terms do not establish about an individual report. The emergency page is direct without a symptom list or alarm graphics. Card previews say what will be downloaded, and the two card types remain distinct.

The repeated “Draft information · review pending” control and development-preview footer appear across multiple routes. They are accurate and calm, but add repeated notice overhead for a returning reader. Keep them compact while preserving the source/review detail where it is useful.

At 320px with doubled app text, the expanded menu is crowded, labels wrap tightly, and the screenshot shows nested scrolling. Keep each menu label and focus target visually clear at that size. Make Escape dismiss the card deletion prompt consistently with the sheet flow. The appointment one-section view resets to all-sections after in-app return; preserve the prior position or make the reset clear.

Compared with my earlier T1 experience, the current supplied practical-card and milestone PDFs show a single disclaimer each. The earlier saved-guides delete-all concern was not retested in this return-audit evidence, so I make no current resolution claim for that flow.

## Scope and limits

All current interactions were actuated by the parent after T1’s browser bridge could not create a tab. T1 independently inspected the supplied DOM, screenshots, actual PDFs, text and PNG artifacts. Scores describe observed UX evidence only; they are not clinical-content approval or a numerical change from the earlier, different-scope audit.

Not tested: true browser zoom; NVDA; audible speech; native devices; OS print or print cancellation; malformed browser storage; a full browser-reload test of guide reading position; a full-focus private profile; individual preference checkbox removal; medical-card PNG export; or independent T1 interaction with the app. Audio controls are present in captured DOM, but audible output was not verified.

Key evidence: docs/return-audit/build.json, interactions.json, menu-coverage.json and guide-coverage.json; T1/01-home.jpg, 02-guides.jpg, 03-basics.txt, 04-glossary-empty.jpg, 05-urgent.txt and glossary-result.txt; T2/03-saved-export.jpg, appointment-sheet.txt, delete-check.json, view-interruption.json and view-return.txt; T3/03-menu-320-double.jpg, 04-landscape-double.jpg, keyboard-menu.json and recovery-navigation.json; T4/04-card-preview.jpg, 07-milestone-preview.jpg, 09-card-escape.jpg, practical-card.pdf, practical-card.txt, practical-card-page1.png, milestone.pdf, milestone.txt, milestone.png, milestone-page1.png, output-checks.json, privacy-observation.json, card-deletion.json and support-deletion.json; T5/reading-resume.json.
