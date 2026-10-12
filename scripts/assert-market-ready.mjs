import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const market = JSON.parse(await readFile(new URL("../src/content/marketReadiness.json", import.meta.url), "utf8"));
assert.equal(market.globalRelease, "ready", "Release blocked: global jurisdiction screening is not approved.");
assert.ok(market.countryRecords.length > 0, "Release blocked: no jurisdiction records are present.");
for (const country of market.countryRecords) {
  assert.equal(country.legalReview.status, "cleared", `Release blocked: ${country.name} has no legal clearance.`);
  assert.equal(country.subnationalReview.status, "cleared", `Release blocked: ${country.name} subnational review is incomplete.`);
  assert.ok(country.reviewOwner && country.lastChecked, `Release blocked: ${country.name} lacks an owner or review date.`);
  assert.ok(country.reviewAreas.every((area) => area.status === "screened" || area.status === "not-applicable"), `Release blocked: ${country.name} has an incomplete or unresolved review area.`);
  assert.ok(country.reviewAreas.every((area) => area.source && area.checkedOn && area.reviewer && (area.status !== "not-applicable" || area.reason)), `Release blocked: ${country.name} review areas lack sources, dates, reviewers, or a reason.`);
  assert.ok(country.subnationalAreas.length > 0 && country.subnationalAreas.every((area) => area.status === "cleared" || (area.status === "not-applicable" && area.reason)), `Release blocked: ${country.name} subnational screening is incomplete.`);
}
console.log("Market release gate passed.");
