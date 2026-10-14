import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { emptyPersonalCard, emptyMilestoneCard, parsePersonalCard, parseMilestoneCard, serializePersonalCard, serializeMilestoneCard, personalCardPresentation, milestoneCardPresentation } from "../src/features/cards/model.mjs";
import { CARD_DESIGNS } from "../src/features/cards/design.mjs";
import { CARD_ARTWORK, cardArtworkSvg } from "../src/features/cards/artwork.mjs";
import { cardHtml } from "../src/features/cards/document.mjs";
import { createCardPdf } from "../src/features/cards/pdf.mjs";
import { contrastRatio } from "../src/components/theme.mjs";

test("existing v1 cards restore their words with a plain design and no artwork", () => {
  const personal = parsePersonalCard(JSON.stringify({ version: 1, card: { preferredName: "EXAMPLE", communicationNeeds: "Write it down.", eventDateKind: "none" } }));
  const milestone = parseMilestoneCard(JSON.stringify({ version: 1, card: { title: "My own title", message: "My own message", useSurvivorWord: true } }));
  assert.equal(personal.preferredName, "EXAMPLE"); assert.equal(personal.designId, "clear"); assert.equal(personal.artworkId, "none");
  assert.equal(milestone.message, "My own message"); assert.equal(milestone.useSurvivorWord, true); assert.equal(milestone.designId, "clear");
});
test("only local allowlisted designs and artwork survive saved data", () => {
  for (const [empty, serialize, parse] of [[emptyPersonalCard, serializePersonalCard, parsePersonalCard], [emptyMilestoneCard, serializeMilestoneCard, parseMilestoneCard]]) {
    const invalid = parse(serialize({ ...empty(), designId: "https://invalid.example/PRIVATE", artworkId: '<script>alert(1)</script>' }));
    assert.equal(invalid.designId, "clear"); assert.equal(invalid.artworkId, "none");
    for (const design of CARD_DESIGNS) for (const art of CARD_ARTWORK) {
      const card = parse(serialize({ ...empty(), designId: design.id, artworkId: art.id }));
      assert.equal(card.designId, design.id); assert.equal(card.artworkId, art.id);
    }
  }
});
test("personal headings are bounded and design changes never import milestone words", () => {
  const personal = parsePersonalCard(serializePersonalCard({ ...emptyPersonalCard(), heading: "x".repeat(200), title: "WARRIOR", message: "MILESTONE-ONLY", designId: "ink" }));
  assert.equal(personal.heading.length, 80); assert.equal(personalCardPresentation(personal).title.length, 80);
  assert.ok(!JSON.stringify(personal).includes("MILESTONE-ONLY"));
  assert.equal(emptyMilestoneCard().useSurvivorWord, false); assert.equal(emptyMilestoneCard().title, "My milestone");
});
test("every paper design keeps body, supporting, accent and header text readable", () => {
  for (const design of CARD_DESIGNS) for (const [foreground, background] of [[design.ink, design.background], [design.muted, design.background], [design.accent, design.background], [design.headerInk, design.header]]) assert.ok(contrastRatio(foreground, background) >= 4.5, design.id + ": " + foreground);
});
test("native PNG drawings match their original local vector sources", async () => {
  const manifest = JSON.parse(await readFile(new URL("../assets/card-art/manifest.json", import.meta.url), "utf8"));
  for (const art of CARD_ARTWORK.filter((item) => item.id !== "none")) {
    const svg = cardArtworkSvg(art.id), png = await readFile(new URL(`../assets/card-art/${art.id}.png`, import.meta.url));
    assert.equal(createHash("sha256").update(svg).digest("hex"), manifest[art.id].svgSha256);
    assert.equal(createHash("sha256").update(png).digest("hex"), manifest[art.id].pngSha256);
    assert.equal(png.subarray(1,4).toString(), "PNG"); assert.doesNotMatch(svg, /<script|<image|href=|<foreignObject/i);
  }
});
test("every template's print document includes only selected words, local art and the safety label", () => {
  for (const design of CARD_DESIGNS) for (const art of CARD_ARTWORK) {
    const card = { ...emptyMilestoneCard(), title: 'MY <WORDS>', message: "MY-SYNTHETIC-MESSAGE", dateKind: "none", date: "DO-NOT-EXPORT-DATE", designId: design.id, artworkId: art.id };
    const html = cardHtml(milestoneCardPresentation(card));
    assert.ok(html.includes("MY &lt;WORDS&gt;")); assert.ok(html.includes(card.message)); assert.ok(!html.includes(card.date));
    assert.ok(html.includes("not medical advice or proof of diagnosis")); assert.equal(html.includes("<svg"), art.id !== "none");
    assert.doesNotMatch(html, /<script|<iframe|<form|<input|fetch\(/i);
  }
});
test("wallet PDFs retain physical dimensions, continuation and neutral metadata with long content", async () => {
  const regular = await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url)), bold = await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url));
  const view = personalCardPresentation({ ...emptyPersonalCard(), heading: "My own heading", preferredName: "SYNTHETIC PRIVATE NAME", communicationNeeds: "A long synthetic sentence. ".repeat(20), medicines: "Synthetic entry. ".repeat(40), designId: "ink", artworkId: "brain" });
  const document = await PDFDocument.load(await createCardPdf(view, regular, bold, { size: "wallet" }), { updateMetadata: false });
  assert.ok(document.getPageCount() > 1); assert.equal(document.getTitle(), "Personal information card");
  for (const page of document.getPages()) { assert.ok(Math.abs(page.getWidth() - 85.6 * 72 / 25.4) < 0.001); assert.ok(Math.abs(page.getHeight() - 54 * 72 / 25.4) < 0.001); }
});
test("a short wallet card keeps its update date on the card instead of stranding it on another panel", async () => {
  const regular = await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url)), bold = await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url));
  const view = personalCardPresentation({ ...emptyPersonalCard(), heading: "Please give me time", preferredName: "Example", communicationNeeds: "Please ask before helping me.", designId: "ink", updatedOn: "2026-10-14" });
  const document = await PDFDocument.load(await createCardPdf(view, regular, bold, { size: "wallet" }));
  assert.equal(document.getPageCount(), 1);
});
