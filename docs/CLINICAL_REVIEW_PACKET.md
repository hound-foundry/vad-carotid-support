# Clinical review packet

This packet prepares the current English drafts for review by an appropriately qualified clinician. It is an internal review aid, not medical guidance, a statement of endorsement, or proof that any content has been checked. All listed pages remain unapproved for patient use until review is actually completed and recorded in their content metadata.

## Review scope

The reviewer should accept only the parts that fall within their expertise and should flag anything that needs another specialist, source check, local review or rewrite. The request is to assess the app’s general educational wording, not to provide advice for an individual patient.

For each sentence or prompt that carries a clinical meaning, check:

- whether it is accurate and current for the population and setting it describes;
- whether the cited source directly supports it, including the source’s limitations and date;
- whether evidence for cervical artery dissection is clearly distinguished from broader stroke evidence or other populations;
- whether uncertainty is represented honestly, without implying a personal prognosis, diagnosis or treatment choice;
- whether wording could create avoidable alarm, false reassurance or an unsafe delay in seeking urgent care;
- whether the next step appropriately points back to the person’s treating team or local emergency services;
- whether a statement needs a specific jurisdiction or should stay out of an international English draft.

Please record suggested edits or questions against the exact page and section. Do not mark a page approved while a material issue, unsupported claim or unresolved source question remains.

## Pages and questions for review

| Page | Draft content to check closely | Source context already recorded |
|---|---|---|
| Understanding cervical artery dissection | Definition and anatomy; distinction between carotid and vertebral arteries; ways a dissection may be found; statements about stroke and individual outlook; appointment questions. | AHA 2024 statement, ESO 2021 guideline and linked patient-information sources. Confirm the draft does not imply that general descriptions interpret an individual scan or predict outcomes. |
| Tests, scans and unfamiliar terms | Definitions of extracranial, intracranial, stenosis, occlusion, infarct and pseudoaneurysm; limitations on applying a definition to a report. | Clinical guidance plus the listed radiology, NICE and NCBI references. Confirm each definition is clinically appropriate in context and that the page does not encourage self-interpretation. |
| Dissection without a diagnosed stroke | Wording that validates concerns without making a recovery promise; discussion prompts and the limited use of older quality-of-life evidence. | AHA 2024, ESO 2021 and an observational quality-of-life study from 2009. Confirm study population and limitations are sufficiently clear. |
| When dissection is accompanied by stroke | Range of possible stroke effects; rehabilitation and communication prompts; urgent-change wording; distinction between stroke-wide evidence and dissection-specific evidence. | AHA 2024, ESO 2021, NICE adult stroke rehabilitation and stroke information-needs sources. Confirm local service references are not implied by general wording. |
| Recovery, fatigue and quality of life | Wording about possible concerns; characterization of two selected studies; no prevalence, individual prediction or effectiveness claim. | A 2009 observational study and a 2026 exploratory follow-up, alongside stroke rehabilitation guidance. Confirm study selection and uncertainty are understandable and accurately represented. |
| Supporting someone after dissection or stroke | Consent and privacy wording; patient-led support; carer needs; claim about the limits of intervention evidence. | Stroke guidance and carer information sources. Confirm the page does not assign carers clinical responsibility or imply universal legal rules. |
| Prepare for a follow-up appointment | Whether all prompts are safe, non-prescriptive and useful; clear distinction between routine questions and emergency situations. | AHA 2024, ESO 2021, NICE and stroke information-needs sources. Confirm the prompts do not suggest an individual should wait for a routine appointment when urgent care may be needed. |
| Plain-language glossary | Clinical meaning, plain-language clarity and limits for each definition. | Each glossary entry has its own source link in `src/content/glossary.ts`. Check that the definition and its cited source agree. |
| Appointment questions and urgent-help wording | Relevance and safety of selectable questions; distinction between preparation and advice; global emergency wording. | Prompts are maintained in `src/features/appointments/model.mjs`; emergency text appears in shared navigation and `app/urgent-help.tsx`. Review emergency wording explicitly. |

## Evidence and review record

The source catalogue is a starting list, not a systematic review. Bibliographic presence does not mean that the project has appraised the source or verified every claim. Reviewers should identify sources they could not inspect, outdated guidance, missing evidence and any text that needs removal rather than assuming the catalogue is complete. The original draft files are in `src/content/guides.ts`, `src/content/glossary.ts` and `src/features/appointments/model.mjs`; the catalogue is `content/references.json`.

For each reviewed item, keep a record of:

- page, section or prompt reviewed and the exact revision reviewed;
- reviewer identity only with their permission, relevant role and qualifications verified by the project;
- scope accepted and any scope outside the reviewer’s expertise;
- review date, conflicts or relevant interests disclosed, and sources checked;
- required edits, questions left open, and the resolution for each;
- approval decision and the next review date or trigger.

The review record does not authorize use of a reviewer’s name, employer, comments or endorsement in public materials. Get separate permission for any public attribution. Do not change clinical metadata to `approved` until the reviewer has given an explicit decision for the final text and all required changes are resolved. Patient/carer usability, translation, privacy, legal and market reviews remain separate release gates.

## Current state

No clinical reviewer has completed this review through the project. The pages and glossary remain drafts. This packet does not recruit or represent a reviewer, and it does not replace clinical or country-specific regulatory review.
