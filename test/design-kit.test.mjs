import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, basename, resolve } from "node:path";
import { inspectDesign, projectPath, validateProfile, assertPaletteMatches } from "../scripts/design-kit.mjs";
import { createDesignPreview } from "../scripts/preview-design-kit.mjs";

const profile = JSON.parse(await readFile(new URL("../.design/project.json",import.meta.url),"utf8"));
test("design workflow rejects a different framework, private URLs and weakened saved-data boundaries",()=>{
  assert.throws(()=>validateProfile({...profile,framework:"vite"}),/Expo/);
  assert.throws(()=>validateProfile({...profile,routes:[{path:"/personal-card?name=PRIVATE",label:"Card"}]}),/route/);
  assert.throws(()=>validateProfile({...profile,privacy:{...profile.privacy,explicitExport:false}}),/privacy/);
  assert.throws(()=>validateProfile({...profile,privacy:{...profile.privacy,localResources:[]}}),/photo resource/);
  assert.throws(()=>projectPath(process.cwd(),"../private.txt"),/stay/);
});
test("palette drift is detected instead of silently generating a different design",async()=>{
  const kit=await inspectDesign();
  assert.equal(Object.keys(kit.tokens.themes).length,4);
  assert.throws(()=>assertPaletteMatches({...kit.tokens.palette,teal:"#000000"},kit.tokens.palette),/drift: teal/);
});
test("source inspection excludes browser contents and preserves independent saved keys",async()=>{
  const kit=await inspectDesign();
  assert.equal(kit.profile.privacy.savedKeyCount,6);
  assert.equal(kit.profile.privacy.localResources[0].storage,"indexeddb");
  assert.equal(kit.tokens.cardTemplates.length,16);
  assert.equal(kit.tokens.cardContrastChecks.length,192);
  assert.ok(kit.sourceHashes["src/features/cards/model.mjs"]);
  assert.equal(kit.tokens.effectiveRules.pressableMinHeight,48);
  assert.ok(!JSON.stringify(kit).includes("localStorage.getItem"));
});
test("local design endpoint only exposes named exports and rejects mutations",async()=>{
  const directory=await mkdtemp(join(tmpdir(),"vad-design-preview-"));
  const server=createDesignPreview(directory);
  try {
    // The independent server check does not require a web build or export files.
    await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
    const origin="http://127.0.0.1:"+server.address().port;
    assert.equal((await fetch(origin+"/_design/../../.env")).status,404);
    assert.equal((await fetch(origin+"/_design/private-notes.json")).status,404);
    assert.equal((await fetch(origin+"/_design/project.json",{method:"POST",body:"SYNTHETIC_PRIVATE"})).status,405);
    assert.equal((await fetch(origin+"/_design/tokens.json")).status,404);
    assert.equal((await fetch(origin+"/_design/tokens.json",{method:"HEAD"})).status,404);
  } finally {
    await new Promise(resolve=>server.close(resolve));
    assert.equal(dirname(directory),resolve(tmpdir())); assert.ok(basename(directory).startsWith("vad-design-preview-"));
    await rm(directory,{recursive:true,force:true});
  }
});
