import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { wrapText } from "./document.mjs";
import { APP_NAME } from "../../brand.mjs";
import { palette } from "../../components/theme.mjs";

export async function createCardPdf(view, regularBytes, boldBytes) {
  const doc = await PDFDocument.create(); doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(regularBytes, { subset: true }); const bold = await doc.embedFont(boldBytes, { subset: true });
  const characters = new Set(regular.getCharacterSet());
  const allText = [view.title, view.subtitle, view.footer, ...view.fields.flatMap((f) => [f.label, f.value])].join("\n");
  for (const character of Array.from(allText)) if (!/[\n\r\t]/u.test(character) && !characters.has(character.codePointAt(0))) throw new Error("PDF cannot display some characters. Use Print card or Download text instead.");
  const colour = (hex) => { const values = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255); return rgb(values[0], values[1], values[2]); };
  const ink = colour(palette.ink), teal = colour(palette.teal), paper = colour(palette.mint);
  const width = 595.28, height = 841.89, margin = 44, contentWidth = width - margin * 2;
  let page, y, number = 0;
  const newPage = () => { page = doc.addPage([width, height]); number++; page.drawRectangle({ x: 26, y: 26, width: width - 52, height: height - 52, color: rgb(1,1,1), borderColor: teal, borderWidth: 1.5 }); page.drawRectangle({ x: 27, y: height - 92, width: width - 54, height: 65, color: paper }); page.drawText(view.subtitle + (number > 1 ? " · continued" : ""), { x: margin, y: height - 62, size: 14, font: bold, color: teal }); y = height - 118; };
  const line = (text, font, size, colour = ink) => { if (y < 72) newPage(); page.drawText(text, { x: margin, y, size, font, color: colour }); y -= size * 1.6; };
  const block = (text, font, size, colour = ink) => { for (const textLine of wrapText(text, contentWidth, (s) => font.widthOfTextAtSize(s, size))) line(textLine, font, size, colour); };
  newPage(); block(view.title, bold, view.kind === "milestone" ? 28 : 24); y -= 12;
  for (const item of view.fields) {
    const labelLines = wrapText(item.label, contentWidth, (s) => bold.widthOfTextAtSize(s, 14));
    // Keep the label and first value line together without an arbitrary gap
    // that strands a short final field on a new page.
    if (y - labelLines.length * 14 * 1.6 < 72) newPage();
    block(item.label, bold, 14, teal); block(item.value, regular, 17); y -= 14;
  }
  for (const sheet of doc.getPages()) {
    const footerLines = wrapText(view.footer, contentWidth, (s) => regular.widthOfTextAtSize(s, 13));
    footerLines.forEach((text, index) => sheet.drawText(text, { x: margin, y: 50 - index * 16, size: 13, font: regular, color: ink }));
  }
  // Neutral document metadata; private fields are not copied into metadata or filenames.
  doc.setTitle(view.kind === "personal" ? "Personal information card" : "Personal milestone card"); doc.setProducer(APP_NAME);
  return doc.save();
}
