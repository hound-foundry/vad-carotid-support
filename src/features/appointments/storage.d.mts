import type { AppointmentSheet } from "./model.mjs";
export type AppointmentStorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};
export function createAppointmentStore(adapter: AppointmentStorageAdapter): {
  load(): Promise<AppointmentSheet>;
  save(sheet: AppointmentSheet): Promise<void>;
  remove(): Promise<void>;
};
