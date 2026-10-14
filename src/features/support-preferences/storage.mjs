// @ts-check
import { STORAGE_KEY, parseSupportPreferences, serializeSupportPreferences } from "./model.mjs";

/** @param {{getItem:(key:string)=>Promise<string|null>,setItem:(key:string,value:string)=>Promise<void>,removeItem:(key:string)=>Promise<void>}} adapter */
export function createSupportPreferencesStore(adapter) {
  return {
    async load() { return parseSupportPreferences(await adapter.getItem(STORAGE_KEY)); },
    async save(sheet) { await adapter.setItem(STORAGE_KEY, serializeSupportPreferences(sheet)); },
    async remove() { await adapter.removeItem(STORAGE_KEY); },
  };
}
