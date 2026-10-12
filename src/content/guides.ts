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
  sections: { heading: string; paragraphs?: string[]; bullets?: string[]; sourceIds?: string[] }[];
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
    slug: "tests-and-terms", publicationStatus: "draft", title: "Tests, scans and unfamiliar terms", summary: "Understand what to ask about a scan or report without trying to interpret it on your own.",
    audience: ["patient", "carer", "interested-reader"], language: "en", jurisdiction: "general", sourceIds: ["aha-2024", "eso-2021", "patient-page-2021", "radiologyinfo-stenosis", "radiologyinfo-occlusion", "nice-infarct", "ncbi-anatomy-skull", "ncbi-pseudoaneurysm"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Start with the question you have", paragraphs: ["You do not need to understand every word in a report at once. Pick one result or term that matters to you and ask the clinician who reviewed the test to explain it in everyday language. This app cannot view or interpret scans, reports or individual results." ] },
      { heading: "Questions about a scan or report", bullets: ["Which artery and part of it are described?", "What does this result tell us, and what can it not tell us?", "Is any result still pending?", "Could you explain the words I have underlined?", "Could I have a copy or plain-language summary, and who can answer questions later?" ] },
      { heading: "Extracranial and intracranial", paragraphs: ["Extracranial means outside the skull; intracranial means inside the skull. A report may use these words to describe where a blood vessel or finding is located."], sourceIds: ["ncbi-anatomy-skull"] },
      { heading: "Stenosis", paragraphs: ["Stenosis means narrowing. The word alone does not say how much a vessel is narrowed or what that means for you."], sourceIds: ["radiologyinfo-stenosis"] },
      { heading: "Occlusion", paragraphs: ["Occlusion means a blockage or closure of a vessel. Ask which vessel and area the report describes, and what the finding means in your case."], sourceIds: ["radiologyinfo-occlusion"] },
      { heading: "Infarct", paragraphs: ["An infarct is an area of tissue damaged because its blood supply was interrupted. The term alone does not explain the size, effects or timing of a finding."], sourceIds: ["nice-infarct"] },
      { heading: "Pseudoaneurysm", paragraphs: ["A pseudoaneurysm is a pocket of blood outside the usual layers of an artery wall, connected to the artery through a wall defect. Ask the clinician to explain the location and significance described in your report."], sourceIds: ["ncbi-pseudoaneurysm"] },
      { heading: "These words do not interpret your report", paragraphs: ["A definition cannot tell you whether a finding is current, how serious it is, what caused it, or what care you need. Words can be used in different clinical contexts. Ask the clinician who reviewed the test to explain the exact wording and how it applies to you." ] },
      { heading: "If the information feels like too much", paragraphs: ["You can ask to take one question at a time, pause, bring someone you choose, or receive information in writing or another accessible format. Your appointment can focus on what matters most to you today." ] },
      { heading: "Limits of this page", paragraphs: ["Professional guidance distinguishes different types and locations of artery dissection, and it may not apply to every presentation. This draft does not tell you what a scan means, what treatment is right, or what follow-up you personally need." ] },
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
    slug: "with-stroke", publicationStatus: "draft", title: "When dissection is accompanied by stroke", summary: "Conversation prompts about rehabilitation, communication, daily life and support for patients and carers.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["nice-ng236", "aha-2024", "eso-2021", "stroke-information-needs-2025", "stroke-information-cochrane-2021"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Recovery can involve many parts of life", paragraphs: ["Stroke effects and rehabilitation needs vary. Communication, movement, vision, thinking, mood, energy, confidence and daily activities may be part of a person’s experience. Not every effect is visible to other people, and no list can predict one person’s recovery." ] },
      { heading: "You and your carer may need different information", paragraphs: ["People with stroke and the people supporting them may have different questions. Information needs can change over time, and it may help to revisit a topic with the care team instead of trying to absorb everything at once. The research behind this idea concerns stroke broadly, not dissection specifically." ] },
      { heading: "Questions for the care team", bullets: ["Who coordinates my rehabilitation and follow-up?", "How can we make appointments work for my communication, reading, memory or energy needs?", "What support is available for me and for the person helping me?", "Who can help with practical needs after discharge?", "What is the best way to ask a non-emergency question between appointments?", "Could we write down the next steps and who is responsible for each one?" ] },
      { heading: "If someone comes with you", paragraphs: ["You can decide whether another person joins and what you want them to do. They might listen, help you remember questions or take notes if you ask. The clinician should know how you prefer to communicate and who you want involved." ] },
      { heading: "Urgent changes", paragraphs: ["If there are sudden symptoms that may be a stroke, contact local emergency services now. Do not use an app or wait for a routine appointment to assess them." ] },
      { heading: "Sources and limits", paragraphs: ["The linked adult stroke rehabilitation guideline is written for its own jurisdiction and health system. It is a source for discussion, not a promise of local services or eligibility." ] },
    ],
  },
  {
    slug: "recovery-and-quality-of-life", publicationStatus: "draft", title: "Recovery, fatigue and quality of life", summary: "Make room for changes in energy, confidence, mood and everyday life, even when they are hard to see.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["qol-2009", "mental-health-2026", "nice-ng236"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "There is room for what is hard", paragraphs: ["Recovery can touch energy, pain, sleep, concentration, confidence, mood, relationships, work and social life. Some changes are easy for other people to see; others are private or come and go. You do not have to prove that a concern is serious before raising it with a clinician." ] },
      { heading: "Choose one thing to bring up", bullets: ["What has been hardest in daily life recently?", "What would I most like help with first?", "Is fatigue, sleep, pain, concentration or mood affecting something I want to do?", "Could we discuss support, rehabilitation or a referral that may fit my situation?", "Who should I speak with if this remains difficult?" ] },
      { heading: "A small and limited research signal", paragraphs: ["A long-term study of cervical artery dissection survivors reported that quality of life may not be captured fully by standard disability ratings. A newer exploratory study followed a selected group with good early functional outcomes and still found long-term fatigue and psychological symptoms in some participants. These studies cannot predict an individual’s experience, establish a general prevalence, or show that this app changes outcomes." ] },
      { heading: "Support for people around you", paragraphs: ["Family and friends may notice changes or have questions of their own. If you want, choose what to share and ask someone to help with a specific task. The person supporting you can also ask their own care team or local support service about help for carers." ] },
    ],
  },
  {
    slug: "supporting-someone", publicationStatus: "draft", title: "Supporting someone after dissection or stroke", summary: "Practical ways to listen, make care conversations easier and look after your own needs too.",
    audience: ["carer", "patient"], language: "en", jurisdiction: "general", sourceIds: ["nice-ng236", "aha-2024", "stroke-information-needs-2025", "stroke-information-cochrane-2021", "stroke-carer-interventions-cochrane-2022"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Start with the person", paragraphs: ["Ask what would help today instead of guessing. A person may want help with one task, company, quiet time or no help right now. Their preferences may change from day to day." ] },
      { heading: "Make care conversations easier", bullets: ["Ask whether the person wants you to attend and what role they want you to take.", "Let the person answer first unless they ask you to speak for them.", "Agree whether you should take notes or help remember questions.", "Leave time for breaks and communication needs.", "Ask before sharing their health information with anyone else.", "After the appointment, check what they want to discuss or remember; do not assume you should keep their records." ] },
      { heading: "Support without taking over", paragraphs: ["A practical offer can be specific and easy to accept or decline: for example, a lift, a meal or help writing down questions. You can use the support-preferences sheet together if the person wants, but they decide what it says and whether to share it." ] },
      { heading: "Your needs matter too", paragraphs: ["Supporting someone can bring uncertainty, practical pressure and emotional strain. You can ask the care team or a local carers’ organisation what support is available to you. Evidence about which carer support programmes work best remains limited, so ask what fits your circumstances rather than assuming one service suits everyone." ] },
      { heading: "Limits", paragraphs: ["This page is general support information, not counselling or emergency response. Ask the person whom they want involved. Privacy and information-sharing rules can vary by care setting and location, so ask the care team what applies." ] },
    ],
  },
  {
    slug: "follow-up-questions", publicationStatus: "draft", title: "Prepare for a follow-up appointment", summary: "Choose what matters most, make room for questions and leave with a clear next step to discuss.",
    audience: ["patient", "carer"], language: "en", jurisdiction: "general", sourceIds: ["aha-2024", "eso-2021", "nice-ng236", "stroke-information-needs-2025", "stroke-information-cochrane-2021"], rights, clinicalReview: review, usabilityReview, translationReview, reviewedOn: null,
    sections: [
      { heading: "Before the appointment", bullets: ["Pick one or two questions that matter most if you have limited time or energy.", "Write down unfamiliar terms or results you want explained.", "Decide whether you want someone to come and what you want them to do.", "Ask the clinic whether there is anything you should bring; this app does not collect or interpret medical records.", "If reading or remembering is difficult, ask whether someone can provide information in another format." ] },
      { heading: "During the appointment", bullets: ["Ask what is known, what remains uncertain and what happens next.", "Ask whether any follow-up imaging is planned for you and, if so, what its purpose is.", "Ask who to contact with a non-emergency question and how to reach them.", "Ask for a written summary or accessible format if that would help.", "You can pause, take a break or ask the clinician to explain something another way." ] },
      { heading: "Before you leave", bullets: ["Check that you understand the next step and who is responsible for it.", "Ask when or how you should expect to hear about pending results.", "Ask what to do if you cannot reach the listed contact with a routine question.", "Decide what you want the person who came with you to remember or share." ] },
      { heading: "After", paragraphs: ["Use the instructions from your own care team. If something is unclear, contact the service they identified. This checklist cannot supply missing clinical advice or determine whether a situation is urgent." ] },
    ],
  },
];

export function getGuide(slug: string | undefined): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
