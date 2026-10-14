import { COLLECTION_ART } from "./collection-art.mjs";
import { paginateScene } from "./layout.mjs";
const xml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
export function sceneSvg(page, metrics, assets = {}) {
    const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${page.width}" height="${page.height}" viewBox="0 0 ${page.width} ${page.height}"><rect width="100%" height="100%" fill="${page.background}"/>`];
    for (const item of page.items) {
        if (item.type === "rect")
            parts.push(`<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" rx="${item.radius}" fill="${item.fill}"${item.stroke ? ` stroke="${item.stroke}" stroke-width="2"` : ""}/>`);
        else if (item.type === "ellipse")
            parts.push(`<ellipse cx="${item.x + item.width / 2}" cy="${item.y + item.height / 2}" rx="${item.width / 2}" ry="${item.height / 2}" fill="${item.fill}"/>`);
        else if (item.type === "text") {
            const font = metrics.fonts[item.font], scale = item.size / font.unitsPerEm;
            for (let index = 0; index < item.lines.length; index++) {
                const line = item.lines[index];
                if ([...line].some(c => !font.hasGlyphForCodePoint(c.codePointAt(0))))
                    throw new Error("Some characters cannot be drawn in this design. Use the text version.");
                const run = font.layout(line);
                const advance = run.positions.reduce((s, p) => s + p.xAdvance, 0) * scale;
                let x = item.x + (item.align === "center" ? (item.width - advance) / 2 : item.align === "right" ? item.width - advance : 0), y = item.y + index * item.size * item.leading + item.size * .9;
                for (let i = 0; i < run.glyphs.length; i++) {
                    const p = run.positions[i], glyph = run.glyphs[i];
                    parts.push(`<path d="${glyph.path.toSVG()}" transform="translate(${x + p.xOffset * scale} ${y - p.yOffset * scale}) scale(${scale} ${-scale})" fill="${item.colour}"/>`);
                    x += p.xAdvance * scale;
                }
            }
        }
        else if (item.type === "art") {
            const paths = COLLECTION_ART[item.id] || [];
            const scale = Math.min(item.width, item.height) / 100, x = item.x + (item.width - 100 * scale) / 2, y = item.y + (item.height - 100 * scale) / 2;
            parts.push(`<g transform="translate(${x} ${y}) scale(${scale})${item.flip ? " translate(100 100) rotate(180)" : ""}">`);
            for (const path of paths)
                parts.push(`<path d="${path.d}" fill="${path.fill ? item.palette[path.fill] : "none"}"${path.stroke ? ` stroke="${item.palette[path.stroke]}" stroke-width="${path.width}" stroke-linecap="round" stroke-linejoin="round"` : ""}/>`);
            parts.push("</g>");
        }
        else if (item.type === "photo" && assets.photo) {
            const r = item.crop;
            parts.push(`<svg x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" viewBox="${r.x} ${r.y} ${r.width} ${r.height}" preserveAspectRatio="none" overflow="hidden"><image href="${assets.photo.dataUrl}" width="${assets.photo.width}" height="${assets.photo.height}"/></svg>`);
        }
    }
    parts.push("</svg>");
    return parts.join("");
}
export function scenePrintHtml(layout, metrics, assets = {}) {
    const wallet = layout.kind === "personal";
    const pages = wallet ? layout.pages : layout.pages.flatMap(page => paginateScene(page, 1460, layout.footer));
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Personal card print</title><style>@page{size:A4;margin:15mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#183248;font:18px/1.5 sans-serif}.panel{margin:0 auto 10mm;break-inside:avoid;width:${wallet ? "85.6mm" : "170mm"}}.panel svg{display:block;width:100%;height:auto}.side{font-size:12px;margin-bottom:2mm}@media print{.panel{break-inside:avoid}${wallet ? "" : ".panel+.panel{break-before:page}"}}</style></head><body>${pages.map(page => `<section class="panel"><div class="side">${xml(page.side)}${wallet ? " · 85.6 × 54 mm · print at actual size" : ""}</div>${sceneSvg(whitePaperScene(page), metrics, assets)}</section>`).join("")}</body></html>`;
}
export function whitePaperScene(page) { return { ...page, background: "#FFFFFF", items: page.items.map(i => i.type === "text" ? { ...i, colour: "#183248" } : i.type === "rect" ? { ...i, fill: i.fill === "none" ? "none" : (i.width <= 22 || i.height <= 22) ? "#2B5F87" : "#FFFFFF", stroke: i.stroke ? "#2B5F87" : undefined } : i.type === "ellipse" ? { ...i, fill: "#FFFFFF" } : i.type === "art" ? { ...i, palette: { paper: "#FFFFFF", ink: "#183248", accent: "#2B5F87", soft: "#E8EFF4" } } : i) }; }
