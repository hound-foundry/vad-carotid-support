import { STORAGE_KEY as appointments } from "../appointments/model.mjs";
import { STORAGE_KEY as support } from "../support-preferences/model.mjs";
import { STORAGE_KEY as guides } from "../saved-guides/model.mjs";
import { STORAGE_KEY as accessibility } from "../accessibility/model.mjs";
import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY } from "../cards/model.mjs";
export const LOCAL_DATA_KEYS = [appointments, support, guides, accessibility, PERSONAL_CARD_KEY, MILESTONE_CARD_KEY];
const clearedListeners = new Set();
export function onProjectDataCleared(listener) { clearedListeners.add(listener); return () => { clearedListeners.delete(listener); }; }
export async function clearProjectData(adapter) {
  await Promise.all(LOCAL_DATA_KEYS.map((key) => adapter.removeItem(key)));
  for (const listener of clearedListeners) listener();
}
