import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { clearReadingSessions, getGuideLibrarySession, getReadingSession, getSheetView, setReadingModeForGuide, setReadingPageForGuide, subscribeReadingSessions, updateGuideLibrarySession, updateSheetView } from "./store.mjs";
import { effectiveOneAtATime } from "./model.mjs";

type ReadingSessionContextValue = { revision: number; clear: () => void };
const ReadingSessionContext = createContext<ReadingSessionContextValue>({ revision: 0, clear: clearReadingSessions });

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const revision = useSyncExternalStore(subscribeReadingSessions, getRevision, getRevision);
  const value = useMemo(() => ({ revision, clear: clearReadingSessions }), [revision]);
  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>;
}

let revision = 0;
function getRevision() { return revision; }
subscribeReadingSessions(() => {
  revision += 1;
});

export function useReadingSession(slug: string, sectionCount: number, globalSimplifiedReading: boolean) {
  const context = useContext(ReadingSessionContext);
  void context.revision;
  const session = getReadingSession(slug, sectionCount);
  return {
    ...session,
    oneAtATime: effectiveOneAtATime(session, globalSimplifiedReading),
    setPageIndex: (index: number) => setReadingPageForGuide(slug, index, sectionCount),
    setOneAtATime: (value: boolean) => setReadingModeForGuide(slug, value, sectionCount),
    useGlobalMode: () => setReadingModeForGuide(slug, null, sectionCount),
    clear: context.clear,
  };
}

export function useGuideLibrarySession() {
  const context = useContext(ReadingSessionContext);
  void context.revision;
  const session = getGuideLibrarySession();
  return {
    ...session,
    setQuery: (query: string) => updateGuideLibrarySession({ query }),
    setAudience: (audience: "all" | "patient" | "carer") => updateGuideLibrarySession({ audience }),
    clear: context.clear,
  };
}

type ValueUpdate<T> = T | ((current: T) => T);
function updated<T>(value: ValueUpdate<T>, current: T): T {
  return typeof value === "function" ? (value as (current: T) => T)(current) : value;
}

export function useSheetView(id: string, sectionCount: number, globalSimplifiedReading: boolean) {
  const context = useContext(ReadingSessionContext);
  void context.revision;
  const view = getSheetView(id, sectionCount);
  return {
    ...view,
    oneAtATime: effectiveOneAtATime(view, globalSimplifiedReading),
    setOneAtATime: (value: ValueUpdate<boolean>) => updateSheetView(id, { modeOverride: updated(value, effectiveOneAtATime(getSheetView(id, sectionCount), globalSimplifiedReading)) }, sectionCount),
    setPageIndex: (value: ValueUpdate<number>) => updateSheetView(id, { pageIndex: updated(value, getSheetView(id, sectionCount).pageIndex) }, sectionCount),
    setSelectedOnly: (value: ValueUpdate<boolean>) => updateSheetView(id, { selectedOnly: updated(value, getSheetView(id, sectionCount).selectedOnly) }, sectionCount),
    setOptionsOpen: (value: ValueUpdate<boolean>) => updateSheetView(id, { optionsOpen: updated(value, getSheetView(id, sectionCount).optionsOpen) }, sectionCount),
  };
}
