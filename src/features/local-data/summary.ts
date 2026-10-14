import { loadAppointmentSheet } from "../appointments/store";
import { loadSupportPreferences } from "../support-preferences/store";
import { loadSavedGuides } from "../saved-guides/store";
import { personalCardStore, milestoneCardStore } from "../cards/store";

export type SavedSummary = {
  guides: boolean;
  appointment: boolean;
  support: boolean;
  personalCard: boolean;
  milestoneCard: boolean;
  hasAny: boolean;
};

/** Read only whether local tools contain something worth resuming. Never returns private field values. */
export async function loadSavedSummary(): Promise<SavedSummary> {
  const [guides, appointment, support, personal, milestone] = await Promise.all([
    loadSavedGuides(),
    loadAppointmentSheet(),
    loadSupportPreferences(),
    personalCardStore.loadRecord(),
    milestoneCardStore.loadRecord(),
  ]);
  const result = {
    guides: guides.length > 0,
    appointment: appointment.selectedIds.length > 0 || Boolean(appointment.note.trim()),
    support: support.selectedIds.length > 0 || Boolean(support.note.trim()),
    personalCard: personal.status === "restored",
    milestoneCard: milestone.status === "restored",
  };
  return { ...result, hasAny: Object.values(result).some(Boolean) };
}
