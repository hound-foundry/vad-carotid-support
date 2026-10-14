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
| Accessibility | Change text scale, spacing, contrast, theme and motion |  | 200% zoom / high contrast / reduced motion | Settings persist locally, roomier layouts have visible effect and focus remains visible |  |  |  |  | Not tested |
| Accessibility and guide | Turn on simplified reading |  | Screen reader / text enlargement | A guide uses one section at a time and larger text without hiding safety or source limits |  |  |  |  | Not tested |
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

## Engineering observations — 13 October 2026

The [design case study](DESIGN_CASE_STUDY.md) contains screenshots and observed browser checks for the simplified header/home, card stages, menu Escape/focus behavior, hidden skip link, labelled inputs, web ARIA states, 320–390px layouts, 200% app text and full-page dark/high contrast. These checks used the exported build in the Codex Chromium-based in-app browser and synthetic cards. They are narrower than the matrix above and do not mark a combined keyboard/screen-reader row pass.

NVDA was not run. Manual 200% browser zoom, a full screen-reader route pass, physical print verification and native VoiceOver/TalkBack checks remain pending. The output PDF is untagged; provide the semantic HTML review and text alternative rather than calling it PDF/UA accessible.
