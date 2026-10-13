// @ts-check

export const STORAGE_KEY = "vad-carotid-support.support-preferences.v1";
export const MAX_NOTE_LENGTH = 300;

export const supportPreferences = [
  { id: "time-to-respond", group: "Communication", text: "Please give me time to think and respond." },
  { id: "one-question", group: "Communication", text: "One question at a time helps me." },
  { id: "write-key-points", group: "Communication", text: "Please write down key points." },
  { id: "ask-before-speaking", group: "Communication", text: "Ask me before speaking or deciding for me." },
  { id: "plain-language", group: "Communication", text: "Please use plain language and explain unfamiliar words." },
  { id: "check-what-helps-today", group: "Communication", text: "Please check what kind of support would help today; it can change." },
  { id: "appointment-company", group: "Practical help", text: "I may want help getting to an appointment." },
  { id: "appointment-notes", group: "Practical help", text: "I may want someone to take notes, if I ask." },
  { id: "offer-help", group: "Practical help", text: "Please offer practical help and let me choose." },
  { id: "plan-breaks", group: "Practical help", text: "It helps to plan breaks." },
  { id: "pause-or-continue", group: "Practical help", text: "If I seem tired, ask whether I want to pause or continue later." },
  { id: "ask-before-sharing", group: "Privacy and boundaries", text: "Please ask before sharing information about me." },
  { id: "choose-attendees", group: "Privacy and boundaries", text: "Let me choose who joins a conversation." },
  { id: "ask-before-advice", group: "Privacy and boundaries", text: "Please ask before offering advice." },
];

/** Suggested choices are shown only after a person chooses a guide action; they are never saved automatically. */
export const guidePreferenceSuggestions = {
  "supporting-someone": ["time-to-respond", "one-question", "write-key-points", "ask-before-speaking", "offer-help", "ask-before-sharing", "choose-attendees"],
  "with-stroke": ["time-to-respond", "one-question", "write-key-points", "plain-language", "plan-breaks", "pause-or-continue"],
  "recovery-and-quality-of-life": ["check-what-helps-today", "offer-help", "plan-breaks", "pause-or-continue", "ask-before-advice"],
};

/** @returns {{ selectedIds: string[], note: string }} */
export function emptySupportPreferences() {
  return { selectedIds: [], note: "" };
}

/** @param {unknown} input */
export function parseSupportPreferences(input) {
  if (typeof input !== "string" || input.length > 4096) return emptySupportPreferences();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || !Array.isArray(value.selectedIds) || typeof value.note !== "string") return emptySupportPreferences();
    const validIds = new Set(supportPreferences.map((item) => item.id));
    return {
      selectedIds: [...new Set(value.selectedIds.filter(/** @param {unknown} id */ (id) => typeof id === "string" && validIds.has(id)))],
      note: value.note.slice(0, MAX_NOTE_LENGTH),
    };
  } catch {
    return emptySupportPreferences();
  }
}

/** @param {{ selectedIds: string[], note: string }} sheet */
export function serializeSupportPreferences(sheet) {
  const validIds = new Set(supportPreferences.map((item) => item.id));
  return JSON.stringify({
    version: 1,
    selectedIds: [...new Set(sheet.selectedIds)].filter((id) => validIds.has(id)),
    note: sheet.note.slice(0, MAX_NOTE_LENGTH),
  });
}

/** @param {{ selectedIds: string[], note: string }} sheet */
export function formatSupportPreferencesExport(sheet) {
  const selected = supportPreferences.filter((item) => sheet.selectedIds.includes(item.id));
  const groups = [...new Set(selected.map((item) => item.group))];
  return [
    "How I prefer to be supported",
    "Prepared with VAD & Carotid Support",
    "",
    ...(selected.length ? groups.flatMap((group) => [group, ...selected.filter((item) => item.group === group).map((item) => `• ${item.text}`), ""]) : ["Choose any statements that feel right for you.", ""]),
    ...(sheet.note.trim() ? ["Something else I’d like you to know", sheet.note.trim(), ""] : []),
    "These are my preferences, not a medical or emergency plan. You can ask me what would help today.",
  ].join("\n");
}
