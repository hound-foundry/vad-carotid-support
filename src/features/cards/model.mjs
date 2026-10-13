// @ts-nocheck

export const PERSONAL_CARD_KEY = "vad-carotid-support.personal-card.v1";
export const MILESTONE_CARD_KEY = "vad-carotid-support.milestone-card.v1";
export const MAX_FIELD_LENGTH = 240;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_LONG_FIELD_LENGTH = 500;
export const DATE_KINDS = new Set(["none", "exact", "month-year", "year", "approximate"]);

/** @typedef {{ preferredName: string, description: string, communicationNeeds: string, whatHelps: string, avoid: string, emergencyContact: string, clinicianContact: string, medicines: string, allergies: string, eventDate: string, eventDateKind: string, updatedOn: string }} PersonalCard */
/** @typedef {{ displayName: string, title: string, useSurvivorWord: boolean, date: string, dateKind: string, message: string }} MilestoneCard */

export function emptyPersonalCard() {
  return { preferredName: "", description: "", communicationNeeds: "", whatHelps: "", avoid: "", emergencyContact: "", clinicianContact: "", medicines: "", allergies: "", eventDate: "", eventDateKind: "none", updatedOn: "" };
}

export function emptyMilestoneCard() {
  return { displayName: "", title: "My milestone", useSurvivorWord: false, date: "", dateKind: "none", message: "" };
}

const personalKeys = new Set(Object.keys(emptyPersonalCard()));
const milestoneKeys = new Set(Object.keys(emptyMilestoneCard()));
const trim = (value, limit = MAX_FIELD_LENGTH) => typeof value === "string" ? value.slice(0, limit) : "";

export function parsePersonalCard(input) {
  if (typeof input !== "string" || input.length > 10000) return emptyPersonalCard();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || typeof value.card !== "object") return emptyPersonalCard();
    const card = emptyPersonalCard();
    for (const key of personalKeys) card[key] = key === "eventDateKind" ? (DATE_KINDS.has(value.card[key]) ? value.card[key] : "none") : trim(value.card[key], key === "updatedOn" ? 40 : key === "medicines" || key === "allergies" ? MAX_LONG_FIELD_LENGTH : MAX_FIELD_LENGTH);
    return card;
  } catch { return emptyPersonalCard(); }
}

export function serializePersonalCard(card) {
  const clean = emptyPersonalCard();
  for (const key of personalKeys) clean[key] = key === "eventDateKind" ? (DATE_KINDS.has(card?.[key]) ? card[key] : "none") : trim(card?.[key], key === "updatedOn" ? 40 : key === "medicines" || key === "allergies" ? MAX_LONG_FIELD_LENGTH : MAX_FIELD_LENGTH);
  return JSON.stringify({ version: 1, card: clean });
}

export function parseMilestoneCard(input) {
  if (typeof input !== "string" || input.length > 10000) return emptyMilestoneCard();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || typeof value.card !== "object") return emptyMilestoneCard();
    const card = emptyMilestoneCard();
    for (const key of milestoneKeys) card[key] = key === "useSurvivorWord" ? value.card[key] === true : key === "dateKind" ? (DATE_KINDS.has(value.card[key]) ? value.card[key] : "none") : trim(value.card[key], key === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH);
    return card;
  } catch { return emptyMilestoneCard(); }
}

export function serializeMilestoneCard(card) {
  const clean = emptyMilestoneCard();
  for (const key of milestoneKeys) clean[key] = key === "useSurvivorWord" ? card?.[key] === true : key === "dateKind" ? (DATE_KINDS.has(card?.[key]) ? card[key] : "none") : trim(card?.[key], key === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH);
  return JSON.stringify({ version: 1, card: clean });
}

function lines(title, pairs, footer) {
  return [title, "Prepared with VAD & Carotid Support", "", ...pairs.flatMap(([label, value]) => value?.trim() ? [`${label}:`, value.trim(), ""] : []), footer].join("\n");
}

export function formatPersonalCardExport(card) {
  const dateLabel = card.eventDateKind && card.eventDateKind !== "none" ? `Event date (${card.eventDateKind})` : "Event date";
  return lines("Personal information and communication card", [
    ["Preferred name", card.preferredName], ["About me", card.description], ["Communication and access needs", card.communicationNeeds], ["What helps me", card.whatHelps], ["Please avoid", card.avoid], ["Emergency contact", card.emergencyContact], ["Clinician/contact", card.clinicianContact], ["Medicines (entered by me; check current)", card.medicines], ["Allergies (entered by me; check current)", card.allergies], [dateLabel, card.eventDate], ["Last updated", card.updatedOn],
  ], "Personal information card — not an official medical record or emergency plan.");
}

export function formatMilestoneCardExport(card) {
  const label = card.useSurvivorWord ? "Survivor milestone" : "Personal milestone";
  const dateLabel = card.dateKind && card.dateKind !== "none" ? `Date (${card.dateKind})` : "Date";
  return lines(label, [["Name", card.displayName], ["Title", card.title], [dateLabel, card.date], ["Message", card.message]], "Personal story/milestone — not medical advice or proof of diagnosis.");
}
