# Data-flow and privacy test inventory

This is an implementation-facing inventory, not a privacy notice or legal opinion. It describes the current static preview and must be rechecked if hosting, analytics, sync, accounts, crash reporting or third-party SDKs are added.

| Data or action | Source | Intended location | Explicit trigger | External copy/control | Required test |
|---|---|---|---|---|---|
| Appointment selections and note | `app/appointments.tsx` | Browser localStorage or Expo SecureStore | Save | Export, print or share destination | Synthetic note never enters URL, log or request; delete removes local key |
| Support preferences and note | `app/support-preferences.tsx` | Browser localStorage or Expo SecureStore | Save | Export, print or share destination | Same leak and deletion checks |
| Personal information card | `app/personal-card.tsx` | Separate card storage key | Save | Download, print or native share | Medicines/contacts stay local until explicit export; no cross-card mixing |
| Milestone/story card | `app/milestone-card.tsx` | Separate card storage key | Save | Download, print or social upload by user | Medical fields are not copied into milestone output |
| Accessibility preferences | `app/accessibility.tsx` | Accessibility storage key | Setting change | None | Reload preserves settings; clear-all removes them |
| Saved guide links | `app/saved-guides.tsx` | Saved-guide storage key | Save guide | Exported text file | Delete cannot claim to remove external copies |
| Static page visits | Static host/browser | No app analytics or backend | Page load | Hosting logs may exist outside app control | Recheck hosting/CDN logs before launch |
| External resources | User opens link | External publisher | User action | External service privacy policy applies | Link labels identify external destination |

Use synthetic values such as `TEST PERSON`, `TEST MEDICINE` and `TEST CONTACT`. Never use real health information in automated or public tests.
