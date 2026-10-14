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

Refined on 14 October 2026 after the user reviewed the phone preview. Display name/subtitle come from `src/brand.mjs`; colours come from `src/components/theme.mjs`, re-exported through the existing `theme.ts` import path. The `Ui` wrappers and existing components define the actual interface. `npm run design:check` detects palette/brand drift and checks 48 opaque contrast pairs; fingerprints identify source and build inputs. The earlier teal cloud trial in `.stitch/metadata.json` is historical and has not been updated to this design. Clinical content approval remains separate.

## 1. Visual Theme & Atmosphere

Restrained blue, soft off-white reading surfaces and rounded panels form a practical interface. The working name is Dissection Companion, with the subtitle “Vertebral & carotid artery support.” Short task labels lead into information, appointment preparation, support preferences and two separate cards. Useful actions take priority over decoration.

Reading is controlled by the person. There are no decorative transitions, automatic reminders, graphic medical imagery or forced survivor wording. These choices consider fatigue, vision and communication difficulty; they do not promise to prevent headache, migraine or PTSD reactions.

## 2. Color Palette & Roles

### Primary Foundation

- Paper `#F5F6F4`: page background.
- White `#FFFFFF`: cards, header, navigation and secondary controls.
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

- Alert paper `#F9E9E2` and alert ink `#713A2D`: existing draft notices. Routine screens use a calm blue medical-help link rather than a warning strip.
- Selection, save, restore, failure and draft status also have written labels; colour alone carries no meaning.
- `themeFor` supplies light, blue-grey dark and both high-contrast variants. Exported `tokens.json` contains resolved variants and bounded contrast checks. Dark focus uses `#BDD9EE`; high contrast increases outline width to 4px. Filled controls retain dark backgrounds and white labels. Do not infer accessibility certification from these tokens.

## 3. Typography Rules

### Hierarchy & Weights

All text uses system sans-serif. Web text uses the shared system font stack; native text uses the platform default. Page titles use 26px/600, Home uses 28px/600, panel titles use 20px/600 and card-preview titles use 26px/600. Utility/navigation labels use 18px/500, with 700 and an underline on the selected tab. Eyebrows use ordinary casing and no added letter spacing. PDF output uses the existing embedded Noto Sans fonts. Native rendering still requires device verification.

The `Ui.Text` wrapper enforces an 18px floor for all text, then multiplies by the selected 100–200% scale. This also keeps smaller authored notes and labels readable. These effective rules take precedence over smaller sizes in route StyleSheets.

### Spacing Principles

Line height is at least 1.5 times effective text size, or 1.75 in roomy mode. Existing authored line heights may increase this further. Let text and controls grow; never shrink long card text to fit. Preserve real labels when enlarging text.

Shared body blocks and primary guide paragraphs/bullets have a 680px maximum reading width. Panels and controls retain their responsive widths; narrow screens use the available space.

## 4. Component Stylings

### Buttons

Use existing `Ui.Pressable` and feature controls. The wrapper enforces a 48px minimum height; card buttons have 12px corners, 18px horizontal and 12px vertical padding, with 18px/600 labels. Blue/white primary and outlined secondary states share written labels. Web focus is a visible 3px outline with a 3px offset. Actual pressed/disabled/loading states remain owned by the components.

### Cards & Personal Information

Ordinary `AppPage.Card`: 16px corners, 1px border, 20px padding and 16px bottom gap; roomy mode uses 24px padding and a 20px gap. Task panels share 16px corners, restrained blue icon tiles, 20px/600 titles and a small directional chevron. Tools and card choices use horizontal rows; narrow rows omit the leading icon to give descriptions more room. Enlarged text removes decorative icons and stacks the content. Card previews use 16px corners, 24px padding, a 1px border and a 3px blue top edge. Use flat borders and surface differences rather than shadows. Preserve the personal-information label, update date and selected-fields-only export behavior.

