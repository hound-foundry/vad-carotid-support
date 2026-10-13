import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { emptyAccessibilitySettings, type AccessibilitySettings } from "./model.mjs";
import { loadAccessibilitySettings, saveAccessibilitySettings } from "./store";

type AccessibilityContextValue = { settings: AccessibilitySettings; update: (patch: Partial<AccessibilitySettings>) => void; reset: () => void };
const AccessibilityContext = createContext<AccessibilityContextValue>({ settings: emptyAccessibilitySettings() as AccessibilitySettings, update: () => undefined, reset: () => undefined });

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(emptyAccessibilitySettings() as AccessibilitySettings);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { void loadAccessibilitySettings().then((value) => setSettings(value as AccessibilitySettings)).catch(() => undefined).finally(() => setHydrated(true)); }, []);
  useEffect(() => { if (Platform.OS === "web") { document.documentElement.dataset.vadContrast = settings.contrast; document.documentElement.dataset.vadTheme = settings.theme; document.documentElement.dataset.vadReducedMotion = String(settings.reducedMotion); document.documentElement.style.setProperty("--vad-text-scale", String(settings.textScale)); document.body.style.zoom = String(settings.textScale); document.body.style.backgroundColor = settings.theme === "dark" ? "#102626" : "#F3F7F6"; if (settings.reducedMotion) document.documentElement.style.setProperty("--vad-motion-duration", "0ms"); else document.documentElement.style.removeProperty("--vad-motion-duration"); } if (hydrated) void saveAccessibilitySettings(settings).catch(() => undefined); }, [settings, hydrated]);
  const value = useMemo(() => ({ settings, update: (patch: Partial<AccessibilitySettings>) => setSettings((current) => ({ ...current, ...patch })), reset: () => setSettings(emptyAccessibilitySettings() as AccessibilitySettings) }), [settings]);
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
export const useAccessibility = () => useContext(AccessibilityContext);
