import { emptyReadingSession, normalizeGuideLibrarySession, normalizeReadingSession, setReadingModeOverride, setReadingPage } from "./model.mjs";
import { onProjectDataCleared } from "../local-data/keys.mjs";

const sessions = new Map();
const listeners = new Set();
let librarySession = normalizeGuideLibrarySession();

function notify() {
  for (const listener of listeners) listener();
}

export function getReadingSession(slug, sectionCount) {
  if (typeof slug !== "string" || !slug) return emptyReadingSession();
  const normalized = normalizeReadingSession(sessions.get(slug), sectionCount);
  sessions.set(slug, normalized);
  return normalized;
}

export function setReadingPageForGuide(slug, index, sectionCount) {
  if (typeof slug !== "string" || !slug) return;
  sessions.set(slug, setReadingPage(getReadingSession(slug, sectionCount), index, sectionCount));
  notify();
}

export function setReadingModeForGuide(slug, value, sectionCount) {
  if (typeof slug !== "string" || !slug) return;
  sessions.set(slug, setReadingModeOverride(getReadingSession(slug, sectionCount), value, sectionCount));
  notify();
}

export function subscribeReadingSessions(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGuideLibrarySession() {
  return librarySession;
}

export function updateGuideLibrarySession(patch) {
  librarySession = normalizeGuideLibrarySession({ ...librarySession, ...patch });
  notify();
}

export function clearReadingSessions() {
  sessions.clear();
  librarySession = normalizeGuideLibrarySession();
  notify();
}

onProjectDataCleared(clearReadingSessions);
