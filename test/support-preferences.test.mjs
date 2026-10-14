import test from "node:test";
import assert from "node:assert/strict";
import { emptySupportPreferences, formatSupportPreferencesExport, guidePreferenceSuggestions, MAX_NOTE_LENGTH, parseSupportPreferences, serializeSupportPreferences, STORAGE_KEY, supportPreferences } from "../src/features/support-preferences/model.mjs";
import { createSupportPreferencesStore } from "../src/features/support-preferences/storage.mjs";

test("new support sheet is empty and contains no personal identifiers", () => {
  assert.deepEqual(emptySupportPreferences(), { selectedIds: [], note: "" });
});

test("guide support suggestions use only known preference ids", () => {
  const knownIds = new Set(supportPreferences.map((item) => item.id));
  for (const [guide, ids] of Object.entries(guidePreferenceSuggestions)) {
    assert.ok(guide.length > 0);
    assert.ok(ids.length > 0);
    assert.ok(ids.every((id) => knownIds.has(id)), `${guide} contains an unknown preference`);
  }
});

test("saved data accepts only known unique choices and bounds notes", () => {
  const parsed = parseSupportPreferences(JSON.stringify({ version: 1, selectedIds: ["one-question", "unknown", "one-question", 5], note: "x".repeat(MAX_NOTE_LENGTH + 30) }));
  assert.deepEqual(parsed.selectedIds, ["one-question"]);
  assert.equal(parsed.note.length, MAX_NOTE_LENGTH);
  assert.deepEqual(parseSupportPreferences(serializeSupportPreferences(parsed)), parsed);
});

test("malformed, oversized, and unsupported storage values fail closed", () => {
  assert.deepEqual(parseSupportPreferences("not json"), emptySupportPreferences());
  assert.deepEqual(parseSupportPreferences("x".repeat(5000)), emptySupportPreferences());
  assert.deepEqual(parseSupportPreferences(JSON.stringify({ version: 2, selectedIds: ["one-question"], note: "private" })), emptySupportPreferences());
});

test("export contains only selected preferences and the optional note", () => {
  const exported = formatSupportPreferencesExport({ selectedIds: ["one-question"], note: "Ask before talking over me." });
  assert.ok(exported.includes(supportPreferences.find((item) => item.id === "one-question").text));
  assert.ok(exported.includes("Ask before talking over me."));
  assert.ok(!exported.includes(supportPreferences.find((item) => item.id === "plain-language").text));
  assert.ok(exported.includes("not a medical or emergency plan"));
  assert.ok(!exported.includes("http"));
});

test("empty export makes no selections on the user's behalf", () => {
  const exported = formatSupportPreferencesExport(emptySupportPreferences());
  assert.ok(exported.includes("Choose any statements that feel right for you."));
  assert.ok(!supportPreferences.some((item) => exported.includes(item.text)));
});

test("storage changes only on explicit save and delete clears the stored sheet", async () => {
  const memory = new Map();
  const store = createSupportPreferencesStore({
    async getItem(key) { return memory.get(key) ?? null; },
    async setItem(key, value) { memory.set(key, value); },
    async removeItem(key) { memory.delete(key); },
  });
  assert.deepEqual(await store.load(), emptySupportPreferences());
  assert.equal(memory.has(STORAGE_KEY), false);
  await store.save({ selectedIds: ["offer-help"], note: "Synthetic test note" });
  assert.equal((await store.load()).note, "Synthetic test note");
  await store.remove();
  assert.equal(memory.has(STORAGE_KEY), false);
  assert.deepEqual(await store.load(), emptySupportPreferences());
});
