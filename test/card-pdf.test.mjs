import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { createCardPdf } from "../src/features/cards/pdf.mjs";
import { emptyPersonalCard, personalCardPresentation } from "../src/features/cards/model.mjs";
const regular = await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url));
const bold = await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url));

test("short optional card fields do not strand the update date on another PDF page", async () => {
  const view = personalCardPresentation({ ...emptyPersonalCard(), preferredName: "T4 Example", description: "Synthetic test card; no real health details.", communicationNeeds: "Please ask before helping me.", whatHelps: "Pause and ask before helping.", avoid: "Do not assume or speak for me.", emergencyContact: "Test contact only; no phone number.", clinicianContact: "Test clinic only; no contact details.", medicines: "Sample only; no medication details.", allergies: "Sample only; no allergy details.", updatedOn: "2026-10-13" });
  const doc = await PDFDocument.load(await createCardPdf(view, regular, bold));
  assert.equal(doc.getPageCount(), 1);
  assert.equal(doc.getTitle(), "Personal information card", "private fields are not copied to document metadata");
});

test("long card fields paginate using readable text instead of clipping or shrinking", async () => {
  const view = personalCardPresentation({ ...emptyPersonalCard(), communicationNeeds: "A long synthetic statement. ".repeat(20), medicines: "Synthetic medicine entry only. ".repeat(30), allergies: "Synthetic allergy entry only. ".repeat(30) });
  const doc = await PDFDocument.load(await createCardPdf(view, regular, bold));
  assert.ok(doc.getPageCount() > 1);
  assert.ok(doc.getPages().every((page) => page.getHeight() > 800));
});
