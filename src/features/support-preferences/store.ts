import { Platform, Share } from "react-native";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEY, formatSupportPreferencesExport, type SupportPreferencesSheet } from "./model.mjs";
import { createSupportPreferencesStore } from "./storage.mjs";

const supportPreferencesStore = createSupportPreferencesStore({
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

export const loadSupportPreferences = supportPreferencesStore.load;
export const saveSupportPreferences = supportPreferencesStore.save;
export const deleteSupportPreferences = supportPreferencesStore.remove;

export async function exportSupportPreferences(sheet: SupportPreferencesSheet): Promise<void> {
  const text = formatSupportPreferencesExport(sheet);
  if (Platform.OS === "web") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "support-preferences.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  await Share.share({ title: "How I prefer to be supported", message: text });
}

export { STORAGE_KEY };
