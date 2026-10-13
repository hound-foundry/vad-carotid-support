# Atlas audit workflow

Atlas is a separate development tool. It is not a runtime dependency of this Expo app and does not require Godot for this repository.

Before using Atlas evidence for VAD & Carotid Support, configure Atlas against this checkout (`C:\Work\VAD CAD app`) and confirm that its status reports this repository, revision and worktree fingerprint. Do not rely on an index rooted at another project such as `C:\Work\GameDev\STRIFE`.

Use Atlas for bounded repository discovery, symbol/reference impact checks and architecture observations. Use the app’s own `npm test`, `npm run typecheck`, `npm run build:web`, route checks and accessibility review for product validation. Atlas search results are candidates for inspection, not proof that a UI behavior is safe or complete.

Refresh the Atlas index after checkout changes, record the indexed revision in audit notes, and never edit application source through Atlas. Keep Atlas caches outside the repository and do not add Godot files or a Godot runtime dependency to this project.
