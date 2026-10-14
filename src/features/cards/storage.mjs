import { PERSONAL_CARD_KEY, MILESTONE_CARD_KEY, emptyPersonalCard, emptyMilestoneCard, parsePersonalCard, parseMilestoneCard, serializePersonalCard, serializeMilestoneCard } from "./model.mjs";
import { onProjectDataClearing } from "../local-data/keys.mjs";

export function createCardStore(adapter, kind, photos) {
  const key = kind === "personal" ? PERSONAL_CARD_KEY : MILESTONE_CARD_KEY;
  const empty = kind === "personal" ? emptyPersonalCard : emptyMilestoneCard;
  const parse = kind === "personal" ? parsePersonalCard : parseMilestoneCard;
  const serialize = kind === "personal" ? serializePersonalCard : serializeMilestoneCard;
  let tail = Promise.resolve();
  let clearing = false;
  const write = (operation) => {
    if (clearing) return Promise.reject(new Error("Saved data is being cleared. Try again afterwards."));
    const result = tail.then(operation);
    tail = result.catch(() => undefined);
    return result;
  };
  return {
    key,
    async loadRecord() {
      const raw = await adapter.getItem(key);
      if (raw == null) return { card: empty(), status: "absent" };
      let valid = false;
      try { const value = JSON.parse(raw); valid = raw.length <= 10000 && value?.version === 1 && value.card != null && typeof value.card === "object" && !Array.isArray(value.card); } catch { /* No private data in errors or logs. */ }
      return { card: valid ? parse(raw) : empty(), status: valid ? "restored" : "invalid" };
    },
    async load() { return (await this.loadRecord()).card; },
    save(card, photo) {
      const snapshot = serialize(card);
      if(!photos)return write(() => adapter.setItem(key,snapshot));
      return write(async()=>{
        const previous=await adapter.getItem(key),before=previous?parse(previous):empty(),next=parse(snapshot);
        let inserted=false,recordWritten=false;
        try{
          if(next.photoRef){const existing=await photos.get(next.photoRef,kind);if(!existing){if(!photo||photo.id!==next.photoRef)throw new Error("The photo is unavailable. Replace or remove it before saving.");await photos.put(photo,kind);inserted=true;}}
          await adapter.setItem(key,snapshot);recordWritten=true;
          if(before.photoRef&&before.photoRef!==next.photoRef)await photos.remove(before.photoRef,kind);
        }catch(error){
          let rollbackFailed=false;
          if(recordWritten)try{if(previous==null)await adapter.removeItem(key);else await adapter.setItem(key,previous);}catch{rollbackFailed=true;}
          if(inserted)try{await photos.remove(next.photoRef,kind);}catch{rollbackFailed=true;}
          if(rollbackFailed)throw new Error("Saving could not finish. Check the saved card before retrying; some local data may have changed.");
          throw error;
        }
      });
    },
    remove() { return write(async()=>{
      if(!photos){await adapter.removeItem(key);return;}
      const previous=await adapter.getItem(key);await adapter.removeItem(key);
      try{await photos.removeOwner(kind);}catch(error){if(previous!=null)try{await adapter.setItem(key,previous);}catch{throw new Error("Deletion was incomplete. Check saved data and try again.");}throw error;}
    }); },
    pauseWrites() { clearing = true; },
    resumeWrites() { clearing = false; },
    drain() { return tail; },
  };
}

/** Pause new writes and finish existing writes before the six keys are removed. */
export function coordinateCardClearing(stores) {
  return onProjectDataClearing(async (phase) => {
    if (phase === "before") {
      for (const store of stores) store.pauseWrites();
      await Promise.all(stores.map((store) => store.drain()));
    } else {
      for (const store of stores) store.resumeWrites();
    }
  });
}
