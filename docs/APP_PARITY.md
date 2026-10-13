# Website and future app parity

The [follow-up audit](RETURNING_USER_AUDIT.md) and [mobile design patterns](MOBILE_DESIGN_PATTERNS.md) document the current shared sheet reading state, preview shortcuts and confirmation controls, together with the remaining device checks.

The static website is the reference implementation for content language, safety boundaries and local-data behavior. A future iOS or Android build should reuse the same content records and feature models rather than creating a second medical vocabulary.

## Shared contract

- The product is general information and appointment preparation. It does not diagnose, interpret scans, select medicines, score symptoms or clear activities.
- Urgent-help wording remains generic until a jurisdiction-specific review enables local guidance.
- Personal cards and milestone cards are separate models and storage keys. Both are user-authored, local-only tools with explicit preview, export and deletion.
- Accessibility settings are device-local preferences. Text size, spacing, contrast, theme, reduced motion and simplified reading must have equivalent behavior on web and native.
- No account, analytics, advertising, sync service or hosted health-data store is added without a separate privacy, security and legal review.
- Every published clinical sentence keeps source, limitation, audience, review status and next-review metadata in the content layer.

## Native implementation sequence

1. Reuse the route content and models in an Expo native shell.
2. Verify the implemented Expo Print/Sharing PDF and text adapters on real devices. PNG is offered on the website; native image export is not claimed. Sharing cancellation must never report a completed transfer when the platform does not expose that result.
3. Keep storage adapters separate from content and UI so deletion and clear-all remain testable.
4. Test VoiceOver, TalkBack, large text, reduced motion, contrast and dynamic type before any store submission.
5. Complete app-store privacy declarations and target-market review only after the intended native data flow is fixed.

Atlas remains a separate development tool. It may index this checkout for code navigation, but its Godot-oriented checks are not evidence of Expo or clinical readiness.

The short card forms, shared filtered presentations, memory-only drafts, version 1 storage records and three-control header are shared Expo code. Browser PDF rendering and canvas PNG generation are platform adapters. Web font coverage, untagged PDF output and pending native accessibility checks are documented in [the design case study](DESIGN_CASE_STUDY.md).
