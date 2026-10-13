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
assert.equal(resources.countryRecords.length, 249, "Inventory must include the 248-row M49 set and the separately identified Taiwan market-screening supplement");
assert.equal(resources.isoCodeCrosswalk?.source, "https://unstats.un.org/unsd/methodology/m49/overview/", "ISO identifier crosswalk source must be recorded");
assert.match(resources.isoCodeCrosswalk?.checkedOn ?? "", /^\d{4}-\d{2}-\d{2}$/, "ISO identifier crosswalk needs a check date");
const m49Records = resources.countryRecords.filter((country) => !country.inventoryBasis);
assert.equal(m49Records.length, 248, "The standard M49 row set must remain distinct from market supplements");
assert.equal(resources.isoCodeCrosswalk?.matchedRecords, m49Records.length, "Every M49 record must be covered by the identifier crosswalk");
assert.equal(resources.isoCodeCrosswalk?.status, "identifier-reconciliation-only", "Identifier reconciliation must not imply legal review");
assert.ok(resources.countryRecords.every((country) => /^[A-Z]{2}$/.test(country.isoAlpha2 ?? "")), "Every country/area record needs a valid ISO alpha-2 identifier");
assert.equal(new Set(resources.countryRecords.map((country) => country.isoAlpha2)).size, resources.countryRecords.length, "ISO alpha-2 identifiers must be unique in the inventory");
assert.ok(resources.countryRecords.every((country) => country.legalReview.status === "not-assessed" && country.release === "blocked"), "Unreviewed jurisdictions must remain blocked");
assert.ok(resources.countryRecords.every((country) => country.reviewAreas.length >= 14 && country.reviewAreas.every((area) => area.status === "not-assessed")), "All required legal review areas must remain explicit and unassessed until screened");
const taiwanRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "TW");
assert.ok(taiwanRecord && taiwanRecord.alpha3 === "TWN" && taiwanRecord.m49 === "158", "Taiwan market supplement must use the recorded ISO identifiers and statistical-only M49 code");
assert.match(taiwanRecord.inventoryBasis ?? "", /outside the standard UN M49/);
assert.equal(taiwanRecord.legalReview.status, "not-assessed", "Taiwan source discovery must not be mistaken for legal clearance");
assert.equal(taiwanRecord.release, "blocked", "Taiwan release must remain blocked pending qualified review");
assert.equal(taiwanRecord.subnationalAreas.length, 22, "Taiwan screening queue must contain the 22 first-level municipality/county/city targets");
assert.equal(taiwanRecord.officialSources.length, 20, "Taiwan source discovery must retain all documented official leads");
assert.ok(taiwanRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13"), "Taiwan local-government targets must remain explicitly unassessed and dated");
assert.ok(taiwanRecord.officialSources.some((source) => source.url === "https://unstats.un.org/unsd/methodology/m49/" && source.status === "source-lead-only"));
assert.ok(taiwanRecord.officialSources.some((source) => source.url === "https://law.moj.gov.tw/LawClass/LawAll.aspx?Pcode=I0050021" && source.status === "source-lead-only"));
const russiaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "RU");
assert.ok(russiaRecord && russiaRecord.officialSources.length === 18, "Russia discovery must retain its dated source-lead bundle");
assert.equal(russiaRecord.legalReview.status, "not-assessed", "Russia source discovery must not be mistaken for legal clearance");
assert.equal(russiaRecord.release, "blocked", "Russia access must remain blocked pending qualified review");
assert.equal(russiaRecord.subnationalAreas.length, 1, "Russia local-law review must remain visibly marked as aggregate and incomplete");
assert.ok(russiaRecord.officialSources.some((source) => source.url === "https://www.gov.uk/government/publications/russia-sanctions-guidance/russia-sanctions-guidance" && source.status === "source-lead-only"));
const unitedStates = resources.countryRecords.find((country) => country.isoAlpha2 === "US");
assert.ok(unitedStates && unitedStates.officialSources.length === 22, "US source discovery must retain its dated federal and state-law source leads");
assert.equal(unitedStates.sourceDiscoveryCheckedOn, "2026-10-13", "US source discovery needs its own dated record");
assert.equal(unitedStates.legalReview.status, "not-assessed", "US source discovery must not be mistaken for legal clearance");
assert.equal(unitedStates.release, "blocked", "US access must remain blocked pending qualified review");
assert.equal(unitedStates.subnationalAreas.length, 51, "US screening queue must include all 50 states and the District of Columbia");
assert.ok(unitedStates.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "US state/DC queue must remain explicitly unassessed");
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule" && source.status === "source-lead-only"));
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://app.leg.wa.gov/RCW/default.aspx?cite=19.373" && source.status === "source-lead-only"));
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://www.cga.ct.gov/Current/pub/chap_743jj.htm" && source.status === "source-lead-only"));
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://tcss.legis.texas.gov/resources/HS/htm/HS.181.htm" && source.status === "source-lead-only"));
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://www.ada.gov/title-ii-web-rule/" && source.status === "source-lead-only"));
assert.ok(unitedStates.officialSources.some((source) => source.url === "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa" && source.status === "source-lead-only"));
assert.match(unitedStates.sourceDiscoveryNote, /not a complete list/);
const canadaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "CA");
assert.ok(canadaRecord && canadaRecord.officialSources.length === 14, "Canada discovery must retain its dated federal and provincial source-lead bundle");
assert.equal(canadaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Canada source discovery needs its own dated record");
assert.equal(canadaRecord.legalReview.status, "not-assessed", "Canada source discovery must not be mistaken for legal clearance");
assert.equal(canadaRecord.release, "blocked", "Canada access must remain blocked pending qualified review");
assert.equal(canadaRecord.subnationalAreas.length, 13, "Canada screening queue must include all 10 provinces and three territories");
assert.ok(canadaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Canada province/territory queue must remain explicitly unassessed");
assert.ok(canadaRecord.officialSources.some((source) => source.url === "https://laws-lois.justice.gc.ca/eng/acts/P-8.6/" && source.status === "source-lead-only"));
assert.ok(canadaRecord.officialSources.some((source) => source.url === "https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/software-medical-device-guidance-document.html" && source.status === "source-lead-only"));
assert.match(canadaRecord.sourceDiscoveryNote, /free\/open-source model alone is not an applicability exemption/);
const australiaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "AU");
assert.ok(australiaRecord && australiaRecord.officialSources.length === 14, "Australia discovery must retain its dated federal and state/territory source-lead bundle");
assert.equal(australiaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Australia source discovery needs its own dated record");
assert.equal(australiaRecord.legalReview.status, "not-assessed", "Australia source discovery must not be mistaken for legal clearance");
assert.equal(australiaRecord.release, "blocked", "Australia access must remain blocked pending qualified review");
assert.equal(australiaRecord.subnationalAreas.length, 8, "Australia screening queue must include six states, ACT and NT");
assert.ok(australiaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Australia state/territory queue must remain explicitly unassessed");
assert.ok(australiaRecord.officialSources.some((source) => source.url === "https://www.legislation.gov.au/C2004A03712/latest" && source.status === "source-lead-only"));
assert.ok(australiaRecord.officialSources.some((source) => source.url === "https://www.tga.gov.au/resources/guidance/understanding-how-we-regulate-software-based-medical-devices" && source.status === "source-lead-only"));
assert.match(australiaRecord.sourceDiscoveryNote, /1 July 2026/);
const brazilRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "BR");
assert.ok(brazilRecord && brazilRecord.officialSources.length === 17, "Brazil discovery must retain its dated federal privacy, medical-software and local-law source-lead bundle");
assert.equal(brazilRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Brazil source discovery needs its own dated record");
assert.equal(brazilRecord.legalReview.status, "not-assessed", "Brazil source discovery must not be mistaken for legal clearance");
assert.equal(brazilRecord.release, "blocked", "Brazil access must remain blocked pending qualified review");
assert.equal(brazilRecord.subnationalAreas.length, 27, "Brazil screening queue must include all 26 states and the Federal District");
assert.ok(brazilRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Brazil state/DF queue must remain explicitly unassessed");
assert.ok(brazilRecord.officialSources.some((source) => source.url === "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm" && source.status === "source-lead-only"));
assert.ok(brazilRecord.officialSources.some((source) => source.url === "https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024" && source.status === "source-lead-only"));
assert.ok(brazilRecord.officialSources.some((source) => source.url === "https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca" && source.status === "source-lead-only"));
assert.match(brazilRecord.sourceDiscoveryNote, /health data is sensitive personal data/);
const indiaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "IN");
assert.ok(indiaRecord && indiaRecord.legalReview.status === "not-assessed" && indiaRecord.subnationalReview.status === "not-assessed" && indiaRecord.release === "blocked", "India source discovery must not be mistaken for legal clearance");
assert.equal(indiaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "India source discovery needs its own dated record");
assert.equal(indiaRecord.officialSources.length, 18, "India source leads must retain the current central privacy, device, consumer, access, child, rights, emergency and territorial sources");
assert.ok(indiaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "India sources must remain dated source leads only");
assert.equal(indiaRecord.reviewAreas.length, 14, "Every India legal review topic must remain explicit");
assert.ok(indiaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "India source discovery must not change a legal review area to assessed");
assert.equal(indiaRecord.subnationalAreas.length, 36, "India must retain all 28 states and 8 union territories/NCT as unassessed screening targets");
assert.equal(new Set(indiaRecord.subnationalAreas.map((area) => area.name)).size, 36, "India state/UT screening targets must be unique");
assert.ok(indiaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "India subnational screening must not be mistaken for local clearance");
assert.ok(indiaRecord.officialSources.some((source) => source.url === "https://egazette.gov.in/WriteReadData/2025/267647.pdf"), "India DPDP phased-commencement Gazette must remain visible");
assert.ok(indiaRecord.officialSources.some((source) => source.url === "https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf"), "India DPDP Rules Gazette must remain visible");
assert.match(indiaRecord.sourceDiscoveryNote, /one year and eighteen months/);
const mexicoRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "MX");
assert.ok(mexicoRecord && mexicoRecord.legalReview.status === "not-assessed" && mexicoRecord.subnationalReview.status === "not-assessed" && mexicoRecord.release === "blocked", "Mexico source discovery must not be mistaken for legal clearance");
assert.equal(mexicoRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Mexico source discovery needs its own dated record");
assert.equal(mexicoRecord.officialSources.length, 19, "Mexico source leads must retain the federal privacy, medical software, consumer, accessibility, child, copyright, emergency, funding and platform-policy inventory");
assert.ok(mexicoRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Mexico sources must remain dated source leads only");
assert.equal(mexicoRecord.reviewAreas.length, 14, "Every Mexico legal review topic must remain explicit");
assert.ok(mexicoRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Mexico source discovery must not change a legal review area to assessed");
assert.equal(mexicoRecord.subnationalAreas.length, 32, "Mexico must retain all 32 federal entities as unassessed screening targets");
assert.equal(new Set(mexicoRecord.subnationalAreas.map((area) => area.name)).size, 32, "Mexico federal entity screening targets must be unique");
assert.ok(mexicoRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Mexico subnational screening must not be mistaken for local clearance");
assert.ok(mexicoRecord.officialSources.some((source) => source.url === "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf"), "Mexico 2025 private-sector personal-data law must remain visible");
assert.ok(mexicoRecord.officialSources.some((source) => source.url === "https://sidof.segob.gob.mx/notas/docFuente/5638793"), "Mexico NOM-241 medical software source must remain visible");
assert.match(mexicoRecord.sourceDiscoveryNote, /not a completeness claim/);
const argentinaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "AR");
assert.ok(argentinaRecord && argentinaRecord.legalReview.status === "not-assessed" && argentinaRecord.subnationalReview.status === "not-assessed" && argentinaRecord.release === "blocked", "Argentina source discovery must not be mistaken for legal clearance");
assert.equal(argentinaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Argentina source discovery needs its own dated record");
assert.equal(argentinaRecord.officialSources.length, 22, "Argentina source leads must retain current data, transfer, SaMD, patient-rights, consumer, accessibility, child, copyright, emergency and territory sources");
assert.ok(argentinaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Argentina sources must remain dated source leads only");
assert.equal(argentinaRecord.reviewAreas.length, 14, "Every Argentina legal review topic must remain explicit");
assert.ok(argentinaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Argentina source discovery must not change a legal review area to assessed");
assert.equal(argentinaRecord.subnationalAreas.length, 24, "Argentina must retain 23 provinces and CABA as unassessed screening targets");
assert.equal(new Set(argentinaRecord.subnationalAreas.map((area) => area.name)).size, 24, "Argentina provincial/CABA screening targets must be unique");
assert.ok(argentinaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Argentina subnational screening must not be mistaken for local clearance");
assert.ok(argentinaRecord.officialSources.some((source) => source.url === "https://www.argentina.gob.ar/normativa/nacional/disposici%C3%B3n-64-2025-408309/texto"), "Argentina ANMAT Disposition 64/2025 must remain visible");
assert.match(argentinaRecord.sourceDiscoveryNote, /107 ambulance service limited to Buenos Aires/);
const nigeriaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "NG");
assert.ok(nigeriaRecord && nigeriaRecord.legalReview.status === "not-assessed" && nigeriaRecord.subnationalReview.status === "not-assessed" && nigeriaRecord.release === "blocked", "Nigeria source discovery must not be mistaken for legal clearance");
assert.equal(nigeriaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Nigeria source discovery needs its own dated record");
assert.equal(nigeriaRecord.officialSources.length, 26, "Nigeria source leads must cover data protection, SaMD, health claims, consumer, accessibility, children, copyright, emergency, nonprofit/tax, territory and platform sources");
assert.ok(nigeriaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Nigeria sources must remain dated source leads only");
assert.equal(nigeriaRecord.reviewAreas.length, 14, "Every Nigeria legal review area must remain explicit");
assert.ok(nigeriaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Nigeria source discovery must not change a legal review area to assessed");
assert.equal(nigeriaRecord.subnationalAreas.length, 37, "Nigeria must retain all 36 states and FCT as unassessed screening targets");
assert.equal(new Set(nigeriaRecord.subnationalAreas.map((area) => area.name)).size, 37, "Nigeria state/FCT screening targets must be unique");
assert.ok(nigeriaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Nigeria state/FCT screening must not be mistaken for local clearance");
assert.ok(nigeriaRecord.officialSources.some((source) => source.url === "https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Guidelines/DR_And_R_Guidelines/Guidelines-for-Registration-of-Software-as-a-Medical-Device-SaMD-in-Nigeria.pdf"), "Nigeria NAFDAC SaMD guidance must remain visible");
assert.ok(nigeriaRecord.officialSources.some((source) => source.url === "https://ndpc.gov.ng/download/nigeria-data-protection-act-2023"), "Nigeria Data Protection Act must remain visible");
assert.match(nigeriaRecord.sourceDiscoveryNote, /not a completeness claim/);
const germanyRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "DE");
assert.ok(germanyRecord && germanyRecord.legalReview.status === "not-assessed" && germanyRecord.subnationalReview.status === "not-assessed" && germanyRecord.release === "blocked", "Germany source discovery must not be mistaken for legal clearance");
assert.equal(germanyRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Germany source discovery needs its own dated record");
assert.equal(germanyRecord.officialSources.length, 25, "Germany source leads must cover shared EU and national privacy, devices, consumer, digital services, accessibility, children, copyright, emergency, nonprofit, territory and platform topics");
assert.ok(germanyRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Germany sources must remain dated source leads only");
assert.equal(germanyRecord.reviewAreas.length, 14, "Every Germany legal review area must remain explicit");
assert.ok(germanyRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Germany source discovery must not change a legal review area to assessed");
assert.equal(germanyRecord.subnationalAreas.length, 16, "Germany must retain all 16 federal Länder as unassessed screening targets");
assert.equal(new Set(germanyRecord.subnationalAreas.map((area) => area.name)).size, 16, "German federal-state screening targets must be unique");
assert.ok(germanyRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "German federal-state screening must not be mistaken for local clearance");
assert.ok(germanyRecord.officialSources.some((source) => source.url === "https://www.bfarm.de/DE/Medizinprodukte/Aufgaben/Feststellung-rechtlicher-Status-und-Klassifizierung/_node.html"), "BfArM software-classification guidance must remain visible");
assert.ok(germanyRecord.officialSources.some((source) => source.url === "https://www.gesetze-im-internet.de/bdsg_2018/BJNR209710017.html"), "Current BDSG source must remain visible");
assert.match(germanyRecord.sourceDiscoveryNote, /not a completeness claim/);
const southAfricaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "ZA");
assert.ok(southAfricaRecord && southAfricaRecord.legalReview.status === "not-assessed" && southAfricaRecord.subnationalReview.status === "not-assessed" && southAfricaRecord.release === "blocked", "South Africa source discovery must not be mistaken for legal clearance");
assert.equal(southAfricaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "South Africa source discovery needs its own dated record");
assert.equal(southAfricaRecord.officialSources.length, 21, "South Africa source leads must retain POPIA and 2026 regulations, SAHPRA, consumer, rights, language, child, copyright, emergency, nonprofit/tax, territory and platform sources");
assert.ok(southAfricaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "South Africa sources must remain dated source leads only");
assert.equal(southAfricaRecord.reviewAreas.length, 14, "Every South Africa legal review area must remain explicit");
assert.ok(southAfricaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "South Africa source discovery must not change a legal review area to assessed");
assert.equal(southAfricaRecord.subnationalAreas.length, 9, "South Africa must retain all nine provinces as unassessed screening targets");
assert.equal(new Set(southAfricaRecord.subnationalAreas.map((area) => area.name)).size, 9, "South African province screening targets must be unique");
assert.ok(southAfricaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "South Africa province screening must not be mistaken for local clearance");
assert.ok(southAfricaRecord.officialSources.some((source) => source.url === "https://www.gov.za/documents/notices/protection-personal-information-act-regulations-english-afrikaans-06-mar-2026"), "South Africa 2026 POPIA regulations notice must remain visible");
assert.ok(southAfricaRecord.officialSources.some((source) => source.url === "https://www.sahpra.org.za/?dlp_document=guideline-for-classification-of-medical-devices-and-ivds"), "Current SAHPRA device classification guidance must remain visible");
assert.match(southAfricaRecord.sourceDiscoveryNote, /not a completeness claim/);
const kenyaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "KE");
assert.ok(kenyaRecord && kenyaRecord.legalReview.status === "not-assessed" && kenyaRecord.subnationalReview.status === "not-assessed" && kenyaRecord.release === "blocked", "Kenya source discovery must not be mistaken for legal clearance");
assert.equal(kenyaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Kenya source discovery needs its own dated record");
assert.equal(kenyaRecord.officialSources.length, 24, "Kenya source leads must cover privacy, digital health/MDSW, health, consumer, accessibility, children, copyright, emergency, PBO/tax and counties");
assert.ok(kenyaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Kenya sources must remain dated source leads only");
assert.equal(kenyaRecord.reviewAreas.length, 14, "Every Kenya legal review topic must remain explicit");
assert.ok(kenyaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Kenya source discovery must not change a legal review area to assessed");
assert.equal(kenyaRecord.subnationalAreas.length, 47, "Kenya must retain all 47 counties as unassessed screening targets");
assert.equal(new Set(kenyaRecord.subnationalAreas.map((area) => area.name)).size, 47, "Kenya county screening targets must be unique");
assert.ok(kenyaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Kenya county screening must not be mistaken for local clearance");
assert.ok(kenyaRecord.officialSources.some((source) => source.url === "https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402019-11-15/source"), "Kenya Data Protection Act must remain visible");
assert.ok(kenyaRecord.officialSources.some((source) => source.url === "https://web.pharmacyboardkenya.org/download/guideline-on-regulation-of-medical-device-software-in-kenya-mdsw/"), "Kenya 2026 medical-device software guideline must remain visible");
assert.ok(kenyaRecord.officialSources.some((source) => source.url === "https://new.kenyalaw.org/akn/ke/act/2025/4/eng%402025-05-13/source"), "Kenya Persons with Disabilities Act 2025 must remain visible");
assert.match(kenyaRecord.sourceDiscoveryNote, /not a completeness claim/);
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
const estoniaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "EE");
assert.ok(estoniaRecord && estoniaRecord.alpha3 === "EST" && estoniaRecord.m49 === "233", "Estonia must remain mapped to the recorded ISO and M49 identifiers");
assert.equal(estoniaRecord.legalReview.status, "not-assessed", "Estonian source discovery must not imply a completed legal screen");
assert.equal(estoniaRecord.subnationalReview.status, "not-assessed", "Estonian source discovery must not imply a completed subnational screen");
assert.equal(estoniaRecord.release, "blocked", "Estonia must remain blocked pending qualified review");
assert.equal(estoniaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Estonian source discovery needs its own dated record");
assert.equal(estoniaRecord.reviewAreas.length, 14, "Every Estonian review topic must remain explicit");
assert.ok(estoniaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Estonian source leads must not change any legal topic to assessed");
assert.equal(estoniaRecord.subnationalAreas.length, 15, "Estonia must retain all 15 counties as unassessed screening targets");
assert.equal(new Set(estoniaRecord.subnationalAreas.map((area) => area.name)).size, 15, "Estonian county screening targets must be unique");
assert.ok(estoniaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Estonian county screening must not be mistaken for local clearance");
const estoniaSourceUrls = [
  "https://www.riigiteataja.ee/en/eli/507112023002/consolide",
  "https://www.aki.ee/en/guidelines-legislation/legislation",
  "https://www.riigiteataja.ee/en/akt/515052025001",
  "https://www.riigiteataja.ee/en/akt/530062021010",
  "https://www.riigiteataja.ee/en/eli/509012015001/consolide",
  "https://www.riigiteataja.ee/en/tolge/pdf/524082022008",
  "https://www.riigiteataja.ee/akt/115062022001.pdf",
  "https://www.riigiteataja.ee/public-api/api/v1/akt/103072026029/blob-html",
  "https://ttja.ee/en/business-client/entrepreneurship/consumer-protection-requirements/consumer-protection-requirements",
  "https://www.riigiteataja.ee/en/akt/511082026005",
  "https://www.riigiteataja.ee/en/eli/ee/520102025003/consolide/current",
  "https://www.riigiteataja.ee/en/eli/ee/503042014003/consolide/current",
  "https://www.112.ee/en/emergency-phone-number-112",
];
assert.equal(estoniaRecord.officialSources.length, estoniaSourceUrls.length, "Estonian national source leads must be enumerated");
for (const url of estoniaSourceUrls) assert.ok(estoniaRecord.officialSources.some((source) => source.url === url && source.status === "source-lead-only" && source.checkedOn === "2026-10-12"), `Estonian source lead missing, undated or misclassified: ${url}`);
const latviaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "LV");
assert.ok(latviaRecord && latviaRecord.alpha3 === "LVA" && latviaRecord.m49 === "428", "Latvia must remain mapped to the recorded ISO and M49 identifiers");
assert.equal(latviaRecord.legalReview.status, "not-assessed", "Latvian source discovery must not imply a completed legal screen");
assert.equal(latviaRecord.subnationalReview.status, "not-assessed", "Latvian source discovery must not imply a completed subnational screen");
assert.equal(latviaRecord.release, "blocked", "Latvia must remain blocked pending qualified review");
assert.equal(latviaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Latvian source discovery needs its own dated record");
assert.equal(latviaRecord.reviewAreas.length, 14, "Every Latvian review topic must remain explicit");
assert.ok(latviaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Latvian source leads must not change any legal topic to assessed");
assert.equal(latviaRecord.subnationalAreas.length, 43, "Latvia must retain all 43 local-government units as unassessed screening targets");
assert.equal(new Set(latviaRecord.subnationalAreas.map((area) => area.name)).size, 43, "Latvian local-government screening targets must be unique");
assert.ok(latviaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Latvian local-government screening must not be mistaken for local clearance");
const latviaSourceUrls = [
  "https://likumi.lv/ta/en/en/id/300099-personal-data-processing-law",
  "https://likumi.lv/ta/id/300099-fizisko-personu-datu-apstrades-likums",
  "https://www.dvi.gov.lv/en/areas-activity",
  "https://likumi.lv/ta/id/334345-elektronisko-sakaru-likums",
  "https://likumi.lv/ta/en/id/96619-law-on-information-society-services",
  "https://likumi.lv/ta/id/96619-informacijas-sabiedribas-pakalpojumu-likums",
  "https://likumi.lv/ta/en/id/44108-medical-treatment-law",
  "https://likumi.lv/ta/id/44108-arstniecibas-likums",
  "https://likumi.lv/ta/en/en/id/344674-regulations-regarding-medical-devices",
  "https://likumi.lv/ta/id/344674-medicinisko-iericu-noteikumi",
  "https://likumi.lv/ta/en/id/23309-consumer-rights-protection-law",
  "https://likumi.lv/ta/id/23309-pateretaju-tiesibu-aizsardzibas-likums",
  "https://likumi.lv/ta/en/id/167759-unfair-commercial-%E2%80%8Bpractices-prohibition-law",
  "https://likumi.lv/ta/id/167759-negodigas-komercprakses-aizlieguma-likums",
  "https://likumi.lv/ta/en/en/id/340554",
  "https://likumi.lv/ta/en/id/14740-official-language-law",
  "https://likumi.lv/ta/id/14740-valsts-valodas-likums",
  "https://likumi.lv/ta/en/en/id/353390-national-cybersecurity-law",
  "https://likumi.lv/ta/en/id/5138-copyright-law",
  "https://likumi.lv/ta/id/5138-autortiesibu-likums",
  "https://likumi.lv/ta/en/en/id/49096-law-on-the-protection-of-the-childrens-rights",
  "https://likumi.lv/ta/id/49096-bernu-tiesibu-aizsardzibas-likums",
  "https://likumi.lv/ta/id/353390-nacionalas-kiberdrosibas-likums",
  "https://likumi.lv/ta/en/id/90822-public-benefit-organisation-law",
  "https://likumi.lv/ta/id/90822-sabiedriska-labuma-organizaciju-likums",
  "https://www.vugd.gov.lv/en/emergency-response-centre",
];
assert.equal(latviaRecord.officialSources.length, latviaSourceUrls.length, "Latvian national source leads must be enumerated");
for (const url of latviaSourceUrls) assert.ok(latviaRecord.officialSources.some((source) => source.url === url && source.status === "source-lead-only" && source.checkedOn === "2026-10-12"), `Latvian source lead missing, undated or misclassified: ${url}`);
const ukraineRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "UA");
assert.ok(ukraineRecord && ukraineRecord.legalReview.status === "not-assessed" && ukraineRecord.subnationalReview.status === "not-assessed" && ukraineRecord.release === "blocked", "Ukraine source discovery must not be mistaken for legal clearance");
assert.equal(ukraineRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Ukraine source discovery needs its own dated record");
assert.equal(ukraineRecord.officialSources.length, 22, "Ukraine source leads should include the current national and platform-policy inventory");
assert.ok(ukraineRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Ukraine sources must remain dated source leads only");
assert.equal(ukraineRecord.reviewAreas.length, 14, "Every Ukraine legal review topic must remain explicit");
assert.ok(ukraineRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Ukraine source discovery must not change a legal review area to assessed");
assert.ok(ukraineRecord.officialSources.some((source) => source.url === "https://zakon.rada.gov.ua/laws/show/3153-IX" && source.sourceType === "legislation-not-yet-in-force"), "Ukraine's consumer-law transition lead must remain visible");
assert.deepEqual(ukraineRecord.subnationalAreas.map((area) => area.name), ["Autonomous Republic of Crimea", "Vinnytsia Oblast", "Volyn Oblast", "Dnipropetrovsk Oblast", "Donetsk Oblast", "Zhytomyr Oblast", "Zakarpattia Oblast", "Zaporizhzhia Oblast", "Ivano-Frankivsk Oblast", "Kyiv Oblast", "Kirovohrad Oblast", "Luhansk Oblast", "Lviv Oblast", "Mykolaiv Oblast", "Odesa Oblast", "Poltava Oblast", "Rivne Oblast", "Sumy Oblast", "Ternopil Oblast", "Kharkiv Oblast", "Kherson Oblast", "Khmelnytskyi Oblast", "Cherkasy Oblast", "Chernivtsi Oblast", "Chernihiv Oblast", "City of Kyiv", "City of Sevastopol"], "Ukraine must retain the full Constitution Article 133 top-level screening queue");
assert.ok(ukraineRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Ukraine subnational source discovery must not be mistaken for local clearance");
const lithuaniaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "LT");
assert.ok(lithuaniaRecord && lithuaniaRecord.legalReview.status === "not-assessed" && lithuaniaRecord.subnationalReview.status === "not-assessed" && lithuaniaRecord.release === "blocked", "Lithuania source discovery must not be mistaken for legal clearance");
assert.equal(lithuaniaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Lithuania source discovery needs its own dated record");
assert.equal(lithuaniaRecord.officialSources.length, 26, "Lithuania source leads should retain national, EU and platform-policy inventory");
assert.ok(lithuaniaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Lithuania sources must remain dated source leads only");
assert.equal(lithuaniaRecord.reviewAreas.length, 14, "Every Lithuania legal review topic must remain explicit");
assert.ok(lithuaniaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Lithuania source discovery must not change a legal review area to assessed");
assert.equal(lithuaniaRecord.subnationalAreas.length, 70, "Lithuania must retain 10 county and 60 municipality screening targets");
assert.equal(new Set(lithuaniaRecord.subnationalAreas.map((area) => area.name)).size, 70, "Lithuanian county and municipality screening targets must be unique");
assert.ok(lithuaniaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Lithuania subnational source discovery must not be mistaken for local clearance");
assert.ok(lithuaniaRecord.officialSources.some((source) => source.sourceType === "legislative-proposal" && source.status === "source-lead-only"), "Pending Lithuanian accessibility amendments must remain a proposal, not enacted law");
const franceRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "FR");
assert.ok(franceRecord && franceRecord.legalReview.status === "not-assessed" && franceRecord.subnationalReview.status === "not-assessed" && franceRecord.release === "blocked", "France source discovery must not be mistaken for legal clearance");
assert.equal(franceRecord.sourceDiscoveryCheckedOn, "2026-10-13", "France source discovery needs its own dated record");
assert.equal(franceRecord.officialSources.length, 26, "France source leads should retain national, EU and platform-policy inventory");
assert.ok(franceRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "France sources must remain dated source leads only");
assert.equal(franceRecord.reviewAreas.length, 14, "Every France legal review topic must remain explicit");
assert.ok(franceRecord.reviewAreas.every((area) => area.status === "not-assessed"), "France source discovery must not change a legal review area to assessed");
assert.deepEqual(franceRecord.subnationalAreas.map((area) => area.name), ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d’Azur", "Guadeloupe", "Martinique", "Guyane", "La Réunion", "Mayotte"], "France must retain its 18-region screening queue, including overseas regions");
assert.ok(franceRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "France subnational source discovery must not be mistaken for local clearance");
assert.ok(franceRecord.officialSources.some((source) => source.url === "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033862549"), "France health-data hosting lead must remain visible");
const spainRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "ES");
assert.ok(spainRecord && spainRecord.legalReview.status === "not-assessed" && spainRecord.subnationalReview.status === "not-assessed" && spainRecord.release === "blocked", "Spain source discovery must not be mistaken for legal clearance");
assert.equal(spainRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Spain source discovery needs its own dated record");
assert.equal(spainRecord.officialSources.length, 28, "Spain source leads should retain national, EU and platform-policy inventory");
assert.ok(spainRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Spain sources must remain dated source leads only");
assert.equal(spainRecord.reviewAreas.length, 14, "Every Spain legal review topic must remain explicit");
assert.ok(spainRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Spain source discovery must not change a legal review area to assessed");
assert.deepEqual(spainRecord.subnationalAreas.map((area) => area.name), ["Andalucía", "Aragón", "Principado de Asturias", "Illes Balears", "Canarias", "Cantabria", "Castilla y León", "Castilla-La Mancha", "Cataluña", "Comunitat Valenciana", "Extremadura", "Galicia", "Comunidad de Madrid", "Región de Murcia", "Comunidad Foral de Navarra", "País Vasco", "La Rioja", "Ceuta", "Melilla"], "Spain must retain all 17 autonomous communities and both autonomous cities");
assert.ok(spainRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Spain subnational source discovery must not be mistaken for local clearance");
assert.ok(spainRecord.officialSources.some((source) => source.url === "https://administracion.gob.es/tu-espacio-europeo/derechos-obligaciones/ciudadanos/asistencia-sanitaria/numeros-urgencia"), "Spain's regionalized 112 service lead must remain visible");
const japanRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "JP");
assert.ok(japanRecord && japanRecord.legalReview.status === "not-assessed" && japanRecord.subnationalReview.status === "not-assessed" && japanRecord.release === "blocked", "Japan source discovery must not be mistaken for legal clearance");
assert.equal(japanRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Japan source discovery needs its own dated record");
assert.equal(japanRecord.officialSources.length, 26, "Japan source leads should retain national, device, consumer and platform-policy inventory");
assert.ok(japanRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Japan sources must remain dated source leads only");
assert.equal(japanRecord.reviewAreas.length, 14, "Every Japan legal review topic must remain explicit");
assert.ok(japanRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Japan source discovery must not change a legal review area to assessed");
assert.equal(japanRecord.subnationalAreas.length, 47, "Japan must retain all 47 prefectures as unassessed screening targets");
assert.equal(new Set(japanRecord.subnationalAreas.map((area) => area.name)).size, 47, "Japanese prefecture screening targets must be unique");
assert.ok(japanRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Japan prefecture source discovery must not be mistaken for local clearance");
assert.ok(japanRecord.officialSources.some((source) => source.url === "https://www.ppc.go.jp/en/legal/"), "Japan APPI source must preserve the translation/legal-effect caveat");
assert.ok(japanRecord.officialSources.some((source) => source.url === "https://www.pmda.go.jp/english/review-services/reviews/0009.html"), "Japan SaMD source must remain visible");
assert.ok(japanRecord.officialSources.some((source) => source.sourceType === "official-territorial-register"), "Japan prefecture queue must retain its official territorial source");
const chinaRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "CN");
assert.ok(chinaRecord && chinaRecord.legalReview.status === "not-assessed" && chinaRecord.subnationalReview.status === "not-assessed" && chinaRecord.release === "blocked", "China source discovery must not be mistaken for legal clearance");
assert.equal(chinaRecord.sourceDiscoveryCheckedOn, "2026-10-13", "China source discovery needs its own dated record");
assert.equal(chinaRecord.officialSources.length, 28, "China source leads should retain privacy, network, app, device and platform-policy inventory");
assert.ok(chinaRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "China sources must remain dated source leads only");
assert.equal(chinaRecord.reviewAreas.length, 14, "Every China legal review topic must remain explicit");
assert.ok(chinaRecord.reviewAreas.every((area) => area.status === "not-assessed"), "China source discovery must not change a legal review area to assessed");
assert.equal(chinaRecord.subnationalAreas.length, 31, "China must retain 31 mainland provincial-level targets, excluding separate Hong Kong and Macao records");
assert.equal(new Set(chinaRecord.subnationalAreas.map((area) => area.name)).size, 31, "China provincial-level screening targets must be unique");
assert.ok(chinaRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "China regional source discovery must not be mistaken for local clearance");
assert.ok(chinaRecord.officialSources.some((source) => source.url === "https://www.cac.gov.cn/2024-03/22/c_1712776611775634.htm"), "China cross-border data transfer rules must remain visible");
assert.ok(chinaRecord.officialSources.some((source) => source.url === "https://www.gov.cn/zhengce/zhengceku/202308/content_6897341.htm?type=mobile-internet"), "China mobile app filing requirement must remain visible");
assert.ok(chinaRecord.officialSources.some((source) => source.url === "https://sdca.miit.gov.cn/zwgk/fgbz/art/2026/art_4815dd4ec11d454783b83a91502a3cc7.html"), "China's current amended Cybersecurity Law source must remain visible");
const hongKongRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "HK");
assert.ok(hongKongRecord && hongKongRecord.legalReview.status === "not-assessed" && hongKongRecord.subnationalReview.status === "not-assessed" && hongKongRecord.release === "blocked", "Hong Kong source discovery must not be mistaken for legal clearance");
assert.equal(hongKongRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Hong Kong source discovery needs its own dated record");
assert.equal(hongKongRecord.officialSources.length, 25, "Hong Kong source leads should retain privacy, disability, device, consumer, emergency and platform-policy inventory");
assert.ok(hongKongRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Hong Kong sources must remain dated source leads only");
assert.equal(hongKongRecord.reviewAreas.length, 14, "Every Hong Kong legal review topic must remain explicit");
assert.ok(hongKongRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Hong Kong source discovery must not change a legal review area to assessed");
assert.deepEqual(hongKongRecord.subnationalAreas.map((area) => area.name), ["Central and Western", "Eastern", "Southern", "Wan Chai", "Kowloon City", "Yau Tsim Mong", "Sham Shui Po", "Wong Tai Sin", "Kwun Tong", "Tai Po", "Yuen Long", "Tuen Mun", "North", "Sai Kung", "Sha Tin", "Tsuen Wan", "Kwai Tsing", "Islands"], "Hong Kong must retain all 18 district screening targets");
assert.ok(hongKongRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Hong Kong district source discovery must not be mistaken for local clearance");
assert.ok(hongKongRecord.officialSources.some((source) => source.url === "https://www.elegislation.gov.hk/hk/cap486"), "Hong Kong PDPO source must remain visible");
assert.ok(hongKongRecord.officialSources.some((source) => source.url === "https://www.dh.gov.hk/english/main/main_mdd/main_mdd.html"), "Hong Kong medical-device framework source must remain visible");
assert.ok(hongKongRecord.officialSources.some((source) => source.url === "https://www.hkengage.gov.hk/en/essentials/basics/emergency-ambulance-services"), "Hong Kong emergency and accessibility route lead must remain visible");
const macaoRecord = resources.countryRecords.find((country) => country.isoAlpha2 === "MO");
assert.ok(macaoRecord && macaoRecord.legalReview.status === "not-assessed" && macaoRecord.subnationalReview.status === "not-assessed" && macaoRecord.release === "blocked", "Macao source discovery must not be mistaken for legal clearance");
assert.equal(macaoRecord.sourceDiscoveryCheckedOn, "2026-10-13", "Macao source discovery needs its own dated record");
assert.equal(macaoRecord.officialSources.length, 25, "Macao source leads should retain privacy, phased device, consumer, access, emergency and platform-policy inventory");
assert.ok(macaoRecord.officialSources.every((source) => source.status === "source-lead-only" && source.checkedOn === "2026-10-13"), "Macao sources must remain dated source leads only");
assert.equal(macaoRecord.reviewAreas.length, 14, "Every Macao legal review topic must remain explicit");
assert.ok(macaoRecord.reviewAreas.every((area) => area.status === "not-assessed"), "Macao source discovery must not change a legal review area to assessed");
assert.deepEqual(macaoRecord.subnationalAreas.map((area) => area.name), ["Nossa Senhora de Fátima", "Santo António", "São Lázaro", "Sé", "São Lourenço", "Nossa Senhora do Carmo", "São Francisco Xavier"], "Macao must retain all seven parish-level territorial targets");
assert.ok(macaoRecord.subnationalAreas.every((area) => area.status === "not-assessed" && area.checkedOn === "2026-10-13" && area.reviewer === null), "Macao parish queue must not be mistaken for local legal clearance");
assert.ok(macaoRecord.officialSources.some((source) => source.url === "https://bo.io.gov.mo/isapi/go.asp?d=lei-12-2025cn"), "Macao's current medical-device law must remain visible");
assert.ok(macaoRecord.officialSources.some((source) => source.url === "https://www.dspdp.gov.mo/file/Laws%20and%20Regulations/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E4%BF%9D%E8%AD%B7%E6%B3%95_EN.pdf"), "Macao privacy-law translation caveat must remain visible");
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
