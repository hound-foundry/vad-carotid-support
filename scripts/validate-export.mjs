import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const files = [
  "index.html", "about.html", "accessibility.html", "appointments.html", "glossary.html", "learn.html",
  "milestone-card.html", "personal-card.html", "resources.html", "saved-guides.html", "support-preferences.html",
  "supporting-someone.html", "urgent-help.html", "with-stroke.html", "without-stroke.html", "+not-found.html",
  "_sitemap.html", "manifest.json", "icon.svg", "sw.js",
  "guide/understanding-dissection.html", "guide/tests-and-terms.html", "guide/without-stroke.html",
  "guide/with-stroke.html", "guide/recovery-and-quality-of-life.html", "guide/follow-up-questions.html",
  "guide/supporting-someone.html",
];
for (const file of files) await access(join(root, file));
assert.ok(files.length >= 25);
console.log(`Validated ${files.length} static route and shell artifacts in dist/.`);
