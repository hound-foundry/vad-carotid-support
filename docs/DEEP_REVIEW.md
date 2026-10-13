# Deep review operating procedure

The project has six separate review tracks. No track can approve another track, and a draft can remain in development while every public clinical claim remains blocked.

## Required evidence

1. **Clinical:** complete `content/claimLedger.json` at atomic-claim level; verify source passages, limits, wording, risk and reviewer qualifications.
2. **Patient/carer:** run the synthetic-scenario tasks in `docs/USABILITY_REVIEW.md`; record only product friction and changes in `docs/USABILITY_FEEDBACK_LOG.md`.
3. **Accessibility:** test keyboard, screen reader, zoom, contrast, theme, reduced motion, print and narrow mobile layouts; record route, assistive technology, expected result, actual result and severity in [`ACCESSIBILITY_TEST_MATRIX.md`](ACCESSIBILITY_TEST_MATRIX.md). Code inspection and automated checks do not replace assistive-technology testing.
4. **Privacy/security:** execute the data-flow tests in `docs/DATA_FLOW.md`, including malformed storage, deletion, reload, export and no-network/no-log checks.
5. **Legal/market:** use `docs/REGULATORY_SCREENING.md`; a source lead is not clearance. Keep a territory blocked while applicability, operator and hosting questions remain open.
6. **Translation/maintenance:** verify rights, source currency, translation meaning, emergency wording and next-review dates for each language.

## Severity

- **Critical:** unsafe emergency wording, misleading medical claim, sensitive data leak, or barrier that prevents access. Stop release.
- **High:** likely harm, serious privacy confusion or inaccessible core task. Resolve before publishing the affected route.
- **Medium:** substantial confusion or avoidable burden. Track with an owner and due date.
- **Low:** polish or preference issue. May follow a preview release.

Every decision must identify the exact revision reviewed. Never change a status to approved based only on a disclaimer, a source link or a passing automated test.
