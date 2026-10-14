// @ts-check
import { STORAGE_KEY, parseAppointmentSheet, serializeAppointmentSheet } from "./model.mjs";

/** @param {{getItem:(key:string)=>Promise<string|null>,setItem:(key:string,value:string)=>Promise<void>,removeItem:(key:string)=>Promise<void>}} adapter */
export function createAppointmentStore(adapter) {
  return {
    async load() { return parseAppointmentSheet(await adapter.getItem(STORAGE_KEY)); },
    async save(sheet) { await adapter.setItem(STORAGE_KEY, serializeAppointmentSheet(sheet)); },
    async remove() { await adapter.removeItem(STORAGE_KEY); },
  };
}
