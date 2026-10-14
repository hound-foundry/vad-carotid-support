import test from "node:test";
import assert from "node:assert/strict";
import { createCardStore, coordinateCardClearing } from "../src/features/cards/storage.mjs";
import { emptyPersonalCard, emptyMilestoneCard } from "../src/features/cards/model.mjs";
import { clearProjectData, LOCAL_DATA_KEYS, onProjectDataClearing } from "../src/features/local-data/keys.mjs";

function delayedAdapter() {
  const data = new Map(); const pending = [];
  return { data, pending,
    getItem: async (key) => data.get(key) ?? null,
    setItem: (key, value) => new Promise((resolve) => pending.push(() => { data.set(key, value); resolve(); })),
    removeItem: async (key) => { data.delete(key); },
  };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("overlapping clears share one operation and keep writes paused until removal finishes", async () => {
  const adapter = delayedAdapter();
  const removals = [];
  adapter.removeItem = (key) => new Promise((resolve) => removals.push(() => {
    adapter.data.delete(key);
    resolve();
  }));
  const store = createCardStore(adapter, "personal");
  const unsubscribe = coordinateCardClearing([store]);
  try {
    const first = clearProjectData(adapter);
    const second = clearProjectData(adapter);
    assert.equal(first, second, "both callers await the same complete clear");
    await tick();
    assert.equal(removals.length, LOCAL_DATA_KEYS.length, "one removal per key");
    await assert.rejects(store.save(emptyPersonalCard()), /being cleared/);
    for (const finish of removals) finish();
    await Promise.all([first, second]);
    assert.equal(adapter.data.has(store.key), false);
    const saving = store.save(emptyPersonalCard());
    await tick();
    adapter.pending.shift()();
    await saving;
    assert.equal(adapter.data.has(store.key), true, "later explicit saves work");
  } finally { unsubscribe(); }
});

test("a failed shared clear releases its operation so the same adapter can retry", async () => {
  let unavailable = true;
  const adapter = {
    removeItem: async () => { if (unavailable) throw new Error("unavailable"); },
  };
  const first = clearProjectData(adapter), second = clearProjectData(adapter);
  assert.equal(first, second);
  await assert.rejects(first, /unavailable/);
  unavailable = false;
  const retry = clearProjectData(adapter);
  assert.notEqual(retry, first);
  await retry;
});

test("card deletion waits for an earlier asynchronous save", async () => {
  const adapter = delayedAdapter(); const store = createCardStore(adapter, "personal");
  const saving = store.save({ ...emptyPersonalCard(), preferredName: "DISPOSABLE" });
  await tick();
  const removing = store.remove();
  adapter.pending.shift()(); await Promise.all([saving, removing]);
  assert.equal(adapter.data.has(store.key), false);
});

test("clear-all drains both card saves, blocks new writes and removes their keys", async () => {
  const adapter = delayedAdapter();
  const personal = createCardStore(adapter, "personal"), milestone = createCardStore(adapter, "milestone");
  const unsubscribe = coordinateCardClearing([personal, milestone]);
  try {
    const saves = [personal.save({ ...emptyPersonalCard(), preferredName: "PRIVATE_FIXTURE" }), milestone.save({ ...emptyMilestoneCard(), message: "OTHER_FIXTURE" })];
    await tick(); let cleared = false;
    const clearing = clearProjectData(adapter).then(() => { cleared = true; });
    await tick(); assert.equal(cleared, false);
    await assert.rejects(personal.save(emptyPersonalCard()), /being cleared/);
    for (const finish of adapter.pending.splice(0)) finish();
    await Promise.all([...saves, clearing]);
    assert.equal(adapter.data.has(personal.key), false);
    assert.equal(adapter.data.has(milestone.key), false);
    const after = personal.save(emptyPersonalCard()); await tick(); adapter.pending.shift()(); await after;
    assert.equal(adapter.data.has(personal.key), true, "explicit saves remain possible after clear finishes");
  } finally { unsubscribe(); }
});

test("failed save does not prevent a later deletion", async () => {
  let removed = false;
  const store = createCardStore({ getItem: async () => null, setItem: async () => { throw new Error("unavailable"); }, removeItem: async () => { removed = true; } }, "personal");
  await assert.rejects(store.save(emptyPersonalCard()), /unavailable/);
  await store.remove(); assert.equal(removed, true);
});

test("failed clear resumes card writes without reporting successful removal", async () => {
  const data = new Map();
  const adapter = { getItem: async (key) => data.get(key), setItem: async (key, value) => data.set(key, value), removeItem: async () => { throw new Error("unavailable"); } };
  const store = createCardStore(adapter, "personal"); const unsubscribe = coordinateCardClearing([store]);
  try { await assert.rejects(clearProjectData(adapter), /unavailable/); await store.save(emptyPersonalCard()); assert.equal(data.has(store.key), true); }
  finally { unsubscribe(); }
});

test("a failing pre-clear hook releases the paused card stores", async () => {
  const data = new Map(); let removed = false;
  const adapter = { getItem: async () => null, setItem: async (key, value) => data.set(key, value), removeItem: async () => { removed = true; } };
  const store = createCardStore(adapter, "personal"); const uncoordinate = coordinateCardClearing([store]);
  const unfail = onProjectDataClearing((phase) => { if (phase === "before") throw new Error("preflight failed"); });
  try { await assert.rejects(clearProjectData(adapter), /preflight failed/); assert.equal(removed, false); await store.save(emptyPersonalCard()); assert.equal(data.has(store.key), true); }
  finally { unfail(); uncoordinate(); }
});
