import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY, emptyPersonalCard, emptyMilestoneCard, parsePersonalCard, parseMilestoneCard, serializePersonalCard, serializeMilestoneCard } from "./model.mjs";

export function createCardStore(adapter, kind) {
  const key = kind === "personal" ? PERSONAL_CARD_KEY : MILESTONE_CARD_KEY;
  const empty = kind === "personal" ? emptyPersonalCard : emptyMilestoneCard;
  const parse = kind === "personal" ? parsePersonalCard : parseMilestoneCard;
  const serialize = kind === "personal" ? serializePersonalCard : serializeMilestoneCard;
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
    async save(card) { await adapter.setItem(key, serialize(card)); },
    async remove() { await adapter.removeItem(key); },
  };
}
