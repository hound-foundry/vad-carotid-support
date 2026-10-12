import test from "node:test";
import assert from "node:assert/strict";
import { appointmentPrompts, emptyAppointmentSheet, formatAppointmentExport, MAX_NOTE_LENGTH, parseAppointmentSheet, serializeAppointmentSheet } from "../src/features/appointments/model.mjs";
import { createAppointmentStore } from "../src/features/appointments/storage.mjs";
import { STORAGE_KEY } from "../src/features/appointments/model.mjs";

test("new sheet is empty and contains no personal identifiers", () => {
  const sheet = emptyAppointmentSheet();
  assert.deepEqual(sheet, { selectedIds: [], note: "" });
});

test("saved data round-trips only known prompts and bounds notes", () => {
  const serialized = serializeAppointmentSheet({ selectedIds: ["follow-up", "unknown", "follow-up"], note: "x".repeat(MAX_NOTE_LENGTH + 40) });
  const loaded = parseAppointmentSheet(serialized);
  assert.deepEqual(loaded.selectedIds, ["follow-up"]);
  assert.equal(loaded.note.length, MAX_NOTE_LENGTH);
});

test("malformed, oversized, and unsupported storage values fail closed", () => {
  assert.deepEqual(parseAppointmentSheet("not json"), emptyAppointmentSheet());
  assert.deepEqual(parseAppointmentSheet("x".repeat(5000)), emptyAppointmentSheet());
  assert.deepEqual(parseAppointmentSheet(JSON.stringify({ version: 2, selectedIds: ["diagnosis"], note: "private" })), emptyAppointmentSheet());
});

test("export includes only explicitly selected prompts and the user-entered note", () => {
  const sheet = { selectedIds: ["diagnosis"], note: "Ask about follow-up" };
  const exported = formatAppointmentExport(sheet);
  assert.ok(exported.includes(appointmentPrompts.find((item) => item.id === "diagnosis").text));
  assert.ok(exported.includes("Ask about follow-up"));
  assert.ok(!exported.includes(appointmentPrompts.find((item) => item.id === "tests").text));
  assert.ok(!exported.includes("http"));
});

test("storage changes only on explicit save and delete clears the stored sheet", async () => {
  const memory = new Map();
  const store = createAppointmentStore({
    async getItem(key) { return memory.get(key) ?? null; },
    async setItem(key, value) { memory.set(key, value); },
    async removeItem(key) { memory.delete(key); },
  });
  const beforeSave = await store.load();
  assert.deepEqual(beforeSave, emptyAppointmentSheet());
  assert.equal(memory.has(STORAGE_KEY), false);
  await store.save({ selectedIds: ["tests"], note: "Synthetic test note" });
  assert.equal((await store.load()).note, "Synthetic test note");
  await store.remove();
  assert.equal(memory.has(STORAGE_KEY), false);
  assert.deepEqual(await store.load(), emptyAppointmentSheet());
});
