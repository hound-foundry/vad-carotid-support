import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { emptyAccessibilitySettings, type AccessibilitySettings } from "./model.mjs";
import { deleteAccessibilitySettings, loadAccessibilitySettings, saveAccessibilitySettings } from "./store";
import { themeFor } from "../../components/theme";

type AccessibilityContextValue = { settings: AccessibilitySettings; storageMessage: string; update: (patch: Partial<AccessibilitySettings>) => void; reset: () => void };
const AccessibilityContext = createContext<AccessibilityContextValue>({ settings: emptyAccessibilitySettings() as AccessibilitySettings, storageMessage: "", update: () => undefined, reset: () => undefined });
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(emptyAccessibilitySettings() as AccessibilitySettings);
  const [storageMessage, setStorageMessage] = useState(""); const touched = useRef(false);
  useEffect(() => { let live = true; void loadAccessibilitySettings().then((value) => { if (live && !touched.current) setSettings(value); }).catch(() => { if (live) setStorageMessage("Preferences could not be restored. You can still change the display."); }); return () => { live = false; }; }, []);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const root = document.documentElement; root.dataset.vadContrast = settings.contrast; root.dataset.vadTheme = settings.theme; root.dataset.vadReducedMotion = String(settings.reducedMotion);
    document.body.style.removeProperty("zoom"); document.body.style.backgroundColor = themeFor(settings).paper;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeFor(settings).paper);
  }, [settings]);
  const value = useMemo(() => ({ settings, storageMessage, update: (patch: Partial<AccessibilitySettings>) => { touched.current = true; setSettings((current) => { const next = { ...current, ...patch }; void saveAccessibilitySettings(next).then(() => setStorageMessage("Preferences saved on this device.")).catch(() => setStorageMessage("Display changed, but preferences could not be saved.")); return next; }); }, reset: () => { touched.current = true; setSettings(emptyAccessibilitySettings() as AccessibilitySettings); void deleteAccessibilitySettings().then(() => setStorageMessage("Preferences reset.")).catch(() => setStorageMessage("Display reset, but saved preferences could not be removed.")); } }), [settings, storageMessage]);
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
export const useAccessibility = () => useContext(AccessibilityContext);
