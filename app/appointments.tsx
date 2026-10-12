import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { appointmentPrompts, emptyAppointmentSheet, MAX_NOTE_LENGTH, type AppointmentSheet } from "../src/features/appointments/model.mjs";
import { deleteAppointmentSheet, exportAppointmentSheet, loadAppointmentSheet, saveAppointmentSheet } from "../src/features/appointments/store";

export default function AppointmentsScreen() {
  const [sheet, setSheet] = useState<AppointmentSheet>(emptyAppointmentSheet());
  const [saved, setSaved] = useState(false);
  const edited = useRef(false);
  const [message, setMessage] = useState("Loading saved questions from this device…");
  useEffect(() => { let active = true; void loadAppointmentSheet().then((value) => { if (active && !edited.current) { setSheet(value); setMessage("Your sheet is stored on this device only when you choose Save."); } }).catch(() => { if (active) setMessage("Device storage could not be read. Your current edits remain on screen until you leave."); }); return () => { active = false; }; }, []);

  const toggle = (id: string) => { edited.current = true; setSaved(false); setMessage("You have unsaved changes. Choose Save to keep them on this device."); setSheet((current) => ({ ...current, selectedIds: current.selectedIds.includes(id) ? current.selectedIds.filter((selected) => selected !== id) : [...current.selectedIds, id] })); };
  const save = async () => { try { await saveAppointmentSheet(sheet); edited.current = false; setSaved(true); setMessage("Saved on this device. It is not sent to the project."); } catch { setMessage("Could not save on this device. You can still review or export this sheet."); } };
  const remove = async () => { try { await deleteAppointmentSheet(); edited.current = false; setSheet(emptyAppointmentSheet()); setSaved(false); setMessage("Saved sheet deleted from this app’s device storage."); } catch { setMessage("Could not delete the saved sheet from device storage."); } };
  const confirmRemove = () => {
    if (Platform.OS === "web") {
      if (globalThis.confirm("Delete the saved appointment sheet from this device?")) void remove();
      return;
    }
    Alert.alert("Delete saved questions?", "This clears this app’s saved appointment sheet from this device.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { void remove(); } }]);
  };
  const exportSheet = async () => { try { await exportAppointmentSheet(sheet); setMessage("Export opened after your request. The destination app or file is outside this project’s control."); } catch { setMessage("Export did not complete."); } };

  return <AppPage><BackHome /><PageHeading eyebrow="Appointment preparation" title="Make space for your questions." summary="Choose prompts and add optional notes. Review the complete sheet before deciding to save it here or export it." />
    <Card title="Choose prompts">{appointmentPrompts.map((prompt) => { const selected = sheet.selectedIds.includes(prompt.id); return <Pressable key={prompt.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggle(prompt.id)} style={styles.option}><View style={[styles.checkbox, selected && styles.checked]}>{selected ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.optionText}>{prompt.text}</Text></Pressable>; })}</Card>
    <Card title="My own notes (optional)"><Text style={styles.helper}>Keep notes brief and avoid names, dates of birth, contact details or copies of records. Notes stay in this browser profile or on this device unless you export them.</Text><TextInput accessibilityLabel="Optional appointment notes" multiline maxLength={MAX_NOTE_LENGTH} value={sheet.note} onChangeText={(note) => { edited.current = true; setSaved(false); setMessage("You have unsaved changes. Choose Save to keep them on this device."); setSheet((current) => ({ ...current, note })); }} placeholder="Write a question or reminder for yourself" placeholderTextColor="#596861" style={styles.input} textAlignVertical="top" /><Text style={styles.counter}>{sheet.note.length}/{MAX_NOTE_LENGTH}</Text></Card>
    <Card title="Preview"><Text style={styles.previewTitle}>Appointment question sheet</Text>{appointmentPrompts.filter((prompt) => sheet.selectedIds.includes(prompt.id)).map((prompt) => <Text key={prompt.id} style={styles.previewLine}>• {prompt.text}</Text>)}{sheet.selectedIds.length === 0 ? <Text style={styles.previewLine}>No prompts selected yet.</Text> : null}{sheet.note.trim() ? <><Text style={styles.previewSubhead}>My own notes</Text><Text style={styles.previewLine}>{sheet.note.trim()}</Text></> : null}<Text style={styles.helper}>For discussion with your own care team. This is not medical advice.</Text></Card>
    <View style={styles.actions}><Button title={saved ? "Saved on this device" : "Save on this device"} onPress={() => void save()} /><Button title="Export sheet" secondary onPress={() => void exportSheet()} /><Button title="Delete saved sheet" secondary onPress={confirmRemove} /></View>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
    <Card title="Where the data lives"><Text style={styles.helper}>On the web, this app uses this browser profile’s local storage. It is not encrypted by this app and may be exposed to people or software with access to the profile or device. On iOS and Android, this app uses Expo SecureStore. Browser, device, operating-system and backup behavior varies; local storage alone does not guarantee privacy. Export sends a copy to the destination you choose. Deleting here may not remove an exported or backed-up copy.</Text></Card>
  </AppPage>;
}

function Button({ title, onPress, secondary = false }: { title: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, pressed && styles.pressed]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}

const styles = StyleSheet.create({ option: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: "#899A93", alignItems: "center", justifyContent: "center" }, checked: { backgroundColor: "#3F7773", borderColor: "#3F7773" }, check: { color: "#FFFFFF", fontWeight: "700" }, optionText: { flex: 1, color: "#394C47", fontSize: 14, lineHeight: 21 }, helper: { color: "#596861", fontSize: 12, lineHeight: 19 }, input: { minHeight: 115, marginTop: 11, padding: 12, backgroundColor: "#FBFCFA", color: "#293D3A", borderColor: "#DCE4DE", borderWidth: 1, borderRadius: 10, fontSize: 15, lineHeight: 22 }, counter: { alignSelf: "flex-end", color: "#596861", fontSize: 11, marginTop: 5 }, previewTitle: { color: "#293D3A", fontSize: 15, fontWeight: "700" }, previewLine: { color: "#576762", fontSize: 14, lineHeight: 22, marginTop: 9 }, previewSubhead: { color: "#293D3A", fontSize: 14, fontWeight: "700", marginTop: 15 }, actions: { gap: 8, marginVertical: 8 }, button: { minHeight: 46, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#3F7773", alignItems: "center", justifyContent: "center" }, secondaryButton: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CAD8D1" }, buttonText: { color: "#FFFFFF", fontSize: 14, lineHeight: 20, fontWeight: "700" }, secondaryText: { color: "#3C6963" }, status: { color: "#52635C", marginVertical: 8, fontSize: 13, lineHeight: 20 }, pressed: { opacity: 0.72 } });
