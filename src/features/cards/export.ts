import { Platform, Share } from "react-native";
import type { CardPresentation } from "./model.mjs";
import { cardHtml, formatCardText, wrapText } from "./document.mjs";

export type CardFormat = "pdf" | "png" | "txt";
export type ExportOutcome = "downloaded" | "shared" | "cancelled";
function download(data: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type })); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function createMilestonePng(view: CardPresentation): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Image download is unavailable. Try PDF or text.");
  const width = 1200, inset = 84, contentWidth = width - inset * 2;
  const blocks = [{ text: view.subtitle, size: 30, bold: true }, { text: view.title, size: 54, bold: true }, ...view.fields.flatMap((item) => [{ text: item.label, size: 26, bold: true }, { text: item.value, size: item.id === "displayName" ? 38 : 34, bold: item.id === "displayName" }]), { text: view.footer, size: 26, bold: false }];
  const measured = blocks.map((block) => { ctx.font = `${block.bold ? "700" : "400"} ${block.size}px system-ui,sans-serif`; return { ...block, lines: wrapText(block.text, contentWidth, (s: string) => ctx.measureText(s).width) as string[] }; });
  const height = Math.max(800, inset * 2 + measured.reduce((sum, block) => sum + block.lines.length * block.size * 1.6 + 28, 0));
  canvas.width = width; canvas.height = height; ctx.fillStyle = "#E4F0ED"; ctx.fillRect(0,0,width,height); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.roundRect(36,36,width-72,height-72,32); ctx.fill();
  ctx.strokeStyle = "#26736E"; ctx.lineWidth = 4; ctx.stroke(); ctx.textBaseline = "top";
  let y = inset;
  for (const block of measured) { ctx.fillStyle = "#183B3B"; ctx.font = `${block.bold ? "700" : "400"} ${block.size}px system-ui,sans-serif`; for (const text of block.lines) { ctx.fillText(text, inset, y); y += block.size * 1.6; } y += 28; }
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Image could not be created. Try again or use text.")), "image/png"));
}
export async function exportCard(view: CardPresentation, format: CardFormat): Promise<ExportOutcome> {
  const filename = view.kind === "personal" ? "personal-information-card" : "personal-milestone-card";
  if (Platform.OS !== "web") {
    if (format === "txt") { const result = await Share.share({ message: formatCardText(view), title: view.kind === "personal" ? "Personal information card" : "Personal milestone card" }); return result.action === Share.dismissedAction ? "cancelled" : "shared"; }
    if (format === "png") throw new Error("Image download is available on the website. Use PDF or text on this device.");
    const Print = await import("expo-print"); const Sharing = await import("expo-sharing");
    if (!await Sharing.isAvailableAsync()) throw new Error("File sharing is unavailable on this device. Use text instead.");
    const file = await Print.printToFileAsync({ html: cardHtml(view) }); await Sharing.shareAsync(file.uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" }); return "shared";
  }
  if (format === "txt") download(formatCardText(view), "text/plain;charset=utf-8", filename + ".txt");
  else if (format === "png") { const blob = await createMilestonePng(view); download(blob, "image/png", filename + ".png"); }
  else {
    const [{ createCardPdf }, regular, bold] = await Promise.all([import("./pdf.mjs"), fetch("/fonts/NotoSans-Regular.ttf").then((r) => { if (!r.ok) throw new Error("PDF font unavailable. Use Print card or Download text."); return r.arrayBuffer(); }), fetch("/fonts/NotoSans-Bold.ttf").then((r) => { if (!r.ok) throw new Error("PDF font unavailable. Use Print card or Download text."); return r.arrayBuffer(); })]);
    const bytes = await createCardPdf(view, regular, bold);
    download(bytes as BlobPart, "application/pdf", filename + ".pdf");
  }
  return "downloaded";
}
export async function printCard(view: CardPresentation): Promise<void> {
  if (Platform.OS !== "web") { const Print = await import("expo-print"); await Print.printAsync({ html: cardHtml(view) }); return; }
  const frame = document.createElement("iframe"); frame.title = "Card print preview"; frame.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:1000px;border:0";
  await new Promise<void>((resolve, reject) => { frame.onload = () => resolve(); frame.onerror = () => reject(new Error("Print view could not open.")); frame.srcdoc = cardHtml(view); document.body.appendChild(frame); });
  if (!frame.contentWindow) { frame.remove(); throw new Error("Print is unavailable. Try downloading a PDF."); }
  frame.contentWindow.addEventListener("afterprint", () => frame.remove(), { once: true }); frame.contentWindow.focus(); frame.contentWindow.print();
}
