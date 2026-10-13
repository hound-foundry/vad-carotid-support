// Retain established property names for authored route styles.
// teal/tealDark are primary action/link; mint is the selected surface.
export const palette = { ink: "#183248", text: "#33485C", muted: "#526574", teal: "#2B5F87", tealDark: "#214C70", mint: "#E8EFF4", paper: "#F5F6F4", white: "#FFFFFF", line: "#D3DFE7", alert: "#F9E9E2", alertInk: "#713A2D", gold: "#956020" };
export const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const focusColours = { light: palette.tealDark, dark: "#BDD9EE" };
export const controlLine = "#65798A";

/** @param {import("../features/accessibility/model.mjs").AccessibilitySettings} settings */
export function themeFor(settings) {
  const dark = settings.theme === "dark";
  if (settings.contrast === "high") return { ...palette, ink: dark ? "#FFFFFF" : "#111111", text: dark ? "#FFFFFF" : "#111111", muted: dark ? "#FFFFFF" : "#111111", tealDark: dark ? "#DCEFFF" : "#173B58", paper: dark ? "#101820" : "#FFFFFF", white: dark ? "#101820" : "#FFFFFF", mint: dark ? "#203746" : palette.mint, line: dark ? "#FFFFFF" : "#111111", alert: dark ? "#30291F" : "#FFF4E7", alertInk: dark ? "#FFFFFF" : "#442816", gold: dark ? "#FFE4A8" : "#653F0B", controlLine: dark ? "#FFFFFF" : "#111111" };
  return dark ? { ...palette, ink: "#F0F4F7", text: "#D9E2E9", muted: "#BFCDD8", tealDark: "#BDD9EE", paper: "#121D27", white: "#172633", mint: "#233B4E", line: "#40586B", alert: "#332D24", alertInk: "#F4CCB0", gold: "#E8C48B", controlLine: "#9BAFC0" } : { ...palette, controlLine };
}

const legacyColours = {
  ink: ["#183B3B", "#293D3A", "#394C47", "#111111", "#000000"],
  text: ["#435A5A", "#52635C", "#576762", "#596861"],
  muted: ["#617474", "#4C6360", "#537670", "#3C6963", "#3F7773"],
  tealDark: ["#195B58"], teal: ["#26736E"], white: ["#FBFCFA"],
  paper: ["#F3F7F6", "#EDF0EC", "#EDF2F0"], mint: ["#E4F0ED", "#F2EEE3", "#FFF9F1"],
  alert: ["#F0D5C8", "#FFF9F6"], alertInk: ["#704D42"],
  controlLine: [controlLine, "#71817A", "#899A93", "#6EAAA0", "#657C73"],
  line: ["#DCE7E4", "#DCE4DE", "#C6DDD7", "#CAD8D1", "#D0E2DD", "#B8D4CE", "#8FBAB0", "#E4DCC9", "#E6C7B9", "#E9CFC3", "#EAD9BD", "#B98170", "#DDE7E3"],
};
const roles = new Map(Object.entries(palette).map(([role, colour]) => [colour, role]));
for (const [role, colours] of Object.entries(legacyColours)) for (const colour of colours) roles.set(colour, role);

/** @param {unknown} value @param {string} property @param {import("../features/accessibility/model.mjs").AccessibilitySettings} settings */
export function themedColour(value, property, settings) {
  if (typeof value !== "string" || !value.startsWith("#")) return value;
  const role = roles.get(value.toUpperCase()); if (!role) return value;
  const t = themeFor(settings);
  // A filled control keeps a dark fill and a white label in every theme.
  if (role === "teal") return property === "backgroundColor" ? palette.teal : t.tealDark;
  if (role === "tealDark" && property === "backgroundColor") return palette.tealDark;
  if (role === "ink" && property === "backgroundColor") return palette.ink;
  if (role === "white" && property === "color") return palette.white;
  return t[role];
}

// Opaque token pairs only; actual routes and assistive technology need separate checks.
export function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export function designContrastReport() {
  return ["light", "dark"].flatMap((theme) => ["standard", "high"].flatMap((contrast) => {
    const settings = { theme, contrast }; const t = themeFor(settings);
    const pairs = [
      ["body/page", t.text, t.paper, 4.5], ["body/surface", t.text, t.white, 4.5],
      ["heading/surface", t.ink, t.white, 4.5], ["supporting/surface", t.muted, t.white, 4.5],
      ["link/selection", t.tealDark, t.mint, 4.5], ["urgent", t.alertInk, t.alert, 4.5],
      ["primary label", palette.white, palette.teal, 4.5],
      ["checked label", palette.white, themedColour("#195B58", "backgroundColor", settings), 4.5],
      ["skip label", palette.white, themedColour(palette.ink, "backgroundColor", settings), 4.5],
      ["input boundary", t.controlLine, t.white, 3],
      ["focus/page", focusColours[theme], t.paper, 3], ["focus/surface", focusColours[theme], t.white, 3],
    ];
    return pairs.map(([pair, foreground, background, minimum]) => ({ theme, contrast, pair, foreground, background, minimum, ratio: contrastRatio(foreground, background) }));
  }));
}
