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
- Treat the home route as a recovery-friendly dashboard: one calm next-step prompt, a small set of task links, and a visible boundary between general information and urgent help.

## Component vocabulary

- **Urgent banner:** persistent, high-contrast route to emergency guidance.
- **Question route cards:** entry points based on what the person needs today.
- **Guide cards:** short source-linked reading with audience, review status and next action.
- **Preparation sheets:** selectable prompts with preview, explicit save/export/delete and local-storage notice.
- **Personal cards:** user-authored communication or milestone outputs with safety labels.
- **Review notice:** visible draft/clinical-review state that never implies approval.

## Website-to-app continuity

Use the same words, content model, local data boundaries and accessibility preferences in the eventual native app. The website remains the reference implementation for content and interaction review; native screens should not invent a separate medical vocabulary or safety model.
