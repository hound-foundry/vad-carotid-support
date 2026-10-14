// @ts-check
import { onProjectDataClearing } from "../local-data/keys.mjs";

const sessions = new Map();
/** @type {Set<()=>void>} */
const subscribers = new Set();

/** @typedef {"loading"|"blank"|"saved"|"restored"|"unsaved"|"saving"|"load-failed"|"save-failed"|"cleared"|"deleting"|"delete-failed"} SheetStatus */

/**
 * Create one in-memory draft session. The session owns no persistent storage;
 * callers provide the existing explicit-save storage functions.
 * @template T
 * @param {string} id
 * @param {{empty:()=>T, isEmpty:(value:T)=>boolean, load:()=>Promise<T>, save:(value:T)=>Promise<void>, remove:()=>Promise<void>}} options
 */
export function createSheetDraftSession(id, options) {
  let value = options.empty();
  let status = /** @type {SheetStatus} */ ("loading");
  let touched = false;
  let revision = 0;
  let generation = 0;
  let started = false;
  let clearing = false;
  let deleting = false;
  /** @type {Set<Promise<unknown>>} */
  const pendingWrites = new Set();
  let writeQueue = Promise.resolve();
  /** @type {Set<()=>void>} */
  const listeners = new Set();
  let currentSnapshot = { id, value, status, hasContent: !options.isEmpty(value), dirty: false };
  const snapshot = () => currentSnapshot;
  const notify = () => {
    currentSnapshot = { id, value, status, hasContent: !options.isEmpty(value), dirty: status === "unsaved" || status === "saving" || status === "save-failed" };
    for (const listener of listeners) listener();
    for (const listener of subscribers) listener();
  };

  const offClear = onProjectDataClearing(async (phase) => {
    if (phase === "before") {
      clearing = true;
      generation += 1;
      await Promise.all([...pendingWrites].map((write) => write.catch(() => undefined)));
      return;
    }
    if (phase === "failed") { clearing = false; return; }
    clearing = false;
    value = options.empty();
    status = "cleared";
    touched = false;
    revision += 1;
    notify();
  });

  return {
    getSnapshot: snapshot,
    /** @param {()=>void} listener */
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    /** @param {(()=>T|undefined)=} suggest */
    hydrate(suggest) {
      if (started) return;
      started = true;
      const requestGeneration = generation;
      const requestRevision = revision;
      void options.load().then((loaded) => {
        if (requestGeneration !== generation || requestRevision !== revision || touched) return;
        value = loaded;
        const suggestion = options.isEmpty(loaded) ? suggest?.() : undefined;
        if (suggestion !== undefined && !options.isEmpty(suggestion)) {
          value = suggestion;
          status = "unsaved";
          touched = true;
          revision += 1;
        } else {
          status = options.isEmpty(loaded) ? "blank" : "restored";
        }
        notify();
      }).catch(() => {
        if (requestGeneration !== generation || requestRevision !== revision || touched) return;
        value = options.empty();
        status = "load-failed";
        notify();
      });
    },
    /** @param {T|undefined} suggestion */
    applySuggestion(suggestion) {
      if (!started || status !== "blank" || touched || !options.isEmpty(value) || suggestion === undefined || options.isEmpty(suggestion)) return false;
      value = suggestion;
      status = "unsaved";
      touched = true;
      revision += 1;
      notify();
      return true;
    },
    /** @param {T|((current:T)=>T)} next */
    edit(next) {
      if (clearing) return;
      value = typeof next === "function" ? /** @type {(current:T)=>T} */ (next)(value) : next;
      touched = true;
      revision += 1;
      status = "unsaved";
      notify();
    },
    async save() {
      if (clearing || deleting) return false;
      const savedValue = value;
      const saveRevision = revision;
      const saveGeneration = generation;
      status = "saving";
      notify();
      const write = writeQueue.catch(() => undefined).then(async () => {
        if (saveGeneration !== generation || clearing || deleting) return false;
        await options.save(savedValue);
        return true;
      });
      writeQueue = write.then(() => undefined, () => undefined);
      pendingWrites.add(write);
      try {
        const wrote = await write;
        if (!wrote) return false;
        if (saveGeneration !== generation) return false;
        if (saveRevision === revision) {
          status = "saved";
          touched = false;
        } else {
          status = "unsaved";
        }
        notify();
        return true;
      } catch {
        if (saveGeneration === generation) {
          status = "save-failed";
          notify();
        }
        return false;
      } finally {
        pendingWrites.delete(write);
      }
    },
    async remove() {
      if (clearing || deleting) return false;
      deleting = true;
      const deleteGeneration = ++generation;
      status = "deleting";
      notify();
      await Promise.all([...pendingWrites].map((write) => write.catch(() => undefined)));
      if (deleteGeneration !== generation || clearing) { deleting = false; return false; }
      try {
        await options.remove();
        if (deleteGeneration !== generation) { deleting = false; return false; }
        value = options.empty();
        status = "blank";
        touched = false;
        revision += 1;
        deleting = false;
        notify();
        return true;
      } catch {
        deleting = false;
        if (deleteGeneration === generation) {
          status = "delete-failed";
          notify();
        }
        return false;
      }
    },
    dispose() { offClear(); },
  };
}

/** @template T @param {string} id @param {{empty:()=>T, isEmpty:(value:T)=>boolean, load:()=>Promise<T>, save:(value:T)=>Promise<void>, remove:()=>Promise<void>}} options */
export function getSheetDraftSession(id, options) {
  let session = sessions.get(id);
  if (!session) {
    session = createSheetDraftSession(id, options);
    sessions.set(id, session);
  }
  return session;
}

export function getSheetDraftStatuses() {
  return [...sessions.values()].map((session) => {
    const { id, status, hasContent, dirty } = session.getSnapshot();
    return { id, status, hasContent, dirty };
  });
}

/** @param {()=>void} listener */
export function subscribeToSheetDraftStatuses(listener) {
  subscribers.add(listener);
  return () => { subscribers.delete(listener); };
}
