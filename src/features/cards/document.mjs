import { formatCardText } from "./model.mjs";
import { APP_NAME } from "../../brand.mjs";
import { palette, fontStack, controlLine } from "../../components/theme.mjs";
import { cardDesign } from "./design.mjs";
import { cardArtworkSvg } from "./artwork.mjs";

export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
export function cardHtml(view) {
  const design = cardDesign(view.designId), art = cardArtworkSvg(view.artworkId, 96);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(view.title)}</title><meta name="generator" content="${escapeHtml(APP_NAME)}"><style>@page{margin:18mm}*{box-sizing:border-box}body{margin:0;font:18px/1.6 ${fontStack};color:${design.ink};background:#fff}main{max-width:740px;margin:auto;padding:28px;border:1px solid ${design.border};border-top:4px solid ${design.accent};border-radius:16px;background:${design.background}}header{display:flex;align-items:center;gap:20px;padding:20px;margin:-8px -8px 24px;border-radius:10px;background:${design.header};color:${design.headerInk}}.heading{flex:1;min-width:0}header svg{flex-shrink:0}h1{font-size:30px;line-height:1.3;margin:8px 0 0;overflow-wrap:anywhere}h2{font-size:18px;margin:18px 0 4px;color:${design.accent}}.kind{font-size:16px}.field{break-inside:avoid}p{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}footer{font-size:16px;color:${design.muted};margin-top:26px;padding-top:16px;border-top:1px solid ${design.border}}@media print{body,main,header{background:#fff!important;color:${palette.ink}!important}h1,h2,footer{color:${palette.ink}!important}main{border-radius:16px;padding:18px}.field{break-inside:auto}h2{break-after:avoid}p{orphans:3;widows:3}}</style></head><body><main aria-label="Card"><header><div class="heading"><p class="kind">${escapeHtml(view.subtitle)}</p><h1>${escapeHtml(view.title)}</h1></div>${art}</header>${view.fields.map((item) => `<section class="field"><h2>${escapeHtml(item.label)}</h2><p>${escapeHtml(item.value)}</p></section>`).join("")}<footer>${escapeHtml(view.footer)}</footer></main></body></html>`;
}
export function wrapText(text, maxWidth, measure) {
  const result = [];
  for (const paragraph of String(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if (line && measure(line + " " + word) > maxWidth) { result.push(line); line = ""; }
      if (measure(word) > maxWidth) {
        if (line) { result.push(line); line = ""; }
        for (const char of Array.from(word)) { if (line && measure(line + char) > maxWidth) { result.push(line); line = ""; } line += char; }
      } else line = line ? line + " " + word : word;
    }
    result.push(line);
  }
  return result;
}
export { formatCardText };
