import { useState } from "react";
import { Alert, Linking, Platform, Pressable, StyleSheet, Text } from "react-native";
import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { languagePlan } from "../src/content/locales";
import { deleteAppointmentSheet } from "../src/features/appointments/store";
import { deleteSavedGuides } from "../src/features/saved-guides/store";
import { deleteSupportPreferences } from "../src/features/support-preferences/store";

export default function About() {
  const [clearMessage, setClearMessage] = useState("");
  const clearLocalData = async () => {
    try {
      await Promise.all([deleteAppointmentSheet(), deleteSupportPreferences(), deleteSavedGuides()]);
      setClearMessage("Saved appointment questions, support preferences and guide links were deleted from this device.");
    } catch {
      setClearMessage("Some saved data could not be deleted. Use each tool’s delete control to try again.");
    }
  };
  const confirmClear = () => {
    if (Platform.OS === "web") {
      if (globalThis.confirm("Delete all saved sheets and guide links from this device? Exported copies are not affected.")) void clearLocalData();
      return;
    }
    Alert.alert("Clear saved data?", "This deletes saved appointment questions, support preferences and guide links from this device. Exported copies are not affected.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { void clearLocalData(); } }]);
  };
  return <AppPage><BackHome /><PageHeading eyebrow="About this project" title="Built to make the next step feel a little clearer." summary="A free, independent, open-source Hound Foundry community project for adults affected by vertebral or carotid artery dissection, families, carers and interested readers." />
    <Card title="What this project is"><Text style={styles.body}>This is an early development preview, not a charity, healthcare provider or medical service. It does not diagnose, interpret scans, recommend medication, estimate individual risk, clear activity or replace a clinician. Personal questions about diagnosis, tests and treatment belong with the person’s own care team.</Text></Card>
    <Card title="Clinical and lived-experience review"><Text style={styles.body}>All guides are original drafts with linked sources and recorded review fields. No clinician or patient/carer usability review has yet been recorded. The app must not publish these guides as approved patient information until qualified review is documented.</Text><Text style={styles.body}>The user-suggested 2017 book is listed bibliographically as an external reading resource. Its chapters and stories are not reproduced or translated.</Text></Card>
    <Card title="Privacy and open source"><Text style={styles.body}>No account, analytics, advertising, sync service or backend is part of V1. Appointment sheets are stored on your device only when you choose Save. Web storage uses your browser profile’s local storage; native storage uses Expo SecureStore. Each has different device and backup behavior, so neither guarantees privacy. See the repository privacy documentation before storing sensitive notes.</Text><Text style={styles.body}>The source code uses the project’s existing open-source licence, and authored guide content uses its existing content licence. The app is free to use; it has no donation, advertising or story-submission feature.</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://github.com/hound-foundry/vad-carotid-support/blob/codex/patient-support-foundation/docs/PRIVACY.md")} style={({ pressed }) => [styles.repoLink, pressed && styles.pressed]}><Text style={styles.repoText}>Read the privacy design notes ↗</Text></Pressable><Pressable accessibilityRole="link" onPress={() => void Linking.openURL("https://github.com/hound-foundry/vad-carotid-support")} style={({ pressed }) => [styles.repoLink, pressed && styles.pressed]}><Text style={styles.repoText}>Open the project repository ↗</Text></Pressable></Card>
    <Card title="Clear saved data"><Text style={styles.body}>Use this when you want to remove all appointment questions, support preferences and saved guide links from this device. It does not remove exported files or backups made outside this app.</Text><Pressable accessibilityRole="button" onPress={confirmClear} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}><Text style={styles.clearButtonText}>Delete all saved data on this device</Text></Pressable>{clearMessage ? <Text accessibilityLiveRegion="polite" style={styles.clearMessage}>{clearMessage}</Text> : null}</Card>
    <Card title="Languages"><Text style={styles.body}>English is the only authored language in this preview. These languages are planned in stages, only after qualified human review of the interface and guides: {languagePlan.slice(1).map((language) => language.name).join(", ")}.</Text></Card>
    <Card title="Use it like an app"><Text style={styles.body}>On browsers that support installation, use the browser menu’s “Install” or “Add to home screen” action. The web version remains a static information tool: it does not create an account, add a server connection or change where saved sheets live.</Text></Card>
    <Card title="How availability works"><Text style={styles.body}>The basic English static web preview is available as general education and appointment preparation. It uses generic urgent-help wording and does not provide country-specific legal, medical or emergency claims. The project keeps a country watchlist before enabling local emergency details, additional languages, hosted data, paid features or native app-store distribution.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ body: { color: "#576762", fontSize: 14, lineHeight: 22, marginTop: 7 }, repoLink: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", marginTop: 5 }, repoText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" }, clearButton: { minHeight: 46, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 15, marginTop: 10, borderWidth: 1, borderColor: "#B98170", borderRadius: 10, backgroundColor: "#FFF9F6" }, clearButtonText: { color: "#713A2D", fontSize: 14, lineHeight: 20, fontWeight: "700" }, clearMessage: { color: "#52635C", fontSize: 13, lineHeight: 20, marginTop: 8 }, pressed: { opacity: 0.72 } });
