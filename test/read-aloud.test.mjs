import test from "node:test";
import assert from "node:assert/strict";
import { createReadAloudController } from "../src/features/read-aloud/controller.mjs";

function fixture() {
  const utterances = [];
  let cancelled = 0;
  const adapter = {
    createUtterance(text) {
      const utterance = { text, onend: null, onerror: null };
      utterances.push(utterance);
      return utterance;
    },
    speak() {},
    cancel() { cancelled++; },
  };
  return { adapter, utterances, cancelled: () => cancelled };
}

test("read-aloud exposes request and finish state without retaining text in its snapshot", () => {
  const speech = fixture(), controller = createReadAloudController(() => speech.adapter);
  controller.start("SYNTHETIC_GUIDE_TEXT");
  assert.equal(controller.getSnapshot().isSpeaking, true);
  assert.match(controller.getSnapshot().message, /requested/);
  assert.ok(!JSON.stringify(controller.getSnapshot()).includes("SYNTHETIC_GUIDE_TEXT"));
  speech.utterances[0].onend();
  assert.equal(controller.getSnapshot().isSpeaking, false);
  assert.match(controller.getSnapshot().message, /finished/);
});

test("stop invalidates callbacks before cancellation and late errors cannot replace a newer state", () => {
  const speech = fixture(), controller = createReadAloudController(() => speech.adapter);
  controller.start("FIRST");
  const lateEnd = speech.utterances[0].onend, lateError = speech.utterances[0].onerror;
  controller.stop();
  assert.equal(speech.cancelled(), 1);
  assert.match(controller.getSnapshot().message, /stopped/);
  controller.start("SECOND");
  lateEnd(); lateError({ error: "synthesis-failed" });
  assert.equal(controller.getSnapshot().isSpeaking, true);
  speech.utterances[1].onend();
  assert.match(controller.getSnapshot().message, /finished/);
});

test("route or reading-scope reset invalidates old callbacks and clears feedback", () => {
  const speech = fixture(), controller = createReadAloudController(() => speech.adapter);
  controller.start("FIRST");
  const lateEnd = speech.utterances[0].onend;
  controller.reset(); lateEnd();
  assert.deepEqual(controller.getSnapshot(), { isSpeaking: false, message: "" });
  assert.equal(speech.cancelled(), 1);
});

test("unavailable speech and synchronous failures expose an error rather than a false active state", () => {
  const unavailable = createReadAloudController(() => null);
  unavailable.start("EXAMPLE");
  assert.match(unavailable.getSnapshot().message, /not available/);
  const speech = fixture();
  for (const failing of ["createUtterance", "speak"]) {
    const controller = createReadAloudController(() => ({ ...speech.adapter, [failing]: () => { throw new Error("unavailable"); } }));
    controller.start("EXAMPLE");
    assert.equal(controller.getSnapshot().isSpeaking, false);
    assert.match(controller.getSnapshot().message, /could not start/);
  }
});

test("backend interruptions and failures produce visible final feedback", () => {
  const speech = fixture(), controller = createReadAloudController(() => speech.adapter);
  controller.start("EXAMPLE"); speech.utterances[0].onerror({ error: "interrupted" });
  assert.match(controller.getSnapshot().message, /stopped/);
  controller.start("EXAMPLE"); speech.utterances[1].onerror({ error: "synthesis-failed" });
  assert.equal(controller.getSnapshot().isSpeaking, false);
  assert.match(controller.getSnapshot().message, /could not start/);
});
