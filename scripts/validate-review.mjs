import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import ts from "typescript";

const ledger = JSON.parse(await readFile(new URL("../content/claimLedger.json", import.meta.url), "utf8"));
const records = JSON.parse(await readFile(new URL("../content/reviewRecords.json", import.meta.url), "utf8"));
const accessibilityMatrix = await readFile(new URL("../docs/ACCESSIBILITY_TEST_MATRIX.md", import.meta.url), "utf8");
const references = JSON.parse(await readFile(new URL("../content/references.json", import.meta.url), "utf8"));
const urgentSource = await readFile(new URL("../src/content/urgentHelp.ts", import.meta.url), "utf8");
const urgentModule = ts.transpileModule(urgentSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { urgentHelp } = await import(`data:text/javascript;base64,${Buffer.from(urgentModule).toString("base64")}`);
assert.equal(ledger.schemaVersion, 1);
assert.equal(records.schemaVersion, 1);
assert.equal(records.releaseStatus, "blocked-pending-human-review");
assert.ok(ledger.coverage.length >= 13, "clinical ledger must cover guides, glossary, prompts, urgent help, homepage and cards");
assert.ok(ledger.claims.length >= 5, "ledger must include representative high-risk claim records");
const evidenceFiles = [
  "../content/claimLedger.json",
  "../docs/CLINICAL_REVIEW_PACKET.md",
  "../docs/USABILITY_REVIEW.md",
  "../docs/USABILITY_FEEDBACK_LOG.md",
  "../docs/ACCESSIBILITY_TEST_MATRIX.md",
  "../docs/DATA_FLOW.md",
  "../docs/REGULATORY_SCREENING.md",
  "../docs/DEEP_REVIEW.md",
];
for (const path of evidenceFiles) await access(new URL(path, import.meta.url));
for (const requiredTask of ["Find urgent help", "Use skip link", "Read one section at a time", "Select prompts, save, export and delete", "Preview selected fields and delete", "Turn on simplified reading"]) {
  assert.match(accessibilityMatrix, new RegExp(requiredTask.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `accessibility matrix lost required task: ${requiredTask}`);
}
for (const item of ledger.coverage) {
  assert.match(item.id, /^(guides|glossary|appointment-prompts|urgent-help|homepage|personal-card|milestone-card):/);
  assert.ok(item.path && item.selector && item.units && item.risk && item.reviewerRole, `incomplete coverage record: ${item.id}`);
}
for (const claim of ledger.claims) {
  assert.ok(claim.id && claim.contentRef && claim.text && claim.evidenceType && claim.limits && claim.risk);
  assert.equal(claim.decision, "not-reviewed", `unreviewed claim must remain blocked: ${claim.id}`);
  assert.equal(claim.reviewer, null, `unreviewed claim cannot name a reviewer: ${claim.id}`);
}
// Bind safety copy to exact, sourced review records. A general disclaimer is
// not evidence of approval, and an old ledger must not validate changed copy.
const urgentUnits = ["action", "doNotWait", "quickAction", "signsIntro", ...urgentHelp.signs.map((_, index) => `signs.${index}.text`), "signsLimit", "feelingUnwell", "appLimit"];
assert.equal(urgentHelp.publicationStatus, "draft");
assert.equal(urgentHelp.clinicalReview.status, "not-reviewed");
assert.equal(urgentHelp.clinicalReview.reviewer, null);
assert.match(urgentHelp.updatedOn, /^\d{4}-\d{2}-\d{2}$/);
assert.match(urgentHelp.nextSourceCheckOn, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(urgentHelp.nextSourceCheckOn > urgentHelp.updatedOn);
for (const selector of urgentUnits) {
  const text = selector.split(".").reduce((value, part) => value[part], urgentHelp);
  const matches = ledger.claims.filter((claim) => claim.contentRef === "urgent-help:all" && claim.selector === selector);
  assert.equal(matches.length, 1, `urgent-help copy needs exactly one review record: ${selector}`);
  const claim = matches[0];
  assert.equal(claim.text, text, `urgent-help wording differs from review ledger: ${selector}`);
  assert.ok(claim.requiredExpertise && claim.audience?.length && claim.revisionHistory?.length, `urgent-help review scope missing: ${selector}`);
  assert.equal(claim.sourceCheckedOn, urgentHelp.updatedOn);
  assert.equal(claim.nextSourceCheckOn, urgentHelp.nextSourceCheckOn);
  if (claim.evidenceType !== "product-safety-boundary") {
    assert.ok(claim.sourceIds.length && claim.sourceSupport?.length, `urgent-help claim needs supporting sources: ${selector}`);
    for (const support of claim.sourceSupport) {
      assert.ok(claim.sourceIds.includes(support.sourceId) && urgentHelp.sourceIds.includes(support.sourceId));
      assert.ok(support.section?.trim() && support.supportingPassage?.trim(), `missing supporting passage: ${selector}`);
      const reference = references.sources.find((item) => item.id === support.sourceId);
      assert.ok(reference?.url?.startsWith("https://") && reference.limits && reference.rights, `incomplete urgent-help source: ${support.sourceId}`);
      assert.equal(reference.checked_on, urgentHelp.updatedOn, `urgent-help source check date differs: ${support.sourceId}`);
    }
  }
}
for (const [name, track] of Object.entries(records.tracks)) {
  assert.ok(track.status && track.ownerRole && track.evidence && track.stopShip, `incomplete review track: ${name}`);
  if (track.status !== "approved" && track.status !== "pass") assert.equal(track.reviewer, null, `unapproved track cannot name a reviewer: ${name}`);
}
console.log(`Validated ${ledger.coverage.length} review coverage records, ${ledger.claims.length} claim records and ${Object.keys(records.tracks).length} release tracks; release remains blocked pending human review.`);
