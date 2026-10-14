import { Pressable, Text, TextInput, View } from "../src/components/Ui";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet, type ScrollView as NativeScrollView } from "react-native";
import { AppPage, Card, PageHeading, palette } from "../src/components/AppPage";
import { emptySupportPreferences, formatSupportPreferencesExport, guidePreferenceSuggestions, MAX_NOTE_LENGTH, supportPreferences, type SupportPreferencesSheet } from "../src/features/support-preferences/model.mjs";
import { deleteSupportPreferences, exportSupportPreferences, loadSupportPreferences, saveSupportPreferences } from "../src/features/support-preferences/store";
import { useSheetDraft } from "../src/features/sheets/useSheetDraft";
import { ConfirmDelete } from "../src/components/ConfirmDelete";
import { PageAnchor, usePageAnchor } from "../src/components/PageAnchor";
import { useAccessibility } from "../src/features/accessibility/AccessibilityProvider";
import { useSheetView } from "../src/features/reading-session/ReadingSessionProvider";

const groups = [...new Set(supportPreferences.map((item) => item.group))];

export default function SupportPreferencesScreen() {
  const { guide } = useLocalSearchParams<{ guide?: string }>();
  const draft = useSheetDraft<SupportPreferencesSheet>({
    id: "support-preferences",
    empty: emptySupportPreferences,
    isEmpty: (value) => value.selectedIds.length === 0 && value.note.length === 0,
    load: loadSupportPreferences,
    save: saveSupportPreferences,
    remove: deleteSupportPreferences,
    suggestion: () => {
      const ids = typeof guide === "string" ? guidePreferenceSuggestions[guide as keyof typeof guidePreferenceSuggestions] ?? [] : [];
      return ids.length ? { selectedIds: [...ids], note: "" } : undefined;
    },
  });
  const sheet = draft.value;
  const [message, setMessage] = useState("");
  const { settings } = useAccessibility();
  const { oneAtATime: oneGroupAtATime, selectedOnly: showSelectedOnly, optionsOpen: showViewOptions, pageIndex: groupIndex,
    setOneAtATime: setOneGroupAtATime, setSelectedOnly: setShowSelectedOnly, setOptionsOpen: setShowViewOptions, setPageIndex: setGroupIndex,
  } = useSheetView("support-preferences", groups.length, settings.simplifiedReading);
  const scrollRef = useRef<NativeScrollView>(null);
  const choices = usePageAnchor(scrollRef); const preview = usePageAnchor(scrollRef);
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const style = document.createElement("style");
    style.dataset.supportPrint = "true";
    style.textContent = "@media print { body * { visibility: hidden !important; } #support-sheet-print, #support-sheet-print * { visibility: visible !important; } #support-sheet-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; padding: 24px !important; background: #fff !important; color: #111 !important; } #support-sheet-print * { color: #111 !important; } }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const markEdited = () => {
    setMessage("");
  };
  const toggle = (id: string) => {
    markEdited();
    draft.edit((current) => ({ ...current, selectedIds: current.selectedIds.includes(id) ? current.selectedIds.filter((selected) => selected !== id) : [...current.selectedIds, id] }));
  };
  const toggleGroup = (group: string) => {
    const groupIds = supportPreferences.filter((item) => item.group === group).map((item) => item.id);
    const allSelected = groupIds.every((id) => sheet.selectedIds.includes(id));
    markEdited();
    draft.edit((current) => ({ ...current, selectedIds: allSelected ? current.selectedIds.filter((id) => !groupIds.includes(id)) : [...new Set([...current.selectedIds, ...groupIds])] }));
  };
  const save = async () => {
    try {
      const ok = await draft.save();
      setMessage(ok ? "" : "Could not save on this device. You can still preview or export your choices.");
    } catch { setMessage("Could not save on this device. You can still preview or export your choices."); }
  };
  const remove = async () => {
    try {
      const ok = await draft.remove();
      setMessage(ok ? "Saved preferences deleted from this app’s device storage." : "Could not delete the saved preferences from device storage.");
      return ok;
    } catch {
      setMessage("Could not delete the saved preferences from device storage.");
      return false;
    }
  };
  const exportSheet = async () => {
    try {
      await exportSupportPreferences(sheet);
      setMessage("Export opened after your request. The destination app or file is outside this project’s control.");
    } catch {
      setMessage("Export did not complete.");
    }
  };
  const copySheet = async () => {
    try {
      if (!globalThis.navigator?.clipboard) { setMessage("Copying is unavailable in this browser. Use Export for sharing instead."); return; }
      await globalThis.navigator.clipboard.writeText(formatSupportPreferencesExport(sheet));
      setMessage("Support preferences copied after your request. The destination app is outside this project’s control.");
    } catch { setMessage("Copying did not complete. Use Export for sharing instead."); }
  };

  return <AppPage scrollRef={scrollRef}>
    <PageHeading compact eyebrow="For the people around you" title="Support preferences" summary="Choose statements that fit today. Review before saving or sharing." />
    <Text style={styles.helper}>This is not a medical or emergency plan.</Text>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showViewOptions }} onPress={() => setShowViewOptions((visible) => !visible)} style={styles.viewOptions}><Text style={styles.viewOptionsText}>{showViewOptions ? "Hide viewing options" : "Optional viewing options"}</Text></Pressable>
    {showViewOptions ? <Card title="Choose your pace"><Pressable accessibilityRole="checkbox" accessibilityLabel="Show one support section at a time" accessibilityState={{ checked: oneGroupAtATime }} onPress={() => setOneGroupAtATime((current) => !current)} style={styles.paceOption}><View style={[styles.checkbox, oneGroupAtATime && styles.checked]}>{oneGroupAtATime ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.optionText}>Show one section at a time</Text></Pressable><Text style={styles.helper}>You can change this view at any time.</Text><Pressable accessibilityRole="checkbox" accessibilityLabel="Show selected preferences only" accessibilityState={{ checked: showSelectedOnly }} onPress={() => setShowSelectedOnly((current) => !current)} style={styles.paceOption}><View style={[styles.checkbox, showSelectedOnly && styles.checked]}>{showSelectedOnly ? <Text style={styles.check}>✓</Text> : null}</View><Text style={styles.optionText}>Show selected preferences only</Text></Pressable></Card> : null}
    {oneGroupAtATime ? <View style={styles.stepper}><Text accessibilityLiveRegion="polite" style={styles.stepProgress}>Section {groupIndex + 1} of {groups.length}: {groups[groupIndex]}</Text><View style={styles.stepButtons}><Pressable accessibilityRole="button" accessibilityState={{ disabled: groupIndex === 0 }} disabled={groupIndex === 0} onPress={() => setGroupIndex((index) => Math.max(0, index - 1))} style={({ pressed }) => [styles.stepButton, groupIndex === 0 && styles.disabled, pressed && styles.pressed]}><Text style={styles.stepButtonText}>Previous</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ disabled: groupIndex === groups.length - 1 }} disabled={groupIndex === groups.length - 1} onPress={() => setGroupIndex((index) => Math.min(groups.length - 1, index + 1))} style={({ pressed }) => [styles.stepButton, groupIndex === groups.length - 1 && styles.disabled, pressed && styles.pressed]}><Text style={styles.stepButtonText}>{groupIndex === groups.length - 1 ? "End of sections" : "Next section"}</Text></Pressable></View></View> : null}
    <PageAnchor anchor={choices} label="Support choices"><View style={styles.selectionSummary} accessibilityLiveRegion="polite"><Text style={styles.selectionCount}>{sheet.selectedIds.length} {sheet.selectedIds.length === 1 ? "preference" : "preferences"} selected</Text>{sheet.selectedIds.length > 0 ? <Pressable accessibilityRole="button" onPress={() => { markEdited(); draft.edit((current) => ({ ...current, selectedIds: [] })); }} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}><Text style={styles.clearButtonText}>Clear selections</Text></Pressable> : null}</View>
    {sheet.selectedIds.length > 0 || sheet.note.trim() ? <Button title="Review your sheet" onPress={preview.jump} /> : null}</PageAnchor>
    {(oneGroupAtATime ? groups.slice(groupIndex, groupIndex + 1) : groups).map((group) => { const allGroupItems = supportPreferences.filter((item) => item.group === group); const groupItems = showSelectedOnly ? allGroupItems.filter((item) => sheet.selectedIds.includes(item.id)) : allGroupItems; const groupSelected = allGroupItems.filter((item) => sheet.selectedIds.includes(item.id)).length; const allSelected = groupSelected === allGroupItems.length; if (showSelectedOnly && groupItems.length === 0) return null; return <Card key={group} title={group}><Pressable accessibilityRole="button" accessibilityLabel={`${allSelected ? "Clear" : "Select all"} preferences in ${group}`} onPress={() => toggleGroup(group)} style={({ pressed }) => [styles.groupAction, pressed && styles.pressed]}><Text style={styles.groupActionText}>{allSelected ? "Clear section" : "Select all in section"}</Text><Text style={styles.groupCount}>{groupSelected}/{allGroupItems.length}</Text></Pressable>{groupItems.map((item) => {
      const selected = sheet.selectedIds.includes(item.id);
      return <Pressable key={item.id} accessibilityRole="checkbox" accessibilityLabel={item.text} accessibilityState={{ checked: selected }} onPress={() => toggle(item.id)} style={styles.option}>
        <View style={[styles.checkbox, selected && styles.checked]}>{selected ? <Text style={styles.check}>✓</Text> : null}</View>
        <Text style={styles.optionText}>{item.text}</Text>
      </Pressable>;
    })}</Card>; })}
    <Card title="A note about this sheet"><Text style={styles.body}>Everything is optional. These are example preferences, not instructions for your care. They can change at any time. This is not a medical or emergency plan.</Text></Card>
    <Card title="Something else I’d like you to know (optional)"><Text style={styles.helper}>This note may include personal information. It stays in this browser profile or on this device unless you export it.</Text><TextInput accessibilityLabel="Optional note about how you prefer to be supported" multiline maxLength={MAX_NOTE_LENGTH} value={sheet.note} onChangeText={(note) => { markEdited(); draft.edit((current) => ({ ...current, note })); }} placeholder="Add a short note in your own words" placeholderTextColor={palette.muted} style={styles.input} textAlignVertical="top" /><Text style={styles.counter}>{sheet.note.length}/{MAX_NOTE_LENGTH}</Text></Card>
    <Card title="If you need to leave safely"><Text style={styles.helper}>Someone who can access this browser or device may see saved support preferences and notes. Close the page, use a private device when appropriate, and remember that exports, printouts, browser history and backups are outside this app’s control.</Text></Card>
    <PageAnchor anchor={preview} label="Support sheet preview"><Card title="Review what you’ll share"><View nativeID="support-sheet-print"><Text style={styles.previewTitle}>How I prefer to be supported</Text>{groups.map((group) => {
      const selected = supportPreferences.filter((item) => item.group === group && sheet.selectedIds.includes(item.id));
      return selected.length ? <View key={group} style={styles.previewGroup}><Text style={styles.previewGroupTitle}>{group}</Text>{selected.map((item) => <Text key={item.id} style={styles.previewLine}>• {item.text}</Text>)}</View> : null;
    })}{sheet.selectedIds.length === 0 && !sheet.note.trim() ? <Text style={styles.previewLine}>Choose a few statements or add a note to build your sheet.</Text> : null}{sheet.note.trim() ? <><Text style={styles.previewGroupTitle}>Something else I’d like you to know</Text><Text style={styles.previewLine}>{sheet.note.trim()}</Text></> : null}<Text style={styles.helper}>Your preferences belong to you. You choose whether to share them.</Text></View></Card>
    <Button title="Back to choices" secondary onPress={choices.jump} />
    <View style={styles.actions}><Button title={draft.status === "saved" || draft.status === "restored" ? "Saved on this device" : draft.status === "saving" ? "Saving…" : "Save on this device"} onPress={() => void save()} /><Button title="Export for sharing" secondary onPress={() => void exportSheet()} />{Platform.OS === "web" ? <><Button title="Copy sheet text" secondary onPress={() => void copySheet()} /><Button title="Print support sheet" secondary onPress={() => globalThis.print?.()} /></> : null}<ConfirmDelete label="Delete saved preferences" question="Delete these saved preferences?" detail="This clears the sheet and deletes its saved copy from this device. Downloaded and printed copies are unchanged." onConfirm={remove} disabled={["loading", "saving", "deleting"].includes(draft.status)} /></View>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{draftStatusMessage(draft.status)} {message}</Text>
    <Card title="Where the data lives"><Text style={styles.helper}>On the web, this app uses this browser profile’s local storage. It is not encrypted by this app and may be exposed to people or software with access to the profile or device. On iOS and Android, this app uses Expo SecureStore. Browser, device, operating-system and backup behavior varies; local storage alone does not guarantee privacy. Export makes a separate copy in the destination you choose; deleting here may not remove an exported or backed-up copy.</Text></Card>
  </PageAnchor></AppPage>;
}

