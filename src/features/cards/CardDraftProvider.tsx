import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { emptyMilestoneCard, emptyPersonalCard, localDate, type MilestoneCard, type PersonalCard, type CardAppearance } from "./model.mjs";
import { milestoneCardStore, personalCardStore } from "./store";
import { cardPhotoStore } from "./photos.mjs";
import { onProjectDataCleared, onProjectDataClearing } from "../local-data/keys.mjs";
export type CardPhotoAsset = {
    id: string;
    blob: Blob;
    width: number;
    height: number;
};
const appearanceKeys = ["templateId", "colourId", "illustrationId", "designId", "artworkId", "photoRef", "photoZoom", "photoX", "photoY"] as const;
type Mode = "templates" | "edit" | "preview";
export type CardStep = 1 | 2 | 3 | 4;
type Draft<T> = {
    card: T;
    photo: CardPhotoAsset | null;
    photoBusy: boolean;
    saveBusy: boolean;
    status: string;
    message: string;
    mode: Mode;
    step: CardStep;
    loaded: boolean;
};
export type DraftController<T> = Draft<T> & {
    canUndo: boolean;
    update: (patch: Partial<T>) => void;
    preview: () => void;
    edit: () => void;
    chooseDesign: () => void;
    setStep: (step: CardStep) => void;
    undoAppearance: () => void;
    beginPhoto: () => number;
    acceptPhoto: (photo: CardPhotoAsset, token: number) => void;
    finishPhoto: (token: number, error?: string) => void;
    removePhoto: () => void;
    save: () => Promise<void>;
    remove: () => Promise<boolean>;
    startBlank: () => void;
    clear: () => void;
};
function useDraft<T extends CardAppearance & {
    designId: string;
    artworkId: string;
}>(empty: () => T, store: any, kind: "personal" | "milestone"): DraftController<T> {
    const initial = (): Draft<T> => ({ card: empty(), photo: null, photoBusy: false, saveBusy: false, status: "loading", message: "Checking for a saved card…", mode: "edit", step: 1, loaded: false });
    const [draft, setDraft] = useState(initial), edited = useRef(false), epoch = useRef(0), current = useRef(draft), previous = useRef<{
        patch: Partial<T>;
        photo: CardPhotoAsset | null;
    } | undefined>(undefined);
    current.current = draft;
    const remember = () => { const d = current.current; previous.current = { patch: Object.fromEntries(appearanceKeys.map(key => [key, d.card[key]])) as Partial<T>, photo: d.photo }; };
    useEffect(() => {
        let live = true;
        void (async () => {
            try {
                const result = await store.loadRecord();
                let photo: CardPhotoAsset | null = null, photoFailed = false;
                if (result.card.photoRef && Platform.OS === "web")
                    try {
                        photo = await cardPhotoStore.get(result.card.photoRef, kind) as CardPhotoAsset | null;
                        photoFailed = !photo;
                    }
                    catch {
                        photoFailed = true;
                    }
                if (!live || edited.current)
                    return;
                const message = result.status === "restored" ? (photoFailed ? "Saved card restored. Its photo could not be read; replace or remove it before a visual export." : "Saved card restored from this device.") : result.status === "invalid" ? "The saved card could not be read. It has not been overwritten." : "Not saved. Choose a design to begin.";
                setDraft({ card: result.card, photo, photoBusy: false, saveBusy: false, status: result.status, mode: "edit", step: 1, loaded: true, message });
            }
            catch {
                if (live)
                setDraft(d => ({ ...d, loaded: true, status: "failed", mode: "edit", step: 1, message: "Saved card could not be read. You can still make a card." }));
            }
        })();
        return () => { live = false; };
    }, [store, kind]);
    const changes = { status: "unsaved", message: "Unsaved changes. They stay here while the app is open." };
    const stamp = () => kind === "personal" ? { updatedOn: localDate() } : {};
    const reset = (message: string, status: string) => { epoch.current++; edited.current = true; previous.current = undefined; setDraft({ ...initial(), loaded: true, status, message }); };
    useEffect(() => {
        const cleared = onProjectDataCleared(() => reset("Saved data cleared. This card is blank and not saved.", "absent"));
        const clearing = onProjectDataClearing(phase => {
            if (phase === "before") {
                epoch.current++;
                setDraft(d => ({...d, photoBusy:false, saveBusy:true, message:"Clearing saved data…"}));
            } else if (phase === "failed") {
                setDraft(d => ({...d, photoBusy:false, saveBusy:false, status:"failed", message:"Clearing was incomplete. Your draft is still here; saved data may have changed. Check it before relying on a saved copy."}));
            } else setDraft(d => ({...d, saveBusy:false}));
        });
        return () => { cleared(); clearing(); };
    }, [store, kind]);
    return { ...draft, canUndo: !!previous.current,
        update: patch => { if (appearanceKeys.some(key => Object.hasOwn(patch, key) && patch[key] !== current.current.card[key]))
            remember(); edited.current = true; setDraft(d => ({ ...d, loaded: true, card: { ...d.card, ...patch, ...stamp() }, ...changes })); },
        preview: () => setDraft(d => ({ ...d, mode: "preview", step: 4 })), edit: () => setDraft(d => ({ ...d, mode: "edit" })), chooseDesign: () => setDraft(d => ({ ...d, mode: "templates", step: 3 })), setStep: step => setDraft(d => ({ ...d, mode: step === 4 ? "preview" : "edit", step })),
        undoAppearance: () => { const before = previous.current; if (!before)
            return; previous.current = undefined; edited.current = true; epoch.current++; setDraft(d => ({ ...d, photo: before.photo, photoBusy: false, card: { ...d.card, ...before.patch, ...stamp() }, ...changes })); },
        beginPhoto: () => { const token = ++epoch.current; setDraft(d => ({ ...d, photoBusy: true })); return token; },
        acceptPhoto: (photo, token) => { if (token !== epoch.current)
            return; remember(); edited.current = true; setDraft(d => ({ ...d, photo, photoBusy: false, card: { ...d.card, photoRef: photo.id, photoZoom: 1, photoX: .5, photoY: .5, ...stamp() }, ...changes })); },
        finishPhoto: (token, error) => { if (token !== epoch.current)
            return; setDraft(d => ({ ...d, photoBusy: false, ...(error ? { message: error } : {}) })); },
        removePhoto: () => { remember(); epoch.current++; edited.current = true; setDraft(d => ({ ...d, photo: null, photoBusy: false, card: { ...d.card, photoRef: "", photoZoom: 1, photoX: .5, photoY: .5, ...stamp() }, ...changes })); },
        save: async () => { if (current.current.saveBusy || current.current.photoBusy)
            return; const original = draft.card, photo = draft.photo, snapshot = { ...original, ...stamp() }; setDraft(d => ({ ...d, saveBusy: true, message: "Saving the card and any chosen photo…" })); try {
            await store.save(snapshot, photo);
            setDraft(d => d.card === original ? { ...d, saveBusy: false, card: snapshot, status: "saved", message: "Saved on this device." } : { ...d, saveBusy: false });
        }
        catch (error) {
            setDraft(d => d.card === original ? { ...d, saveBusy: false, status: "failed", message: error instanceof Error && /^(Saving could not|The photo is unavailable)/.test(error.message) ? error.message : "Could not save the complete card. Your edits are still here; try again or download a copy." } : { ...d, saveBusy: false });
        } },
        remove: async () => { try {
            await store.remove();
            reset("Saved card and photo deleted from this device. Downloaded and printed copies are unchanged.", "absent");
            return true;
        }
        catch {
            setDraft(d => ({ ...d, status: "failed", message: "Could not complete deletion. The draft is still here; check saved data and try again." }));
            return false;
        } },
        startBlank: () => reset("Blank draft. Your saved card is unchanged until you save or delete it.", "unsaved"), clear: () => reset("Saved data cleared. This card is blank and not saved.", "absent"),
    };
}
type CardDrafts = {
    personal: DraftController<PersonalCard>;
    milestone: DraftController<MilestoneCard>;
    clearDrafts: () => void;
};
const Context = createContext<CardDrafts | null>(null);
export function CardDraftProvider({ children }: {
    children: ReactNode;
}) { const personal = useDraft<PersonalCard>(emptyPersonalCard, personalCardStore, "personal"), milestone = useDraft<MilestoneCard>(emptyMilestoneCard, milestoneCardStore, "milestone"); const value = useMemo(() => ({ personal, milestone, clearDrafts: () => { personal.clear(); milestone.clear(); } }), [personal, milestone]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useCardDrafts() { const value = useContext(Context); if (!value)
    throw new Error("Card drafts require their provider."); return value; }
