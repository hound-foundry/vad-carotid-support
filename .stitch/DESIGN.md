---
name: Dissection Companion
colors:
  ink: '#183248'
  text: '#33485C'
  muted: '#526574'
  teal: '#2B5F87'
  tealDark: '#214C70'
  mint: '#E8EFF4'
  paper: '#F5F6F4'
  white: '#FFFFFF'
  line: '#D3DFE7'
  alert: '#F9E9E2'
  alertInk: '#713A2D'
  gold: '#956020'
---

# Design System: Dissection Companion

Updated for the approved blue redesign, 13 October 2026. Display name/subtitle come from `src/brand.mjs`; colours come from `src/components/theme.mjs`, re-exported through the existing `theme.ts` import path. The `Ui` wrappers and existing components define the actual interface. `npm run design:check` detects palette/brand drift and checks 48 opaque contrast pairs; fingerprints identify source and build inputs. The earlier teal cloud trial in `.stitch/metadata.json` is historical and has not been updated to this design. Clinical content approval remains separate.

## 1. Visual Theme & Atmosphere

Restrained blue, soft off-white reading surfaces and rounded panels form a practical interface. The working name is Dissection Companion, with the subtitle “Vertebral & carotid artery support.” Short task labels lead into information, appointment preparation, support preferences and two separate cards. Useful actions take priority over decoration.

Reading is controlled by the person. There are no decorative transitions, automatic reminders, graphic medical imagery or forced survivor wording. These choices consider fatigue, vision and communication difficulty; they do not promise to prevent headache, migraine or PTSD reactions.

## 2. Color Palette & Roles

### Primary Foundation

- Paper `#F5F6F4`: page and header background.
- White `#FFFFFF`: cards and secondary controls.
- Selected surface `#E8EFF4`: navigation and calm secondary surfaces; the legacy property name is `mint`.
- Line `#D3DFE7`: ordinary borders and separators.

### Accent & Interactive

- Primary blue `#2B5F87`: filled control background with white text; the compatible property name is `teal`.
- Deep blue `#214C70`: links and standard focus colour; the compatible property name is `tealDark`.
- Muted gold `#956020`: restrained existing accents, not a new status code.

### Typography & Text Hierarchy

- Ink `#183248`: headings and primary information.
- Text `#33485C`: body copy.
- Muted `#526574`: supporting labels. Keep text readable rather than reducing opacity.

### Functional States

- Alert paper `#F9E9E2` and alert ink `#713A2D`: persistent urgent-help row and existing notices.
- Selection, save, restore, failure and draft status also have written labels; colour alone carries no meaning.
- `themeFor` supplies light, blue-grey dark and both high-contrast variants. Exported `tokens.json` contains resolved variants and bounded contrast checks. Dark focus uses `#BDD9EE`; high contrast increases outline width to 4px. Filled controls retain dark backgrounds and white labels. Do not infer accessibility certification from these tokens.

## 3. Typography Rules

### Hierarchy & Weights

All text uses system sans-serif. Web text uses the shared system font stack; native text uses the platform default. Page titles retain 32px/600, navigation 16/700, card headings 17/700 and card-preview headings 26/700 before accessibility scaling. PDF output uses the existing embedded Noto Sans fonts. Native rendering still requires device verification.

The `Ui.Text` wrapper enforces an 18px floor for all text, then multiplies by the selected 100–200% scale. This also keeps smaller authored notes and labels readable. These effective rules take precedence over smaller sizes in route StyleSheets.

### Spacing Principles

Line height is at least 1.5 times effective text size, or 1.75 in roomy mode. Existing authored line heights may increase this further. Let text and controls grow; never shrink long card text to fit. Preserve real labels when enlarging text.

Shared body blocks and primary guide paragraphs/bullets have a 680px maximum reading width. Panels and controls retain their responsive widths; narrow screens use the available space.

## 4. Component Stylings

### Buttons

Use existing `Ui.Pressable` and feature controls. The wrapper enforces a 48px minimum height; card buttons have 14px corners, 16px horizontal and 10px vertical padding. Blue/white primary and outlined secondary states share written labels. Web focus is a visible 3px outline with a 3px offset. Actual pressed/disabled/loading states remain owned by the components.

### Cards & Personal Information

Ordinary `AppPage.Card`: 15px corners, 1px border, 18px padding and 13px bottom gap; roomy mode uses 23px padding and an 18px gap. Designed card previews use 24px corners and padding with a 2px border. Use flat borders and surface differences rather than dramatic shadows. Preserve the personal-information label, update date and selected-fields-only export behavior.

### Navigation

Four Home actions: Understand dissection, Prepare an appointment, Make a card, Help someone. Header: Home, Menu, Text and display. Menu expands inline and closes with Escape, returning focus. Keep Urgent help visible. Do not add a second navigation system, animated drawer or unrelated bottom tab bar as part of a tool import.

### Inputs & Forms

Card inputs: 12px corners, 12px padding, 1px control border. `Ui.TextInput` applies the themed control border and a 52px minimum height. Optional details remain optional, labels stay visible, and a preview precedes explicit export. Failed Save/Delete must preserve edits and permit retry.

### Sheets and Reading

Use existing selectable prompts, one-section reading, retained session-only position, Review your sheet and Back to choices. Save and Export remain separate. Guide sources and draft/review status are visible. Clinical wording is not generated or approved by a design tool.

## 5. Layout Principles

### Grid & Structure

The ordinary page has a 920px maximum width; wide pages use 1120px. Header max width is 980px. These are current measured differences, not one invented shared width. Page gutters are 24px, 16px below 390px, and 28px in roomy mode before the narrow override. Header gutters are 16px.

### Whitespace Strategy

The existing values are mostly based on 4/8px rhythm but include established 13, 15, 18 and 23px values. Reuse them; extraction must not silently replace them with a new scale. Page bottom padding is 56px, or 72px in roomy mode.

### Alignment & Visual Balance

Left-aligned headings and reading blocks, a centred content container, flexible action rows and content-driven panels. Keep the preview content and its actions together. Avoid hero sections that push the four useful actions off a phone's first screen.

### Responsive Behavior & Touch

Review at 390×844, 320×640, 1440×900 and 844×320. Test enlarged app text separately from actual browser zoom. Menu space uses the measured header and an 80px focus reserve; its current internal scrolling is an acknowledged usability limit. Native safe areas, keyboard clearance, VoiceOver and TalkBack need physical-device or simulator evidence.

## 6. Design System Notes for Stitch Generation

### Language to Use

Preserve this calm blue, rounded Expo interface. Improve one selected task and state at a time. Use real route labels and synthetic fixtures only. Supply phone and desktop constraints together, plus large-text and short-height states.

### Color References

Use the frontmatter tokens and exported resolved themes. Do not import Blushie's typography, entitlement rules, Today/Stash layout or Vite/CSS architecture. Do not claim that a generated image or code export has working saved data.

### Component Prompts

- "Refine the appointment sheet using its current labelled choices, early Review action, named preview focus target and separate Save/Export controls. Retain the existing palette and 48px target minimum. Show 390px and 320px layouts with long text."
- "Refine the two-choice cards page while preserving separate medical/communication and milestone tools, neutral wording, optional fields and short form → preview → edit. Do not invent medical claims or share automatically."

### Incremental Iteration

Bring an accepted composition back into existing Expo routes and shared components. Keep card models, storage keys, privacy boundaries, clinical metadata and licences. Treat external HTML as a visual reference; replacing the working app with it is outside the design workflow. Record before/after screenshots and real interactions, with untested areas named.
