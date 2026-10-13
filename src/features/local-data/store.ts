import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { clearProjectData } from "./keys.mjs";

const adapter = {
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      if (!globalThis.localStorage) throw new Error("Local storage is unavailable");
      globalThis.localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export async function clearAllSavedData() {
  await clearProjectData(adapter);
}
