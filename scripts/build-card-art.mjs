import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { CARD_ARTWORK, cardArtworkSvg } from "../src/features/cards/artwork.mjs";

// One-time maintainer utility; prebuilt PNGs are checked in, so the app and CI
// do not depend on this optional renderer. A bundled Sharp path may be supplied.
const option = process.argv.indexOf("--sharp-module");
const sharp = (await import(option >= 0 ? pathToFileURL(process.argv[option + 1]).href : "sharp")).default;
const directory = new URL("../assets/card-art/", import.meta.url);
await mkdir(directory, { recursive: true });
const manifest = {};
for (const art of CARD_ARTWORK.filter((item) => item.id !== "none")) {
  const svg = cardArtworkSvg(art.id), png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(new URL(art.id + ".svg", directory), svg + "\n");
  await writeFile(new URL(art.id + ".png", directory), png);
  manifest[art.id] = { svgSha256: createHash("sha256").update(svg).digest("hex"), pngSha256: createHash("sha256").update(png).digest("hex") };
}
await writeFile(new URL("manifest.json", directory), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Built ${Object.keys(manifest).length} original local card drawings.`);
