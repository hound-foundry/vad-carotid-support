import type { CardPresentation } from "./model.mjs";
import type { CardPhotoAsset } from "./CardDraftProvider";
import { buildCardLayout } from "./layout.mjs";
import { sceneSvg } from "./scene-svg.mjs";
import { resolveTemplate } from "./templates.mjs";
let resources: Promise<any> | undefined;
const fetchBytes = async (path: string) => { const response = await fetch(path); if (!response.ok)
    throw new Error("Card artwork or font unavailable. Try again or use text."); return new Uint8Array(await response.arrayBuffer()); };
const dataUrl = (blob: Blob): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("The photo could not be read. Replace or remove it.")); reader.readAsDataURL(blob); });
export function loadCardResources() {
    if (!resources)
        resources = Promise.all([fetchBytes("/fonts/NotoSans-Regular.ttf"), fetchBytes("/fonts/NotoSans-Bold.ttf"), fetchBytes("/fonts/barlow/BarlowCondensed-Bold.ttf")]).then(async ([regular, bold, display]) => { const { createCardMetrics } = await import("./metrics.mjs"); return { bytes: { regular, bold, display }, metrics: createCardMetrics(regular, bold, display) }; }).catch(error => { resources = undefined; throw error; });
    return resources;
}
export async function cardComposition(view: CardPresentation, photo: CardPhotoAsset | null = null) {
    const r = await loadCardResources(), template = resolveTemplate(view);
    const usesPhoto = !!template?.photo && !!view.photoRef;
    if (usesPhoto && (!photo || photo.id !== view.photoRef))
        throw new Error("The photo is unavailable. Replace or remove it before a visual export.");
    const image = usesPhoto && photo ? { id: photo.id, width: photo.width, height: photo.height, bytes: new Uint8Array(await photo.blob.arrayBuffer()), dataUrl: await dataUrl(photo.blob) } : undefined;
    const layout = buildCardLayout(view, r.metrics, { photo: image });
    if (!layout)
        throw new Error("Choose a designed template before creating this output.");
    return { layout, metrics: r.metrics, bytes: r.bytes, assets: { photo: image }, photo: image };
}
export async function pagePng(page: any, metrics: any, assets: any): Promise<Blob> {
    const url = URL.createObjectURL(new Blob([sceneSvg(page, metrics, assets)], { type: "image/svg+xml;charset=utf-8" }));
    try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error("Image could not be created. Try PDF or text.")); img.src = url; });
        const canvas = document.createElement("canvas");
        canvas.width = page.width;
        canvas.height = page.height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Image download is unavailable. Try PDF or text.");
        ctx.drawImage(image, 0, 0);
        return await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Image could not be created. Try PDF or text.")), "image/png"));
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
