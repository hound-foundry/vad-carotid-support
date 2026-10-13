# Accessibility test matrix

This is an evidence form for manual review of the actual web build. It is intentionally unfilled until a tester runs the routes with the listed tools. Do not mark a row pass from code inspection alone.

## Stop-ship rules

- A critical barrier to urgent help, navigation, reading, form completion, deletion or error recovery blocks the preview release.
- Record synthetic scenarios only. Do not include diagnoses, scans, names, dates of birth or personal stories.
- Record the exact build/revision, browser, assistive technology, viewport and accessibility settings used.

## Matrix

| Route or feature | Task | Browser/device | Assistive technology or mode | Expected result | Observed result | Severity | Evidence/link | Tester/date | Status |
|---|---|---|---|---|---|---|---|---|---|
| Every route | Find urgent help and return home |  | Keyboard only | Urgent-help link is visible, focusable and usable |  |  |  |  | Not tested |
| Every route | Use skip link and main navigation |  | Keyboard only | Focus moves to main content; focus order is logical |  |  |  |  | Not tested |
| Home | Choose a useful next step |  | Screen reader | Headings and link names communicate the available paths |  |  |  |  | Not tested |
| Guide | Read one section at a time |  | Screen reader | Section status is announced and controls have clear names |  |  |  |  | Not tested |
| Guide | Increase text and use read-aloud |  | 200% zoom / text enlargement | Content reflows without loss or overlap |  |  |  |  | Not tested |
| Appointments | Select prompts, save, export and delete |  | Keyboard and screen reader | Labels, selected state, confirmation and live status are clear |  |  |  |  | Not tested |
| Support preferences | Add and remove a note |  | Keyboard and screen reader | The note is labelled, bounded and deletion is understandable |  |  |  |  | Not tested |
| Personal card | Preview selected fields and delete |  | Keyboard and screen reader | Safety label, field labels and delete confirmation are available |  |  |  |  | Not tested |
| Milestone card | Preview, export and delete |  | Keyboard and screen reader | Personal-story label and external-copy warning are available |  |  |  |  | Not tested |
| Accessibility | Change text scale, contrast, theme and motion |  | 200% zoom / high contrast / reduced motion | Settings persist locally and focus remains visible |  |  |  |  | Not tested |
| Print | Print a guide or card |  | Print preview | Text is readable, urgent/safety labels remain visible and controls are omitted |  |  |  |  | Not tested |
| Narrow layout | Complete a core task |  | Mobile viewport | No horizontal scrolling; targets remain reachable |  |  |  |  | Not tested |

## Review summary

- Build/revision:
- Date:
- Tester role:
- Browser/device coverage:
- Critical issues:
- Follow-up changes:
- Decision: Not reviewed
