import { Platform, Share } from "react-native";
import type { CardPresentation } from "./model.mjs";
import { cardHtml, formatCardText, wrapText } from "./document.mjs";
import { palette, fontStack } from "../../components/theme";
import { cardDesign } from "./design.mjs";
import { cardArtwork, ART_COLOURS } from "./artwork.mjs";
import type { CardPhotoAsset } from "./CardDraftProvider";
import { cardComposition,pagePng } from "./composition";
import { scenePrintHtml } from "./scene-svg.mjs";

export type CardFormat = "pdf" | "wallet-pdf" | "png" | "txt";
export type ExportOutcome = "downloaded" | "shared" | "cancelled";
function download(data: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type })); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function createMilestonePng(view: CardPresentation): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Image download is unavailable. Try PDF or text.");
  const design = cardDesign(view.designId), art = cardArtwork(view.artworkId);
  const width = 1200, inset = 84, contentWidth = width - inset * 2;
  const titleWidth = contentWidth - (art.id === "none" ? 0 : 200);
  const headerBlocks = [{ text: view.subtitle, size: 30, bold: false }, { text: view.title, size: 54, bold: true }].map((block) => { ctx.font = `${block.bold ? "700" : "400"} ${block.size}px ${fontStack}`; return { ...block, lines: wrapText(block.text, titleWidth, (s: string) => ctx.measureText(s).width) as string[] }; });
  const headerHeight = Math.max(art.id === "none" ? 0 : 160, headerBlocks.reduce((sum, block) => sum + block.lines.length * block.size * 1.4 + 16, 0)) + 24;
  const blocks = [...view.fields.flatMap((item) => [{ text: item.label, size: 26, bold: true }, { text: item.value, size: item.id === "displayName" || item.id === "preferredName" ? 38 : 34, bold: false }]), { text: view.footer, size: 26, bold: false }];
  const measured = blocks.map((block) => { ctx.font = `${block.bold ? "700" : "400"} ${block.size}px ${fontStack}`; return { ...block, lines: wrapText(block.text, contentWidth, (s: string) => ctx.measureText(s).width) as string[] }; });
  const height = Math.max(800, inset * 2 + headerHeight + 24 + measured.reduce((sum, block) => sum + block.lines.length * block.size * 1.6 + 28, 0));
  canvas.width = width; canvas.height = height; ctx.fillStyle = palette.paper; ctx.fillRect(0,0,width,height); ctx.fillStyle = design.background; ctx.beginPath(); ctx.roundRect(36,36,width-72,height-72,32); ctx.fill();
  ctx.strokeStyle = design.accent; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = design.header; ctx.beginPath(); ctx.roundRect(52,52,width-104,headerHeight+32,20); ctx.fill(); ctx.textBaseline = "top";
  let y = inset;
  for (const block of headerBlocks) { ctx.fillStyle = design.headerInk; ctx.font = `${block.bold ? "700" : "400"} ${block.size}px ${fontStack}`; for (const text of block.lines) { ctx.fillText(text, inset, y); y += block.size * 1.4; } y += 16; }
  if (art.id !== "none") { ctx.save(); ctx.translate(width-inset-160,inset); ctx.scale(1.6,1.6); ctx.lineCap = "round"; ctx.lineJoin = "round"; for (const path of art.paths) { const shape = new Path2D(path.d); if (path.fill) { ctx.fillStyle = ART_COLOURS[path.fill as keyof typeof ART_COLOURS]; ctx.fill(shape); } if (path.stroke) { ctx.strokeStyle = ART_COLOURS[path.stroke as keyof typeof ART_COLOURS]; ctx.lineWidth = path.width!; ctx.stroke(shape); } } ctx.restore(); }
  y = inset + headerHeight + 24;
  for (const block of measured) { ctx.fillStyle = block.bold ? design.accent : design.ink; ctx.font = `${block.bold ? "700" : "400"} ${block.size}px ${fontStack}`; for (const text of block.lines) { ctx.fillText(text, inset, y); y += block.size * 1.6; } y += 28; }
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Image could not be created. Try again or use text.")), "image/png"));
}
export async function exportCard(view: CardPresentation, format: CardFormat, options: {photo?:CardPhotoAsset|null;side?:number} = {}): Promise<ExportOutcome> {
  const filename = view.kind === "personal" ? "personal-information-card" : "personal-milestone-card";
  if (Platform.OS !== "web") {
    if (format === "txt") { const result = await Share.share({ message: formatCardText(view), title: view.kind === "personal" ? "Personal information card" : "Personal milestone card" }); return result.action === Share.dismissedAction ? "cancelled" : "shared"; }
    if (format === "png" || format === "wallet-pdf") throw new Error("Image download and wallet PDF are available on the website. Use PDF or text on this device.");
    const Print = await import("expo-print"); const Sharing = await import("expo-sharing");
    if (!await Sharing.isAvailableAsync()) throw new Error("File sharing is unavailable on this device. Use text instead.");
    const file = await Print.printToFileAsync({ html: cardHtml(view) }); await Sharing.shareAsync(file.uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" }); return "shared";
  }
  if (format === "txt") download(formatCardText(view), "text/plain;charset=utf-8", filename + ".txt");
  else if(view.templateId){
    const composition=await cardComposition(view,options.photo);
    if(format==="png"){const side=options.side??0;if(!Number.isInteger(side)||side<0||side>=composition.layout.pages.length)throw new Error("Image download is unavailable for that panel.");const page=composition.layout.pages[side];const blob=await pagePng(page,composition.metrics,composition.assets);download(blob,"image/png",filename+(view.kind==="personal"?(side===0?"-front":"-back-"+side):"")+".png");}
    else{const {createDesignedPdf}=await import("./scene-pdf.mjs");const bytes=await createDesignedPdf(view,composition.bytes,{size:format==="wallet-pdf"?"wallet":"a4",photo:composition.photo});download(bytes as BlobPart,"application/pdf",filename+(format==="wallet-pdf"?"-wallet":"")+".pdf");}
  }
  else if (format === "png") { const blob = await createMilestonePng(view); download(blob, "image/png", filename + ".png"); }
  else {
    const [{ createCardPdf }, regular, bold] = await Promise.all([import("./pdf.mjs"), fetch("/fonts/NotoSans-Regular.ttf").then((r) => { if (!r.ok) throw new Error("PDF font unavailable. Use Print card or Download text."); return r.arrayBuffer(); }), fetch("/fonts/NotoSans-Bold.ttf").then((r) => { if (!r.ok) throw new Error("PDF font unavailable. Use Print card or Download text."); return r.arrayBuffer(); })]);
    const bytes = await createCardPdf(view, regular, bold, { size: format === "wallet-pdf" ? "wallet" : view.kind === "milestone" ? "keepsake" : "a4" });
    download(bytes as BlobPart, "application/pdf", filename + (format === "wallet-pdf" ? "-wallet" : "") + ".pdf");
  }
  return "downloaded";
}
export async function printCard(view: CardPresentation, photo:CardPhotoAsset|null=null): Promise<void> {
  if (Platform.OS !== "web") { const Print = await import("expo-print"); await Print.printAsync({ html: cardHtml(view) }); return; }
  const frame = document.createElement("iframe"); frame.title = "Card print preview"; frame.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:1000px;border:0";
  const composition=view.templateId?await cardComposition(view,photo):undefined;
  const html=composition?scenePrintHtml(composition.layout,composition.metrics,composition.assets):cardHtml(view);
  await new Promise<void>((resolve, reject) => { frame.onload = () => resolve(); frame.onerror = () => reject(new Error("Print view could not open.")); frame.srcdoc = html; document.body.appendChild(frame); });
  if (!frame.contentWindow) { frame.remove(); throw new Error("Print is unavailable. Try downloading a PDF."); }
  frame.contentWindow.addEventListener("afterprint", () => frame.remove(), { once: true }); frame.contentWindow.focus(); frame.contentWindow.print();
}
