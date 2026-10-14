import test from "node:test";
import assert from "node:assert/strict";
import { createSheetDraftSession, getSheetDraftSession, getSheetDraftStatuses, subscribeToSheetDraftStatuses } from "../src/features/sheets/drafts.mjs";
import { clearProjectData } from "../src/features/local-data/keys.mjs";

const empty = () => ({ selectedIds: [], note: "" });
const isEmpty = (value) => value.selectedIds.length === 0 && value.note.length === 0;
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

test("an edit made during hydration wins over the slower stored value", async () => {
  const loading = deferred();
  const session = createSheetDraftSession("test-hydration", {
    empty, isEmpty, load: () => loading.promise, async save() {}, async remove() {},
  });
  session.hydrate();
  session.edit({ selectedIds: ["new"], note: "typed before load" });
  loading.resolve({ selectedIds: ["old"], note: "saved earlier" });
  await loading.promise;
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(session.getSnapshot().value, { selectedIds: ["new"], note: "typed before load" });
  assert.equal(session.getSnapshot().status, "unsaved");
  session.dispose();
});

test("guide suggestions apply only to a pristine blank sheet", async () => {
  const blank = createSheetDraftSession("test-suggestion-blank", {
    empty, isEmpty, async load() { return empty(); }, async save() {}, async remove() {},
  });
  blank.hydrate(() => ({ selectedIds: ["suggested"], note: "" }));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(blank.getSnapshot().value.selectedIds, ["suggested"]);
  assert.equal(blank.getSnapshot().status, "unsaved");

  const populated = createSheetDraftSession("test-suggestion-populated", {
    empty, isEmpty, async load() { return { selectedIds: ["existing"], note: "existing note" }; }, async save() {}, async remove() {},
  });
  populated.hydrate(() => ({ selectedIds: ["suggested"], note: "" }));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(populated.getSnapshot().value, { selectedIds: ["existing"], note: "existing note" });
  assert.equal(populated.getSnapshot().status, "restored");

  const resumed = createSheetDraftSession("test-suggestion-resumed", {
    empty, isEmpty, async load() { return empty(); }, async save() {}, async remove() {},
  });
  resumed.hydrate();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(resumed.applySuggestion({ selectedIds: ["later-guide"], note: "" }), true);
  assert.equal(resumed.applySuggestion({ selectedIds: ["another-guide"], note: "" }), false);
  assert.deepEqual(resumed.getSnapshot().value.selectedIds, ["later-guide"]);
  blank.dispose();
  populated.dispose();
  resumed.dispose();
});

test("clear-all waits for an in-flight save, then clears memory and storage", async () => {
  const storageKey = "vad-carotid-support.appointment-sheet.v1";
  const write = deferred();
  const stored = new Map();
  const session = createSheetDraftSession("test-clear", {
    empty, isEmpty, async load() { return empty(); },
    async save(value) { await write.promise; stored.set(storageKey, value); },
    async remove() { stored.delete(storageKey); },
  });
  session.edit({ selectedIds: ["private"], note: "draft" });
  const saving = session.save();
  await new Promise((resolve) => setImmediate(resolve));
  let removed = false;
  const clearing = clearProjectData({ async removeItem(key) { if (key === storageKey) { stored.delete(key); removed = true; } } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(removed, false);
  write.resolve();
  await Promise.all([saving, clearing]);
  assert.equal(removed, true);
  assert.equal(stored.has(storageKey), false);
  assert.deepEqual(session.getSnapshot().value, empty());
  assert.equal(session.getSnapshot().status, "cleared");
  session.dispose();
});

test("delete invalidates a pending load and resets the sheet", async () => {
  const loading = deferred();
  let deleted = false;
  const session = createSheetDraftSession("test-delete", {
    empty, isEmpty, load: () => loading.promise, async save() {}, async remove() { deleted = true; },
  });
  session.hydrate();
  assert.equal(await session.remove(), true);
  loading.resolve({ selectedIds: ["old"], note: "old" });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(deleted, true);
  assert.deepEqual(session.getSnapshot().value, empty());
  assert.equal(session.getSnapshot().status, "blank");
  session.dispose();
});

test("saved-hub summaries expose truthful state without draft contents", async () => {
  const session = getSheetDraftSession("test-hub-summary", {
    empty, isEmpty, async load() { return empty(); }, async save() {}, async remove() {},
  });
  let notifications = 0;
  const unsubscribe = subscribeToSheetDraftStatuses(() => { notifications += 1; });
  session.hydrate();
  await new Promise((resolve) => setImmediate(resolve));
  session.edit({ selectedIds: ["private"], note: "sensitive note" });
  const summary = getSheetDraftStatuses().find((item) => item.id === "test-hub-summary");
  assert.equal(summary.status, "unsaved");
  assert.equal(summary.hasContent, true);
  assert.equal(summary.dirty, true);
  assert.equal("value" in summary, false);
  assert.ok(notifications >= 2);
  unsubscribe();
});

test("editing never saves automatically and a failed explicit save keeps the draft for retry", async () => {
  let writes = 0;
  const session = createSheetDraftSession("test-save-failure", {
    empty, isEmpty, async load() { return empty(); },
    async save() { writes += 1; if (writes === 1) throw Error("Unavailable"); },
    async remove() {},
  });
  session.hydrate();
  await new Promise((resolve) => setImmediate(resolve));
  session.edit({ selectedIds: ["synthetic-choice"], note: "SYNTHETIC PRIVATE NOTE" });
  assert.equal(writes, 0);
  assert.equal(await session.save(), false);
  assert.equal(session.getSnapshot().status, "save-failed");
  assert.equal(session.getSnapshot().value.note, "SYNTHETIC PRIVATE NOTE");
  assert.equal(await session.save(), true);
  assert.equal(session.getSnapshot().status, "saved");
  session.dispose();
});

test("failed deletion preserves the current sheet and does not report it deleted", async () => {
  const session = createSheetDraftSession("test-delete-failure", {
    empty, isEmpty, async load() { return empty(); }, async save() {},
    async remove() { throw Error("Unavailable"); },
  });
  session.edit({ selectedIds: ["synthetic-choice"], note: "SYNTHETIC PRIVATE NOTE" });
  assert.equal(await session.remove(), false);
  assert.equal(session.getSnapshot().status, "delete-failed");
  assert.equal(session.getSnapshot().value.note, "SYNTHETIC PRIVATE NOTE");
  session.dispose();
});
