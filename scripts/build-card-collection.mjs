import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { CARD_TEMPLATES } from "../src/features/cards/templates.mjs";
import { emptyPersonalCard, emptyMilestoneCard, personalCardPresentation, milestoneCardPresentation } from "../src/features/cards/model.mjs";
import { createCardMetrics } from "../src/features/cards/metrics.mjs";
import { buildCardLayout } from "../src/features/cards/layout.mjs";
import { sceneSvg } from "../src/features/cards/scene-svg.mjs";
import { createDesignedPdf } from "../src/features/cards/scene-pdf.mjs";
const sharpPath = process.argv[process.argv.indexOf("--sharp-module") + 1];
if (!sharpPath || !process.argv.includes("--sharp-module"))
    throw new Error("Supply the optional maintainer Sharp module path");
const sharp = (await import(pathToFileURL(sharpPath).href)).default;
const output = new URL("../docs/designed-cards-proof/", import.meta.url), thumbs = new URL("../assets/card-collection/", import.meta.url), tmp = new URL("../tmp/card-collection/", import.meta.url);
for (const d of [output, thumbs, tmp])
    await mkdir(d, { recursive: true });
const bytes = { regular: await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url)), bold: await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url)), display: await readFile(new URL("../public/fonts/barlow/BarlowCondensed-Bold.ttf", import.meta.url)) }, metrics = createCardMetrics(bytes.regular, bytes.bold, bytes.display);
const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#E8EFF4"/><ellipse cx="300" cy="780" rx="300" ry="275" fill="#5B3D7F"/><path d="M250 475L350 475L375 575L225 575Z" fill="#D8A691"/><ellipse cx="300" cy="338" rx="130" ry="169" fill="#E4BDAA"/><path d="M171 350C120 168 264 92 372 170C469 192 466 360 425 392L403 277C341 301 254 307 193 273Z" fill="#183248"/><circle cx="251" cy="343" r="7" fill="#183248"/><circle cx="348" cy="343" r="7" fill="#183248"/><path d="M258 430Q300 450 342 430" stroke="#9F3049" stroke-width="6" fill="none"/></svg>`;
const photoBytes = await sharp(Buffer.from(placeholder)).jpeg().toBuffer(), photo = { bytes: photoBytes, width: 600, height: 800 }, assets = { photo: { ...photo, dataUrl: `data:image/jpeg;base64,${photoBytes.toString("base64")}` } };
await writeFile(new URL("illustrated-photo-placeholder.jpg", tmp), photoBytes);
const rows = [];
for (const template of CARD_TEMPLATES) {
    const style = { templateId: template.id, colourId: template.colours[0], illustrationId: "auto" };
    const card = template.kind === "personal" ? { ...emptyPersonalCard(), ...style, heading: "Please give me time", preferredName: "Example", communicationNeeds: "Please use short, clear sentences.", updatedOn: "2026-10-14" } : { ...emptyMilestoneCard(), ...style, title: template.id === "ribbon-poster" ? "SURVIVOR" : template.id === "warrior" ? "WARRIOR" : template.id === "brain-poster" ? "At my own pace" : "My milestone", displayName: "Example", message: "My story, my words.", dateKind: "month-year", date: "October 2026" };
    const view = template.kind === "personal" ? personalCardPresentation(card) : milestoneCardPresentation(card), layout = buildCardLayout(view, metrics, { photo: template.photo ? photo : undefined });
    const pdf = await createDesignedPdf(view, bytes, { size: template.kind === "personal" ? "wallet" : "a4", photo: template.photo ? photo : undefined });
    await writeFile(new URL(template.id + ".pdf", tmp), pdf);
    const png = await sharp(Buffer.from(sceneSvg(layout.pages[0], metrics, assets))).png().toBuffer();
    await writeFile(new URL(template.id + ".png", output), png);
    await writeFile(new URL(template.id + ".png", thumbs), await sharp(png).resize({ width: 432 }).png().toBuffer());
    if (template.kind === "personal")
        await writeFile(new URL(template.id + "-back.png", output), await sharp(Buffer.from(sceneSvg(layout.pages[1], metrics, assets))).png().toBuffer());
    const noArt = buildCardLayout({ ...view, illustrationId: "none" }, metrics);
    await writeFile(new URL(template.id + "-plain.png", tmp), await sharp(Buffer.from(sceneSvg(noArt.pages[0], metrics, {}))).png().toBuffer());
    rows.push({ id: template.id, name: template.name, kind: template.kind, width: layout.pages[0].width, height: layout.pages[0].height, panels: layout.pages.length });
}
await writeFile(new URL("catalogue.json", output), JSON.stringify(rows, null, 2) + "\n");
console.log("Built sixteen original card examples, gallery images, wallet backs and PDF fixtures locally.");
