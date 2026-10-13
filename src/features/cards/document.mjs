import { formatCardText } from "./model.mjs";

export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
export function cardHtml(view) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(view.title)}</title><style>@page{margin:18mm}*{box-sizing:border-box}body{margin:0;font:18px/1.6 system-ui,sans-serif;color:#183B3B;background:#fff}main{max-width:740px;margin:auto;padding:28px;border:2px solid #26736E;border-radius:24px}h1{font-size:30px;line-height:1.3;margin:8px 0 24px}h2{font-size:18px;margin:18px 0 4px}.kind{font-size:16px;color:#195B58}.field{break-inside:avoid}p{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}footer{font-size:16px;margin-top:26px;padding-top:14px;border-top:1px solid #657C73} @media print{main{border-radius:16px;padding:18px}.field{break-inside:auto}h2{break-after:avoid}p{orphans:3;widows:3}}</style></head><body><main aria-label="Card"><p class="kind">${escapeHtml(view.subtitle)}</p><h1>${escapeHtml(view.title)}</h1>${view.fields.map((item) => `<section class="field"><h2>${escapeHtml(item.label)}</h2><p>${escapeHtml(item.value)}</p></section>`).join("")}<footer>${escapeHtml(view.footer)}</footer></main></body></html>`;
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
