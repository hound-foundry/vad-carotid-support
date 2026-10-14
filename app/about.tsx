import { Pressable, Text } from "../src/components/Ui";
import { useState } from "react";
import { Linking, StyleSheet } from "react-native";
import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { languagePlan } from "../src/content/locales";
import { clearAllSavedData } from "../src/features/local-data/store";
import { useAccessibility } from "../src/features/accessibility/AccessibilityProvider";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { ConfirmDelete } from "../src/components/ConfirmDelete";

export default function About() {
  const [clearMessage, setClearMessage] = useState("");
  const { reset } = useAccessibility(); const { clearDrafts } = useCardDrafts();
  const clearLocalData = async () => {
    try {
      await clearAllSavedData();
      clearDrafts(); reset();
      setClearMessage("Saved sheets, cards, photos, guide links and accessibility preferences were deleted from this device.");
      return true;
    } catch {
      setClearMessage("Some saved data could not be deleted. Use each tool’s delete control to try again.");
      return false;
    }
  };
  return <AppPage><BackHome /><PageHeading eyebrow="About this project" title="About and privacy" summary="A free, independent, open-source Hound Foundry community project for adults affected by vertebral or carotid artery dissection, families, carers and interested readers." />
    <Card title="What this project is"><Text style={styles.body}>This is an early development preview, not a charity, healthcare provider or medical service. It does not diagnose, interpret scans, recommend medication, estimate individual risk, clear activity or replace a clinician. Personal questions about diagnosis, tests and treatment belong with the person’s own care team.</Text></Card>
    <Card title="Clinical and lived-experience review"><Text style={styles.body}>All guides are original drafts with linked sources and recorded review fields. No clinician or patient/carer usability review has yet been recorded. The app must not publish these guides as approved patient information until qualified review is documented.</Text><Text style={styles.body}>The user-suggested 2017 book is listed bibliographically as an external reading resource. Its chapters and stories are not reproduced or translated.</Text></Card>
    <Card title="Privacy and open source"><Text style={styles.body}>No account, analytics, advertising, sync service or backend is part of V1. On the website, sheets, cards and optional photos are saved in this browser profile only when you choose Save. Anyone with access to the profile or device may be able to read them. Browser and device backups vary, so local storage does not guarantee privacy. Read the privacy design notes before storing sensitive information.</Text><Text style={styles.body}>The source code uses the project’s existing open-source licence, and authored guide content uses its existing content licence. The app is free to use; it has no donation, advertising or story-submission feature.</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://github.com/hound-foundry/vad-carotid-support/blob/codex/patient-support-foundation/docs/PRIVACY.md")} style={({ pressed }) => [styles.repoLink, pressed && styles.pressed]}><Text style={styles.repoText}>Read the privacy design notes ↗</Text></Pressable><Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://github.com/hound-foundry/vad-carotid-support")} style={({ pressed }) => [styles.repoLink, pressed && styles.pressed]}><Text style={styles.repoText}>Open the project repository ↗</Text></Pressable></Card>
    <Card title="Clear saved data"><Text style={styles.body}>Use this when you want to remove all appointment questions, support preferences, personal cards, milestone cards, saved photos, accessibility preferences and saved guide links from this device. It does not remove exported files or backups made outside this app.</Text><ConfirmDelete label="Delete all saved data on this device" question="Delete all saved data?" detail="This removes sheets, cards, photos, guide links and display preferences from this device. Downloaded files, printouts and backups are unchanged." onConfirm={clearLocalData} />{clearMessage ? <Text accessibilityLiveRegion="polite" style={styles.clearMessage}>{clearMessage}</Text> : null}</Card>
    <Card title="Help improve the project"><Text style={styles.body}>Suggestions, accessibility findings and review help are welcome. Please use synthetic examples only: do not put diagnoses, scan details, contact information or another person’s health information in a public issue.</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://github.com/hound-foundry/vad-carotid-support/blob/codex/patient-support-foundation/CONTRIBUTING.md")} style={({ pressed }) => [styles.repoLink, pressed && styles.pressed]}><Text style={styles.repoText}>Read contribution guidance ↗</Text></Pressable></Card>
    <Card title="Languages"><Text style={styles.body}>English is the only authored language in this preview. These languages are planned in stages, only after qualified human review of the interface and guides: {languagePlan.slice(1).map((language) => language.name).join(", ")}.</Text></Card>
    <Card title="Use it like an app"><Text style={styles.body}>On browsers that support installation, use the browser menu’s “Install” or “Add to home screen” action. The web version remains a static information tool: it does not create an account, add a server connection or change where saved sheets live.</Text></Card>
    <Card title="How availability works"><Text style={styles.body}>The basic English static web preview is available as general education and appointment preparation. It uses generic urgent-help wording and does not provide country-specific legal, medical or emergency claims. The project keeps a country watchlist before enabling local emergency details, additional languages, hosted data, paid features or native app-store distribution.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ body: { color: "#576762", fontSize: 14, lineHeight: 22, marginTop: 7 }, repoLink: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", marginTop: 5 }, repoText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" }, clearButton: { minHeight: 46, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 15, marginTop: 10, borderWidth: 1, borderColor: "#B98170", borderRadius: 10, backgroundColor: "#FFF9F6" }, clearButtonText: { color: "#713A2D", fontSize: 14, lineHeight: 20, fontWeight: "700" }, clearMessage: { color: "#52635C", fontSize: 13, lineHeight: 20, marginTop: 8 }, pressed: { opacity: 0.72 } });
