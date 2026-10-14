import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { APP_NAME, APP_SUBTITLE } from "../src/brand.mjs";

const config = JSON.parse(await readFile(new URL("../app.json", import.meta.url), "utf8")).expo;
assert.equal(config.name, APP_NAME);
assert.equal(config.description, APP_SUBTITLE);
assert.equal(config.slug, "vad-carotid-support");
assert.equal(config.scheme, "vadcarotidsupport");
assert.ok(config.ios?.supportsTablet, "native config must retain tablet support");
assert.ok(config.plugins.includes("expo-router"), "native config must include Expo Router");
assert.ok(config.plugins.includes("expo-secure-store"), "native config must include device-local secure storage");
assert.deepEqual(config.platforms, undefined, "platform declarations belong to Expo's derived public config");
console.log("Validated Expo native configuration for iOS, Android and web.");
