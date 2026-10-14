import { palette } from "../../components/theme.mjs";

// Only these local designs and drawings can enter a saved card. No URLs,
// uploaded images, HTML or executable styling are accepted from stored data.
export const CARD_DESIGNS = [
  { id: "clear", name: "Clear blue", description: "White paper, blue detail.", background: palette.white, ink: palette.ink, muted: palette.text, accent: palette.tealDark, border: palette.line, header: palette.white, headerInk: palette.ink },
  { id: "ink", name: "Ink heading", description: "A formal navy heading on white paper.", background: palette.white, ink: palette.ink, muted: palette.text, accent: palette.tealDark, border: palette.line, header: palette.ink, headerInk: palette.white },
  { id: "gentle", name: "Quiet teal", description: "Soft paper with a restrained teal accent.", background: "#EEF4F2", ink: "#203D3C", muted: "#385654", accent: "#285E5B", border: "#BED2CD", header: "#EEF4F2", headerInk: "#203D3C" },
  { id: "midnight", name: "Deep blue", description: "Pale text on a deep blue card.", background: palette.ink, ink: "#F0F4F7", muted: "#D8E3EC", accent: "#BDD9EE", border: "#9BB3C7", header: palette.ink, headerInk: "#F0F4F7" },
];
export const DEFAULT_CARD_DESIGN = "clear";
export function cardDesign(id) { return CARD_DESIGNS.find((design) => design.id === id) ?? CARD_DESIGNS[0]; }
export function normalizeDesign(id) { return CARD_DESIGNS.some((design) => design.id === id) ? id : DEFAULT_CARD_DESIGN; }
export const CARD_WORDING = [
  { label: "My milestone", title: "My milestone" },
  { label: "Survivor", title: "SURVIVOR" },
  { label: "Dissection survivor", title: "DISSECTION SURVIVOR" },
  { label: "Stroke survivor", title: "STROKE SURVIVOR" },
  { label: "Warrior", title: "WARRIOR" },
];
