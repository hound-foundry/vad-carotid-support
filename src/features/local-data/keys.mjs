import { STORAGE_KEY as appointments } from "../appointments/model.mjs";
import { STORAGE_KEY as support } from "../support-preferences/model.mjs";
import { STORAGE_KEY as guides } from "../saved-guides/model.mjs";
import { STORAGE_KEY as accessibility } from "../accessibility/model.mjs";
import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY } from "../cards/model.mjs";
export const LOCAL_DATA_KEYS = [appointments, support, guides, accessibility, PERSONAL_CARD_KEY, MILESTONE_CARD_KEY];
const clearedListeners = new Set();
const clearingListeners = new Set();
/** @param {()=>void|Promise<void>} listener */
export function onProjectDataCleared(listener) { clearedListeners.add(listener); return () => { clearedListeners.delete(listener); }; }
/** @param {(phase:"before"|"after"|"failed")=>void|Promise<void>} listener */
export function onProjectDataClearing(listener) { clearingListeners.add(listener); return () => { clearingListeners.delete(listener); }; }
export async function clearProjectData(adapter) {
  try {
    await Promise.all([...clearingListeners].map((listener) => listener("before")));
    const results = await Promise.allSettled(LOCAL_DATA_KEYS.map((key) => adapter.removeItem(key)));
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") throw failure.reason;
    for (const listener of clearedListeners) await listener();
    await Promise.all([...clearingListeners].map((listener) => listener("after")));
  } catch (error) {
    await Promise.all([...clearingListeners].map((listener) => listener("failed")));
    throw error;
  }
}
