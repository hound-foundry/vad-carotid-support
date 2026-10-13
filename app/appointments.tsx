import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { appointmentPrompts, emptyAppointmentSheet, MAX_NOTE_LENGTH, type AppointmentSheet } from "../src/features/appointments/model.mjs";
import { deleteAppointmentSheet, exportAppointmentSheet, loadAppointmentSheet, saveAppointmentSheet } from "../src/features/appointments/store";

export default function AppointmentsScreen() {
  const [sheet, setSheet] = useState<AppointmentSheet>(emptyAppointmentSheet());
  const [saved, setSaved] = useState(false);
  const [oneGroupAtATime, setOneGroupAtATime] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const edited = useRef(false);
  const [message, setMessage] = useState("Loading saved questions from this device…");
  const promptGroups = [...new Set(appointmentPrompts.map((prompt) => prompt.group))];
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const style = document.createElement("style");
    style.dataset.appointmentPrint = "true";
    style.textContent = "@media print { body * { visibility: hidden !important; } #appointment-sheet-print, #appointment-sheet-print * { visibility: visible !important; } #appointment-sheet-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; padding: 24px !important; background: #fff !important; color: #111 !important; } #appointment-sheet-print * { color: #111 !important; } }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  useEffect(() => { let active = true; void loadAppointmentSheet().then((value) => { if (active && !edited.current) { setSheet(value); setMessage("Your sheet is stored on this device only when you choose Save."); } }).catch(() => { if (active) setMessage("Device storage could not be read. Your current edits remain on screen until you leave."); }); return () => { active = false; }; }, []);

  const toggle = (id: string) => { edited.current = true; setSaved(false); setMessage("You have unsaved changes. Choose Save to keep them on this device."); setSheet((current) => ({ ...current, selectedIds: current.selectedIds.includes(id) ? current.selectedIds.filter((selected) => selected !== id) : [...current.selectedIds, id] })); };
  const toggleGroup = (group: string) => {
    const groupIds = appointmentPrompts.filter((prompt) => prompt.group === group).map((prompt) => prompt.id);
    const allSelected = groupIds.every((id) => sheet.selectedIds.includes(id));
    edited.current = true;
    setSaved(false);
    setMessage(`${allSelected ? "Section cleared" : "Section selected"}. Choose Save to keep the updated sheet.`);
    setSheet((current) => ({ ...current, selectedIds: allSelected ? current.selectedIds.filter((id) => !groupIds.includes(id)) : [...new Set([...current.selectedIds, ...groupIds])] }));
  };
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
  const printSheet = () => { if (Platform.OS === "web") globalThis.print?.(); };

  const visibleGroups = oneGroupAtATime ? promptGroups.slice(groupIndex, groupIndex + 1) : promptGroups;
  return <AppPage><BackHome /><PageHeading eyebrow="Appointment preparation" title="Make space for your questions." summary="Choose what matters most today. You can start with one question, add a reminder, and review the sheet before deciding to save or export it." />
    <Card title="Choose your pace">
      <Text style={styles.helper}>You do not need to choose everything. One question is a useful start, and you can change your choices at any time.</Text>
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Show one appointment section at a time" accessibilityState={{ checked: oneGroupAtATime }} onPress={() => setOneGroupAtATime((current) => !current)} style={styles.paceOption}>
        <View style={[styles.checkbox, oneGroupAtATime && styles.checked]}>{oneGroupAtATime ? <Text style={styles.check}>✓</Text> : null}</View>
        <Text style={styles.optionText}>Show one section at a time</Text>
      </Pressable>
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Show selected questions only" accessibilityState={{ checked: showSelectedOnly }} onPress={() => setShowSelectedOnly((current) => !current)} style={styles.paceOption}>
        <View style={[styles.checkbox, showSelectedOnly && styles.checked]}>{showSelectedOnly ? <Text style={styles.check}>✓</Text> : null}</View>
        <Text style={styles.optionText}>Show selected questions only</Text>
      </Pressable>
      <Text style={styles.helper}>Your selected questions stay on this screen as you move between sections. You can change this view at any time.</Text>
      {oneGroupAtATime ? <View style={styles.stepper}>
        <Text accessibilityLiveRegion="polite" style={styles.stepProgress}>Section {groupIndex + 1} of {promptGroups.length}: {promptGroups[groupIndex]}</Text>
        <View style={styles.stepButtons}>
          <Button title="Previous" secondary onPress={() => setGroupIndex((index) => Math.max(0, index - 1))} disabled={groupIndex === 0} />
          <Button title={groupIndex === promptGroups.length - 1 ? "End of sections" : "Next section"} secondary onPress={() => setGroupIndex((index) => Math.min(promptGroups.length - 1, index + 1))} disabled={groupIndex === promptGroups.length - 1} />
        </View>
      </View> : null}
    </Card>
    <View style={styles.selectionSummary} accessibilityLiveRegion="polite">
      <Text style={styles.selectionCount}>{sheet.selectedIds.length} {sheet.selectedIds.length === 1 ? "question" : "questions"} selected</Text>
      {sheet.selectedIds.length > 0 ? <Pressable accessibilityRole="button" onPress={() => { edited.current = true; setSaved(false); setMessage("Selections cleared. Choose Save to keep the updated sheet."); setSheet((current) => ({ ...current, selectedIds: [] })); }} style={({ pressed }) => [styles.clearSelection, pressed && styles.pressed]}><Text style={styles.clearSelectionText}>Clear selections</Text></Pressable> : null}
    </View>
    {visibleGroups.map((group) => { const allGroupPrompts = appointmentPrompts.filter((prompt) => prompt.group === group); const groupPrompts = showSelectedOnly ? allGroupPrompts.filter((prompt) => sheet.selectedIds.includes(prompt.id)) : allGroupPrompts; const groupSelected = allGroupPrompts.filter((prompt) => sheet.selectedIds.includes(prompt.id)).length; const allSelected = groupSelected === allGroupPrompts.length; if (showSelectedOnly && groupPrompts.length === 0) return null; return <Card key={group} title={group}><Pressable accessibilityRole="button" accessibilityLabel={`${allSelected ? "Clear" : "Select all"} questions in ${group}`} onPress={() => toggleGroup(group)} style={({ pressed }) => [styles.groupAction, pressed && styles.pressed]}><Text style={styles.groupActionText}>{allSelected ? "Clear section" : "Select all in section"}</Text><Text style={styles.groupCount}>{groupSelected}/{allGroupPrompts.length}</Text></Pressable>{groupPrompts.map((prompt) => { const selected = sheet.selectedIds.includes(prompt.id); return <Pressable key={prompt.id} accessibilityRole="checkbox" accessibilityLabel={prompt.text} accessibilityState={{ checked: selected }} onPress={() => toggle(prompt.id)} style={styles.option}><View style={[styles.checkbox, selected && styles.checked]}>{selected ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.optionText}>{prompt.text}</Text></Pressable>; })}</Card>; })}
    <Card title="My own notes (optional)"><Text style={styles.helper}>Keep notes brief and avoid names, dates of birth, contact details or copies of records. Notes stay in this browser profile or on this device unless you export them.</Text><TextInput accessibilityLabel="Optional appointment notes" multiline maxLength={MAX_NOTE_LENGTH} value={sheet.note} onChangeText={(note) => { edited.current = true; setSaved(false); setMessage("You have unsaved changes. Choose Save to keep them on this device."); setSheet((current) => ({ ...current, note })); }} placeholder="Write a question or reminder for yourself" placeholderTextColor="#596861" style={styles.input} textAlignVertical="top" /><Text style={styles.counter}>{sheet.note.length}/{MAX_NOTE_LENGTH}</Text></Card>
    <Card title="Preview"><View nativeID="appointment-sheet-print"><Text style={styles.previewTitle}>Appointment question sheet</Text>{promptGroups.map((group) => { const selected = appointmentPrompts.filter((prompt) => prompt.group === group && sheet.selectedIds.includes(prompt.id)); return selected.length ? <View key={group}><Text style={styles.previewSubhead}>{group}</Text>{selected.map((prompt) => <Text key={prompt.id} style={styles.previewLine}>□ {prompt.text}</Text>)}</View> : null; })}{sheet.selectedIds.length === 0 ? <Text style={styles.previewLine}>Choose the questions that matter most to you.</Text> : null}{sheet.note.trim() ? <><Text style={styles.previewSubhead}>My own notes</Text><Text style={styles.previewLine}>{sheet.note.trim()}</Text></> : null}<Text style={styles.helper}>For discussion with your own care team. This is not medical advice.</Text></View></Card>
    <View style={styles.actions}><Button title={saved ? "Saved on this device" : "Save on this device"} onPress={() => void save()} /><Button title="Export sheet" secondary onPress={() => void exportSheet()} />{Platform.OS === "web" ? <Button title="Print question sheet" secondary onPress={printSheet} /> : null}<Button title="Delete saved sheet" secondary onPress={confirmRemove} /></View>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
    <Card title="Where the data lives"><Text style={styles.helper}>On the web, this app uses this browser profile’s local storage. It is not encrypted by this app and may be exposed to people or software with access to the profile or device. On iOS and Android, this app uses Expo SecureStore. Browser, device, operating-system and backup behavior varies; local storage alone does not guarantee privacy. Export sends a copy to the destination you choose. Deleting here may not remove an exported or backed-up copy.</Text></Card>
  </AppPage>;
}

