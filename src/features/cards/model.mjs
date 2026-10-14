// @ts-nocheck
import { normalizeDesign } from "./design.mjs";
import { normalizeArtwork } from "./artwork.mjs";

export const PERSONAL_CARD_KEY = "vad-carotid-support.personal-card.v1";
export const MILESTONE_CARD_KEY = "vad-carotid-support.milestone-card.v1";
export const MAX_FIELD_LENGTH = 240;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_LONG_FIELD_LENGTH = 500;
export const DATE_KINDS = new Set(["none", "exact", "month-year", "year", "approximate"]);

/** @typedef {{ preferredName: string, heading: string, description: string, communicationNeeds: string, whatHelps: string, avoid: string, emergencyContact: string, clinicianContact: string, medicines: string, allergies: string, eventDate: string, eventDateKind: string, updatedOn: string, designId: string, artworkId: string }} PersonalCard */
/** @typedef {{ displayName: string, title: string, useSurvivorWord: boolean, date: string, dateKind: string, message: string, designId: string, artworkId: string }} MilestoneCard */

export function emptyPersonalCard() {
  return { preferredName: "", heading: "", description: "", communicationNeeds: "", whatHelps: "", avoid: "", emergencyContact: "", clinicianContact: "", medicines: "", allergies: "", eventDate: "", eventDateKind: "none", updatedOn: "", designId: "clear", artworkId: "none" };
}

export function emptyMilestoneCard() {
  return { displayName: "", title: "My milestone", useSurvivorWord: false, date: "", dateKind: "none", message: "", designId: "clear", artworkId: "none" };
}

const personalKeys = new Set(Object.keys(emptyPersonalCard()));
const milestoneKeys = new Set(Object.keys(emptyMilestoneCard()));
const trim = (value, limit = MAX_FIELD_LENGTH) => typeof value === "string" ? value.slice(0, limit) : "";
const designValue = (key, value) => key === "designId" ? normalizeDesign(value) : normalizeArtwork(value);

export function parsePersonalCard(input) {
  if (typeof input !== "string" || input.length > 10000) return emptyPersonalCard();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || typeof value.card !== "object") return emptyPersonalCard();
    const card = emptyPersonalCard();
    for (const key of personalKeys) card[key] = ["designId", "artworkId"].includes(key) ? designValue(key, value.card[key]) : key === "eventDateKind" ? (DATE_KINDS.has(value.card[key]) ? value.card[key] : "none") : trim(value.card[key], key === "updatedOn" ? 40 : key === "heading" ? 80 : key === "medicines" || key === "allergies" ? MAX_LONG_FIELD_LENGTH : MAX_FIELD_LENGTH);
    return card;
  } catch { return emptyPersonalCard(); }
}

export function serializePersonalCard(card) {
  const clean = emptyPersonalCard();
  for (const key of personalKeys) clean[key] = ["designId", "artworkId"].includes(key) ? designValue(key, card?.[key]) : key === "eventDateKind" ? (DATE_KINDS.has(card?.[key]) ? card[key] : "none") : trim(card?.[key], key === "updatedOn" ? 40 : key === "heading" ? 80 : key === "medicines" || key === "allergies" ? MAX_LONG_FIELD_LENGTH : MAX_FIELD_LENGTH);
  return JSON.stringify({ version: 1, card: clean });
}

export function parseMilestoneCard(input) {
  if (typeof input !== "string" || input.length > 10000) return emptyMilestoneCard();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || typeof value.card !== "object") return emptyMilestoneCard();
    const card = emptyMilestoneCard();
    for (const key of milestoneKeys) card[key] = ["designId", "artworkId"].includes(key) ? designValue(key, value.card[key]) : key === "useSurvivorWord" ? value.card[key] === true : key === "dateKind" ? (DATE_KINDS.has(value.card[key]) ? value.card[key] : "none") : trim(value.card[key], key === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH);
    return card;
  } catch { return emptyMilestoneCard(); }
}

export function serializeMilestoneCard(card) {
  const clean = emptyMilestoneCard();
  for (const key of milestoneKeys) clean[key] = ["designId", "artworkId"].includes(key) ? designValue(key, card?.[key]) : key === "useSurvivorWord" ? card?.[key] === true : key === "dateKind" ? (DATE_KINDS.has(card?.[key]) ? card[key] : "none") : trim(card?.[key], key === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH);
  return JSON.stringify({ version: 1, card: clean });
}

/** @typedef {{kind: "personal" | "milestone", title: string, subtitle: string, fields: Array<{id: string, label: string, value: string}>, footer: string, designId: string, artworkId: string}} CardPresentation */
export function localDate(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`; }
const field = (id, label, value) => ({ id, label, value: typeof value === "string" ? value.trim() : "" });
const dateLabel = (kind) => ({ exact: "exact date", "month-year": "month and year", year: "year only", approximate: "approximate" })[kind] ?? "no date";
/** @returns {CardPresentation} */
export function personalCardPresentation(input, today = localDate()) {
  const card = parsePersonalCard(serializePersonalCard(input));
  return { kind: "personal", title: card.heading.trim() || "Medical and communication card", subtitle: "Personal information", designId: card.designId, artworkId: card.artworkId, fields: [
    field("preferredName", "Preferred name", card.preferredName), field("description", "About me", card.description), field("communicationNeeds", "Communication and access needs", card.communicationNeeds), field("whatHelps", "What helps me", card.whatHelps), field("avoid", "Please avoid", card.avoid), field("emergencyContact", "Emergency contact", card.emergencyContact), field("clinicianContact", "Clinician or service contact", card.clinicianContact), field("medicines", "Medicines (entered by me; check current)", card.medicines), field("allergies", "Allergies (entered by me; check current)", card.allergies), field("eventDate", `Event date (${dateLabel(card.eventDateKind)})`, card.eventDateKind === "none" ? "" : card.eventDate), field("updatedOn", "Last updated", card.updatedOn || today),
  ].filter((item) => item.value), footer: "Personal information card — not an official medical record or emergency plan." };
}
/** @returns {CardPresentation} */
export function milestoneCardPresentation(input) {
  const card = parseMilestoneCard(serializeMilestoneCard(input));
  return { kind: "milestone", title: card.title.trim() || "My milestone", subtitle: card.useSurvivorWord ? "Survivor milestone" : "Personal milestone", designId: card.designId, artworkId: card.artworkId, fields: [field("displayName", "Name", card.displayName), field("date", `Date (${dateLabel(card.dateKind)})`, card.dateKind === "none" ? "" : card.date), field("message", "Message", card.message)].filter((item) => item.value), footer: "Personal story/milestone — not medical advice or proof of diagnosis." };
}
export function formatCardText(view) { return [view.subtitle, view.title, "", ...view.fields.flatMap(({label,value}) => [label + ":", value, ""]), view.footer].join("\n"); }
export const formatPersonalCardExport = (card) => formatCardText(personalCardPresentation(card));
export const formatMilestoneCardExport = (card) => formatCardText(milestoneCardPresentation(card));
