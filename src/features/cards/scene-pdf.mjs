import { PDFDocument, rgb, LineCapStyle, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { createCardMetrics } from "./metrics.mjs";
import { buildCardLayout, paginateScene } from "./layout.mjs";
export { paginateScene } from "./layout.mjs";
import { COLLECTION_ART } from "./collection-art.mjs";
import { APP_NAME } from "../../brand.mjs";
const colour = hex => { const values = hex.slice(1).match(/../g).map(s => parseInt(s, 16) / 255); return rgb(...values); };
/**
 * @param {any} view
 * @param {{regular:Uint8Array,bold:Uint8Array,display?:Uint8Array}} bytes
 * @param {{size?:string,photo?:any}} options
 */
export async function createDesignedPdf(view, bytes, { size = "a4", photo } = {}) {
    const metrics = createCardMetrics(bytes.regular, bytes.bold, bytes.display), layout = buildCardLayout(view, metrics, { photo });
    if (!layout)
        throw new Error("Choose a designed template before creating a PDF.");
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    const fonts = { regular: await doc.embedFont(bytes.regular, { subset: true }), bold: await doc.embedFont(bytes.bold, { subset: true }), display: await doc.embedFont(bytes.display || bytes.bold, { subset: true }) };
    const photoImage = photo ? await doc.embedJpg(photo.bytes) : undefined;
    for (const p of layout.pages)
        for (const i of p.items.filter(i => i.type === "text"))
            for (const c of [...i.value])
                if (!/[\n\r\t]/u.test(c) && !fonts[i.font].getCharacterSet().includes(c.codePointAt(0)))
                    throw new Error("PDF cannot display some characters. Download text instead.");
    const scenes = layout.kind === "milestone" ? layout.pages.flatMap(p => paginateScene(p, 1460, view.footer)) : layout.pages;
    for (const scene of scenes) {
        const wallet = size === "wallet", proof = size === "proof";
        const width = proof ? scene.width : wallet ? 85.6 * 72 / 25.4 : 595.28, height = proof ? scene.height : wallet ? 54 * 72 / 25.4 : 841.89;
        const page = doc.addPage([width, height]), scale = proof ? 1 : wallet ? width / scene.width : 507.28 / scene.width, offsetX = proof || wallet ? 0 : 44, offsetY = proof || wallet ? 0 : 44;
        drawScene(page, scene, { scale, offsetX, offsetY, height, fonts, metrics, photoImage, photo });
    }
    doc.setTitle(view.kind === "personal" ? "Personal information card" : "Personal milestone card");
    doc.setProducer(APP_NAME);
    doc.setCreator(APP_NAME);
    return doc.save();
}
function drawScene(page, scene, { scale: s, offsetX: ox, offsetY: oy, height, fonts, metrics, photoImage, photo }) {
    const x = v => ox + v * s, y = (v, h = 0) => height - oy - (v + h) * s;
    page.pushOperators(pushGraphicsState(), rectangle(ox, height - oy - scene.height * s, scene.width * s, scene.height * s), clip(), endPath());
    page.drawRectangle({ x: ox, y: y(0, scene.height), width: scene.width * s, height: scene.height * s, color: colour(scene.background) });
    for (const i of scene.items) {
        if (i.type === "rect")
            page.drawRectangle({ x: x(i.x), y: y(i.y, i.height), width: i.width * s, height: i.height * s, ...(i.fill !== "none" ? { color: colour(i.fill) } : {}), ...(i.stroke ? { borderColor: colour(i.stroke), borderWidth: 2 * s } : {}) });
        else if (i.type === "ellipse")
            page.drawEllipse({ x: x(i.x + i.width / 2), y: y(i.y + i.height / 2), xScale: i.width * s / 2, yScale: i.height * s / 2, color: colour(i.fill) });
        else if (i.type === "text")
            for (let n = 0; n < i.lines.length; n++) {
                const line = i.lines[n], w = metrics.width(line, i.size, i.font), dx = i.align === "center" ? (i.width - w) / 2 : i.align === "right" ? i.width - w : 0;
                page.drawText(line, { x: x(i.x + dx), y: y(i.y + n * i.size * i.leading + i.size * .9), font: fonts[i.font], size: i.size * s, color: colour(i.colour) });
            }
        else if (i.type === "art") {
            const q = Math.min(i.width, i.height) / 100, dx = i.x + (i.width - q * 100) / 2, dy = i.y + (i.height - q * 100) / 2;
            for (const path of COLLECTION_ART[i.id] || [])
                page.drawSvgPath(path.d, { x: x(i.flip ? dx + q * 100 : dx), y: y(i.flip ? dy + q * 100 : dy), scale: q * s, ...(i.flip ? { rotate: { type: "degrees", angle: 180 } } : {}), ...(path.fill ? { color: colour(i.palette[path.fill]) } : {}), ...(path.stroke ? { borderColor: colour(i.palette[path.stroke]), borderWidth: path.width, borderLineCap: LineCapStyle.Round } : {}) });
        }
        else if (i.type === "photo" && photoImage) {
            const r = i.crop, q = i.width / r.width;
            page.pushOperators(pushGraphicsState(), rectangle(x(i.x), y(i.y, i.height), i.width * s, i.height * s), clip(), endPath());
            page.drawImage(photoImage, { x: x(i.x - r.x * q), y: y(i.y - r.y * q, photo.height * q), width: photo.width * q * s, height: photo.height * q * s });
            page.pushOperators(popGraphicsState());
        }
    }
    page.pushOperators(popGraphicsState());
}
