// @ts-check

export const STORAGE_KEY = "vad-carotid-support.appointment-sheet.v1";
export const MAX_NOTE_LENGTH = 500;

export const appointmentPrompts = [
  { id: "priority", group: "Before the appointment", text: "What is the one thing I most want help understanding or discussing today?" },
  { id: "appointment-support", group: "Before the appointment", text: "Would I like someone to come with me, and what would I like them to do?" },
  { id: "access-needs", group: "Before the appointment", text: "Would a written summary, communication aid, interpreter, or more time help me take part?" },
  { id: "diagnosis", group: "During the appointment", text: "Could you explain the diagnosis and which artery is involved?" },
  { id: "tests", group: "During the appointment", text: "Could you explain what my test results show, what remains uncertain, and whether anything is still pending?" },
  { id: "follow-up-imaging", group: "During the appointment", text: "Is any follow-up imaging planned for me? If so, what is its purpose?" },
  { id: "daily-life", group: "During the appointment", text: "Which day-to-day concerns, such as energy or concentration, would be useful to discuss?" },
  { id: "support", group: "During the appointment", text: "What support is available for me and the people helping me?" },
  { id: "next-steps", group: "Before I leave", text: "Could we write down the next steps and who is responsible for each one?" },
  { id: "pending-results", group: "Before I leave", text: "Who will contact me about any pending results, and how can I follow up if I do not hear back?" },
  { id: "between-appointments", group: "Before I leave", text: "Who can I contact with a non-emergency question between appointments?" },
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
