import references from "../../content/references.json";
import community from "../../content/community-candidates.json";

export type DirectoryResource = {
  id: string;
  title: string;
  url: string;
  audience: string[];
  kind: string;
  checkedOn: string;
  note: string;
  language: string;
  editorialStatus: string;
  clinicalReviewStatus: string;
  rights: string;
  verifiedForDirectory: boolean;
};

export const publicResources: DirectoryResource[] = [
  { id: "patient-page-2021", title: "Vascular Disease Patient Information Page: Cervical artery dissection", url: "https://journals.sagepub.com/doi/full/10.1177/1358863X211051427", audience: ["patients", "carers"], kind: "patient information", checkedOn: "2026-10-12", note: "Older patient-information article. Read its date and discuss care questions with your own team.", verifiedForDirectory: true },
  { id: "cleveland-overview", title: "Cervical Artery Dissection — Cleveland Clinic", url: "https://my.clevelandclinic.org/health/diseases/16857-cervical-carotid-or-vertebral-artery-dissection", audience: ["patients", "carers", "interested readers"], kind: "health-service overview", checkedOn: "2026-10-12", note: "The source catalogue records a 2022 review date; check for newer guidance.", verifiedForDirectory: true },
  { id: "survivor-book-2017", title: "Carotid and Vertebral Artery Dissection: A Guide for Survivors and Their Loved Ones", url: "https://books.google.com/books/about/Carotid_and_Vertebral_Artery_Dissection.html?id=2SZhswEACAAJ", audience: ["patients", "carers"], kind: "book", checkedOn: "2026-10-12", note: "2017 book by Jodi A. Dodds and Amanda P. Anderson. Only bibliographic information has been checked; the project does not reproduce its text.", verifiedForDirectory: true },
  { id: "asa-warning-signs", title: "Stroke Symptoms and Warning Signs — American Stroke Association", url: "https://www.stroke.org/en/about-stroke/stroke-symptoms", audience: ["patients", "carers", "interested readers"], kind: "patient information", checkedOn: "2026-10-12", note: "US-published resource. Emergency instructions and services are country-specific.", verifiedForDirectory: true },
  { id: "nice-ng236", title: "Stroke rehabilitation in adults — NICE guideline", url: "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations", audience: ["patients", "carers", "professionals"], kind: "clinical guideline", checkedOn: "2026-10-12", note: "UK guideline; service recommendations may not apply in other countries.", verifiedForDirectory: true },
].map((resource) => {
  const source = references.sources.find((item) => item.id === resource.id);
  return {
    ...resource,
    title: source?.title ?? resource.title,
    url: source?.url ?? resource.url,
    kind: source?.kind ?? resource.kind,
    language: source?.language ?? "en",
    editorialStatus: source?.editorial_status ?? "not recorded",
    clinicalReviewStatus: source?.clinical_review?.status ?? "not recorded",
    rights: source?.rights ?? "Rights information has not been recorded.",
  };
});

// Candidates are deliberately not displayed until access and current group details can be verified.
export const communityCandidates = community.candidates;
