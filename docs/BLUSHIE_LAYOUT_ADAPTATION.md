# Blushie layout adaptation — 14 October 2026

The previous website combined a warning strip, header navigation, repeated Home links and a long menu. The user rejected that structure and requested Blushie's layout. The revised Expo shell uses a compact header, a focused page and persistent Home, Guides, Tools and Saved navigation.

## Reference and changes

Inspected Blushie's `src/main.tsx`, `src/styles.css`, design rules and the live specimen at `http://127.0.0.1:8018/live-appearance.html`. Its useful pattern is a compact identity row, purposeful content groups and four labelled bottom destinations. Blushie was read only; its artwork, cosmetic finishes, fonts and product data were not imported.

- Home retains the four requested actions. It uses two columns on a normal phone and rows below 360px; enlarged text uses one column.
- `/tools` groups appointment preparation, the two separate card tools and support preferences.
- The menu contains five secondary destinations. Escape closes it and restores focus.
- The header uses “Feeling unwell?”; the destination is titled “Medical help”. The warning strip is removed from routine screens. Existing emergency instructions, B.E. F.A.S.T., medical-contact wording and clinical review status are preserved.
- Header and page gutters align. Compact page titles use 24px before scaling. Body text keeps its 18px floor.
- Navigation occupies its own layout space, grows with text, and is excluded from printing. Enlarged and short layouts remove decorative icons to leave more reading space.
- Routes, app identifiers, six storage keys, card models and explicit Save/Export/Delete behaviour remain compatible. No dependency or cloud design generation was added.

## Confirmed corrections

The first 320px grid split long action names across letters. It was replaced with readable rows. The initial 200% layout let branding and decorative navigation consume most of the screen. Compact controls, fewer icons and a shorter Home introduction now leave the first useful action visible. Initial screenshots are retained with `-initial` filenames; they are evidence of those faults, not final designs.

## Evidence

Actual screenshots and structured checks are in `docs/blushie-layout-proof/`.

- All 25 public routes passed 100 geometry checks: 320px, 390px, short landscape and 200% app text at 390px. Main content does not overflow horizontally; medical help and all four navigation targets remain visible; navigation does not cover the page; targets measure at least 48px. Each enlarged-text case confirmed a 36px navigation label.
- Manually inspected 320px enlarged Home, desktop Home/Tools, phone Home/Guides/Tools/Medical help, dark and both high-contrast modes.
- Twelve rendered shell text/background pairs across four themes passed 4.5:1, with a measured minimum of 7.75:1. The existing token checks cover focus and other opaque pairs separately; this does not establish whole-app accessibility.
- Keyboard Enter opened Tools; menu Escape restored focus at normal and enlarged sizes. Appointment review received focus.
- Synthetic appointment questions/notes and both card drafts survived tab navigation. The milestone card began blank and did not inherit practical-card contents. Saved displayed generic labels without fixture names or notes. Fixtures stayed on the isolated `localhost:4183` origin; reload removed unsaved fixtures and display preferences were reset.
- The unavailable-page shell retained medical help and app navigation. Existing unit/privacy/content checks, TypeScript, design validation, static export and exported-artifact checks were run.

These are technical checks, not patient feedback or accessibility certification. Screen readers, actual browser zoom, physical phones, virtual-keyboard behaviour, native VoiceOver/TalkBack and system print output remain unverified. Clinical and other human review remain pending.

The updated LAN URL responded on this PC at `http://192.168.0.115:4174/`. The earlier Windows firewall elevation was cancelled by the user; phone connectivity was not confirmed. No broader firewall or network-profile change was made.