function Button({ title, onPress, secondary = false }: { title: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, pressed && styles.pressed]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}

function draftStatusMessage(status: string) {
  const messages: Record<string, string> = {
    loading: "Loading saved preferences from this device…",
    blank: "Nothing is saved unless you choose Save on this device.",
    saved: "Saved on this device. It is not sent to the project.",
    restored: "Your saved preferences and notes were restored from this device.",
    unsaved: "You have unsaved changes. Choose Save to keep them on this device.",
    saving: "Saving on this device…",
    "load-failed": "Device storage could not be read. Your current edits remain in this session.",
    "save-failed": "Could not save on this device. Your current edits remain in this session.",
    cleared: "Saved data was cleared. This sheet is blank.",
    deleting: "Deleting the saved preferences…",
    "delete-failed": "Could not delete the saved preferences from device storage.",
  };
  return messages[status] ?? "";
}

const styles = StyleSheet.create({
  viewOptions: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start", paddingHorizontal: 4 },
  viewOptionsText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  body: { color: palette.text, fontSize: 15, lineHeight: 24 },
  option: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: palette.line },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: "#899A93", alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: palette.teal, borderColor: palette.teal },
  check: { color: palette.white, fontWeight: "800" },
  optionText: { flex: 1, color: palette.text, fontSize: 14, lineHeight: 21 },
  helper: { color: palette.muted, fontSize: 12, lineHeight: 19 },
  input: { minHeight: 105, marginTop: 11, padding: 12, backgroundColor: palette.white, color: palette.ink, borderColor: palette.line, borderWidth: 1, borderRadius: 10, fontSize: 15, lineHeight: 22 },
  counter: { alignSelf: "flex-end", color: palette.muted, fontSize: 11, marginTop: 5 },
  previewTitle: { color: palette.ink, fontSize: 15, fontWeight: "800" },
  previewGroup: { marginTop: 12 },
  previewGroupTitle: { color: palette.ink, fontSize: 13, lineHeight: 19, fontWeight: "700", marginTop: 12 },
  previewLine: { color: palette.text, fontSize: 14, lineHeight: 22, marginTop: 7 },
  selectionSummary: { minHeight: 44, paddingHorizontal: 3, flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" },
  selectionCount: { color: palette.text, fontSize: 13, lineHeight: 20, fontWeight: "800" },
  clearButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 },
  clearButtonText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  groupAction: { minHeight: 44, paddingHorizontal: 4, flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" },
  groupActionText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  groupCount: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  paceOption: { minHeight: 44, marginBottom: 8, paddingHorizontal: 3, flexDirection: "row", alignItems: "center", gap: 10 },
  stepper: { marginTop: 10, paddingTop: 11, borderTopWidth: 1, borderTopColor: palette.line },
  stepProgress: { color: palette.text, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  stepButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  stepButton: { minHeight: 44, paddingHorizontal: 14, borderRadius: 9, borderWidth: 1, borderColor: palette.teal, justifyContent: "center" },
  stepButtonText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  disabled: { opacity: 0.55 },
  actions: { gap: 8, marginVertical: 8 },
  button: { minHeight: 46, paddingHorizontal: 15, borderRadius: 10, backgroundColor: palette.teal, alignItems: "center", justifyContent: "center" },
  secondaryButton: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  buttonText: { color: palette.white, fontSize: 14, lineHeight: 20, fontWeight: "800" },
  secondaryText: { color: palette.tealDark },
  status: { color: palette.text, marginVertical: 8, fontSize: 13, lineHeight: 20 },
  pressed: { opacity: 0.72 },
});
