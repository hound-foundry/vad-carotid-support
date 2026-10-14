# Urgent-help wording check — 13 October 2026

The revised `/urgent-help` page includes an immediate emergency action, the six B.E. F.A.S.T. headings, guidance to contact a doctor or qualified medical professional for health concerns, and the app's information-only boundary. Stroke warning signs direct people to local emergency services even when signs stop. No country-specific number, symptom score or diagnosis is added.

The American Stroke Association and NHS source pages were inspected. The exact authored wording and pending clinical decisions are recorded in `src/content/urgentHelp.ts` and `content/claimLedger.json`. This is an editorial source check, not clinical approval.

Browser evidence was captured from the actual static build at `http://localhost:4173/urgent-help`:

- `urgent-help-desktop.jpg` and `urgent-help-phone.jpg`: emergency action and beginning of B.E. F.A.S.T.
- `urgent-help-care-boundary.jpg`: app limits, source links and visible keyboard focus.
- `urgent-help.txt`: all rendered main-content text, including professional-contact wording and all six signs.
- `layout-checks.json`: 390 × 844, 320 × 640 and 844 × 320 checks. Main content has no horizontal overflow; text is at least 18px; all six sign headings and product limits are present.

The header's Urgent help link opened the page with Enter. Tab navigation reached the labelled source links with visible focus. A direct page reload retained the revised page. Browser settings, notes, sheets and cards were not changed or deleted. Viewport overrides were reset.

Validation passed: 72 existing unit tests; content, review and native configuration checks; TypeScript; design validation; 27-route static web export; 32 exported artifact checks. Export validation now accepts the deliberate verb “call” and checks for B.E. F.A.S.T., stopped-symptom wording and the product boundary. Review validation binds 13 exact wording units to their source and pending review records.

Screen readers, native devices, actual browser zoom and patient usability were not tested in this focused wording change. All relevant human review remains pending.
