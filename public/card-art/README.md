# Card collection artwork

These assets belong to Dissection Companion's optional card templates. The practical interface remains separate from expressive card artwork. No commercial example, user photo, logo, official seal or medical certification mark was copied.

- Artery & ribbon, ribbon, branch and shield/leaf: original vector paths in `src/features/cards/collection-art.mjs`, maintained with the project's source. The artery-and-ribbon motif is a decorative branching-vessel design, not an official or universally recognised dissection symbol, anatomical diagram or medical-alert mark.
- Gallery portraits: original synthetic vector placeholders made by `scripts/build-card-collection.mjs`. They are illustrations, not patient photographs.

Project-authored artwork is distributed under the repository's existing content licence. The font has its own licence.

The previous brain character has been retired. Saved `brain-poster`, `brain-character` and `brain` identifiers now resolve to Artery & ribbon; names, dates, colours and wording are preserved. The old raster is no longer bundled or fetched. Previews, PNGs, PDFs and print use the same vector paths.

## Fonts

Barlow Condensed Bold is bundled in `public/fonts/barlow/`. Its [SIL Open Font License](../fonts/barlow/OFL.txt) is preserved. It is used for short expressive card headings; Noto Sans Bold is used when it lacks a selected character. Noto Sans regular/bold remain the detail fonts. Unsupported characters produce a useful error and a text alternative rather than silent substitution. Interface text continues to use the system font.
