import test from "node:test";
import assert from "node:assert/strict";
import { createSavedGuidesStore } from "../src/features/saved-guides/storage.mjs";
import { emptySavedGuides, formatSavedGuidesExport, parseSavedGuides, serializeSavedGuides, STORAGE_KEY } from "../src/features/saved-guides/model.mjs";

test("new reading list is empty", () => {
  assert.deepEqual(emptySavedGuides(), []);
});

test("saved guide slugs round-trip once and discard malformed values", () => {
  const value = serializeSavedGuides(["tests-and-terms", "bad/route", "tests-and-terms", 4]);
  assert.deepEqual(parseSavedGuides(value), ["tests-and-terms"]);
});

test("malformed, oversized, and unsupported saved lists fail closed", () => {
  assert.deepEqual(parseSavedGuides("not json"), []);
  assert.deepEqual(parseSavedGuides("x".repeat(5000)), []);
  assert.deepEqual(parseSavedGuides(JSON.stringify({ version: 2, slugs: ["understanding-dissection"] })), []);
});

test("export lists only the guides explicitly provided", () => {
  const exported = formatSavedGuidesExport([{ slug: "tests-and-terms", title: "Tests and terms" }], "https://support.example/");
  assert.ok(exported.includes("Tests and terms"));
  assert.ok(exported.includes("https://support.example/guide/tests-and-terms"));
  assert.ok(!exported.includes("understanding-dissection"));
});

test("saved guides change only after explicit save and delete clears device storage", async () => {
  const memory = new Map();
  const store = createSavedGuidesStore({
    async getItem(key) { return memory.get(key) ?? null; },
    async setItem(key, value) { memory.set(key, value); },
    async removeItem(key) { memory.delete(key); },
  });
  assert.deepEqual(await store.load(), []);
  assert.equal(memory.has(STORAGE_KEY), false);
  await store.save(["tests-and-terms"]);
  assert.deepEqual(await store.load(), ["tests-and-terms"]);
  await store.remove();
  assert.equal(memory.has(STORAGE_KEY), false);
  assert.deepEqual(await store.load(), []);
});
