// @ts-check
import { APP_NAME } from "../../brand.mjs";

export const STORAGE_KEY = "vad-carotid-support.saved-guides.v1";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SAVED_GUIDES = 100;

/** @returns {string[]} */
export function emptySavedGuides() {
  return [];
}

/** @param {unknown} input @returns {string[]} */
export function parseSavedGuides(input) {
  if (typeof input !== "string" || input.length > 4096) return emptySavedGuides();
  try {
    const value = JSON.parse(input);
    if (value?.version !== 1 || !Array.isArray(value.slugs)) return emptySavedGuides();
    return parseSavedGuidesInput(value.slugs);
  } catch {
    return emptySavedGuides();
  }
}

/** @param {unknown} input @returns {string[]} */
export function parseSavedGuidesInput(input) {
  if (!Array.isArray(input)) return emptySavedGuides();
  /** @type {unknown[]} */
  const values = input;
  /** @type {Set<string>} */
  const slugs = new Set();
  for (const value of values) if (typeof value === "string" && SLUG_PATTERN.test(value)) slugs.add(value);
  return [...slugs].slice(0, MAX_SAVED_GUIDES);
}

/** @param {unknown[]} slugs */
export function serializeSavedGuides(slugs) {
  return JSON.stringify({
    version: 1,
    slugs: parseSavedGuidesInput(slugs),
  });
}

/** @param {Array<{ slug:string, title:string }>} guides @param {string} [baseUrl] */
export function formatSavedGuidesExport(guides, baseUrl = "") {
  const base = baseUrl.replace(/\/$/, "");
  return [
    `Saved guides — ${APP_NAME}`,
    "These are links to general information drafts, not a personal care record.",
    "",
    ...(guides.length ? guides.map((guide) => `${guide.title}\n${base}/guide/${guide.slug}`) : ["No guides were saved."]),
  ].join("\n\n");
}
