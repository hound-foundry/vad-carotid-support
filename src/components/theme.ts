import type { AccessibilitySettings } from "../features/accessibility/model.mjs";

export const palette = { ink: "#183B3B", text: "#435A5A", muted: "#4C6360", teal: "#26736E", tealDark: "#195B58", mint: "#E4F0ED", paper: "#F3F7F6", white: "#FFFFFF", line: "#DCE7E4", alert: "#F9E9E2", alertInk: "#713A2D", gold: "#956020" };

export function themeFor(settings: AccessibilitySettings) {
  const dark = settings.theme === "dark";
  if (settings.contrast === "high") return { ...palette, ink: dark ? "#FFFFFF" : "#111111", text: dark ? "#FFFFFF" : "#111111", muted: dark ? "#FFFFFF" : "#111111", tealDark: dark ? "#D6FFF1" : "#163D35", paper: dark ? "#101A17" : "#FFFFFF", white: dark ? "#101A17" : "#FFFFFF", mint: dark ? "#213B32" : "#E4F0ED", line: dark ? "#FFFFFF" : "#111111", alert: dark ? "#30291F" : "#FFF4E7", alertInk: dark ? "#FFFFFF" : "#442816", gold: dark ? "#FFE4A8" : "#653F0B", controlLine: dark ? "#FFFFFF" : "#111111" };
  return dark ? { ...palette, ink: "#F0F7F4", text: "#D0DED8", muted: "#B8CBC3", tealDark: "#9ADBCB", paper: "#102620", white: "#17352E", mint: "#21453B", line: "#3D6658", alert: "#332D24", alertInk: "#F4CCB0", gold: "#E8C48B", controlLine: "#94B5A6" } : { ...palette, controlLine: "#657C73" };
}

// Existing route colours are resolved centrally, including the older authored pages.
export function themedColour(value: unknown, property: string, settings: AccessibilitySettings) {
  if (typeof value !== "string" || !value.startsWith("#")) return value;
  const colour = value.toUpperCase(); const t = themeFor(settings);
  if (["#183B3B", "#293D3A", "#394C47", "#111111", "#000000"].includes(colour)) return t.ink;
  if (["#435A5A", "#52635C", "#576762", "#596861"].includes(colour)) return t.text;
  if (["#617474", "#4C6360", "#537670", "#3C6963", "#3F7773"].includes(colour)) return t.muted;
  if (colour === "#195B58") return t.tealDark;
  if (colour === "#26736E") return property === "backgroundColor" ? palette.teal : t.tealDark;
  if (["#FFFFFF", "#FBFCFA"].includes(colour)) return property === "color" ? "#FFFFFF" : t.white;
  if (["#F3F7F6", "#EDF0EC", "#EDF2F0"].includes(colour)) return t.paper;
  if (colour === "#E4F0ED") return t.mint;
  if (["#F9E9E2", "#F0D5C8", "#FFF9F6"].includes(colour)) return t.alert;
  if (["#713A2D", "#704D42"].includes(colour)) return t.alertInk;
  if (["#F2EEE3", "#FFF9F1"].includes(colour)) return t.mint;
  if (colour === "#956020") return t.gold;
  if (["#71817A", "#899A93", "#6EAAA0", "#657C73"].includes(colour)) return t.controlLine;
  if (["#DCE7E4", "#DCE4DE", "#C6DDD7", "#CAD8D1", "#D0E2DD", "#B8D4CE", "#8FBAB0", "#E4DCC9", "#E6C7B9", "#E9CFC3", "#EAD9BD", "#B98170"].includes(colour)) return t.line;
  return value;
}
