import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const ledger = JSON.parse(await readFile(new URL("../content/claimLedger.json", import.meta.url), "utf8"));
const records = JSON.parse(await readFile(new URL("../content/reviewRecords.json", import.meta.url), "utf8"));
const accessibilityMatrix = await readFile(new URL("../docs/ACCESSIBILITY_TEST_MATRIX.md", import.meta.url), "utf8");
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
for (const [name, track] of Object.entries(records.tracks)) {
  assert.ok(track.status && track.ownerRole && track.evidence && track.stopShip, `incomplete review track: ${name}`);
  if (track.status !== "approved" && track.status !== "pass") assert.equal(track.reviewer, null, `unapproved track cannot name a reviewer: ${name}`);
}
console.log(`Validated ${ledger.coverage.length} review coverage records, ${ledger.claims.length} claim records and ${Object.keys(records.tracks).length} release tracks; release remains blocked pending human review.`);
