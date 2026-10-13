import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY, emptyPersonalCard, emptyMilestoneCard, parsePersonalCard, parseMilestoneCard, serializePersonalCard, serializeMilestoneCard } from "./model.mjs";
import { onProjectDataClearing } from "../local-data/keys.mjs";

export function createCardStore(adapter, kind) {
  const key = kind === "personal" ? PERSONAL_CARD_KEY : MILESTONE_CARD_KEY;
  const empty = kind === "personal" ? emptyPersonalCard : emptyMilestoneCard;
  const parse = kind === "personal" ? parsePersonalCard : parseMilestoneCard;
  const serialize = kind === "personal" ? serializePersonalCard : serializeMilestoneCard;
  let tail = Promise.resolve();
  let clearing = false;
  const write = (operation) => {
    if (clearing) return Promise.reject(new Error("Saved data is being cleared. Try again afterwards."));
    const result = tail.then(operation);
    tail = result.catch(() => undefined);
    return result;
  };
  return {
    key,
    async loadRecord() {
      const raw = await adapter.getItem(key);
      if (raw == null) return { card: empty(), status: "absent" };
      let valid = false;
      try { const value = JSON.parse(raw); valid = raw.length <= 10000 && value?.version === 1 && value.card != null && typeof value.card === "object" && !Array.isArray(value.card); } catch { /* No private data in errors or logs. */ }
      return { card: valid ? parse(raw) : empty(), status: valid ? "restored" : "invalid" };
    },
    async load() { return (await this.loadRecord()).card; },
    save(card) { const snapshot = serialize(card); return write(() => adapter.setItem(key, snapshot)); },
    remove() { return write(() => adapter.removeItem(key)); },
    pauseWrites() { clearing = true; },
    resumeWrites() { clearing = false; },
    drain() { return tail; },
  };
}

/** Pause new writes and finish existing writes before the six keys are removed. */
export function coordinateCardClearing(stores) {
  return onProjectDataClearing(async (phase) => {
    if (phase === "before") {
      for (const store of stores) store.pauseWrites();
      await Promise.all(stores.map((store) => store.drain()));
    } else {
      for (const store of stores) store.resumeWrites();
    }
  });
}
