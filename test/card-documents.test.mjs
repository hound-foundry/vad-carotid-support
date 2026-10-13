import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { createCardPdf } from "../src/features/cards/pdf.mjs";
import { cardHtml, wrapText } from "../src/features/cards/document.mjs";
import { emptyPersonalCard, emptyMilestoneCard, personalCardPresentation, milestoneCardPresentation, formatPersonalCardExport, formatMilestoneCardExport, PERSONAL_CARD_KEY, MILESTONE_CARD_KEY } from "../src/features/cards/model.mjs";
import { createCardStore } from "../src/features/cards/storage.mjs";

test("hidden dates are omitted from both presentations, text and print HTML", () => {
  const privateDate = "HIDDEN-DATE-TEST";
  const personal = { ...emptyPersonalCard(), eventDate: privateDate, eventDateKind: "none" };
  const milestone = { ...emptyMilestoneCard(), date: privateDate, dateKind: "none" };
  for (const content of [formatPersonalCardExport(personal), formatMilestoneCardExport(milestone), cardHtml(personalCardPresentation(personal)), cardHtml(milestoneCardPresentation(milestone))]) assert.ok(!content.includes(privateDate));
});
test("all visible date kinds preserve wording and no date is inferred", () => {
  for (const kind of ["exact", "month-year", "year", "approximate"]) {
    const view = milestoneCardPresentation({ ...emptyMilestoneCard(), dateKind: kind, date: "October 2020" });
    assert.equal(view.fields.find((f) => f.id === "date").value, "October 2020");
  }
  assert.equal(milestoneCardPresentation(emptyMilestoneCard()).fields.length, 0);
});
test("print document escapes user markup and contains only card fields and label", () => {
  const value = '<script>fetch("https://invalid.example/")</script>';
  const html = cardHtml(personalCardPresentation({ ...emptyPersonalCard(), preferredName: value }, "2026-10-13"));
  assert.ok(html.includes("&lt;script&gt;")); assert.doesNotMatch(html, /<script|<input|<button|<form|<iframe|https:\/\/invalid\.example\/"/);
  assert.match(html, /not an official medical record or emergency plan/);
  assert.match(html, /2026-10-13/);
});
test("card storage distinguishes absent, restored, malformed and unsupported records without changing them", async () => {
  const data = new Map(); const adapter = { getItem: async (k) => data.get(k) ?? null, setItem: async (k,v) => data.set(k,v), removeItem: async (k) => data.delete(k) };
  const personal = createCardStore(adapter, "personal"), milestone = createCardStore(adapter, "milestone");
  assert.equal((await personal.loadRecord()).status, "absent");
  await personal.save({ ...emptyPersonalCard(), preferredName: "SYNTHETIC PERSON", communicationNeeds: "Written words help" });
  await milestone.save({ ...emptyMilestoneCard(), message: "SYNTHETIC MILESTONE" });
  assert.equal((await personal.loadRecord()).status, "restored");
  assert.equal((await milestone.load()).message, "SYNTHETIC MILESTONE");
  assert.ok(!JSON.stringify(await personal.load()).includes("SYNTHETIC MILESTONE"));
  await personal.remove(); assert.equal(data.has(PERSONAL_CARD_KEY), false); assert.equal(data.has(MILESTONE_CARD_KEY), true);
  for (const raw of ["broken", '{"version":2,"card":{}}', '{"version":1,"card":null}', "x".repeat(11000)]) { data.set(PERSONAL_CARD_KEY, raw); assert.equal((await personal.loadRecord()).status, "invalid"); assert.equal(data.get(PERSONAL_CARD_KEY), raw); }
  await personal.remove(); await milestone.remove(); assert.equal(data.size, 0);
});
test("storage failures propagate so the interface cannot report a false success", async () => {
  const store = createCardStore({ getItem: async () => { throw Error("Unavailable"); }, setItem: async () => { throw Error("Unavailable"); }, removeItem: async () => { throw Error("Unavailable"); } }, "personal");
  await assert.rejects(store.loadRecord()); await assert.rejects(store.save(emptyPersonalCard())); await assert.rejects(store.remove());
});
test("long words and Unicode wrap without losing characters", () => {
  const original = "Éль".repeat(200);
  const lines = wrapText(original, 15, (s) => Array.from(s).length);
  assert.equal(lines.join(""), original); assert.ok(lines.every((line) => Array.from(line).length <= 15));
});
test("PDF is generated locally with readable text, Unicode and paginated overflow", async () => {
  const regular = await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url));
  const bold = await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url));
  const card = { ...emptyPersonalCard(), preferredName: "Élodie · Мантас", communicationNeeds: "Give me time. ".repeat(16), description: "A long description. ".repeat(12), medicines: "SYNTHETIC medicine entry. ".repeat(20), allergies: "SYNTHETIC allergy entry. ".repeat(20), whatHelps: "Please write it down. ".repeat(10), eventDate: "HIDDEN-DATE", eventDateKind: "none" };
  const bytes = await createCardPdf(personalCardPresentation(card, "2026-10-13"), regular, bold);
  assert.match(Buffer.from(bytes).subarray(0,8).toString(), /%PDF-/);
  const doc = await PDFDocument.load(bytes); assert.ok(doc.getPageCount() > 1); assert.equal(doc.getTitle(), "Personal information card");
  await assert.rejects(createCardPdf(milestoneCardPresentation({ ...emptyMilestoneCard(), title: "Unsupported 🧠" }), regular, bold), /Use Print card or Download text/);
});
