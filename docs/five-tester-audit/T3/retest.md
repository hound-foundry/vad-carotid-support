# T3 focused repaired-build retest

Status: retest attempt locked with a browser-availability limitation. The baseline T3 report, report.json, and coverage.json remain unchanged.

## Target and browser attempt

- Assigned repaired origin: `http://localhost:52070/`.
- Repaired entry asset identified by the parent: `entry-43829916d0b8ade49d91424899eebfb3.js`.
- The selected Codex in-app browser (ID `2`) returned `Browser is not available: 2` when I attempted one fresh hidden tab at the assigned origin.
- I read the documented browser-troubleshooting guidance once, then stopped without retrying, switching drivers, or using a shell browser.
- No new tab was created, no viewport override was changed, and there was no new tab to close. The previous T3 viewport override had already been reset before this retest assignment.

## Parent-supplied image reviewed separately

I inspected `../root/after-home-320-double.jpg` as parent-supplied evidence, not as a T3 capture. The visible Home heading reads “Guides and tools” and wraps at the space; the brand/navigation wrap onto multiple lines and appear visible in the image. I saw no apparent clipping in that one image. This visual inspection cannot verify the repaired app interaction or any other viewport, route, keyboard, or deletion behavior.

## Retest coverage

| Check | Status | Evidence or limitation |
| --- | --- | --- |
| 200% app text at 320×568, 390×844, and 844×360; repaired Home heading and clipping | Not tested | Browser unavailable before navigation; parent-supplied 320px image was inspected separately. |
| All nine menu destinations, urgent-help link, Menu keyboard activation, Escape/focus, and skip link | Not tested | No browser tab could be opened. |
| Themes and display options | Not tested | No browser tab could be opened. |
| Appointment Delete: in-page Cancel, Escape, Confirm, and reload | Not tested | No browser tab could be opened; no synthetic fixture was entered on the repaired origin. |
| Saved-guide deletion cancellation | Not tested | No browser tab could be opened; no saved guide was created on the repaired origin. |
| Unknown-route 404 and Home recovery link | Not tested | No browser tab could be opened. |
| Actual browser zoom, NVDA/screen reader, and real printing | Not tested | These remain outside the supported retest scope and were not attempted. |

No fresh repaired-build screenshots or interaction findings were produced. The supplied image is linked as external evidence in `retest.json`; it was not copied into T3. No app, source, dependency, or baseline report file was edited.

## Lock

`locked=true` for this retest addendum: the single permitted fresh-tab attempt failed, troubleshooting was read once, the parent image was reviewed separately, and remaining checks have precise not-tested reasons. Browser lease released to the parent.

## Supplemental review of parent-supplied repaired-build evidence

This review adds evidence context only. My own repaired-origin browser check remains blocked at the selected browser connection; none of these supplied artifacts changes the T3 retest coverage rows from `not-tested` to `pass`.

| Parent-supplied artifact | What it supports | Boundary |
| --- | --- | --- |
| `../root/after-home-320-double.jpg` | At the shown 320px view, “Guides and tools” wraps at the space; the visible header and first card are legible. | One static parent image; cannot establish T3 interaction or the other target dimensions. |
| `../root/after-home-390-double.jpg`, `../root/after-home-landscape-double.jpg`, `../root/after-home-390-default.jpg` | In the supplied 390px large-text and landscape large-text captures, the Home heading breaks at spaces and is not visibly clipped. The default 390px capture also shows intact heading text and scrollable cards. A visible focus outline appears around Menu in the large-text captures. | Parent captures only; no direct T3 verification of viewports or keyboard input. |
| `../root/after-menu-320-double.jpg` and `../root/repaired-menu-journeys.json` | The menu is expanded at 320px with a visible Close menu control and a scrollable list. The journey record lists all nine menu destinations and an urgent-help link for each visited page. | The journey JSON URLs are on `localhost:52073`, while this assignment’s target was `localhost:52070`; build/origin equivalence was not independently verified. The screenshot shows only the first visible menu entries. |
| `../root/keyboard-skip-focus.json` | Skip-to-main focus was recorded with role `main` and text beginning at “Guides and tools.” | This is a focus record, not screen-reader or NVDA certification. |
| `../root/after-home-dark-contrast.jpg` | The parent capture shows a dark, high-contrast appearance with light text and outlined cards. | Screenshot alone does not verify contrast ratios or preference persistence. |
| `../root/after-appointment-delete-cancel.jpg`, `../root/appointment-cancel-escape.txt`, `../root/appointment-cancel-reload.txt`, `../root/appointment-delete-reload.txt` | The screenshot shows an in-page “Delete this saved sheet?” panel with Cancel deletion and Confirm deletion. The post-Escape record shows the saved sheet still present; the reload record shows its chosen question and synthetic note restored; after confirmation and reload the record shows no selected questions/notes and “Nothing is saved.” | Parent-supplied records, not T3 interaction. The artifacts support cancel, Escape, confirm, and reload behavior in the parent run. |
| `../root/after-unavailable-recovery.jpg` | The unavailable route shows “Page not found” plus a Home recovery link and footer navigation. | Parent screenshot only; direct T3 route check remains blocked. |

These items support the corresponding repairs in the parent’s run, subject to the 52073 origin recorded in the menu journey data. They do not establish a successful T3 retest on 52070, screen-reader behavior, actual browser zoom, or printing.
