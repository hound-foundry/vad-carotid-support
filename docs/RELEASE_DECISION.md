# Release decision record

This record is intentionally blocked until the required human reviews are completed. It is a template and status record, not an endorsement.

| Area | Evidence | Owner | Status | Stop-ship issue | Next review |
|---|---|---|---|---|---|
| Clinical claims | `content/claimLedger.json` and clinical review packet | Qualified clinician | Not reviewed | All clinical claims remain draft | — |
| Patient/carer usefulness | `docs/USABILITY_REVIEW.md` and feedback log | Patient/carer reviewer | Not reviewed | No lived-experience review recorded | — |
| Accessibility | `docs/ACCESSIBILITY_TEST_MATRIX.md` | Accessibility tester | Not reviewed | Manual route checks incomplete | — |
| Privacy/security | `docs/DATA_FLOW.md` and automated tests | Technical/privacy reviewer | Not reviewed | Hosting and external-copy review incomplete | — |
| Legal/market | `docs/REGULATORY_SCREENING.md` | Qualified legal reviewer | Blocked | Jurisdiction applicability unresolved | — |
| Translation | Language review records | Language reviewer | Not started | No translated release approved | — |

Current release status: **blocked-pending-human-review**.

The 13 October [design case study](DESIGN_CASE_STUDY.md) supplies engineering evidence for the revised home/header, `/cards`, `/saved`, `/personal-card`, `/milestone-card` and display preferences. Keyboard, mobile layout, file generation and synthetic privacy observations do not promote any review track above. Include the two new directory routes in the next patient/carer and full assistive-technology review.
