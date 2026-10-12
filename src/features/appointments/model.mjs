// @ts-check

export const STORAGE_KEY = "vad-carotid-support.appointment-sheet.v1";
export const MAX_NOTE_LENGTH = 500;

export const appointmentPrompts = [
  { id: "diagnosis", group: "Understanding tests and results", text: "Could you explain the diagnosis and which artery is involved?" },
  { id: "tests", group: "Understanding tests and results", text: "What do my test results mean, what remains uncertain, and is anything still pending?" },
  { id: "follow-up-imaging", group: "Understanding tests and results", text: "Is any follow-up imaging planned for me? If so, what is its purpose?" },
  { id: "follow-up", group: "Follow-up and next steps", text: "What follow-up is planned, and who should I contact with questions?" },
  { id: "next-steps", group: "Follow-up and next steps", text: "Could we write down the next steps and who is responsible for each one?" },
  { id: "between-appointments", group: "Follow-up and next steps", text: "Who can I contact with a non-emergency question between appointments?" },
  { id: "daily-life", group: "Daily life and support", text: "Which day-to-day concerns, such as energy or concentration, should I raise with my care team?" },
  { id: "support", group: "Daily life and support", text: "What support is available for me and the people helping me?" },
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
  const groups = [...new Set(selected.map((item) => item.group))];
  return [
    "Appointment question sheet",
    "Prepared with VAD & Carotid Support",
    "",
    ...(selected.length ? groups.flatMap((group) => [group, ...selected.filter((item) => item.group === group).map((item) => `• ${item.text}`), ""]) : ["Choose the questions that matter most to you.", ""]),
    ...(sheet.note.trim() ? ["", "My own notes", sheet.note.trim()] : []),
    "",
    "This sheet is for discussion with your own care team. It is not medical advice or an emergency plan.",
  ].join("\n");
}
