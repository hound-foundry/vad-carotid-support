import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createCardPdf } from "../src/features/cards/pdf.mjs";
import { emptyPersonalCard, emptyMilestoneCard, personalCardPresentation, milestoneCardPresentation } from "../src/features/cards/model.mjs";

// Disposable synthetic output for visual and text checks; never load browser data.
const out = new URL("../output/pdf/", import.meta.url), temporary = new URL("../tmp/pdfs/", import.meta.url);
await mkdir(out, { recursive: true }); await mkdir(temporary, { recursive: true });
const regular = await readFile(new URL("../public/fonts/NotoSans-Regular.ttf", import.meta.url)), bold = await readFile(new URL("../public/fonts/NotoSans-Bold.ttf", import.meta.url));
const practical = personalCardPresentation({ ...emptyPersonalCard(), heading: "Please give me time", preferredName: "Example", communicationNeeds: "Please ask before helping me.", designId: "ink", updatedOn: "2026-10-14" });
const survivor = milestoneCardPresentation({ ...emptyMilestoneCard(), title: "SURVIVOR", message: "My story, my words.", designId: "ink", artworkId: "ribbon" });
await writeFile(new URL("medical-wallet-example.pdf", out), await createCardPdf(practical, regular, bold, { size: "wallet" }));
await writeFile(new URL("survivor-example.pdf", out), await createCardPdf(survivor, regular, bold));
const long = personalCardPresentation({ ...emptyPersonalCard(), heading: "Synthetic long card", preferredName: "EXAMPLE-ONLY", communicationNeeds: "Please write important things down. ".repeat(10), medicines: "SYNTHETIC-MEDICINE-ENTRY ".repeat(24), allergies: "SYNTHETIC-ALLERGY-ENTRY ".repeat(24), eventDateKind: "none", eventDate: "HIDDEN-DATE-MARKER", artworkId: "brain", designId: "gentle", updatedOn: "2026-10-14" });
await writeFile(new URL("long-wallet.pdf", temporary), await createCardPdf(long, regular, bold, { size: "wallet" }));
await writeFile(new URL("long-portrait.pdf", temporary), await createCardPdf(long, regular, bold));
console.log("Generated two synthetic examples and two overflow fixtures locally.");
