import { validPhotoRef } from "./model.mjs";
export const PHOTO_DATABASE = "dissection-companion-card-photos";
export const PHOTO_STORE = "photos";
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
let opening;
function database() {
    if (!globalThis.indexedDB)
        return Promise.reject(new Error("Photo storage is unavailable. You can still preview and download without saving."));
    if (opening)
        return opening;
    opening = new Promise((resolve, reject) => { const req = globalThis.indexedDB.open(PHOTO_DATABASE, 1); req.onupgradeneeded = () => { const store = req.result.createObjectStore(PHOTO_STORE, { keyPath: "id" }); store.createIndex("owner", "owner"); }; req.onerror = () => reject(new Error("Photo storage could not open.")); req.onblocked = () => reject(new Error("Photo storage is busy. Close other app tabs and try again.")); req.onsuccess = () => { const db = req.result; db.onversionchange = () => { db.close(); opening = undefined; }; resolve(db); }; }).catch(error => { opening = undefined; throw error; });
    return opening;
}
async function transaction(mode, action) { const db = await database(); return new Promise((resolve, reject) => { const tx = db.transaction(PHOTO_STORE, mode), store = tx.objectStore(PHOTO_STORE); let value; tx.oncomplete = () => resolve(value); tx.onabort = tx.onerror = () => reject(new Error("Photo storage could not complete the operation.")); try {
    action(store, v => { value = v; });
}
catch {
    tx.abort();
} }); }
export function validPhotoAsset(value) { return !!value && validPhotoRef(value.id) && value.blob instanceof Blob && value.blob.type === "image/jpeg" && value.blob.size > 0 && value.blob.size <= 3 * 1024 * 1024 && Number.isInteger(value.width) && value.width > 0 && value.width <= 1280 && Number.isInteger(value.height) && value.height > 0 && value.height <= 1280; }
async function checkSavedPhoto(value) {
    let source, url;
    try {
        if (typeof createImageBitmap === "function") source = await createImageBitmap(value.blob);
        else {
            url = URL.createObjectURL(value.blob);
            source = await new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = url;
            });
        }
        if ((source.naturalWidth || source.width) !== value.width || (source.naturalHeight || source.height) !== value.height) throw new Error("Invalid photo dimensions");
    } catch { throw new Error("The saved photo could not be read."); }
    finally { source?.close?.(); if (url) URL.revokeObjectURL(url); }
}
export const cardPhotoStore = {
    async get(id, owner) { if (!validPhotoRef(id))
        return null; const value = await transaction("readonly", (store, set) => { const r = store.get(id); r.onsuccess = () => set(r.result); }); if (!value)
        return null; if (value.version !== 1 || value.owner !== owner || !validPhotoAsset(value))
        throw new Error("The saved photo could not be read."); const magic = new Uint8Array(await value.blob.slice(0, 3).arrayBuffer()); if (magic[0] !== 255 || magic[1] !== 216 || magic[2] !== 255)
        throw new Error("The saved photo could not be read."); await checkSavedPhoto(value); return { id: value.id, blob: value.blob, width: value.width, height: value.height }; },
    put(photo, owner) { if (!["personal", "milestone"].includes(owner) || !validPhotoAsset(photo))
        return Promise.reject(new Error("The photo could not be saved.")); return transaction("readwrite", store => store.put({ ...photo, owner, version: 1 })); },
    remove(id, owner) { return transaction("readwrite", store => { const r = store.get(id); r.onsuccess = () => { if (r.result?.owner === owner)
        store.delete(id); }; }); },
    async removeOwner(owner) { if (!globalThis.indexedDB)
        return; if (!opening && typeof globalThis.indexedDB.databases === "function") {
        const names = await globalThis.indexedDB.databases();
        if (!names.some(value => value.name === PHOTO_DATABASE))
            return;
    } return transaction("readwrite", store => { const r = store.index("owner").openCursor(IDBKeyRange.only(owner)); r.onsuccess = () => { const cursor = r.result; if (cursor) {
        cursor.delete();
        cursor.continue();
    } }; }); },
    // Avoid creating a new database just to clear a profile that never saved photos.
    async clear() { if (!globalThis.indexedDB)
        return; if (!opening && typeof globalThis.indexedDB.databases === "function") {
        const names = await globalThis.indexedDB.databases();
        if (!names.some(value => value.name === PHOTO_DATABASE))
            return;
    } await transaction("readwrite", store => store.clear()); },
};
export async function normalisePhoto(file) {
    const fail = () => new Error("Choose a JPEG, PNG or WebP image up to 10 MB. Your previous photo is unchanged.");
    if (!(file instanceof Blob) || !file.size || file.size > PHOTO_MAX_BYTES || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw fail();
    const magic = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const jpeg = magic[0] === 255 && magic[1] === 216, png = magic[0] === 137 && magic[1] === 80 && magic[2] === 78 && magic[3] === 71, webp = String.fromCharCode(...magic.slice(0, 4)) === "RIFF" && String.fromCharCode(...magic.slice(8, 12)) === "WEBP";
    if (!(jpeg || png || webp))
        throw fail();
    let source, url;
    try {
        if (typeof createImageBitmap === "function")
            source = await createImageBitmap(file, { imageOrientation: "from-image" });
        else {
            url = URL.createObjectURL(file);
            source = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(fail()); image.src = url; });
        }
        const sw = source.width || source.naturalWidth, sh = source.height || source.naturalHeight;
        if (!sw || !sh || sw * sh > 64000000)
            throw fail();
        const scale = Math.min(1, 1280 / Math.max(sw, sh)), canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(sw * scale));
        canvas.height = Math.max(1, Math.round(sh * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw fail();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(fail()), "image/jpeg", .88));
        const random = new Uint8Array(16);
        globalThis.crypto.getRandomValues(random);
        const id = "photo-" + [...random].map(n => n.toString(16).padStart(2, "0")).join("");
        const result = { id, blob, width: canvas.width, height: canvas.height };
        if (!validPhotoAsset(result))
            throw fail();
        return result;
    }
    catch {
        throw fail();
    }
    finally {
        source?.close?.();
        if (url)
            URL.revokeObjectURL(url);
    }
}
