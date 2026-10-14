# Dissection Companion design results

Implemented 13 October 2026 in the existing Expo website/shared app components. Working name: **Dissection Companion**. Subtitle: **Vertebral & carotid artery support**. The existing app slug, scheme, six local storage keys and versioned card records remain unchanged.

The interface uses muted blue, soft off-white, opaque rounded surfaces, system sans-serif, an 18px text floor, scalable line spacing and 48px minimum control height. Shared body/guide reading blocks are capped at 680px. Four Home tasks, urgent help, explicit Save/Export/Delete and the two separate card models remain intact. Legacy route colours resolve through the same light/dark/high-contrast system. Dark filled controls and skip-link labels retain readable contrast. Printed/downloaded cards use white paper and the shared blue palette.

## Actual screens

| Screen | Phone | Desktop |
|---|---|---|
| Home | [390px](redesign-proof/home-phone.jpg) | [1440px](redesign-proof/home-desktop.jpg) |
| Recovery guide | [390px](redesign-proof/guide-phone.jpg) | [1440px](redesign-proof/guide-desktop.jpg) |
| Appointment preview | [390px](redesign-proof/appointment-phone.jpg) | [1440px](redesign-proof/appointment-desktop.jpg) |
| Personal card preview | [390px](redesign-proof/personal-phone.jpg) | [1440px](redesign-proof/personal-desktop.jpg) |
| Milestone preview | [390px](redesign-proof/milestone-phone.jpg) | [1440px](redesign-proof/milestone-desktop.jpg) |

[Normal dark](redesign-proof/home-dark-phone.jpg), [dark high contrast](redesign-proof/home-dark-high-phone.jpg), [light high contrast](redesign-proof/home-light-high-phone.jpg), and [enlarged reading](redesign-proof/guide-enlarged-phone.jpg). Captures contain public interface or explicitly invented fixtures, never the user's saved data. These are working screens, not generator mockups.

## Verification

- 72 unit tests; TypeScript; content, review and native-config validation; source design validation; 27-route static export and 32-artifact validation pass.
- [Route matrix](redesign-proof/route-checks.json): 24 public routes at 390×844, 320×640, 844×320 and doubled app text at 390×844. All 96 checks had no horizontal main-content overflow and kept urgent help within the viewport. Internal Expo sitemap/template routes are excluded; the unavailable-page response was tested separately.
- [Rendered themes](redesign-proof/rendered-themes.json): all four variants use the expected system font, readable checked controls and visible 3px/4px keyboard focus. CI additionally checks 48 opaque foreground/background pairs without rounding thresholds. This is bounded evidence, not a whole-app WCAG certification.
- [Journeys](redesign-proof/journeys.json): keyboard Menu/Escape, appointment draft return/preview/save/reload/text export/cancel/delete, both card save/reload/download/delete flows, hidden dates, separate contents, milestone unsaved return, guide section-two return, generic saved-hub labels and confirmed clear-all on the isolated origin `localhost:4182`.
- Actual personal PDF/text and milestone PNG/PDF/text downloads were inspected. Both hidden event dates were absent; labels and selected fields were present; form instructions were absent. Embedded Noto Sans preserved the tested Unicode. [PDF checks](redesign-proof/pdf-checks.json) and page renders are retained. Existing long-field pagination regressions also pass.
- [Network observations](redesign-proof/network-checks.json) and [console check](redesign-proof/console-checks.json): no synthetic marker matches in the later short observations. The earlier long trace was truncated and discarded. This covers the recorded journeys, not every possible browser/hosting behavior; no new analytics, backend or dependencies were added.

## Limits

Actual 200% browser zoom, NVDA, VoiceOver/TalkBack, native keyboard/export behavior and real patient/carer sessions remain untested. App text enlargement is a separate check. A real Print card request opened a browser dialog that blocked DOM automation; only the disposable test tab was closed. System print/cancel behavior was not verified. Generated print HTML and downloaded PDFs were checked, but are not a substitute for that test.

Clinical content, source/review status and release gates are unchanged. No claim is made that this design prevents fatigue, migraine or trauma reactions. The earlier Stitch canvas is an outdated reference, not this implementation.
