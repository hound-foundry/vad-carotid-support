import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createReadAloudController } from "./controller.mjs";

function browserSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return null;
  const speech = window.speechSynthesis;
  return {
    createUtterance: (text: string) => new SpeechSynthesisUtterance(text),
    speak: (utterance: SpeechSynthesisUtterance) => speech.speak(utterance),
    cancel: () => speech.cancel(),
  };
}

/** Stop and invalidate callbacks when the guide, reading scope or route changes. */
export function useReadAloud(scope: string) {
  const controller = useMemo(() => createReadAloudController(browserSpeech), []);
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);

  useEffect(() => {
    controller.reset();
    return () => controller.reset();
  }, [controller, scope]);

  return {
    ...state,
    toggle: (text: string) => state.isSpeaking ? controller.stop() : controller.start(text),
  };
}
