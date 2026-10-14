import fontkit from "@pdf-lib/fontkit";
export function createCardMetrics(regularBytes, boldBytes, displayBytes) {
    const regular = fontkit.create(regularBytes), bold = fontkit.create(boldBytes), display = displayBytes ? fontkit.create(displayBytes) : bold;
    const fonts = { regular, bold, display };
    function resolveFont(key, text) { const font = fonts[key] || regular; return [...text].every(c => /[\n\r\t]/u.test(c) || font.hasGlyphForCodePoint(c.codePointAt(0))) ? key : "bold"; }
    function width(text, size, key = "regular") { const font = fonts[resolveFont(key, text)]; return font.layout(text).positions.reduce((sum, p) => sum + p.xAdvance, 0) * size / font.unitsPerEm; }
    return { fonts, width, resolveFont };
}
