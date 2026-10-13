// Reading progress and a per-guide reading-mode override live in memory only.
export function emptyReadingSession() {
  return { pageIndex: 0, modeOverride: null };
}

export function clampPageIndex(index, sectionCount) {
  const lastIndex = Math.max(0, Math.floor(Number(sectionCount) || 0) - 1);
  return Math.min(lastIndex, Math.max(0, Math.floor(Number(index) || 0)));
}

export function normalizeReadingSession(value, sectionCount) {
  return {
    pageIndex: clampPageIndex(value?.pageIndex, sectionCount),
    modeOverride: typeof value?.modeOverride === "boolean" ? value.modeOverride : null,
  };
}

export function effectiveOneAtATime(session, globalSimplifiedReading) {
  return session?.modeOverride ?? globalSimplifiedReading === true;
}

export function setReadingPage(session, index, sectionCount) {
  return { ...normalizeReadingSession(session, sectionCount), pageIndex: clampPageIndex(index, sectionCount) };
}

export function setReadingModeOverride(session, value, sectionCount) {
  return { ...normalizeReadingSession(session, sectionCount), modeOverride: typeof value === "boolean" ? value : null };
}

export function normalizeGuideLibrarySession(value) {
  return {
    query: typeof value?.query === "string" ? value.query.slice(0, 80) : "",
    audience: ["all", "patient", "carer"].includes(value?.audience) ? value.audience : "all",
  };
}
