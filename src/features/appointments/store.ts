import { Platform, Share } from "react-native";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEY, formatAppointmentExport, type AppointmentSheet } from "./model.mjs";
import { createAppointmentStore } from "./storage.mjs";

const appointmentStore = createAppointmentStore({
  async getItem(key) {
    if (Platform.OS === "web") return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === "web") {
      if (!globalThis.localStorage) throw new Error("Browser local storage is unavailable");
      globalThis.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
});

export const loadAppointmentSheet = appointmentStore.load;
export const saveAppointmentSheet = appointmentStore.save;
export const deleteAppointmentSheet = appointmentStore.remove;

export async function exportAppointmentSheet(sheet: AppointmentSheet): Promise<void> {
  const text = formatAppointmentExport(sheet);
  if (Platform.OS === "web") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "appointment-question-sheet.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  await Share.share({ title: "Appointment question sheet", message: text });
}

export { STORAGE_KEY };
