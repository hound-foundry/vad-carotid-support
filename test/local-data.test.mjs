import test from "node:test";
import assert from "node:assert/strict";
import { clearProjectData, LOCAL_DATA_KEYS, onProjectDataCleared } from "../src/features/local-data/keys.mjs";
import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY } from "../src/features/cards/model.mjs";
test("clear all removes every project key, including both cards, without touching other data", async () => {
  const data = new Map(LOCAL_DATA_KEYS.map((key) => [key, "SYNTHETIC SAVED DATA"])); data.set("unrelated-key", "keep");
  assert.ok(LOCAL_DATA_KEYS.includes(PERSONAL_CARD_KEY)); assert.ok(LOCAL_DATA_KEYS.includes(MILESTONE_CARD_KEY));
  assert.equal(new Set(LOCAL_DATA_KEYS).size, 6);
  await clearProjectData({ removeItem: async (key) => { data.delete(key); } });
  assert.deepEqual([...data], [["unrelated-key", "keep"]]);
});
test("clear all notifies open tools only after deletion succeeds", async () => {
  let notified = 0;
  const unsubscribe = onProjectDataCleared(() => notified++);
  try {
    await assert.rejects(clearProjectData({ removeItem: async () => { throw Error("Unavailable"); } }));
    assert.equal(notified, 0);
    await clearProjectData({ removeItem: async () => undefined });
    assert.equal(notified, 1);
    unsubscribe();
    await clearProjectData({ removeItem: async () => undefined });
    assert.equal(notified, 1);
  } finally { unsubscribe(); }
});
