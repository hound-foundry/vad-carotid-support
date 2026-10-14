# Data-flow and privacy test inventory

This is an implementation-facing inventory, not a privacy notice or legal opinion. It describes the current static preview and must be rechecked if hosting, analytics, sync, accounts, crash reporting or third-party SDKs are added.

| Data or action | Source | Intended location | Explicit trigger | External copy/control | Required test |
|---|---|---|---|---|---|
| Appointment selections and note | `app/appointments.tsx` | Browser localStorage or Expo SecureStore | Save | Export, print or share destination | Synthetic note never enters URL, log or request; delete removes local key |
| Support preferences and note | `app/support-preferences.tsx` | Browser localStorage or Expo SecureStore | Save | Export, print or share destination | Same leak and deletion checks |
| Personal information card | `app/personal-card.tsx` | Separate card storage key | Save | Download, print or native share | Medicines/contacts stay local until explicit export; no cross-card mixing |
| Milestone/story card | `app/milestone-card.tsx` | Separate card storage key | Save | Download, print or social upload by user | Medical fields are not copied into milestone output |
| Newly selected photo and crop | Browser file chooser, local decoder/canvas | React memory; local Blob URLs | Choose/replace photo | Included in the selected photo template only after explicit export | JPEG/PNG/WebP ≤10 MB; orientation corrected; JPEG re-encode strips metadata/filename; edge ≤1280px; invalid replacement preserves previous photo |
| Saved card photo | Normalised local JPEG Blob | IndexedDB `dissection-companion-card-photos` / `photos`, opaque ID and card-kind owner | Save | Same browser/profile/backup limitations as wording | No image string in localStorage; personal/milestone cannot share an owned Blob; save rollback, per-card delete and clear-all include photos |
| Accessibility preferences | `app/accessibility.tsx` | Accessibility storage key | Setting change | None | Reload preserves settings; clear-all removes them |
| Saved guide links | `app/saved-guides.tsx` | Saved-guide storage key | Save guide | Exported text file | Delete cannot claim to remove external copies |
| Static page visits | Static host/browser | No app analytics or backend | Page load | Hosting logs may exist outside app control | Recheck hosting/CDN logs before launch |
| External resources | User opens link | External publisher | User action | External service privacy policy applies | Link labels identify external destination |
| Unsaved card drafts | Card editor | React memory in this app session | Typing/selection | None until user exports | Navigation preserves edits; reload loses them; clear-all clears memory |
| Unsaved sheet drafts | Appointment/support tools | Separate in-memory sessions | Typing/selection | None until explicit export | Navigation preserves notes and choices; only Save persists; pending writes drain before clear all |
| Guide reading state and library search | Guide/library controls | In-memory session only | Reading/search controls | None | Local/global pace agree; returning resumes the section/search; clear all resets them; reload loses them |
| Card fonts, public illustration and export code | Bundled same-origin static assets | Browser memory/cache | Designed preview or export | No fields or private photos are sent with the requests | Capture requests while generating a synthetic photo card |
| Card PDFs, PNG and text | Shared filtered card presentation | Device-generated Blob/download or native share | Explicit preview action | Browser/device download, print or chosen share destination | Hidden dates omitted; content matches preview; filenames/metadata are neutral |
| Card print document | Escaped shared presentation | Temporary same-origin iframe or native print adapter | Print card | Operating-system/browser print destination | No form instructions; frame removed after print flow |

The central registry in `src/features/local-data/keys.mjs` retains the six wording/preference keys and adds the `card-photos` IndexedDB resource. Pending photo/wording saves drain before clear-all; all removal promises settle before a success announcement. Failed or partial removal is reported as failure. Clearing notifies active sheets, cards and reading state so retained navigation cannot redisplay cleared information. Exported files, device backups, browser extensions and other profile users remain outside this boundary. Design-kit export records source fingerprints and storage descriptors only; it never reads private browser contents or uploads photos.

On 13 October 2026 a synthetic card edit, PDF export and navigation were observed with browser network capture. Three requests loaded the PDF code chunk and two same-origin fonts; the synthetic value was absent from requests, captured console output and URLs. This limited engineering observation is recorded in [the case study](DESIGN_CASE_STUDY.md); it is not a hosting/privacy review.

Use synthetic values such as `TEST PERSON`, `TEST MEDICINE` and `TEST CONTACT`. Never use real health information in automated or public tests.
