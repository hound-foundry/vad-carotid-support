import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createPreviewServer } from "../scripts/preview-web.mjs";

test("clean card URLs and reloads resolve without a catch-all or directory traversal", async () => {
  const dir = await mkdtemp(join(tmpdir(), "vad-preview-test-"));
  assert.equal(dirname(resolve(dir)), resolve(tmpdir()), "test cleanup must stay in the temporary directory");
  await writeFile(join(dir, "index.html"), "HOME"); await writeFile(join(dir, "personal-card.html"), "PERSONAL CARD"); await writeFile(join(dir, "milestone-card.html"), "MILESTONE CARD");
  const server = createPreviewServer(dir); server.listen(0,"127.0.0.1"); await once(server,"listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of ["/", "/personal-card", "/milestone-card", "/personal-card.html"]) { const response = await fetch(origin+route); assert.equal(response.status,200); assert.match(response.headers.get("content-type"),/text\/html/); }
    assert.equal((await fetch(origin+"/missing-page")).status,404);
    assert.equal((await fetch(origin+"/%2e%2e%2fpackage.json")).status,403);
    assert.equal((await fetch(origin+"/%00")).status,403);
  } finally { server.close(); await once(server,"close"); await rm(dir,{recursive:true,force:true}); }
});
