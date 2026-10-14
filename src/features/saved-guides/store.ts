import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEY } from "./model.mjs";
import { createSavedGuidesStore } from "./storage.mjs";

const store = createSavedGuidesStore({
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

export const loadSavedGuides = store.load;
export const saveSavedGuides = store.save;
export const deleteSavedGuides = store.remove;

export async function exportSavedGuides(text: string): Promise<void> {
  if (Platform.OS === "web") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "saved-guides.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  const { Share } = await import("react-native");
  await Share.share({ title: "Saved guides", message: text });
}

export { STORAGE_KEY };
