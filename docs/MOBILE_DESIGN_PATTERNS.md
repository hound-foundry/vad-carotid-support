# Mobile design patterns in the existing Expo project

The current React Native/Expo components carry the design between the website and eventual iOS/Android app. The approved Dissection Companion redesign uses restrained blue, rounded panels, system sans-serif and an 18px minimum text size. Existing task flows and saved-data contracts remain intact. See [redesign results](DESIGN_RESULTS.md) for actual screenshots and bounded verification.

| Pattern | Implemented here | Purpose |
|---|---|---|
| Clear next action | Review your sheet on question/preferences tools; existing short card form → preview → edit | Review a small selection without reading the rest of the list |
| Preserve context | Separate session-only sheet view records retain section, mode, filters and open controls | Reduce reconstruction after interruption |
| Consistent reading defaults | Sheets follow Simplified reading unless locally overridden | Shorter blocks across tools |
| Predictable confirmation | Shared deletion component, Cancel focus, Escape, returned focus, failure/retry | Transfer familiar behavior between tools |
| Stable navigation space | Menu leaves room for skip focus and urgent help | Keep labelled controls available in short landscape |
| Shared visual system | Existing theme, scalable text, 48px targets and React Native StyleSheet components | Common words, colours and interaction structure across platforms |

Preview anchors use React Native scroll refs, with DOM focus only on web. They put no fields into navigation parameters or storage. Sheet viewing records contain only section index/booleans, live in memory, remain independent of saved contents, and clear on successful clear-all. No storage version/key changed.

## Primary design references, checked 13 October 2026

- Apple's [accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility) supports consistent simple actions, scalable text and avoiding timed controls; [layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) supports adaptation to available space.
- [Material foundations](https://m3.material.io/foundations/) describes tokens, interaction states and accessible layouts. Adopt principles while preserving product identity.
- W3C [cognitive accessibility guidance](https://www.w3.org/TR/coga-usable/) supports reducing memory demands and helping people recover. [Reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) requires access at narrow equivalent widths; vertical scrolling alone is not a failure.
- Expo [safe areas](https://docs.expo.dev/develop/user-interface/safe-areas/) and [keyboard handling](https://docs.expo.dev/guides/keyboard-handling/) inform native verification. Safe-area-context is already installed; device keyboard/focus behavior needs actual testing.

These references do not establish this product's accessibility conformance or clinical safety.

## Tools and native verification

Sleek's mobile integration guidance was examined. No credential or exported Sleek project was supplied here, so no live design run, account connection, paid generation or import is claimed. Its Expo/StyleSheet guidance fits this repository: inspect actual exported code/screenshots, map the theme once, preserve real state/navigation, and verify native behavior. Figma or Sleek exports can provide specific visual references later; the current fixes use the existing components.

Before native release, verify VoiceOver/TalkBack, system font rendering/scaling, safe areas, software-keyboard reachability, and native share/print cancellation. Web screenshots and TypeScript/static export do not prove those behaviors. Avoid adding a second menu or bottom bar until real people test a native navigation prototype; four Home tasks already form a small useful starting set.

The [follow-up audit](RETURNING_USER_AUDIT.md) records scores, captures, repairs and technical checks. Colour/motion choices are sensitivity-conscious and do not promise to prevent migraine or PTSD reactions.

The [free design workflow](FREE_DESIGN_WORKFLOW.md) registers this Expo app, exports source-derived design values and embeds the real build for phone/desktop checks. Its external platform trial remains separate from implementation and patient usability review.
