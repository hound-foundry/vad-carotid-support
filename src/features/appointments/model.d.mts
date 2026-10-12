export type AppointmentSheet = { selectedIds: string[]; note: string };
export const STORAGE_KEY: string;
export const MAX_NOTE_LENGTH: number;
export const appointmentPrompts: { id: string; text: string }[];
export function emptyAppointmentSheet(): AppointmentSheet;
export function parseAppointmentSheet(input: unknown): AppointmentSheet;
export function serializeAppointmentSheet(sheet: AppointmentSheet): string;
export function formatAppointmentExport(sheet: AppointmentSheet): string;
