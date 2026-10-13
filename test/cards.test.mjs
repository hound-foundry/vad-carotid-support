import test from "node:test";
import assert from "node:assert/strict";
import { emptyMilestoneCard, emptyPersonalCard, formatMilestoneCardExport, formatPersonalCardExport, parseMilestoneCard, parsePersonalCard, serializeMilestoneCard, serializePersonalCard } from "../src/features/cards/model.mjs";

test("personal card defaults are blank and export is clearly bounded", () => {
  const card = emptyPersonalCard();
  assert.equal(card.preferredName, "");
  const exported = formatPersonalCardExport({ ...card, medicines: "A medicine" });
  assert.match(exported, /Personal information card — not an official medical record or emergency plan/);
  assert.match(exported, /A medicine/);
});

test("personal card serialization drops malformed and oversized values", () => {
  const card = parsePersonalCard(JSON.stringify({ version: 1, card: { preferredName: "x".repeat(500), medicines: "m".repeat(400), eventDateKind: "invalid" } }));
  assert.equal(card.preferredName.length, 240);
  assert.equal(card.medicines.length, 400);
  assert.equal(card.eventDateKind, "none");
  assert.deepEqual(parsePersonalCard("bad"), emptyPersonalCard());
  assert.equal(parsePersonalCard(serializePersonalCard(card)).preferredName.length, 240);
});

test("milestone card stays separate and labels social export as personal", () => {
  const card = { ...emptyMilestoneCard(), useSurvivorWord: true, dateKind: "month-year", date: "October 2026", title: "A year since my milestone", message: "Today I mark this moment." };
  const exported = formatMilestoneCardExport(card);
  assert.match(exported, /Survivor milestone/);
  assert.match(exported, /Date \(month-year\)/);
  assert.match(exported, /not medical advice or proof of diagnosis/);
  assert.equal(parseMilestoneCard(serializeMilestoneCard(card)).message, card.message);
});
