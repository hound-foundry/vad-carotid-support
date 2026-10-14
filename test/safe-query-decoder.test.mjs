import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const queryStringPath = new URL("../node_modules/query-string/index.js", import.meta.url);
const requireFromQueryString = createRequire(queryStringPath);
const queryString = requireFromQueryString("query-string");
const decodeUriComponent = requireFromQueryString("decode-uri-component");

test("Expo Router's CommonJS query parser uses the safe local decoder", () => {
  assert.equal(queryString.parse("name=J%C3%B3n").name, "Jón");
  assert.equal(queryString.parse("q=one%20two").q, "one two");
  assert.equal(decodeUriComponent("bad%E0%A4%Ainput"), "bad%E0%A4%Ainput");
  assert.throws(() => decodeUriComponent(123), TypeError);
});

test("malformed query values complete without recursive decoding", () => {
  const malformed = "%E0%A4%25".repeat(20_000);
  const decodedMalformed = "%E0%A4%".repeat(20_000);
  assert.equal(decodeUriComponent(malformed), decodedMalformed);
  assert.equal(queryString.parse(`value=${malformed}`).value, decodedMalformed);
});