function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}><Text style={[styles.buttonText, secondary && styles.secondaryText, disabled && styles.disabledText]}>{title}</Text></Pressable>;
}

const styles = StyleSheet.create({ paceOption: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10 }, stepper: { marginTop: 10, paddingTop: 11, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, stepProgress: { color: "#435A5A", fontSize: 13, lineHeight: 20, fontWeight: "700" }, stepButtons: { flexDirection: "row", gap: 10, marginTop: 8 }, selectionSummary: { minHeight: 44, marginBottom: 8, paddingHorizontal: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, selectionCount: { color: "#52635C", fontSize: 13, lineHeight: 20, fontWeight: "700" }, clearSelection: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 }, clearSelectionText: { color: "#3C6963", fontSize: 13, lineHeight: 20, fontWeight: "700" }, groupAction: { minHeight: 44, paddingHorizontal: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, groupActionText: { color: "#3C6963", fontSize: 13, lineHeight: 20, fontWeight: "700" }, groupCount: { color: "#617474", fontSize: 12, lineHeight: 18 }, option: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: "#899A93", alignItems: "center", justifyContent: "center" }, checked: { backgroundColor: "#3F7773", borderColor: "#3F7773" }, check: { color: "#FFFFFF", fontWeight: "700" }, optionText: { flex: 1, color: "#394C47", fontSize: 14, lineHeight: 21 }, helper: { color: "#596861", fontSize: 12, lineHeight: 19 }, input: { minHeight: 115, marginTop: 11, padding: 12, backgroundColor: "#FBFCFA", color: "#293D3A", borderColor: "#DCE4DE", borderWidth: 1, borderRadius: 10, fontSize: 15, lineHeight: 22 }, counter: { alignSelf: "flex-end", color: "#596861", fontSize: 11, marginTop: 5 }, previewTitle: { color: "#293D3A", fontSize: 15, fontWeight: "700" }, previewLine: { color: "#576762", fontSize: 14, lineHeight: 22, marginTop: 9 }, previewSubhead: { color: "#293D3A", fontSize: 14, fontWeight: "700", marginTop: 15 }, actions: { gap: 8, marginVertical: 8 }, button: { minHeight: 46, minWidth: 96, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#3F7773", alignItems: "center", justifyContent: "center" }, secondaryButton: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CAD8D1" }, buttonText: { color: "#FFFFFF", fontSize: 14, lineHeight: 20, fontWeight: "700" }, secondaryText: { color: "#3C6963" }, disabledButton: { borderColor: "#DCE7E4", opacity: 0.55 }, disabledText: { color: "#617474" }, status: { color: "#52635C", marginVertical: 8, fontSize: 13, lineHeight: 20 }, pressed: { opacity: 0.72 } });
