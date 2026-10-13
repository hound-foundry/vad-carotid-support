import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { emptyMilestoneCard, emptyPersonalCard, localDate, type MilestoneCard, type PersonalCard } from "./model.mjs";
import { milestoneCardStore, personalCardStore } from "./store";

type Draft<T> = { card: T; status: string; message: string; mode: "edit" | "preview"; loaded: boolean };
type DraftController<T> = Draft<T> & { update: (patch: Partial<T>) => void; preview: () => void; edit: () => void; save: () => Promise<void>; remove: () => Promise<boolean>; startBlank: () => void; clear: () => void };
function useDraft<T>(empty: () => T, store: any, personal: boolean): DraftController<T> {
  const initial = (): Draft<T> => ({ card: empty(), status: "loading", message: "Checking for a saved card…", mode: "edit", loaded: false });
  const [draft, setDraft] = useState(initial); const edited = useRef(false);
  useEffect(() => { let live = true; void store.loadRecord().then((result: any) => { if (!live || edited.current) return; setDraft({ card: result.card, status: result.status, mode: "edit", loaded: true, message: result.status === "restored" ? "Saved card restored from this device." : result.status === "invalid" ? "The saved card could not be read. It has not been overwritten." : "Not saved. You can preview without saving." }); }).catch(() => { if (live) setDraft((d) => ({ ...d, loaded: true, status: "failed", message: "Saved card could not be read. You can still make a card." })); }); return () => { live = false; }; }, [store]);
  return { ...draft,
    update: (patch) => { edited.current = true; setDraft((d) => ({ ...d, loaded: true, card: { ...d.card, ...patch, ...(personal ? { updatedOn: localDate() } : {}) }, status: "unsaved", message: "Unsaved changes. They stay here while the app is open." })); },
    preview: () => setDraft((d) => ({ ...d, mode: "preview" })), edit: () => setDraft((d) => ({ ...d, mode: "edit" })),
    save: async () => { const original = draft.card; const snapshot = personal ? { ...original, updatedOn: localDate() } : original; try { await store.save(snapshot); setDraft((d) => d.card === original ? { ...d, card: snapshot, status: "saved", message: "Saved on this device." } : d); } catch { setDraft((d) => d.card === original ? { ...d, status: "failed", message: "Could not save. Your edits are still here; try again or download a copy." } : d); } },
    remove: async () => { try { await store.remove(); edited.current = true; setDraft({ ...initial(), loaded: true, status: "absent", message: "Saved card deleted from this device. Downloaded and printed copies are unchanged." }); return true; } catch { setDraft((d) => ({ ...d, status: "failed", message: "Could not delete the saved card. Try again." })); return false; } },
    startBlank: () => { edited.current = true; setDraft({ ...initial(), loaded: true, status: "unsaved", message: "Blank draft. Your saved card is unchanged until you save or delete it." }); },
    clear: () => { edited.current = true; setDraft({ ...initial(), loaded: true, status: "absent", message: "Saved data cleared. This card is blank and not saved." }); },
  };
}
type CardDrafts = { personal: DraftController<PersonalCard>; milestone: DraftController<MilestoneCard>; clearDrafts: () => void };
const Context = createContext<CardDrafts | null>(null);
export function CardDraftProvider({ children }: { children: ReactNode }) {
  const personal = useDraft<PersonalCard>(emptyPersonalCard, personalCardStore, true);
  const milestone = useDraft<MilestoneCard>(emptyMilestoneCard, milestoneCardStore, false);
  const value = useMemo(() => ({ personal, milestone, clearDrafts: () => { personal.clear(); milestone.clear(); } }), [personal, milestone]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCardDrafts() { const value = useContext(Context); if (!value) throw new Error("Card drafts require their provider."); return value; }
