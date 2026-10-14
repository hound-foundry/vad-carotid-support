// @ts-check
import { STORAGE_KEY, parseSavedGuides, serializeSavedGuides } from "./model.mjs";

/** @param {{getItem:(key:string)=>Promise<string|null>,setItem:(key:string,value:string)=>Promise<void>,removeItem:(key:string)=>Promise<void>}} adapter */
export function createSavedGuidesStore(adapter) {
  return {
    async load() { return parseSavedGuides(await adapter.getItem(STORAGE_KEY)); },
    /** @param {string[]} slugs */
    async save(slugs) { await adapter.setItem(STORAGE_KEY, serializeSavedGuides(slugs)); },
    async remove() { await adapter.removeItem(STORAGE_KEY); },
  };
}
