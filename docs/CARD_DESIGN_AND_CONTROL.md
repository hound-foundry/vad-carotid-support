# Card design and user control

14 October 2026. Implementation extends the quieter Dissection Companion interface. This is a technical/design review with synthetic examples, not patient feedback or clinical approval.

## What changed

Both card tools now offer distinct practical and milestone designs. Design choices start collapsed. No artwork is selected by default; optional original ribbon, leaf, shield/leaf and artery-and-ribbon drawings are available in a second disclosure. Plain design and one-step Undo change only styling. They preserve words and dates and do not save or export automatically.

The practical card accepts a custom heading and retains selectable communication statements and optional details. The separate milestone card offers editable title ideas including Survivor and Warrior. Neither wording is compulsory. No reminder, elapsed-time calculation, official identifier, diagnostic inference or automatic social posting was added.

The creator now shows a live front-and-back preview while the person chooses a design, colour or artwork. The main preview keeps one front and one back in view; longer wallet details remain available under an explicit “Additional details” disclosure and still paginate in exports. One filtered presentation supplies preview, PDF, PNG, text and print. No date omits the entered date from the presentation and every output. Dark/high-contrast preview follows the person's display preferences; the adjacent caption explains this. Downloads use the chosen paper style. Print uses white paper and dark text. Standard PDF remains the larger-text option; personal cards additionally offer 85.6 × 54 mm wallet panels with overflow onto additional panels rather than shrinking text.

Existing separate v1 storage keys and explicit Save/Export/Delete remain. Old cards without design fields restore with Clear blue and no artwork. Only known style/artwork IDs survive serialization. Artwork is original, local and documented in [its licence/readme](../assets/card-art/README.md). Commercial reference screenshots and their logos were not copied or committed. No dependency was added.

## References and design decisions

| Source, checked 14 October 2026 | Pattern used and limit |
| --- | --- |
| [Apple Design Awards 2026](https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/) | Guitar Wiz supports text/contrast and non-colour distinctions; Pine Hearts offers legibility and sensory controls. Adapt the emphasis on adjustable presentation, rather than a visual trend that adds movement or transparency. These awards do not validate this app. |
| [National Trauma Transformation Programme](https://www.traumatransformation.scot/about/) | Its choice, safety and empowerment principles informed optional artwork/wording, predictable controls and undo. This is an inference for interface design, not evidence that the site prevents PTSD reactions. |
| [W3C cognitive accessibility guidance](https://www.w3.org/TR/coga-usable/) | Keep labels, familiar navigation, reversible choices and short steps; avoid requiring people to remember hidden choices. Supplemental guidance does not establish WCAG conformance. |
| [American Stroke Association aphasia ID card](https://www.stroke.org/en/about-stroke/effects-of-stroke/communication-and-aphasia/stroke-and-aphasia/aphasia-id-card) | A communication aid can express what helps and request time. Our layout/artwork is original; there is no affiliation or clinical endorsement. |

The visual approach preserves opaque surfaces, blue identity, restrained borders and rounded corners. Images appear only after the person chooses them. There is no motion, autoplay or forced positive identity. Comfort varies; neither blue nor this layout is claimed to prevent migraine, fatigue or trauma responses.

## Verification

Evidence is in [card-design-proof](card-design-proof/). The gallery contains actual app PNG downloads, not cloud mockups. Other screenshots show phone/desktop practical cards, optional designs, and doubled app text in dark mode.

- 80 unit tests, content/review/native configuration checks, TypeScript, design validation, static export and 33 exported-artifact checks pass. New tests cover old v1 compatibility, allowlists, separate contents, heading bounds, colour pairs, artwork integrity, selected-only print HTML, hidden dates and wallet pagination.
- Browser journeys verified both cards' blank defaults, preview/edit, explicit save/reload, generic saved labels, separate contents, unsaved style loss on reload, and cancellation/confirmation of deletion. Only owned synthetic fixtures on port 4183 were deleted. Main/phone preview data was untouched.
- Actual personal PNG, PDF, wallet PDF and text downloads were retrieved and inspected. Four milestone styles were downloaded and visually inspected. A browser-generated milestone PDF omits its hidden year. PDF text checks confirm expected synthetic values and safety labels without form instructions. Long-content fixtures render as two A4 pages and thirteen wallet panels; a short wallet card fits one panel including its update date.
- At 320px, doubled app text reflows in dark and both high-contrast modes. Radio arrows, plain reset, undo and Menu Escape work. One overflow reading immediately after resizing was not present on the stable recheck. Actual browser zoom is a separate, untested check.
- A clean-browser bounded input/save/export trace captured five same-origin code/font requests, no synthetic field marker in requests, URLs or logs, no truncated events and no console errors. The earlier extension-browser trace was truncated and is retained only as incomplete evidence, not a privacy pass. These checks do not guarantee privacy on a shared device or control copies after export.

The browser checks also exposed a pre-existing hydration mismatch: responsive markup differed between static export and the first client render. `useLayoutDimensions` now matches the export's zero viewport until web hydration completes; native layout uses its dimensions immediately. After this repair, 46 checks across 25 routes and phone, narrow, short-landscape and desktop samples found no console errors, persistent horizontal overflow, missing main landmark, inaccessible medical-help link or missing bottom-navigation destination. See [startup-route-checks.json](card-design-proof/startup-route-checks.json).

Screen readers, physical printing/system print cancellation, actual browser zoom, device keyboard clearance, native VoiceOver/TalkBack and native file sharing remain untested in this pass. HTML print safety/field filtering and PDF rasterizations were checked; those are not evidence of physical print usability. Clinical, patient/carer, translation and market review remain separate and pending.
