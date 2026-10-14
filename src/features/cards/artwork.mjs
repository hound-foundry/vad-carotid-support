// Original project artwork. These paths are decorative, not anatomical diagrams,
// medical-alert symbols, certification marks or claims about the cardholder.
import { ARTERY_RIBBON_PATHS } from "./collection-art.mjs";
export const ART_COLOURS = { ink: "#183248", accent: "#2B5F87", soft: "#E8EFF4", white: "#FFFFFF" };
/** @typedef {{d: string, fill?: "ink" | "accent" | "soft" | "white", stroke?: "ink" | "accent" | "soft" | "white", width?: number}} ArtworkPath */
/** @type {ArtworkPath} */
const disk = { d: "M50 3C76 3 97 24 97 50C97 76 76 97 50 97C24 97 3 76 3 50C3 24 24 3 50 3Z", fill: "soft" };
/** @type {Array<{id: string, name: string, description: string, paths: ArtworkPath[]}>} */
export const CARD_ARTWORK = [
  { id: "none", name: "No artwork", description: "Keep the card plain.", paths: [] },
  { id: "ribbon", name: "Ribbon", description: "A blue ribbon.", paths: [disk,
    { d: "M33 26C36 12 64 12 67 26C70 38 56 55 43 73L34 86L23 74C39 57 64 30 57 25C53 22 47 22 43 25C36 30 61 57 77 74L66 86L57 73C44 55 30 38 33 26Z", fill: "accent" },
    { d: "M43 25C47 22 53 22 57 25", stroke: "ink", width: 2 },
  ] },
  { id: "leaf", name: "Growing leaf", description: "A leaf and stem.", paths: [disk,
    { d: "M48 72C25 73 17 55 21 38C41 37 54 51 48 72Z", fill: "accent" },
    { d: "M50 55C46 32 60 20 80 21C82 40 70 57 50 55Z", fill: "white", stroke: "accent", width: 3 },
    { d: "M50 86L50 56L69 33M50 72L31 49", stroke: "ink", width: 3 },
  ] },
  { id: "shield", name: "Shield and leaf", description: "A simple shield and leaf drawing.", paths: [disk,
    { d: "M50 14C61 23 72 25 80 25L80 49C80 66 68 81 50 90C32 81 20 66 20 49L20 25C28 25 39 23 50 14Z", fill: "white", stroke: "accent", width: 3 },
    { d: "M42 61C38 40 49 32 66 33C67 49 57 62 42 61Z", fill: "accent" },
    { d: "M39 73L56 44", stroke: "ink", width: 3 },
  ] },
  // Keep the saved ID while replacing the old drawing everywhere.
  { id: "brain", name: "Artery & ribbon", description: "An original branching-vessel and awareness-ribbon motif.", paths: [disk,
    ...ARTERY_RIBBON_PATHS.map(path => ({ ...path, ...(path.fill === "paper" ? { fill: "white" } : {}), ...(path.stroke === "paper" ? { stroke: "white" } : {}) })),
  ] },
];
export function normalizeArtwork(id) { return CARD_ARTWORK.some((art) => art.id === id) ? id : "none"; }
export function cardArtwork(id) { return CARD_ARTWORK.find((art) => art.id === id) ?? CARD_ARTWORK[0]; }
export function cardArtworkSvg(id, size = 256) {
  const art = cardArtwork(id); if (art.id === "none") return "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">${art.paths.map((path) => `<path d="${path.d}" fill="${path.fill ? ART_COLOURS[path.fill] : "none"}"${path.stroke ? ` stroke="${ART_COLOURS[path.stroke]}" stroke-width="${path.width}" stroke-linecap="round" stroke-linejoin="round"` : ""}/>`).join("")}</svg>`;
}
