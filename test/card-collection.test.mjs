import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { CARD_TEMPLATES, CARD_PALETTES, templateAppearance } from "../src/features/cards/templates.mjs";
import { emptyPersonalCard, emptyMilestoneCard, parsePersonalCard, serializePersonalCard, parseMilestoneCard, serializeMilestoneCard, personalCardPresentation, milestoneCardPresentation, formatCardText } from "../src/features/cards/model.mjs";
import { createCardMetrics } from "../src/features/cards/metrics.mjs";
import { buildCardLayout, photoCropRect } from "../src/features/cards/layout.mjs";
import { sceneSvg, whitePaperScene, scenePrintHtml } from "../src/features/cards/scene-svg.mjs";
import { createDesignedPdf, paginateScene } from "../src/features/cards/scene-pdf.mjs";
import { contrastRatio } from "../src/components/theme.mjs";
const bytes = { regular: await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url)), bold: await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url)), display: await readFile(new URL("../public/fonts/barlow/BarlowCondensed-Bold.ttf", import.meta.url)) };
const metrics = createCardMetrics(bytes.regular, bytes.bold, bytes.display);
const make = (t, patch = {}) => t.kind === "personal" ? personalCardPresentation({ ...emptyPersonalCard(), templateId: t.id, heading: "MY OWN WORDS", preferredName: "EXAMPLE", communicationNeeds: "Write important things down.", ...patch }) : milestoneCardPresentation({ ...emptyMilestoneCard(), templateId: t.id, title: "MY OWN WORDS", displayName: "EXAMPLE", message: "MY OWN MESSAGE", ...patch });
test("eight templates have distinct compositions and three curated readable colour combinations", () => {
    assert.equal(CARD_TEMPLATES.length, 8);
    assert.equal(CARD_TEMPLATES.filter(t => t.kind === "personal").length, 3);
    const layouts = new Set();
    for (const t of CARD_TEMPLATES) {
        assert.equal(t.colours.length, 3);
        for (const id of t.colours) {
            const c = CARD_PALETTES[id];
            for (const [a, b] of [[c.ink, c.paper], [c.detail, c.paper], [c.accent, c.paper], [c.onAccent, c.accent]])
                assert.ok(contrastRatio(a, b) >= 4.5, t.id + " " + id);
        }
        const scene = buildCardLayout(make(t), metrics);
        layouts.add(JSON.stringify(scene.pages[0].items.map(i => ({ type: i.type, x: i.x, y: i.y, width: i.width, height: i.height, font: i.font, size: i.size }))));
    }
    assert.equal(layouts.size, 8);
});
test("v1 design metadata stays optional, bounded and separate between the two card kinds", () => {
    const old = parsePersonalCard(JSON.stringify({ version: 1, card: { preferredName: "EXAMPLE", designId: "ink", artworkId: "ribbon" } }));
    assert.equal(old.templateId, "");
    assert.equal(old.designId, "ink");
    assert.equal(old.artworkId, "ribbon");
    const bad = parsePersonalCard(serializePersonalCard({ ...old, templateId: "warrior", colourId: "url(PRIVATE)", photoRef: "https://invalid.example/PRIVATE", photoZoom: 100, photoX: -8, photoY: NaN }));
    assert.equal(bad.templateId, "");
    assert.equal(bad.photoRef, "");
    assert.equal(bad.photoZoom, 3);
    assert.equal(bad.photoX, 0);
    assert.equal(bad.photoY, .5);
    assert.equal(templateAppearance({ templateId: "brain-poster", colourId: "cranberry", illustrationId: "crest" }, "milestone").colourId, "coral");
    assert.equal(parseMilestoneCard(serializeMilestoneCard({ templateId: "communication", preferredName: "PRIVATE" })).templateId, "");
});
test("milestone scenes use the selected words directly without form labels or hidden dates", () => {
    for (const t of CARD_TEMPLATES.filter(t => t.kind === "milestone")) {
        const view=make(t, { dateKind: "none", date: "HIDDEN-1999" });
        const layout = buildCardLayout(view, metrics);
        assert.doesNotMatch(formatCardText(view), /(?:^|\n)(Name|Message):/);
        const items = layout.pages.flatMap(p => p.items).filter(i => i.type === "text");
        assert.ok(items.some(i => i.value === "MY OWN MESSAGE"));
        assert.ok(items.some(i => i.value === "EXAMPLE"));
        assert.ok(items.some(i => i.value === "Personal milestone"));
        assert.ok(!items.some(i => ["Name", "Message", "HIDDEN-1999"].includes(i.value)));
        assert.ok(items.some(i => i.value.includes("not medical advice or proof of diagnosis")));
    }
});
test("the explicit plain option uses the new filtered scene while legacy records retain their previous layout",()=>{
    const old=parseMilestoneCard(JSON.stringify({version:1,card:{title:"MY OWN WORDS",designId:"ink"}}));
    assert.equal(old.templateId,"");assert.equal(old.designId,"ink");
    for(const kind of ["personal","milestone"]){
        const style=templateAppearance({templateId:"plain",illustrationId:"crest"},kind);
        assert.equal(style.templateId,"plain");assert.equal(style.colourId,"blue");assert.equal(style.illustrationId,"auto");
        const view=make({kind,id:"plain"}),layout=buildCardLayout(view,metrics);
        assert.ok(layout.pages.every(p=>!p.items.some(i=>["art","photo"].includes(i.type))));
        if(kind==="milestone")assert.doesNotMatch(formatCardText(view),/(?:^|\n)(Name|Message):/);
    }
});
test("no-art and no-photo compositions remove their image slots and retain selected wording", () => {
    for (const t of CARD_TEMPLATES) {
        const p = buildCardLayout(make(t, { illustrationId: "none" }), metrics).pages[0];
        assert.ok(!p.items.some(i => ["art", "photo"].includes(i.type)));
        assert.ok(p.items.some(i => i.type === "text" && i.value === "MY OWN WORDS"));
    }
});
test("photo crop stays inside the original image at every supported zoom and position", () => {
    for (const photo of [{ width: 1280, height: 720 }, { width: 720, height: 1280 }])
        for (const zoom of [1, 2, 3])
            for (const x of [0, .5, 1])
                for (const y of [0, .5, 1]) {
                    const crop = photoCropRect(photo, 203, 270, { photoZoom: zoom, photoX: x, photoY: y });
                    assert.ok(crop.x >= 0 && crop.y >= 0 && crop.x + crop.width <= photo.width + .001 && crop.y + crop.height <= photo.height + .001);
                    assert.ok(Math.abs(crop.width / crop.height - 203 / 270) < .001);
                }
});
test("long practical details paginate at a fixed readable size and keep safety text on every panel", () => {
    const view = make(CARD_TEMPLATES[0], { heading: "A long synthetic heading ".repeat(4), preferredName: "EXAMPLE ".repeat(30), communicationNeeds: "SYNTHETIC-NEED ".repeat(16), medicines: "SYNTHETIC-MEDICINE ".repeat(28), allergies: "SYNTHETIC-ALLERGY ".repeat(28), eventDateKind: "none", eventDate: "HIDDEN-1999" });
    const layout = buildCardLayout(view, metrics);
    assert.ok(layout.pages.length > 4);
    for (const p of layout.pages) {
        assert.equal(p.width, 856);
        assert.equal(p.height, 540);
        assert.ok(p.items.some(i => i.type === "text" && i.value === view.footer));
        for (const i of p.items.filter(i => i.type === "text"))
            assert.ok(i.y + i.lines.length * i.size * i.leading <= 540.1, i.value);
    }
    const backBody = layout.pages.slice(1).flatMap(p => p.items).filter(i => i.type === "text" && i.font === "regular" && i.value.startsWith("SYNTHETIC"));
    assert.ok(backBody.every(i => i.size === 38));
});
test("long milestone PNGs grow and PDF pagination preserves each measured message line", () => {
    const view = make(CARD_TEMPLATES.find(t => t.id === "photo-story"), { title: "A long heading ".repeat(16), message: "SYNTHETIC-MESSAGE ".repeat(29) }), p = buildCardLayout(view, metrics).pages[0];
    assert.ok(p.height > 1350);
    const pages = paginateScene(p, 1460, view.footer);
    assert.ok(pages.length > 1);
    const original = p.items.filter(i => i.type === "text" && i.value.startsWith("SYNTHETIC-MESSAGE")).flatMap(i => i.lines), paged = pages.flatMap(p => p.items).filter(i => i.type === "text" && i.value.startsWith("SYNTHETIC-MESSAGE")).flatMap(i => i.lines);
    assert.deepEqual(paged, original);
    const html = scenePrintHtml({ kind: "milestone", pages: [p], footer: view.footer }, metrics);
    assert.equal((html.match(/<section/g) || []).length, pages.length);
    assert.match(html, /break-before:page/);
});
test("vector preview escapes user markup by drawing glyph paths and print colours remain readable", () => {
    const view = make(CARD_TEMPLATES.find(t => t.id === "warrior"), { title: '<script>PRIVATE</script>' }), p = buildCardLayout(view, metrics).pages[0], svg = sceneSvg(p, metrics);
    assert.doesNotMatch(svg, /<script>|PRIVATE|fetch\(|(?:href|src)="https?:/);
    const white = whitePaperScene(p);
    assert.equal(white.background, "#FFFFFF");
    assert.ok(white.items.filter(i => i.type === "text").every(i => contrastRatio(i.colour, "#FFFFFF") >= 4.5));
});
test("display lettering falls back for Cyrillic while wallet PDFs keep real dimensions and neutral metadata", async () => {
    assert.equal(metrics.resolveFont("display", "Пример"), "bold");
    const view = make(CARD_TEMPLATES[0], { heading: "Пример", preferredName: "SYNTHETIC PRIVATE NAME" });
    const document = await PDFDocument.load(await createDesignedPdf(view, bytes, { size: "wallet" }), { updateMetadata: false });
    assert.ok(document.getPageCount() >= 2);
    for (const page of document.getPages()) {
        assert.ok(Math.abs(page.getWidth() - 85.6 * 72 / 25.4) < .001);
        assert.ok(Math.abs(page.getHeight() - 54 * 72 / 25.4) < .001);
    }
    assert.equal(document.getTitle(), "Personal information card");
});
