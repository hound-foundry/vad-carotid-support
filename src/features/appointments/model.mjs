// @ts-check

export const STORAGE_KEY = "vad-carotid-support.appointment-sheet.v1";
export const MAX_NOTE_LENGTH = 500;

export const appointmentPrompts = [
  { id: "diagnosis", text: "Could you explain the diagnosis and which artery is involved?" },
  { id: "tests", text: "What do my test results mean, and is anything still pending?" },
  { id: "follow-up", text: "What follow-up is planned, and who should I contact with questions?" },
  { id: "daily-life", text: "Which day-to-day concerns should I raise with my care team?" },
  { id: "support", text: "What support is available for me and the people helping me?" },
  { id: "next-steps", text: "Could I have a written summary of the next steps?" },
];

/** @returns {{ selectedIds: string[], note: string }} */
export function emptyAppointmentSheet() {
  return { selectedIds: [], note: "" };
}

/** @param {unknown} input */
export function parseAppointmentSheet(input) {
  if (typeof input !== "string" || input.length > 4096) return emptyAppointmentSheet();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || !Array.isArray(value.selectedIds) || typeof value.note !== "string") return emptyAppointmentSheet();
    const validIds = new Set(appointmentPrompts.map((item) => item.id));
    return {
      selectedIds: value.selectedIds.filter(/** @param {unknown} id */ (id) => typeof id === "string" && validIds.has(id)),
      note: value.note.slice(0, MAX_NOTE_LENGTH),
    };
  } catch {
    return emptyAppointmentSheet();
  }
}

/** @param {{ selectedIds: string[], note: string }} sheet */
export function serializeAppointmentSheet(sheet) {
  const validIds = new Set(appointmentPrompts.map((item) => item.id));
  return JSON.stringify({
    version: 1,
    selectedIds: [...new Set(sheet.selectedIds)].filter((id) => validIds.has(id)),
    note: sheet.note.slice(0, MAX_NOTE_LENGTH),
  });
}

/** @param {{ selectedIds: string[], note: string }} sheet */
export function formatAppointmentExport(sheet) {
  const selected = appointmentPrompts.filter((item) => sheet.selectedIds.includes(item.id));
  return [
    "Appointment question sheet",
    "Prepared with VAD & Carotid Support",
    "",
    "Questions to discuss",
    ...(selected.length ? selected.map((item) => `• ${item.text}`) : ["• No prompts selected"]),
    ...(sheet.note.trim() ? ["", "My own notes", sheet.note.trim()] : []),
    "",
    "This sheet is for discussion with your own care team. It is not medical advice.",
  ].join("\n");
}
