import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const files = [
  "index.html", "about.html", "accessibility.html", "appointments.html", "glossary.html", "learn.html", "cards.html", "saved.html", "fonts/NotoSans-Regular.ttf", "fonts/NotoSans-Bold.ttf", "fonts/barlow/BarlowCondensed-Bold.ttf", "fonts/barlow/OFL.txt", "card-art/friendly-brain.png",
  "milestone-card.html", "personal-card.html", "resources.html", "saved-guides.html", "support-preferences.html",
  "supporting-someone.html", "tools.html", "urgent-help.html", "with-stroke.html", "without-stroke.html", "+not-found.html",
  "_sitemap.html", "manifest.json", "icon.svg", "sw.js", "_headers",
  "guide/understanding-dissection.html", "guide/tests-and-terms.html", "guide/without-stroke.html",
  "guide/with-stroke.html", "guide/recovery-and-quality-of-life.html", "guide/follow-up-questions.html",
  "guide/supporting-someone.html",
];
for (const file of files) await access(join(root, file));
const urgent = await readFile(join(root, "urgent-help.html"), "utf8");
const home = await readFile(join(root, "index.html"), "utf8");
const personal = await readFile(join(root, "personal-card.html"), "utf8");
const milestone = await readFile(join(root, "milestone-card.html"), "utf8");
const notFound = await readFile(join(root, "+not-found.html"), "utf8");
const headers = await readFile(join(root, "_headers"), "utf8");
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
assert.ok(/(?:call|contact) local emergency services now/i.test(urgent), "urgent-help route must retain immediate, generic emergency wording");
assert.ok(/B\.E\. F\.A\.S\.T\./.test(urgent), "urgent-help route must include the stroke-sign reminder");
assert.ok(/Call even if the symptoms stop/.test(urgent), "urgent-help route must not reassure when signs stop");
assert.ok(/information and preparation app, not a medical service/.test(urgent), "urgent-help route must state its product boundary");
assert.ok(/Information and preparation, not medical care/i.test(home), "home route must explain the product boundary");
assert.ok(/data-testid=\"app-navigation\"/.test(home), "home route must export persistent app navigation");
assert.match(home, /@media print/, "export must include print styles");
assert.match(home, /data-testid=\\?\"site-header\\?\"/, "print styles must hide site navigation");
assert.match(personal, /not an official medical record or emergency plan/i, "personal card safety label must be exported");
assert.match(milestone, /not medical advice or proof of diagnosis/i, "milestone card safety label must be exported");
assert.match(notFound, /Page not found/, "unavailable-page shell must give a clear heading");
assert.ok(/href=\"\/urgent-help\"/.test(notFound), "medical help must remain available from a missing page");
assert.match(notFound, /href=\\?\"\//, "unavailable-page shell must provide a Home route");
for (const directive of ["X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin", "Permissions-Policy: camera=(), microphone=(), geolocation=()"])
  assert.match(headers, new RegExp(directive.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `static headers lost directive: ${directive}`);
assert.equal(manifest.id, "/", "manifest must define a stable app id");
assert.equal(manifest.scope, "/", "manifest must define the static app scope");
assert.equal(manifest.lang, "en", "manifest must declare the authored language");
assert.ok(files.length >= 25);
console.log(`Validated ${files.length} static route and shell artifacts in dist/.`);
