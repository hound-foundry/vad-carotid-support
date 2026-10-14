import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEY, emptyAccessibilitySettings, parseAccessibilitySettings, serializeAccessibilitySettings, type AccessibilitySettings } from "./model.mjs";
export async function loadAccessibilitySettings(): Promise<AccessibilitySettings> { const raw = Platform.OS === "web" ? globalThis.localStorage?.getItem(STORAGE_KEY) ?? null : await SecureStore.getItemAsync(STORAGE_KEY); return parseAccessibilitySettings(raw) as AccessibilitySettings; }
export async function saveAccessibilitySettings(value: AccessibilitySettings) { const serialized = serializeAccessibilitySettings(value); if (Platform.OS === "web") { if (!globalThis.localStorage) throw new Error("Browser local storage is unavailable"); globalThis.localStorage.setItem(STORAGE_KEY, serialized); return; } await SecureStore.setItemAsync(STORAGE_KEY, serialized); }
export async function deleteAccessibilitySettings() { if (Platform.OS === "web") globalThis.localStorage?.removeItem(STORAGE_KEY); else await SecureStore.deleteItemAsync(STORAGE_KEY); }
export { STORAGE_KEY, emptyAccessibilitySettings };
