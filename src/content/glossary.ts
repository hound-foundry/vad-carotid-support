export type GlossaryTerm = {
  term: string;
  definition: string;
  limit: string;
  sourceId: string;
};

/** Short, source-linked draft definitions; not a way to interpret a personal report. */
export const glossary: GlossaryTerm[] = [
  {
    term: "CAD",
    definition: "In this app, CAD means carotid artery dissection.",
    limit: "The abbreviation can mean other things elsewhere. Check how it is used in your own report.",
    sourceId: "aha-2024",
  },
  {
    term: "Dissection",
    definition: "A problem involving the wall of an artery. A cervical artery dissection affects an artery in the neck, such as a carotid or vertebral artery.",
    limit: "This general definition cannot explain the location, cause, seriousness or care plan in an individual case.",
    sourceId: "aha-2024",
  },
  {
    term: "Extracranial / intracranial",
    definition: "Extracranial means outside the skull; intracranial means inside the skull.",
    limit: "These words describe location. They do not explain what a finding means for a person.",
    sourceId: "ncbi-anatomy-skull",
  },
  {
    term: "Infarct",
    definition: "An area of tissue injury associated with loss of its blood supply.",
    limit: "The word alone does not tell you the location, size, timing, cause or effects of a finding.",
    sourceId: "nice-infarct",
  },
  {
    term: "Occlusion",
    definition: "A blockage or closure of a vessel.",
    limit: "Ask the clinician who reviewed the test what vessel and area the report describes and what it means in your case.",
    sourceId: "radiologyinfo-occlusion",
  },
  {
    term: "Pseudoaneurysm",
    definition: "A pocket of blood outside the usual layers of an artery wall, connected to the artery through a defect in the wall.",
    limit: "A definition cannot establish the location or significance of a finding in an individual report.",
    sourceId: "ncbi-pseudoaneurysm",
  },
  {
    term: "Stenosis",
    definition: "Narrowing.",
    limit: "The word alone does not say how much a vessel is narrowed or what that means for you.",
    sourceId: "radiologyinfo-stenosis",
  },
  {
    term: "VAD",
    definition: "Vertebral artery dissection.",
    limit: "A clinician can explain which artery and part of the artery are involved in an individual case.",
    sourceId: "aha-2024",
  },
];
