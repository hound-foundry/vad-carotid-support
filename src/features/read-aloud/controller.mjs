/**
 * @typedef {{createUtterance:(text:string)=>SpeechSynthesisUtterance,
 * speak:(utterance:SpeechSynthesisUtterance)=>void, cancel:()=>void}} SpeechAdapter
 */

/** Own speech lifecycle; snapshots contain only control state and feedback. */
/** @param {()=>SpeechAdapter|null} getAdapter */
export function createReadAloudController(getAdapter) {
  const idle = { isSpeaking: false, message: "" };
  let snapshot = idle;
  /** @type {{adapter:SpeechAdapter, utterance:SpeechSynthesisUtterance}|null} */
  let active = null;
  const listeners = new Set();

  const publish = (isSpeaking, message) => {
    snapshot = { isSpeaking, message };
    for (const listener of listeners) listener();
  };

  const release = () => {
    const previous = active;
    active = null;
    if (!previous) return true;
    previous.utterance.onend = null;
    previous.utterance.onerror = null;
    try { previous.adapter.cancel(); return true; }
    catch { return false; }
  };

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    start(text) {
      if (!release()) {
        publish(false, "Read-aloud could not stop. Use your browser’s speech controls.");
        return;
      }
      try {
        const adapter = getAdapter();
        if (!adapter) {
          publish(false, "Read-aloud is not available in this browser. You can use Text and display to change text size.");
          return;
        }
        const utterance = adapter.createUtterance(text);
        const request = { adapter, utterance };
        active = request;
        utterance.onend = () => {
          if (active !== request) return;
          active = null;
          publish(false, "Read-aloud finished.");
        };
        utterance.onerror = (event) => {
          if (active !== request) return;
          active = null;
          publish(false, ["canceled", "interrupted"].includes(event.error)
            ? "Read-aloud stopped."
            : "Read-aloud could not start. You can use Text and display to change text size.");
        };
        publish(true, "Read-aloud requested.");
        adapter.speak(utterance);
      } catch {
        release();
        publish(false, "Read-aloud could not start. You can use Text and display to change text size.");
      }
    },
    stop() {
      const stopped = release();
      publish(false, stopped ? "Read-aloud stopped." : "Read-aloud could not stop. Use your browser’s speech controls.");
    },
    reset() {
      release();
      snapshot = idle;
      for (const listener of listeners) listener();
    },
  };
}