The creator starts with eight actual compositions: Communication first, Photo and details, Statement card, Survivor ribbon, Warrior badge, Friendly brain, Botanical keepsake and Photo story. Each has three curated palette combinations and compatible original artwork. The app interface stays quiet blue; cards can use plum, cranberry, sage, coral and navy/gold. Names, messages and dates appear directly on milestone designs. Practical reverse panels retain useful field labels. Template selection changes appearance only; starter words require a separate action.

Short expressive headings use locally bundled Barlow Condensed Bold with Noto Sans Bold fallback. Detail text uses Noto Sans. Original vector ribbon/leaf/shield motifs and the disclosed original AI-assisted brain illustration are public app assets. Optional personal photos stay in memory until explicit Save, then use a separate local IndexedDB Blob store. No photo or card wording is passed to a design tool.

One measured template scene drives the design preview, PNG, PDF and white-paper print output. The text preview follows global text/display settings and is opened automatically for large text, simplified reading or high contrast. It contains every selected word. Practical wallet PDFs contain fixed 85.6 × 54 mm front/back and continuation panels; details remain at a fixed readable size. Larger-text A4 and text alternatives remain available. Milestone PNGs begin at 1080 × 1350 and extend for long text; PDF overflow continues rather than shrinking. All exports remain explicit, with neutral filenames and document metadata. Previous v1 cards keep their existing appearance until the person changes it. Native photo/render/export parity is not claimed.

### Navigation

The user requested Blushie's app structure on 13 October 2026. The shared shell has a compact identity/utility header and one persistent bottom navigation: Home, Guides, Tools and Saved. At widths of at least 880px, standard text and sufficient height, the header becomes a single row. Phone and enlarged-text headers keep two rows. The white navigation bar has a single top separator; its selected tab has a soft rounded fill, bold label and underline, with an additional border in high contrast. Menu contains five secondary destinations; it expands inline and closes with Escape, returning focus. The medical-help destination remains `/urgent-help`, reached through “Feeling unwell?” and the footer's “Medical help”. Its emergency instructions and B.E. F.A.S.T. copy remain unchanged.

Four Home actions remain: Understand dissection, Prepare an appointment, Make a card, Help someone. Normal phone layouts use two columns; below 360px they use rows. Enlarged text uses one column, shorter introductory copy and fewer decorative icons. The dock changes to two rows on narrow screens with enlarged text; labels remain visible. At the largest text setting, the compact header uses a labelled menu icon and an Aa display control. Bottom navigation occupies its own layout space rather than overlapping content, and is excluded from print output.

### Inputs & Forms

Card inputs: 12px corners, 12px padding, 1px control border. `Ui.TextInput` applies the themed control border and a 52px minimum height. Optional details remain optional, labels stay visible, and a preview precedes explicit export. Failed Save/Delete must preserve edits and permit retry.

### Sheets and Reading

Use existing selectable prompts, one-section reading, retained session-only position, Review your sheet and Back to choices. Save and Export remain separate. Guide sources and draft/review status are visible. Clinical wording is not generated or approved by a design tool.

## 5. Layout Principles

### Grid & Structure

The ordinary page and header have a 920px maximum width; existing wide pages use 1120px. Shared gutters are 24px, 16px below 390px, and 28px in roomy mode before the narrow override. The dock is centred within a 620px maximum width and grows with its labels.

### Whitespace Strategy

Shared panels use 12–16px gaps, 16px corners and 20–24px padding. Smaller utility surfaces use 10–12px corners. Route-specific values remain where changing them would affect an established task. Extraction records the actual values rather than silently normalizing them. Page bottom padding is 56px, or 72px in roomy mode.

### Alignment & Visual Balance

Left-aligned headings and reading blocks, a centred content container, flexible action rows and content-driven panels. Keep the preview content and its actions together. Avoid hero sections that push the four useful actions off a phone's first screen.

### Responsive Behavior & Touch

Review at 390×844, 320×640, desktop and 844×320. Test enlarged app text separately from actual browser zoom. Menu space accounts for the measured header and dock, retaining space for the page and focus. Native safe areas, keyboard clearance, VoiceOver and TalkBack need physical-device or simulator evidence.

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
