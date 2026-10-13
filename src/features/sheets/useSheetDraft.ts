import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { getSheetDraftSession } from "./drafts.mjs";

export type SheetDraftStatus = "loading" | "blank" | "saved" | "restored" | "unsaved" | "saving" | "load-failed" | "save-failed" | "cleared" | "deleting" | "delete-failed";
export type SheetDraftSnapshot<T> = { id: string; value: T; status: SheetDraftStatus; hasContent: boolean; dirty: boolean };

/** Shared in-memory sheet state that survives route unmounts until app shutdown. */
export function useSheetDraft<T>(config: {
  id: string;
  empty: () => T;
  isEmpty: (value: T) => boolean;
  load: () => Promise<T>;
  save: (value: T) => Promise<void>;
  remove: () => Promise<void>;
  suggestion?: () => T | undefined;
}) {
  const { id, empty, isEmpty, load, save, remove, suggestion } = config;
  const session = useMemo(() => getSheetDraftSession(id, { empty, isEmpty, load, save, remove }), [id]);
  const suggestionRef = useRef(suggestion);
  suggestionRef.current = suggestion;
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot) as SheetDraftSnapshot<T>;
  useEffect(() => {
    session.hydrate(() => suggestionRef.current?.());
    session.applySuggestion(suggestionRef.current?.());
  }, [session, suggestion]);
  return {
    ...snapshot,
    edit: (value: T | ((current: T) => T)) => session.edit(value),
    save: () => session.save(),
    remove: () => session.remove(),
  };
}
