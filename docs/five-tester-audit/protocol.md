# Independent AI walkthrough protocol

This is a simulated UX/engineering review, not a patient study or clinical/accessibility approval. Audit only the frozen revision 72688788cb926af39b9813c38ac830301a0eaeda on the test origin assigned in your task. Your fixture values are invented and disposable. Never open saved data on localhost:4173.

## Independence and tools

- Read this protocol and inspect the assigned web app. Do not read previous audits, ratings, other tester folders, source code or Git diffs before locking your report.
- Use only cua_repl for browser interaction. Start by creating a hidden IAB tab at your assigned origin. Read returned documentation. Use unique variable names prefixed with your tester ID in the persistent REPL. Never use a shell browser driver, Playwright CLI, injected app state or browser-evaluate writes.
- If IAB becomes unavailable, root may authorize a supported-browser fallback in a new tab on the same assigned origin. Omit unsupported visibility options, preserve every existing tab, and record the browser/capability difference and setup intervention. Unsupported viewport/developer/download capabilities remain named limitations; do not pretend the fallback is IAB.
- Only one tester controls the browser at a time. You may change your test copy's display preferences and temporary viewport. Reset the viewport and close your test tab at the end. Never change the user's saved data or OS/browser-wide preferences.
- Storage is origin-scoped, including the port. Clear-all on your assigned origin removes only that origin's app keys; it cannot clear another tester's port or localhost:4173. The approved plan authorizes cancellation, deletion and bulk clear of your disposable synthetic fixtures. Test them rather than skipping because the browser profile is shared.
- After the initial tab creation call, read `await cua.rewriteDocumentation()` for the full selected-browser API, including Playwright locators, download events, developer observations and viewport controls. The initial generic CUA documentation is not the complete capability inventory. Use supported Tab APIs rather than declaring downloads unsupported without checking.
- Save captures inside CUA REPL with `await import('node:fs/promises')` and `fs.writeFile(absolutePath, screenshotBytes)`. General filesystem operations for artifacts are permitted; browser interaction must still use CUA. Start `tab.playwright.waitForEvent('download')` before the observed download click, await the event, then use `download.path()` to inspect/copy the real file. Namespace variables by tester ID and save only synthetic artifacts.
- Actual PDF inspection is supported without installing dependencies: bundled Python `C:/Users/M88K/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe` includes `pypdf`, `pdfplumber`, and `pypdfium2`. Extract text/page counts and render PDFs to PNG with pypdfium2; inspect saved PNGs with view_image or CUA emitImage. Inspect TXT bytes directly and real PNG downloads visually. Do not substitute a successful download toast or PDF signature for output-content checks.
- Take fresh DOM observations after actions. Capture and inspect screenshots for main journeys, important states and findings. Save the exact inspected bytes in your assigned folder with numbered names. Screenshots are not proof of screen-reader behavior.
- Begin at Home. First explore according to your own perspective without UI hints, then complete all common checks below. Record backtracking and hints. Do not convert AI timing into a patient speed result.
- Share no findings with other testers. Do not edit application code, dependencies or shared docs. Write only inside your own evidence folder. Lock your report before ending.

## Common coverage (every tester)

1. Navigation: all nine menu destinations; header, footer, Home and urgent help; direct/reloaded routes; Back/Forward; both legacy stroke routes; an unavailable page. Record whether links and return behavior work.
   Technical route fixtures for the two legacy links are `/with-stroke` and `/without-stroke`; they are not ordinary menu entries. Record their provision as coverage input, not as a navigation-discovery success.
2. Learning: all seven guides from beginning to end, including sources/review details; glossary matching and empty searches; saved guide behavior; one-section and global simplified modes; manual read-aloud start/stop; leave and resume reading/search.
3. Both sheets: select and remove choices; invented notes; preview; leave and return; explicit save; reload; export; delete cancellation; deletion/clear behavior on disposable fixtures or isolated adapters. Check that closing optional controls never traps section navigation.
4. Both cards: blank defaults, statements and optional fields; preview/edit/return; explicit save/reload; hidden dates; separate card contents; PDF/text and milestone PNG; print layout; export/cancel/delete states. Inspect actual output where possible; mark unsupported checks not tested rather than guessing.
5. Display/privacy: text scale, spacing, contrast, dark theme, reduced motion, simplified reading, saved-hub generic labels, and explicit export boundaries. Observe whether synthetic markers appear in URLs, requests or console logs using the documented developer observation APIs. Never send entered fields to an external service.
6. Layout/input: desktop, 390px and 320px width, short landscape, doubled app text, keyboard focus/activation, and pointer scrolling. Actual browser zoom, screen readers and native devices are separate checks; mark them not tested if unsupported. T3 must additionally exercise actual sequential Tab/Shift+Tab order rather than only jumping directly to named controls.

All patient-facing pages and all seven guides must receive a coverage row. A test may be marked not tested only with a specific reason. Do not open Facebook, sign in to an external service, submit a print job, or imply clinical text is approved. Source links can be inspected as links without browsing publisher content.

## Report and scoring

Write report.md and report.json in your own folder. Include perspective/expectations, strengths, frustrations, first improvement, task coverage, findings, uncertainty and evidence limits. Use synthetic assessments, not invented patient quotations or claims that you experienced a disability.

Each finding needs an ID, category (confirmed-fault/usability-barrier/preference/untested), severity, route, reproducible steps, expected versus actual result, and screenshot/observation evidence. Distinguish a reproduced fault from a concern or taste. Unsupported clinical concerns are referrals for clinician review, not facts to rewrite.

Scores: navigation, reading/access, practical usefulness, data/output trust, recovery from interruption, each 0–2. Zero means blocked/unusable, one means substantial avoidable effort or a workaround, two means no significant observed barrier. Explain deductions. A confirmed critical fault caps the affected overall verdict at 4/10; good colours cannot cancel lost data or an unreachable essential action. Do not manufacture a critical fault or a unanimous opinion.

report.json: tester, baselineRevision, perspective, scores (five categories plus total and criticalCapApplied), verdict, strengths, frustrations, findings, coverage (task/route, pass/fail/not-tested, evidence/reason), limits, locked=true. Include screenshots and observation notes beside it. Record browser, viewport and settings for reproduced failures.

If a browser capability is unavailable, report the exact scope it prevents and complete the remaining checks. Do not hide incomplete coverage behind a high score. End with a concise report path and completion notice; root will separately reproduce faults and coordinate repairs after all five reports lock.
