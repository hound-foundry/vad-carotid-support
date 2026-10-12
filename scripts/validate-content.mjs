import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const guideSource = await readFile(new URL("../src/content/guides.ts", import.meta.url), "utf8");
const guideModule = ts.transpileModule(guideSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { guides } = await import(`data:text/javascript;base64,${Buffer.from(guideModule).toString("base64")}`);
const glossarySource = await readFile(new URL("../src/content/glossary.ts", import.meta.url), "utf8");
const glossaryModule = ts.transpileModule(glossarySource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { glossary } = await import(`data:text/javascript;base64,${Buffer.from(glossaryModule).toString("base64")}`);

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
  for (const section of guide.sections) {
    for (const sourceId of section.sourceIds ?? []) {
      assert.ok(guide.sourceIds.includes(sourceId), `${guide.slug} section ${section.heading} cites a source not listed by the guide: ${sourceId}`);
      assert.ok(sources.has(sourceId), `${guide.slug} section ${section.heading} has unknown source ${sourceId}`);
    }
  }
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

assert.ok(glossary.length > 0, "The plain-language glossary must contain entries");
assert.equal(new Set(glossary.map((entry) => entry.term)).size, glossary.length, "Glossary terms must be unique");
for (const entry of glossary) {
  assert.ok(entry.term.trim() && entry.definition.trim() && entry.limit.trim(), "Every glossary entry needs a term, definition and limitation");
  assert.ok(sources.has(entry.sourceId), `Glossary term ${entry.term} has unknown source ${entry.sourceId}`);
}

assert.equal(resources.globalRelease, "blocked", "International release must stay blocked until jurisdiction screening is complete");
assert.ok(resources.countryRecords.length >= 240, "Country/area release queue must be comprehensive");
assert.equal(resources.countryRecords.length, 248, "Country/area inventory must match the currently recorded M49 discovery set");
assert.equal(resources.isoCodeCrosswalk?.source, "https://unstats.un.org/unsd/methodology/m49/overview/", "ISO identifier crosswalk source must be recorded");
assert.match(resources.isoCodeCrosswalk?.checkedOn ?? "", /^\d{4}-\d{2}-\d{2}$/, "ISO identifier crosswalk needs a check date");
assert.equal(resources.isoCodeCrosswalk?.matchedRecords, resources.countryRecords.length, "Every inventory record must be covered by the identifier crosswalk");
assert.equal(resources.isoCodeCrosswalk?.status, "identifier-reconciliation-only", "Identifier reconciliation must not imply legal review");
assert.ok(resources.countryRecords.every((country) => /^[A-Z]{2}$/.test(country.isoAlpha2 ?? "")), "Every country/area record needs a valid ISO alpha-2 identifier");
assert.equal(new Set(resources.countryRecords.map((country) => country.isoAlpha2)).size, resources.countryRecords.length, "ISO alpha-2 identifiers must be unique in the inventory");
assert.ok(resources.countryRecords.every((country) => country.legalReview.status === "not-assessed" && country.release === "blocked"), "Unreviewed jurisdictions must remain blocked");
assert.ok(resources.countryRecords.every((country) => country.reviewAreas.length >= 14 && country.reviewAreas.every((area) => area.status === "not-assessed")), "All required legal review areas must remain explicit and unassessed until screened");
const euGroup = resources.regionalSourceGroups?.find((group) => group.id === "eu-member-states");
assert.equal(euGroup?.status, "membership-scope-source-checked-only", "EU grouping must not imply law applicability");
assert.equal(euGroup?.membershipSource, "https://european-union.europa.eu/principles-countries-history/eu-countries_en?page=1", "EU membership list source must be recorded");
assert.match(euGroup?.checkedOn ?? "", /^\d{4}-\d{2}-\d{2}$/, "EU member-state list needs a check date");
assert.equal(euGroup?.memberAlpha2?.length, 27, "EU member-state source group must contain the 27 checked members");
assert.equal(new Set(euGroup.memberAlpha2).size, 27, "EU member-state source group must not duplicate identifiers");
const euSourceUrls = [
  "https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng/",
  "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32002L0058",
  "https://eur-lex.europa.eu/eli/reg/2017/745/oj/eng",
  "https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en",
  "https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng",
  "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=celex%3A32005L0029",
  "https://eur-lex.europa.eu/eli/dir/2001/29/2017-10-10/eng",
  "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32011L0083",
  "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L2161",
  "https://eur-lex.europa.eu/eli/dir/2019/790/oj/eng",
];
assert.equal(euGroup.sources?.length, euSourceUrls.length, "EU common source leads must be stored once in the regional source bundle");
for (const url of euSourceUrls) assert.ok(euGroup.sources.some((source) => source.url === url && source.status === "source-lead-only" && source.checkedOn), `EU source bundle missing or misclassifies ${url}`);
for (const alpha2 of euGroup.memberAlpha2) {
  const country = resources.countryRecords.find((record) => record.isoAlpha2 === alpha2);
  assert.ok(country && country.legalReview.status === "not-assessed" && country.release === "blocked", `EU source-group member ${alpha2} must remain legally unassessed and blocked`);
}
const ukRecord = resources.countryRecords.find((country) => country.alpha3 === "GBR");
assert.ok(ukRecord && ukRecord.legalReview.status === "not-assessed" && ukRecord.subnationalReview.status === "not-assessed" && ukRecord.release === "blocked", "UK source discovery must not be mistaken for legal clearance");
assert.equal(ukRecord.isoAlpha2, "GB", "UK ISO alpha-2 identifier must match the recorded ISO source");
assert.ok(ukRecord.sourceDiscoveryCheckedOn && ukRecord.officialSources.length > 0 && ukRecord.officialSources.every((source) => ["source-lead-only", "identifier-checked"].includes(source.status) && source.checkedOn), "UK sources need dates and must not imply legal clearance");
assert.ok(ukRecord.officialSources.some((source) => source.sourceType === "code-list" && source.status === "identifier-checked"), "UK ISO code needs a dated code-list source");
for (const url of [
  "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/",
  "https://ico.org.uk/for-organisations/data-protection-fee/",
  "https://www.legislation.gov.uk/ukpga/1988/48/contents",
  "https://www.gov.uk/guidance/999-and-112-the-uks-national-emergency-numbers",
  "https://www.legislation.gov.uk/eur/2016/679/article/30",
  "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/documentation",
  "https://www.legislation.gov.uk/mwa/2011/1/contents",
  "https://www.legislation.gov.uk/ukpga/2018/12/contents",
  "https://www.gov.uk/setting-up-charity",
  "https://www.gov.uk/charities-and-tax/overview",
  "https://developer.apple.com/app-store/review/guidelines/",
  "https://support.google.com/googleplay/android-developer/answer/16679511?hl=en-GB",
]) assert.ok(ukRecord.officialSources.some((source) => source.url === url && source.status === "source-lead-only"), `UK source lead missing or misclassified: ${url}`);
assert.ok(ukRecord.officialSources.filter((source) => source.sourceType === "platform-policy").length >= 2, "Store policies must be recorded separately from legislation");
assert.deepEqual(ukRecord.subnationalAreas.map((area) => area.name), ["England", "Wales", "Scotland", "Northern Ireland"], "UK subnational areas must remain in the release-screening queue");
assert.ok(ukRecord.subnationalAreas.every((area) => area.status === "not-assessed"), "No UK nation may appear cleared by source discovery alone");
assert.equal(community.candidates.length, 3, "All three user-provided community candidates must be tracked");
assert.ok(community.candidates.every((candidate) => candidate.status === "pending-verification" && /^\d{4}-\d{2}-\d{2}$/.test(candidate.lastChecked) && candidate.verificationNote?.trim()), "Unverified community candidates must remain hidden with a dated verification record");
assert.ok(community.candidates.every((candidate) => /^https:\/\/www\.facebook\.com\/groups\/[0-9]+$/.test(candidate.url)), "The community verification queue may contain group links only");
const privateDataFiles = [
  "../app/appointments.tsx",
  "../app/support-preferences.tsx",
  "../app/saved-guides.tsx",
  "../src/features/appointments/store.ts",
  "../src/features/support-preferences/store.ts",
  "../src/features/saved-guides/store.ts",
  "../src/features/saved-guides/SaveGuideButton.tsx",
];
for (const path of privateDataFiles) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  assert.doesNotMatch(source, /console\.|\bfetch\s*\(|XMLHttpRequest|sendBeacon/, `${path} must not log private sheet data or send it over the network`);
}
for (const path of ["../app/appointments.tsx", "../app/support-preferences.tsx"]) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  assert.doesNotMatch(source, /href\s*=\s*\{[^}]*\bnote\b/s, `${path} must not put note text in route URLs`);
}
console.log(`Validated ${guides.length} source-linked guide drafts, ${resources.countryRecords.length} blocked jurisdiction records, and ${community.candidates.length} hidden community candidates.`);
