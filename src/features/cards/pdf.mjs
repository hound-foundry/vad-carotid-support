import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { wrapText } from "./document.mjs";

export async function createCardPdf(view, regularBytes, boldBytes) {
  const doc = await PDFDocument.create(); doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(regularBytes, { subset: true }); const bold = await doc.embedFont(boldBytes, { subset: true });
  const characters = new Set(regular.getCharacterSet());
  const allText = [view.title, view.subtitle, view.footer, ...view.fields.flatMap((f) => [f.label, f.value])].join("\n");
  for (const character of Array.from(allText)) if (!/[\n\r\t]/u.test(character) && !characters.has(character.codePointAt(0))) throw new Error("PDF cannot display some characters. Use Print card or Download text instead.");
  const ink = rgb(0.094, 0.231, 0.231), teal = rgb(0.098, 0.357, 0.345), paper = rgb(0.894, 0.941, 0.929);
  const width = 595.28, height = 841.89, margin = 44, contentWidth = width - margin * 2;
  let page, y, number = 0;
  const newPage = () => { page = doc.addPage([width, height]); number++; page.drawRectangle({ x: 26, y: 26, width: width - 52, height: height - 52, color: rgb(1,1,1), borderColor: teal, borderWidth: 1.5 }); page.drawRectangle({ x: 27, y: height - 92, width: width - 54, height: 65, color: paper }); page.drawText(view.subtitle + (number > 1 ? " · continued" : ""), { x: margin, y: height - 62, size: 14, font: bold, color: teal }); y = height - 118; };
  const line = (text, font, size, colour = ink) => { if (y < 72) newPage(); page.drawText(text, { x: margin, y, size, font, color: colour }); y -= size * 1.6; };
  const block = (text, font, size, colour = ink) => { for (const textLine of wrapText(text, contentWidth, (s) => font.widthOfTextAtSize(s, size))) line(textLine, font, size, colour); };
  newPage(); block(view.title, bold, view.kind === "milestone" ? 28 : 24); y -= 12;
  for (const item of view.fields) {
    if (y < 135) newPage();
    block(item.label, bold, 14, teal); block(item.value, regular, 17); y -= 14;
  }
  y -= 12; block(view.footer, regular, 13, ink);
  for (const sheet of doc.getPages()) {
    const footerLines = wrapText(view.footer, contentWidth, (s) => regular.widthOfTextAtSize(s, 10));
    footerLines.forEach((text, index) => sheet.drawText(text, { x: margin, y: 50 - index * 14, size: 10, font: regular, color: ink }));
  }
  // Neutral document metadata; private fields are not copied into metadata or filenames.
  doc.setTitle(view.kind === "personal" ? "Personal information card" : "Personal milestone card"); doc.setProducer("VAD & Carotid Support");
  return doc.save();
}
