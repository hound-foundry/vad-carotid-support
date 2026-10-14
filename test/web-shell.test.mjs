import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("offline shell stays same-origin and does not handle private storage", async () => {
  const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  assert.match(source, /event\.request\.method !== "GET"/);
  assert.match(source, /new URL\(event\.request\.url\)\.origin !== self\.location\.origin/);
  assert.match(source, /cache\.put\(event\.request/);
  assert.doesNotMatch(source, /localStorage|SecureStore|appointment|personal-card|milestone-card/);
});
