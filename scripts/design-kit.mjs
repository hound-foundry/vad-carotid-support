import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import ts from "typescript";
import { LOCAL_DATA_KEYS, LOCAL_DATA_RESOURCES } from "../src/features/local-data/keys.mjs";
import { CARD_TEMPLATES, CARD_PALETTES } from "../src/features/cards/templates.mjs";
import { contrastRatio } from "../src/components/theme.mjs";
import { workbenchHtml, paletteSvg } from "./design-workbench.mjs";
import { APP_NAME } from "../src/brand.mjs";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export const kitDirectory = resolve(projectRoot, "output/design-kit");
export function projectPath(root, name) {
  if (typeof name !== "string" || !name || name.includes("\\") || name.includes("\0")) throw new Error("Invalid project path");
  const target = resolve(root, name); const rel = relative(root, target);
  if (!rel || rel === ".." || rel.startsWith(".." + sep) || resolve(name) === name) throw new Error("Path must stay in this project: " + name);
  return target;
}
export function validateProfile(profile) {
  if (profile?.schemaVersion !== 1 || profile.id !== "vad-carotid-support" || profile.name !== APP_NAME || profile.framework !== "expo-react-native") throw new Error("Profile must describe this Expo app");
  for (const flag of ["localOnly", "explicitSave", "explicitExport", "separateCards"]) if (profile.privacy?.[flag] !== true) throw new Error("Missing privacy boundary: " + flag);
  if (profile.privacy.savedKeyCount !== LOCAL_DATA_KEYS.length || new Set(LOCAL_DATA_KEYS).size !== 6) throw new Error("Saved-data contract changed; review the profile");
  if (JSON.stringify(profile.privacy.localResources) !== JSON.stringify(LOCAL_DATA_RESOURCES)) throw new Error("Local photo resource changed; review the profile");
  if (!Array.isArray(profile.routes) || profile.routes.length === 0 || !Array.isArray(profile.viewports) || profile.viewports.length === 0) throw new Error("Routes and viewports required");
  const paths = new Set();
  for (const route of profile.routes) {
    if (!/^\/(?:[a-z-]+)?$/.test(route.path) || paths.has(route.path) || typeof route.label !== "string" || !route.label.trim()) throw new Error("Invalid or duplicate preview route");
    paths.add(route.path);
  }
  for (const viewport of profile.viewports) if (!/^[a-z-]+$/.test(viewport.id) || !Number.isInteger(viewport.width) || !Number.isInteger(viewport.height) || viewport.width < 320 || viewport.width > 1920 || viewport.height < 320 || viewport.height > 1200) throw new Error("Invalid review viewport");
}
export function readDocumentColors(document, expectedName = APP_NAME) {
  const frontmatter = document.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter || frontmatter.match(/^name:[ \t]*(.+)$/m)?.[1].trim() !== expectedName) throw new Error("Design frontmatter name does not match the app brand");
  const colors = {}; let inColors = false;
  for (const line of frontmatter.split(/\r?\n/)) {
    if (line === "colors:") { inColors = true; continue; }
    if (!inColors) continue;
    const token = line.match(/^  ([A-Za-z][A-Za-z0-9-]*): ['"](#[0-9a-fA-F]{6})['"]$/);
    if (!token || Object.hasOwn(colors, token[1])) throw new Error("Invalid or duplicate design colour token");
    colors[token[1]] = token[2].toUpperCase();
  }
  return colors;
}
export function assertPaletteMatches(documentColors, palette) {
  if (JSON.stringify(Object.keys(documentColors).sort()) !== JSON.stringify(Object.keys(palette).sort())) throw new Error("Design palette keys drifted");
  for (const [name, value] of Object.entries(palette)) if (documentColors[name] !== value.toUpperCase()) throw new Error("Design colour drift: " + name);
}
function numericStyles(source, filename) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); const output = {};
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(file) === "StyleSheet.create" && ts.isObjectLiteralExpression(node.arguments[0])) {
      for (const style of node.arguments[0].properties) if (ts.isPropertyAssignment(style) && ts.isObjectLiteralExpression(style.initializer)) {
        const values = {};
        for (const property of style.initializer.properties) if (ts.isPropertyAssignment(property) && ts.isNumericLiteral(property.initializer)) values[property.name.getText(file)] = Number(property.initializer.text);
        if (Object.keys(values).length) output[style.name.getText(file)] = values;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file); return output;
}
export async function inspectDesign(root = projectRoot) {
  const profile = JSON.parse(await readFile(resolve(root, ".design/project.json"), "utf8")); validateProfile(profile);
  const packageData = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  if (packageData.name !== profile.id || packageData.main !== "expo-router/entry") throw new Error("Expo project structure changed");
  for (const name of ["expo", "expo-router", "react", "react-native", "react-native-web"]) if (!packageData.dependencies[name]) throw new Error("Missing existing framework: " + name);
  const inputs = [...new Set(["package.json", profile.themeSource, ...profile.styleSources, ...profile.protectedPaths, ...profile.routes.map(route => route.source)])];
  const sourceHashes = {}; const sources = {};
  for (const name of inputs) {
    const path = projectPath(root, name); if (!(await stat(path)).isFile()) throw new Error("Source is not a file: " + name);
    const bytes = await readFile(path); sourceHashes[name] = createHash("sha256").update(bytes).digest("hex"); sources[name] = bytes.toString("utf8");
  }
  const design = await readFile(projectPath(root, profile.designDocument), "utf8");
  // Only the checked local pure theme module is loaded; it is shared with card exports.
  const { palette, themeFor, designContrastReport } = await import(pathToFileURL(projectPath(root, profile.themeSource)).href);
  assertPaletteMatches(readDocumentColors(design, profile.name), palette);
  const contrastChecks = designContrastReport();
  for (const check of contrastChecks) if (check.ratio < check.minimum) throw new Error(`Contrast failed: ${check.theme}/${check.contrast} ${check.pair}`);
  const cardContrastChecks = [];
  if (CARD_TEMPLATES.length !== 8 || new Set(CARD_TEMPLATES.map(template => template.id)).size !== 8) throw new Error("Expected eight distinct card templates");
  for (const template of CARD_TEMPLATES) {
    if (template.colours.length !== 3) throw new Error("Each card needs three curated colour combinations");
    for (const id of template.colours) {
      const c = CARD_PALETTES[id];
      for (const [pair, foreground, background] of [["body", c.ink, c.paper], ["detail", c.detail, c.paper], ["accent", c.accent, c.paper], ["band", c.onAccent, c.accent]]) {
        const ratio = contrastRatio(foreground, background);
        if (ratio < 4.5) throw new Error("Card contrast failed: " + template.id + "/" + id + " " + pair);
        cardContrastChecks.push({template:template.id, colour:id, pair, foreground, background, ratio, minimum:4.5});
      }
    }
  }
  const themes = {};
  for (const theme of ["light", "dark"]) for (const contrast of ["standard", "high"]) themes[theme + "-" + contrast] = themeFor({theme,contrast});
  const metrics = Object.fromEntries(profile.styleSources.map(name => [name, numericStyles(sources[name], name)]));
  const ui = sources["src/components/Ui.tsx"];
  const textFloor = ui.match(/Math\.max\((\d+), base\)/)?.[1];
  const extracted = {pressableMinHeight:ui.match(/minHeight: Math\.max\((\d+),/)?.[1],inputMinHeight:ui.match(/minHeight: (\d+), borderColor/)?.[1],bodyFloor:textFloor,smallLabelFloor:textFloor};
  if (Object.values(extracted).some(value => !value)) throw new Error("UI wrapper changed; update design extraction before exporting");
  const effectiveRules = Object.fromEntries(Object.entries(extracted).map(([key,value])=>[key,Number(value)]));
  return {profile, design, tokens:{schemaVersion:1,format:"vad-design-tokens/1",palette,themes,contrastChecks,cardTemplates:CARD_TEMPLATES,cardPalettes:CARD_PALETTES,cardContrastChecks,authoredMetrics:metrics,effectiveRules},sourceHashes};
}
export async function buildDesignKit(root = projectRoot, destination = kitDirectory) {
  const kit = await inspectDesign(root);
  for (const route of kit.profile.routes) await stat(resolve(root, "dist", route.path === "/" ? "index.html" : route.path.slice(1) + ".html"));
  let revision = "unknown"; try { revision = execFileSync("git", ["rev-parse", "HEAD"], {cwd:root,encoding:"utf8"}).trim(); } catch { /* Fingerprints still identify the inputs. */ }
  const bundleDirectory = resolve(root,"dist/_expo/static/js/web");
  const bundles = (await readdir(bundleDirectory)).filter(name=>/^entry-.*\.js$/.test(name));
  if (bundles.length !== 1) throw new Error("Expected one current exported entry bundle; rebuild the web preview");
  const bundleHashes = {};
  for (const name of bundles) bundleHashes[name] = createHash("sha256").update(await readFile(resolve(bundleDirectory,name))).digest("hex");
  const manifest = {schemaVersion:1,app:kit.profile.id,revision,sourceHashes:kit.sourceHashes,bundleHashes,storageKeys:[...LOCAL_DATA_KEYS],localResources:LOCAL_DATA_RESOURCES,scope:"Source-only design export; no browser storage, notes, card contents, photos, accounts or remote service calls"};
  await mkdir(destination, {recursive:true});
  for (const [name, contents] of Object.entries({"project.json":JSON.stringify(kit.profile,null,2)+"\n","tokens.json":JSON.stringify(kit.tokens,null,2)+"\n","manifest.json":JSON.stringify(manifest,null,2)+"\n","DESIGN.md":kit.design,"palette.svg":paletteSvg(kit.tokens.palette),"index.html":workbenchHtml(kit.profile,kit.tokens)})) await writeFile(resolve(destination,name),contents);
  return manifest;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--check")) { const kit = await inspectDesign(); console.log(`Design profile passed: ${kit.profile.routes.length} routes, ${Object.keys(kit.tokens.palette).length} colours, four themes, ${LOCAL_DATA_KEYS.length} saved keys.`); }
  else { const manifest = await buildDesignKit(); console.log(`Design kit exported locally to output/design-kit; source revision ${manifest.revision.slice(0,7)}. No remote calls.`); }
}
