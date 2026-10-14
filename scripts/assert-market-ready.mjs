import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const market = JSON.parse(await readFile(new URL("../src/content/marketReadiness.json", import.meta.url), "utf8"));
assert.equal(market.globalRelease, "web-preview", "Release blocked: the low-risk web-preview scope is not enabled.");
assert.ok(market.countryRecords.length > 0, "Release blocked: no jurisdiction watchlist records are present.");
assert.ok(market.countryRecords.every((country) => country.release === "blocked"), "Release blocked: country-specific activation must remain explicitly gated.");
console.log("Low-risk web preview release gate passed; country-specific activation remains gated.");
