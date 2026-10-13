// Authored emergency copy is kept separate from its presentation for review.
// Source checking does not constitute clinical approval.
export const urgentHelp = {
  language: "en",
  jurisdiction: "general",
  audience: ["patient", "carer", "interested-reader"],
  publicationStatus: "draft",
  updatedOn: "2026-10-13",
  nextSourceCheckOn: "2027-04-13",
  clinicalReview: { status: "not-reviewed", reviewer: null, date: null },
  sourceIds: ["asa-warning-signs", "nhs-stroke-symptoms"],
  action: "If you think you or someone else may be having a stroke or another medical emergency, call local emergency services now.",
  doNotWait: "Call even if the symptoms stop. Do not wait for a doctor's appointment or for this app.",
  quickAction: "Acting quickly can save a life.",
  signsIntro: "If any of these changes starts suddenly, call local emergency services immediately. You do not need all the signs.",
  signs: [
    { letter: "B", label: "Balance", text: "Sudden difficulty with balance, walking or coordination." },
    { letter: "E", label: "Eyes", text: "Sudden blurred or double vision, or loss of sight in one or both eyes." },
    { letter: "F", label: "Face", text: "One side of the face droops or feels numb." },
    { letter: "A", label: "Arms", text: "One arm becomes weak or numb." },
    { letter: "S", label: "Speech", text: "Speech becomes slurred, or speaking or understanding speech becomes difficult." },
    { letter: "T", label: "Time", text: "Call local emergency services now." },
  ],
  signsLimit: "B.E. F.A.S.T. is a reminder of stroke warning signs, not a test that can rule out a stroke. Other signs can occur. If you suspect a stroke, call even if none of these signs is present.",
  feelingUnwell: "If you feel unwell or are worried about your health, contact your doctor or another qualified medical professional. Possible stroke signs or another medical emergency need emergency services immediately, rather than waiting for an appointment.",
  appLimit: "This is an information and preparation app, not a medical service. It cannot assess symptoms, diagnose a condition, give personal medical advice or provide emergency care.",
} as const;
