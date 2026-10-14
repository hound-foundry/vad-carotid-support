export const STORAGE_KEY: string;
export const MAX_NOTE_LENGTH: number;
export const supportPreferences: { id: string; group: string; text: string }[];
export const guidePreferenceSuggestions: Record<string, string[]>;
export type SupportPreferencesSheet = { selectedIds: string[]; note: string };
export function emptySupportPreferences(): SupportPreferencesSheet;
export function parseSupportPreferences(input: unknown): SupportPreferencesSheet;
export function serializeSupportPreferences(sheet: SupportPreferencesSheet): string;
export function formatSupportPreferencesExport(sheet: SupportPreferencesSheet): string;
