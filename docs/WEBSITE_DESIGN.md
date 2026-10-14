# Website design direction

## Chosen direction

The website uses a **calm editorial** direction: clear enough for a person reading while tired, with a patient-led tone rather than a hospital portal. The visual signature is a quiet paper background, navy-blue reading text, and small plum, cranberry and sage accents used only to orient the person between task families. Rounded opaque surfaces and a restrained border system keep the page calm without hiding content behind effects.

This is intentionally informed by established health-service patterns rather than copying their branding. NHS guidance emphasises clear health content and inclusive formats; GOV.UK provides tested patterns for typography, forms, navigation and accessibility; USWDS treats accessibility as a foundation rather than a finishing layer.

- [NHS standard for creating health content](https://service-manual.nhs.uk/content/standard-for-creating-health-content)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/)
- [USWDS accessibility guidance](https://designsystem.digital.gov/documentation/accessibility/)

## Design rules

- Lead every route with the user’s question or next action.
- Keep urgent help persistent and visually separate from routine navigation.
- Use sentence-case labels that describe what a person controls.
- Keep pages short, scannable and usable at 200% zoom.
- Use blue for primary actions and focus; use plum, cranberry and sage only as supporting route accents. Never use colour alone to communicate status.
- Prefer real text and printable layouts to decorative imagery.
- Keep motion optional and never use animation to communicate medical urgency.
- Keep the same shell across the website and future app so the mental model transfers. The shared primitives are the page frame, route heading, task card, reading surface, status badge, disclosure, step rail, empty state, action group and saved-item row.
- Keep the static shell usable during a short connectivity interruption. Network-first refreshes should prefer current content, while a cached page is only a fallback; never cache or transmit card and appointment fields through the service worker.
- On narrow screens, keep the brand first and use a wrapped, two-row navigation with full-size targets. Never squeeze labels into a single unreadable row; the active route uses both colour and a border so it remains clear in high contrast.
- Use the same three header controls at every width: Home, Menu, Text and display. Menu expands inline with named links and closes with Escape. Home offers four actions: Understand dissection, Prepare an appointment, Make a card, Help someone.
- Treat migraine, headache and trauma sensitivity as design constraints rather than promises: no flashing, autoplay, parallax, cursor trails, surprise sound, aggressive red alerts or forced animation; provide reduced motion, dark/light choice, readable muted surfaces and an immediate route away from urgent content.
- Use trauma-informed presentation: warn before distressing or emergency material, keep descriptions neutral and brief, avoid graphic imagery and sensational language, preserve user choice, and never claim that a page can prevent PTSD or guarantee that nothing will be triggering.
- Keep the home introduction short enough for the four actions to appear on the first ordinary phone screen. Put one saved-items link below them. Explain the product's limits briefly, with detailed notices on the relevant destinations.
- Borrow the reference site's sense of a guided journey and generous rounded panels, while keeping movement optional, navigation explicit and every destination reachable by keyboard, touch and assistive technology. The visual reference is [Squilla Fund by Red Collar](https://redcollar.co/work/squilla-fund); its 3D/cursor effects are intentionally not part of this patient-facing interface.

## Whole-site shell implemented in the current pass

`APP_NAME` and `APP_SUBTITLE` remain the single brand source: **Dissection Companion** and **Vertebral & carotid artery support**. `SiteHeader` keeps the Feeling unwell?, Text & display and labelled Menu controls in a predictable position. The inline menu has a bounded scroll area on short screens, closes with Escape, and restores focus to its trigger. The four-item dock remains Home, Guides, Tools and Saved, with active route state and a visible high-contrast focus treatment.

The shared page frame is capped at 1120px on desktop and keeps reading content near 700px. Below the narrow breakpoint it becomes one column with 16px side padding, 48px controls and no horizontal overflow. The homepage presents four equal tasks—Understand dissection, Prepare an appointment, Make a card and Help someone—then shows a small local-only resume area only when saved state exists. Resume labels are generic and are derived from presence checks, so names, dates, medicines and notes never appear there.

The visual tokens are centralized in `src/components/theme.mjs`: page `#F5F6F4`, reading surface `#FFFFFF`, heading `#183248`, body `#33485C`, action `#2B5F87`, link/focus `#214C70`, selected surface `#E8EFF4`, with task accents `#2B5F87`, `#5B3D7F`, `#9F3049` and `#376657`. System sans-serif is used throughout the site; expressive display type remains confined to generated cards. Illustrations stay selective and are used for orientation or empty states, never inside dense clinical reading.

The chooser at `/cards` uses real local card compositions so a person can understand the difference before entering either creator. Existing card routes, storage keys, exports and draft behaviour remain unchanged. The shared saved rows expose only a generic label and truthful status, while the detailed tool remains responsible for showing the person’s own fields.

## Component vocabulary

- **Urgent-help link:** persistent, clearly named route to emergency guidance; instructions live on that destination.
- **Question route cards:** entry points based on what the person needs today.
- **Guide cards:** short source-linked reading with audience, review status and next action.
- **Preparation sheets:** selectable prompts with preview, explicit save/export/delete and local-storage notice.
- **Personal cards:** separate short form and preview, optional details, explicit local save, designed downloads, standalone card-only print and safety labels.
- **Review notice:** visible draft/clinical-review state that never implies approval.

## Website-to-app continuity

Use the same words, content model, local data boundaries and accessibility preferences in the eventual native app. The website remains the reference implementation for content and interaction review; native screens should not invent a separate medical vocabulary or safety model.

The [design case study](DESIGN_CASE_STUDY.md) records the before/after evidence, adopted patterns, implemented card behavior and verification limits. It is not a claim of WCAG conformance or clinical approval.
