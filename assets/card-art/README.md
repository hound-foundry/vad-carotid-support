# Original card drawings

The ribbon, growing leaf, shield/leaf and artery-and-ribbon motif are original project drawings defined in `src/features/cards/artwork.mjs`. The `brain` filename is retained for saved-card compatibility and now contains the artery-and-ribbon drawing. They are decorative artwork, not medical-alert symbols, official identification or anatomical illustrations. User-provided commercial screenshots were inspiration only; their artwork and logos were not copied.

The SVG and PNG versions share the same source. `scripts/build-card-art.mjs` uses an optional maintainer-side Sharp installation to build the committed PNGs; the app and CI do not need Sharp. `manifest.json` and the tests detect stale derivatives. Web/native previews use the PNGs; PDF, PNG exports and print HTML use the original vector paths.

These original illustrations use the project's [CC BY 4.0 content licence](../../CONTENT-LICENSE.md), attributed to Dissection Companion contributors. Source code remains under the code licence. These drawings do not assert a universal awareness colour or medical meaning.
