export type Audience = "patient" | "carer" | "interested-reader";
export type Guide = {
  slug: string;
  publicationStatus: "draft" | "published";
  title: string;
  summary: string;
  audience: Audience[];
  language: "en";
  jurisdiction: "general";
  sourceIds: string[];
  rights: string;
  clinicalReview: { status: "not-reviewed" | "approved"; reviewer: string | null; qualifications: string | null; date: string | null };
  usabilityReview: { status: "not-reviewed" | "approved"; reviewer: string | null; date: string | null };
  translationReview: { status: "not-applicable" | "not-reviewed" | "approved"; reviewer: string | null; date: string | null };
  reviewedOn: null;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

const review = { status: "not-reviewed" as const, reviewer: null, qualifications: null, date: null };
const usabilityReview = { status: "not-reviewed" as const, reviewer: null, date: null };
const translationReview = { status: "not-applicable" as const, reviewer: null, date: null };
const rights = "Original short draft written for this project; not approved for patient use. External sources are linked, not reproduced.";

export const guides: Guide[] = [
  {
    slug: "understanding-dissection", publicationStatus: "draft", title: "Understanding cervical artery dissection", summary: "A plain-language starting point for carotid and vertebral artery dissection.",
    audience: ["patient", "carer", "interested-reader"], language: "en", jurisdiction: "general", sourceIds: ["aha-2024", "eso-2021", "patient-page-2021", "cleveland-overview"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "What the words mean", paragraphs: ["A cervical artery dissection is a problem in the wall of an artery in the neck. The carotid arteries and vertebral arteries carry blood toward the brain. A dissection can affect either type of artery; the location and effects vary from person to person.", "VAD means vertebral artery dissection. In this app, CAD means carotid artery dissection. The carotid and vertebral arteries in the neck carry blood toward the brain. A clinician can explain which artery is involved in an individual case." ] },
      { heading: "Why experiences differ", paragraphs: ["A dissection may be found during assessment for local symptoms, may be associated with a stroke, or may be discovered in another way. Imaging findings and symptoms do not tell the whole story about an individual’s outlook. Only the treating team can interpret a person’s tests and care plan." ] },
      { heading: "Questions you could take to your team", bullets: ["Which artery and part of the artery are involved?", "What did the imaging show, and what remains uncertain?", "What follow-up is planned, and whom should I contact with a non-emergency question?", "Which information is specific to my situation and which is general?" ] },
      { heading: "Sources and limits", paragraphs: ["This draft is informed by the linked AHA scientific statement, ESO guideline and patient-information sources. Their recommendations and populations are not interchangeable. This draft has not been clinically reviewed and cannot explain an individual scan or recommend treatment." ] },
    ],
  },
  {
    slug: "tests-and-terms", publicationStatus: "draft", title: "Tests, scans and unfamiliar terms", summary: "Prompts for understanding the words used in reports and appointments.",
    audience: ["patient", "carer", "interested-reader"], language: "en", jurisdiction: "general", sourceIds: ["aha-2024", "eso-2021", "patient-page-2021"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Reports can be hard to read", paragraphs: ["Medical reports may use abbreviations and describe anatomy in technical terms. A short phrase in a report is not a substitute for the full clinical interpretation, and this app cannot interpret images or reports." ] },
      { heading: "Ask for an explanation", bullets: ["Could you show me which artery and segment you mean?", "What does this finding mean in my case?", "Is there a result still pending?", "Could I have a copy or a plain-language summary of the report?", "Who should I contact if I do not understand the follow-up plan?" ] },
      { heading: "Terms to clarify", paragraphs: ["Words such as extracranial, intracranial, stenosis, occlusion, infarct and pseudoaneurysm have specific meanings. Their significance depends on the full report and a clinician’s assessment. Ask the clinician who ordered or reviewed the test to explain any term that affects your care." ] },
    ],
  },
  {
    slug: "without-stroke", publicationStatus: "draft", title: "Dissection without a diagnosed stroke", summary: "A pathway for people whose dissection was not accompanied by a diagnosed stroke.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["qol-2009", "aha-2024", "eso-2021"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Your experience still matters", paragraphs: ["People’s symptoms, test findings, care and recovery differ. Not having a diagnosed stroke does not mean questions or ongoing effects are unimportant. This page is a prompt for discussion, not a prediction about what will happen." ] },
      { heading: "Follow-up conversation", bullets: ["What follow-up do I need, and what is its purpose?", "Which changes should prompt urgent help, and which questions can wait for follow-up?", "Are there symptoms or practical concerns I should mention at the next visit?", "Who is my point of contact after discharge?" ] },
      { heading: "Research limits", paragraphs: ["A published quality-of-life study can describe a particular group at a particular time. It cannot establish how any one person will feel or recover. The linked study is older and requires interpretation alongside newer evidence." ] },
    ],
  },
  {
    slug: "with-stroke", publicationStatus: "draft", title: "When dissection is accompanied by stroke", summary: "Conversation prompts about stroke recovery, communication and day-to-day support.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["nice-ng236", "aha-2024", "eso-2021"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Recovery can involve many parts of life", paragraphs: ["Stroke effects and rehabilitation needs vary. Communication, movement, vision, thinking, mood, energy and daily activities may be part of a person’s experience. This list is not a screening tool and does not predict recovery." ] },
      { heading: "Questions for the care team", bullets: ["Who coordinates rehabilitation and follow-up?", "How can I communicate if speech, reading, memory or fatigue make appointments difficult?", "What support is available to my family or carer?", "Who can help with practical needs after discharge?", "What is the best way to ask a question between appointments?" ] },
      { heading: "Urgent changes", paragraphs: ["If there are sudden symptoms that may be a stroke, contact local emergency services now. Do not use an app or wait for a routine appointment to assess them." ] },
      { heading: "Sources and limits", paragraphs: ["The linked adult stroke rehabilitation guideline is written for its own jurisdiction and health system. It is a source for discussion, not a promise of local services or eligibility." ] },
    ],
  },
  {
    slug: "recovery-and-quality-of-life", publicationStatus: "draft", title: "Recovery, fatigue and quality of life", summary: "Acknowledge concerns that may not be visible and prepare to raise them.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["qol-2009", "mental-health-2026", "nice-ng236"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "There is room for what is hard", paragraphs: ["People may have questions about energy, pain, sleep, anxiety, concentration, relationships, work or returning to daily routines. These concerns deserve a conversation with an appropriate clinician, even when other people cannot see them." ] },
      { heading: "Keep a question list", bullets: ["What has changed in daily life, and when did I notice it?", "Which issue would I most like help with first?", "Would a referral or another kind of support be useful?", "Can I bring someone or ask for information in a different format?" ] },
      { heading: "What the research can say", paragraphs: ["The listed studies have different designs, populations and limitations. An exploratory study or group survey cannot diagnose a mental-health condition, estimate an individual’s recovery or show that an app will improve outcomes." ] },
    ],
  },
  {
    slug: "supporting-someone", publicationStatus: "draft", title: "Supporting someone after dissection or stroke", summary: "Practical ways to listen, communicate and support the person’s choices.",
    audience: ["carer", "patient"], language: "en", jurisdiction: "general", sourceIds: ["nice-ng236", "aha-2024"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Start with the person", paragraphs: ["Ask what would help today, and respect the person’s choices about what they share. Support can include listening, helping keep a question list, accompanying someone when invited, or taking on a practical task." ] },
      { heading: "Make appointments easier", bullets: ["Ask whether the person wants you to attend.", "Agree in advance whether you should take notes or ask questions.", "Leave time for breaks and communication needs.", "Ask the person before sharing their health information with anyone else." ] },
      { heading: "Support for carers", paragraphs: ["Carers can have their own questions and limits. Ask the care team what support is available locally. This project does not provide counselling, emergency response or a substitute for professional help." ] },
    ],
  },
  {
    slug: "follow-up-questions", publicationStatus: "draft", title: "Prepare for a follow-up appointment", summary: "Use a short, editable checklist to make space for the questions that matter to you.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["aha-2024", "eso-2021", "nice-ng236"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Before the appointment", bullets: ["Choose your most important questions first.", "Write down unfamiliar terms you want explained.", "Decide whether you want someone to come with you.", "Ask whether there is anything you should bring; this app does not collect or interpret medical records." ] },
      { heading: "During the appointment", bullets: ["Ask what is known, what is uncertain and what happens next.", "Ask who to contact with follow-up questions.", "Ask for a written summary or accessible format if that would help.", "You can pause and ask the clinician to explain something another way." ] },
      { heading: "After", paragraphs: ["Use the care team’s instructions for your situation. This checklist cannot supply missing clinical advice or determine urgency." ] },
    ],
  },
];

export function getGuide(slug: string | undefined): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
