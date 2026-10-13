# Website design direction

## Chosen direction

The website uses a **calm clinical editorial** direction: clear enough for a person reading while tired, but recognisably patient-led rather than a hospital portal. The visual signature is a quiet paper background, a teal “care” colour, restrained gold action markers and a small editorial serif used only for major headings.

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
- Use one warm accent for focus and action feedback; never use colour alone to communicate status.
- Prefer real text and printable layouts to decorative imagery.
- Keep motion optional and never use animation to communicate medical urgency.
- Keep the same shell across the website and future app so the mental model transfers.
- Keep the static shell usable during a short connectivity interruption. Network-first refreshes should prefer current content, while a cached page is only a fallback; never cache or transmit card and appointment fields through the service worker.
- On narrow screens, keep the brand first and use a wrapped, two-row navigation with full-size targets. Never squeeze labels into a single unreadable row; the active route uses both colour and a border so it remains clear in high contrast.
- Use the same three header controls at every width: Home, Menu, Text and display. Menu expands inline with named links and closes with Escape. Home offers four actions: Understand dissection, Prepare an appointment, Make a card, Help someone.
- Treat migraine, headache and trauma sensitivity as design constraints rather than promises: no flashing, autoplay, parallax, cursor trails, surprise sound, aggressive red alerts or forced animation; provide reduced motion, dark/light choice, readable muted surfaces and an immediate route away from urgent content.
- Use trauma-informed presentation: warn before distressing or emergency material, keep descriptions neutral and brief, avoid graphic imagery and sensational language, preserve user choice, and never claim that a page can prevent PTSD or guarantee that nothing will be triggering.
- Keep the home introduction short enough for the four actions to appear on the first ordinary phone screen. Put one saved-items link below them. Explain the product's limits briefly, with detailed notices on the relevant destinations.
- Borrow the reference site's sense of a guided journey and generous rounded panels, while keeping movement optional, navigation explicit and every destination reachable by keyboard, touch and assistive technology. The visual reference is [Squilla Fund by Red Collar](https://redcollar.co/work/squilla-fund); its 3D/cursor effects are intentionally not part of this patient-facing interface.

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
