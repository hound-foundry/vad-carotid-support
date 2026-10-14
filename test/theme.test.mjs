import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { palette, themeFor, themedColour, defaultTextColour, contrastRatio, designContrastReport } from "../src/components/theme.mjs";
import { APP_NAME, APP_SUBTITLE } from "../src/brand.mjs";
import { cardHtml } from "../src/features/cards/document.mjs";
import { emptyPersonalCard, personalCardPresentation } from "../src/features/cards/model.mjs";
import { paletteSvg } from "../scripts/design-workbench.mjs";
import { readDocumentColors } from "../scripts/design-kit.mjs";

test("legacy and current route colours resolve across four themes without losing filled labels", () => {
  for (const theme of ["light", "dark"]) for (const contrast of ["standard", "high"]) {
    const settings = { theme, contrast }; const resolved = themeFor(settings);
    for (const colour of ["#435A5A", palette.text]) assert.equal(themedColour(colour, "color", settings), resolved.text);
    for (const colour of ["#E4F0ED", palette.mint]) assert.equal(themedColour(colour, "backgroundColor", settings), resolved.mint);
    assert.equal(themedColour("#FFFFFF", "backgroundColor", settings), resolved.white);
    assert.equal(themedColour("#FFFFFF", "color", settings), "#FFFFFF");
    assert.equal(themedColour("#195B58", "backgroundColor", settings), palette.tealDark);
    assert.equal(themedColour("#183B3B", "backgroundColor", settings), palette.ink);
    assert.equal(themedColour("transparent", "backgroundColor", settings), "transparent");
  }
});
test("readability and focus pairs pass without rounding a failing contrast threshold", () => {
  assert.equal(contrastRatio("#000000", "#FFFFFF"), 21);
  assert.ok(contrastRatio("#777777", "#FFFFFF") < 4.5);
  const checks = designContrastReport(); assert.equal(checks.length, 48);
  for (const check of checks) assert.ok(check.ratio >= check.minimum, `${check.theme}/${check.contrast} ${check.pair}: ${check.ratio}`);
});

test("unstyled root text stays readable in every theme without overriding nested or filled labels", () => {
  for (const theme of ["light", "dark"]) for (const contrast of ["standard", "high"]) {
    const settings={theme,contrast},t=themeFor(settings);
    const foreground=defaultTextColour(undefined,false,settings);
    assert.equal(foreground,t.text);
    assert.ok(contrastRatio(foreground,t.paper)>=4.5);
    assert.ok(contrastRatio(foreground,t.white)>=4.5);
    assert.equal(defaultTextColour(undefined,true,settings),undefined);
    assert.equal(defaultTextColour("#FFFFFF",false,settings),"#FFFFFF");
  }
});
test("display identity and portable design exports agree without renaming the technical app", async () => {
  const config = JSON.parse(await readFile(new URL("../app.json", import.meta.url), "utf8")).expo;
  assert.equal(config.name, APP_NAME); assert.equal(config.description, APP_SUBTITLE);
  assert.equal(config.slug, "vad-carotid-support"); assert.equal(config.scheme, "vadcarotidsupport");
  const svg = paletteSvg(palette); assert.ok(svg.includes(APP_NAME)); assert.ok(svg.includes(palette.teal));
  const html = cardHtml(personalCardPresentation(emptyPersonalCard()));
  assert.ok(html.includes(`name="generator" content="${APP_NAME}"`)); assert.ok(html.includes(palette.ink));
  assert.ok(html.includes("background:#fff"));
  const guide = await readFile(new URL("../.stitch/DESIGN.md", import.meta.url), "utf8");
  assert.throws(() => readDocumentColors(guide.replace(APP_NAME, "Old title")), /brand/);
});
