import test from "node:test";
import assert from "node:assert/strict";
import { clampPageIndex, effectiveOneAtATime, emptyReadingSession, normalizeGuideLibrarySession, normalizeReadingSession, setReadingModeOverride, setReadingPage } from "../src/features/reading-session/model.mjs";
import { clearReadingSessions, getGuideLibrarySession, getReadingSession, getSheetView, updateSheetView, setReadingModeForGuide, setReadingPageForGuide, subscribeReadingSessions, updateGuideLibrarySession } from "../src/features/reading-session/store.mjs";
import { clearProjectData } from "../src/features/local-data/keys.mjs";

test("effective reading pace follows the global preference unless locally overridden", () => {
  const initial = emptyReadingSession();
  assert.equal(effectiveOneAtATime(initial, true), true);
  assert.equal(effectiveOneAtATime(initial, false), false);
  assert.equal(effectiveOneAtATime(setReadingModeOverride(initial, false, 4), true), false);
  assert.equal(effectiveOneAtATime(setReadingModeOverride(initial, true, 4), false), true);
  assert.equal(effectiveOneAtATime(setReadingModeOverride(initial, null, 4), true), true);
});

test("page transitions clamp at the first and last sections and preserve place on mode changes", () => {
  let session = setReadingPage(emptyReadingSession(), -8, 4);
  assert.equal(session.pageIndex, 0);
  session = setReadingPage(session, 99, 4);
  assert.equal(session.pageIndex, 3);
  session = setReadingModeOverride(session, false, 4);
  assert.equal(session.pageIndex, 3);
  assert.equal(clampPageIndex(2, 0), 0);
});

test("slug sessions resume in memory and clamp when a guide has fewer sections", () => {
  clearReadingSessions();
  setReadingPageForGuide("guide-a", 2, 4);
  setReadingModeForGuide("guide-a", true, 4);
  assert.deepEqual(getReadingSession("guide-a", 4), { pageIndex: 2, modeOverride: true });
  assert.deepEqual(getReadingSession("guide-a", 2), { pageIndex: 1, modeOverride: true });
  assert.deepEqual(getReadingSession("guide-b", 3), { pageIndex: 0, modeOverride: null });
});

test("library query and audience resume in memory and normalize unsupported values", () => {
  clearReadingSessions();
  updateGuideLibrarySession({ query: "fatigue", audience: "carer" });
  assert.deepEqual(getGuideLibrarySession(), { query: "fatigue", audience: "carer" });
  assert.deepEqual(normalizeGuideLibrarySession({ query: "x".repeat(100), audience: "private" }), { query: "x".repeat(80), audience: "all" });
});

test("clear-all notification clears guide and library reading state", async () => {
  clearReadingSessions();
  setReadingPageForGuide("guide-a", 1, 3);
  updateGuideLibrarySession({ query: "scan", audience: "patient" });
  let notifications = 0;
  const unsubscribe = subscribeReadingSessions(() => { notifications += 1; });
  await clearProjectData({ async removeItem() {} });
  unsubscribe();
  assert.deepEqual(getReadingSession("guide-a", 3), { pageIndex: 0, modeOverride: null });
  assert.deepEqual(getGuideLibrarySession(), { query: "", audience: "all" });
  assert.equal(notifications, 1);
});

test("failed clear-all preserves in-memory reading state", async () => {
  clearReadingSessions();
  setReadingPageForGuide("guide-a", 2, 4);
  updateGuideLibrarySession({ query: "private query", audience: "carer" });
  let notifications = 0;
  const unsubscribe = subscribeReadingSessions(() => { notifications += 1; });
  await assert.rejects(clearProjectData({ async removeItem() { throw new Error("storage unavailable"); } }), /storage unavailable/);
  unsubscribe();
  assert.deepEqual(getReadingSession("guide-a", 4), { pageIndex: 2, modeOverride: null });
  assert.deepEqual(getGuideLibrarySession(), { query: "private query", audience: "carer" });
  assert.equal(notifications, 0);
  clearReadingSessions();
});

test("returning to a sheet retains its reading place and filters independently", () => {
  clearReadingSessions();
  updateSheetView("appointment-sheet", { pageIndex: 1, modeOverride: true, selectedOnly: true, optionsOpen: true }, 3);
  assert.deepEqual(getSheetView("appointment-sheet", 3), { pageIndex: 1, modeOverride: true, selectedOnly: true, optionsOpen: true });
  assert.deepEqual(getSheetView("support-preferences", 3), { pageIndex: 0, modeOverride: null, selectedOnly: false, optionsOpen: false });
  assert.deepEqual(getReadingSession("appointment-sheet", 3), emptyReadingSession());
});

test("sheet view follows simplified reading unless overridden and keeps no private fields", () => {
  clearReadingSessions();
  assert.equal(effectiveOneAtATime(getSheetView("appointment-sheet", 3), true), true);
  updateSheetView("appointment-sheet", { pageIndex: 99, modeOverride: false, note: "SYNTHETIC_PRIVATE_NOTE", selectedOnly: "true" }, 3);
  const view = getSheetView("appointment-sheet", 3);
  assert.deepEqual(view, { pageIndex: 2, modeOverride: false, selectedOnly: false, optionsOpen: false });
  assert.equal(effectiveOneAtATime(view, true), false);
  assert.equal(getSheetView("appointment-sheet", 1).pageIndex, 0);
});

test("successful clear resets sheet views; a failed clear preserves them for return", async () => {
  clearReadingSessions();
  updateSheetView("support-preferences", { pageIndex: 2, modeOverride: true, selectedOnly: true }, 3);
  await assert.rejects(clearProjectData({ async removeItem() { throw new Error("storage unavailable"); } }));
  assert.equal(getSheetView("support-preferences", 3).pageIndex, 2);
  await clearProjectData({ async removeItem() {} });
  assert.deepEqual(getSheetView("support-preferences", 3), { pageIndex: 0, modeOverride: null, selectedOnly: false, optionsOpen: false });
});
