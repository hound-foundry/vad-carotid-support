import { STORAGE_KEY as appointments } from "../appointments/model.mjs";
import { STORAGE_KEY as support } from "../support-preferences/model.mjs";
import { STORAGE_KEY as guides } from "../saved-guides/model.mjs";
import { STORAGE_KEY as accessibility } from "../accessibility/model.mjs";
import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY } from "../cards/model.mjs";
export const LOCAL_DATA_KEYS = [appointments, support, guides, accessibility, PERSONAL_CARD_KEY, MILESTONE_CARD_KEY];
export const LOCAL_DATA_RESOURCES = [{id:"card-photos",storage:"indexeddb",database:"dissection-companion-card-photos",store:"photos"}];
const resourceClearers = new Map();
export function registerLocalDataResource(id,clear){if(!LOCAL_DATA_RESOURCES.some(resource=>resource.id===id))throw new Error("Unknown local data resource");resourceClearers.set(id,clear);return ()=>{if(resourceClearers.get(id)===clear)resourceClearers.delete(id);};}
const clearedListeners = new Set();
const clearingListeners = new Set();
const activeClears = new WeakMap();
/** @param {()=>void|Promise<void>} listener */
export function onProjectDataCleared(listener) { clearedListeners.add(listener); return () => { clearedListeners.delete(listener); }; }
/** @param {(phase:"before"|"after"|"failed")=>void|Promise<void>} listener */
export function onProjectDataClearing(listener) { clearingListeners.add(listener); return () => { clearingListeners.delete(listener); }; }
/** Share overlapping requests so one caller cannot resume writes mid-clear. */
export function clearProjectData(adapter) {
  const current = activeClears.get(adapter);
  if (current) return current;

  const operation = Promise.resolve().then(() => performClear(adapter));
  activeClears.set(adapter, operation);
  const release = () => { activeClears.delete(adapter); };
  void operation.then(release, release);
  return operation;
}

async function performClear(adapter) {
  try {
    await Promise.all([...clearingListeners].map((listener) => listener("before")));
    const operations=[...LOCAL_DATA_KEYS.map(key=>()=>adapter.removeItem(key)),...resourceClearers.values()];
    const results = await Promise.allSettled(operations.map(operation=>Promise.resolve().then(operation)));
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") throw failure.reason;
    for (const listener of clearedListeners) await listener();
    await Promise.all([...clearingListeners].map((listener) => listener("after")));
  } catch (error) {
    await Promise.all([...clearingListeners].map((listener) => listener("failed")));
    throw error;
  }
}
