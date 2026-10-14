import { PDFDocument, rgb, LineCapStyle } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { wrapText } from "./document.mjs";
import { APP_NAME } from "../../brand.mjs";
import { palette } from "../../components/theme.mjs";
import { cardDesign } from "./design.mjs";
import { cardArtwork, ART_COLOURS } from "./artwork.mjs";

export async function createCardPdf(view, regularBytes, boldBytes, { size = view.kind === "milestone" ? "keepsake" : "a4" } = {}) {
  const doc = await PDFDocument.create(); doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(regularBytes, { subset: true }); const bold = await doc.embedFont(boldBytes, { subset: true });
  const characters = new Set(regular.getCharacterSet());
  const allText = [view.title, view.subtitle, view.footer, ...view.fields.flatMap((f) => [f.label, f.value])].join("\n");
  for (const character of Array.from(allText)) if (!/[\n\r\t]/u.test(character) && !characters.has(character.codePointAt(0))) throw new Error("PDF cannot display some characters. Use Print card or Download text instead.");
  const colour = (hex) => { const values = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255); return rgb(values[0], values[1], values[2]); };
  const design = cardDesign(view.designId), art = cardArtwork(view.artworkId), wallet = size === "wallet";
  const ink = colour(design.ink), accent = colour(design.accent), muted = colour(design.muted);
  const width = wallet ? 85.6 * 72 / 25.4 : 595.28, height = wallet ? 54 * 72 / 25.4 : size === "keepsake" ? 419.53 : 841.89;
  const margin = wallet ? 12 : 44, contentWidth = width - margin * 2;
  const bodySize = wallet ? 11 : 17, labelSize = wallet ? 9.5 : 14, footerSize = wallet ? 7.5 : 13;
  const leading = wallet ? 1.25 : 1.6;
  const updated = wallet ? view.fields.find((item) => item.id === "updatedOn") : undefined;
  const footerText = view.footer + (updated ? `\n${updated.label}: ${updated.value}` : "");
  const footerLines = wrapText(footerText, contentWidth, (s) => regular.widthOfTextAtSize(s, footerSize));
  const footerBottom = wallet ? 8 : 50 - (footerLines.length - 1) * 16;
  const footerTop = footerBottom + (footerLines.length - 1) * footerSize * (wallet ? 1.2 : 16 / 13);
  const bottom = Math.max(wallet ? 28 : 72, footerTop + footerSize + (wallet ? 6 : 8));
  let page, y, number = 0;
  const drawArt = (x, top, artSize) => { for (const path of art.paths) page.drawSvgPath(path.d, { x, y: top, scale: artSize / 100, ...(path.fill ? { color: colour(ART_COLOURS[path.fill]) } : {}), ...(path.stroke ? { borderColor: colour(ART_COLOURS[path.stroke]), borderWidth: path.width, borderLineCap: LineCapStyle.Round } : {}) }); };
  const newPage = () => {
    page = doc.addPage([width, height]); number++;
    const frame = wallet ? 3 : 26;
    page.drawRectangle({ x: frame, y: frame, width: width - frame * 2, height: height - frame * 2, color: colour(design.background), borderColor: colour(design.border), borderWidth: wallet ? 0.75 : 1 });
    const headerHeight = wallet ? 24 : 65;
    page.drawRectangle({ x: frame + 1, y: height - frame - 1 - headerHeight, width: width - frame * 2 - 2, height: headerHeight, color: colour(design.header) });
    page.drawText(view.subtitle + (number > 1 ? " · continued" : ""), { x: margin, y: height - (wallet ? 18 : 62), size: wallet ? 8.5 : 14, font: bold, color: colour(design.headerInk) });
    if (art.id !== "none" && number === 1) drawArt(width - margin - (wallet ? 28 : 56), height - (wallet ? 7 : 31), wallet ? 28 : 56);
    y = height - (wallet ? 43 : 118);
  };
  const line = (text, font, textSize, textColour = ink) => { if (y < bottom) newPage(); page.drawText(text, { x: margin, y, size: textSize, font, color: textColour }); y -= textSize * leading; };
  const block = (text, font, textSize, textColour = ink, maxWidth = contentWidth) => { for (const textLine of wrapText(text, maxWidth, (s) => font.widthOfTextAtSize(s, textSize))) line(textLine, font, textSize, textColour); };
  newPage(); block(view.title, bold, wallet ? 13 : view.kind === "milestone" ? 28 : 24, ink, contentWidth - (wallet && art.id !== "none" ? 34 : 0)); y -= wallet ? 7 : 12;
  for (const item of view.fields) {
    if (wallet && item.id === "updatedOn") continue;
    const labelLines = wrapText(item.label, contentWidth, (s) => bold.widthOfTextAtSize(s, labelSize));
    // Keep the label and first value line together without an arbitrary gap
    // that strands a short final field on a new page.
    if (y - labelLines.length * labelSize * leading < bottom) newPage();
    block(item.label, bold, labelSize, accent);
    for (const textLine of wrapText(item.value, contentWidth, (s) => regular.widthOfTextAtSize(s, bodySize))) {
      if (y < bottom) { newPage(); block(item.label + " (continued)", bold, labelSize, accent); }
      line(textLine, regular, bodySize);
    }
    y -= wallet ? 7 : 14;
  }
  for (const sheet of doc.getPages()) {
    footerLines.forEach((text, index) => sheet.drawText(text, { x: margin, y: footerTop - index * footerSize * (wallet ? 1.2 : 16 / 13), size: footerSize, font: regular, color: muted }));
  }
  // Neutral document metadata; private fields are not copied into metadata or filenames.
  doc.setTitle(view.kind === "personal" ? "Personal information card" : "Personal milestone card"); doc.setProducer(APP_NAME);
  return doc.save();
}
