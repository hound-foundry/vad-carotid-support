import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const guideSource = await readFile(new URL("../src/content/guides.ts", import.meta.url), "utf8");
const guideModule = ts.transpileModule(guideSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { guides } = await import(`data:text/javascript;base64,${Buffer.from(guideModule).toString("base64")}`);

const require = createRequire(import.meta.url);
const references = require("../content/references.json");
const resources = require("../src/content/marketReadiness.json");
const community = require("../content/community-candidates.json");
const sources = new Set(references.sources.map((source) => source.id));
const slugs = new Set();

for (const guide of guides) {
  assert.ok(guide.slug && !slugs.has(guide.slug), `Missing or duplicate guide slug: ${guide.slug}`);
  slugs.add(guide.slug);
  assert.ok(guide.title.trim() && guide.summary.trim(), `${guide.slug} needs a title and summary`);
  assert.ok(guide.audience.length > 0, `${guide.slug} needs an audience`);
  assert.ok(guide.language && guide.jurisdiction, `${guide.slug} needs language and jurisdiction metadata`);
  assert.ok(guide.rights.trim(), `${guide.slug} needs a rights statement`);
  assert.ok(guide.sourceIds.length > 0, `${guide.slug} must cite at least one source`);
  for (const sourceId of guide.sourceIds) assert.ok(sources.has(sourceId), `${guide.slug} has unknown source ${sourceId}`);
  assert.ok(guide.clinicalReview?.status && guide.clinicalReview.reviewer !== undefined && guide.clinicalReview.date !== undefined, `${guide.slug} needs clinical review metadata`);
  assert.ok(guide.clinicalReview.qualifications !== undefined, `${guide.slug} needs reviewer qualification metadata`);
  assert.ok(guide.usabilityReview?.status && guide.usabilityReview.reviewer !== undefined && guide.usabilityReview.date !== undefined, `${guide.slug} needs patient/carer usability review metadata`);
  assert.ok(guide.translationReview?.status && guide.translationReview.reviewer !== undefined && guide.translationReview.date !== undefined, `${guide.slug} needs translation review metadata`);
  assert.ok(guide.reviewedOn !== undefined, `${guide.slug} needs a review date field`);
  if (guide.publicationStatus === "published") {
    assert.equal(guide.clinicalReview.status, "approved", `${guide.slug} cannot publish before clinical approval`);
    assert.ok(guide.clinicalReview.reviewer && guide.clinicalReview.date, `${guide.slug} needs named clinical reviewer and date`);
    assert.ok(guide.clinicalReview.qualifications, `${guide.slug} needs verified clinical reviewer qualifications`);
    assert.equal(guide.usabilityReview.status, "approved", `${guide.slug} cannot publish before patient/carer usability review`);
    assert.ok(guide.usabilityReview.reviewer && guide.usabilityReview.date, `${guide.slug} needs patient/carer usability reviewer and date`);
    if (guide.language !== "en") {
      assert.equal(guide.translationReview.status, "approved", `${guide.slug} cannot publish before translation approval`);
      assert.ok(guide.translationReview.reviewer && guide.translationReview.date, `${guide.slug} needs translator and date`);
    }
    assert.ok(guide.reviewedOn, `${guide.slug} needs a review date before publication`);
  }
}

assert.equal(resources.globalRelease, "blocked", "International release must stay blocked until jurisdiction screening is complete");
assert.ok(resources.countryRecords.length >= 240, "Country/area release queue must be comprehensive");
assert.ok(resources.countryRecords.every((country) => country.legalReview.status === "not-assessed" && country.release === "blocked"), "Unreviewed jurisdictions must remain blocked");
assert.ok(resources.countryRecords.every((country) => country.reviewAreas.length >= 14 && country.reviewAreas.every((area) => area.status === "not-assessed")), "All required legal review areas must remain explicit and unassessed until screened");
assert.equal(community.candidates.length, 3, "All three user-provided community candidates must be tracked");
assert.ok(community.candidates.every((candidate) => candidate.status === "pending-verification" && candidate.lastChecked === null), "Unverified community candidates must remain hidden");
assert.ok(community.candidates.every((candidate) => /^https:\/\/www\.facebook\.com\/groups\/[0-9]+$/.test(candidate.url)), "The community verification queue may contain group links only");
const appointmentUi = await readFile(new URL("../app/appointments.tsx", import.meta.url), "utf8");
const appointmentStore = await readFile(new URL("../src/features/appointments/store.ts", import.meta.url), "utf8");
assert.doesNotMatch(appointmentUi, /console\.|\bfetch\s*\(|XMLHttpRequest|sendBeacon/, "Appointment notes must not be logged or sent over the network");
assert.doesNotMatch(appointmentUi, /href\s*=\s*\{[^}]*\bnote\b/s, "Appointment notes must not enter route URLs");
assert.doesNotMatch(appointmentStore, /console\.|\bfetch\s*\(|XMLHttpRequest|sendBeacon/, "Appointment storage must not log or transmit note data");
console.log(`Validated ${guides.length} source-linked guide drafts, ${resources.countryRecords.length} blocked jurisdiction records, and ${community.candidates.length} hidden community candidates.`);
