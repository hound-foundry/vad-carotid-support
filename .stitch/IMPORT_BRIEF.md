# VAD & Carotid Support: preserve the existing application

Import target: design reference project, not a replacement executable application.

Use DESIGN.md as the design system first. Import the blank existing Home screen at phone and desktop widths when available. Keep route names and content order; changes are proposals pending visual review. The source app uses Expo Router, React Native StyleSheet and shared Ui wrappers.

The audience is adults affected by vertebral/carotid dissection and their families/carers. The Home has four actions: Understand dissection, Prepare an appointment, Make a card, Help someone. Header: Home, Menu, Text and display. Urgent help remains visible. Clinical content stays labelled as draft.

There are two separate cards: personal medical/communication information and a private milestone. Both have optional fields, preview/edit, explicit local Save, user-triggered exports and confirmed Delete. No automatic social sharing, forced survivor wording, invented clinical text, diagnosis inference, automatic date calculations, accounts or remote health-data storage.

Review 390×844 and 1440×900, then 320×640 and 844×320 with enlarged app text. Content grows rather than clipping or shrinking. Retain one-section reading, interruption recovery, labels, focus visibility and plain next actions. No animation, autoplay or decorative medical imagery.

Exported screenshots/HTML are static design evidence. They do not establish accessible controls, saved data, clinical approval or native behavior. Accepted changes return to the existing source components and pass the existing checks. Never overwrite the app with generated HTML.
