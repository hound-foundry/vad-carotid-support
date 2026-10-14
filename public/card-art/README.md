# Card collection artwork

These assets belong to Dissection Companion's optional card templates. The practical interface remains separate from expressive card artwork. No commercial example, user photo, logo, official seal or medical certification mark was copied.

- `friendly-brain.png`: original AI-assisted raster illustration, generated 14 October 2026 using the built-in OpenAI image-generation tool with a transparent background. 1312 × 1199 RGBA. The app bundles this public illustration; private photos never go to an image-generation or design service.
- Ribbon, branch and shield/leaf: original vector paths in `src/features/cards/collection-art.mjs`, maintained with the project's source.
- Gallery portraits: original synthetic vector placeholders made by `scripts/build-card-collection.mjs`. They are illustrations, not patient photographs.

Project-authored artwork is distributed under the repository's existing content licence, as far as rights permit. AI-assisted provenance is disclosed; no claim of exclusive copyright in generated pixels is made. The font has its own licence.

## Generation prompt

> Use case: illustration-story. Asset: original large character illustration for an optional personal milestone card in Dissection Companion. Create a polished contemporary editorial cartoon of one friendly anthropomorphic brain character, softly rounded lobes, small warm expression, open eyes, one little hand waving and the other holding a leafy sprig. Coral pink #F4CCC3, sage green #376657, deep navy #183248 and warm cream highlights. Clean confident ink outlines with subtly varied weight, flat rich colours and very restrained printed texture within the drawing. Enough detailed character and craft to be the main illustration on a beautiful adult card, approachable without looking like a medical diagram or a children's logo. The character is fully visible and centred, generous transparent margins, genuine transparent background. No words, lettering, ribbon, medical cross, official marks, seal, watermark, shadows outside the character, other characters or copied commercial artwork. This is expressive decoration; no illness symptoms, distress, bandages or battle imagery.

## Fonts

Barlow Condensed Bold is bundled in `public/fonts/barlow/`. Its [SIL Open Font License](../fonts/barlow/OFL.txt) is preserved. It is used for short expressive card headings; Noto Sans Bold is used when it lacks a selected character. Noto Sans regular/bold remain the detail fonts. Unsupported characters produce a useful error and a text alternative rather than silent substitution. Interface text continues to use the system font.
