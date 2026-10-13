// @ts-nocheck
export const STORAGE_KEY = "vad-carotid-support.accessibility.v1";
/** @typedef {{ textScale: number, spacing: "standard" | "roomy", contrast: "standard" | "high", theme: "light" | "dark", reducedMotion: boolean, simplifiedReading: boolean }} AccessibilitySettings */
export function emptyAccessibilitySettings() { return { textScale: 1, spacing: "standard", contrast: "standard", theme: "light", reducedMotion: false, simplifiedReading: false }; }
export function parseAccessibilitySettings(input) {
  if (typeof input !== "string" || input.length > 1000) return emptyAccessibilitySettings();
  try {
    const value = JSON.parse(input); const base = emptyAccessibilitySettings();
    return { textScale: [1, 1.25, 1.5, 1.75, 2].includes(value?.textScale) ? value.textScale : base.textScale, spacing: value?.spacing === "roomy" ? "roomy" : base.spacing, contrast: value?.contrast === "high" ? "high" : base.contrast, theme: value?.theme === "dark" ? "dark" : base.theme, reducedMotion: value?.reducedMotion === true, simplifiedReading: value?.simplifiedReading === true };
  } catch { return emptyAccessibilitySettings(); }
}
export function serializeAccessibilitySettings(settings) { const value = parseAccessibilitySettings(JSON.stringify(settings)); return JSON.stringify(value); }
