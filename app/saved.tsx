import { Link } from "../src/components/AppLink";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import { AppPage, BackHome, PageHeading, SavedItemRow } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";
import { loadAppointmentSheet } from "../src/features/appointments/store";
import { loadSupportPreferences } from "../src/features/support-preferences/store";
import { loadSavedGuides } from "../src/features/saved-guides/store";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { getSheetDraftStatuses, subscribeToSheetDraftStatuses } from "../src/features/sheets/drafts.mjs";

export default function SavedScreen() {
  const { personal, milestone } = useCardDrafts(); const [status, setStatus] = useState(["Checking…", "Checking…", "Checking…"]);
  const [sheetDrafts, setSheetDrafts] = useState(getSheetDraftStatuses);
  useEffect(() => { const unsubscribe = subscribeToSheetDraftStatuses(() => setSheetDrafts(getSheetDraftStatuses())); return () => { unsubscribe(); }; }, []);
  useFocusEffect(useCallback(() => { let live = true; void Promise.allSettled([loadSavedGuides(), loadAppointmentSheet(), loadSupportPreferences()]).then((results) => { if (!live) return; setStatus(results.map((result, index) => { if (result.status !== "fulfilled") return "Could not check saved data"; const saved = index === 0 ? (result.value as string[]).length > 0 : (result.value as {selectedIds: string[]; note: string}).selectedIds.length > 0 || Boolean((result.value as {note: string}).note); return saved ? "Saved on this device" : "No saved items"; })); }); return () => { live = false; }; }, []));
  const cardState = (value: string) => ["restored", "saved"].includes(value) ? "Saved on this device" : value === "unsaved" ? "Unsaved draft · app memory only" : value === "loading" ? "Checking…" : ["invalid", "failed"].includes(value) ? "Saved data could not be checked" : "No saved card";
  const sheetState = (id: string, fallback: string) => {
    const draft = sheetDrafts.find((item) => item.id === id);
    if (!draft) return fallback;
    if (["saved", "restored"].includes(draft.status)) return "Saved on this device";
    if (["unsaved", "save-failed"].includes(draft.status)) return draft.status === "save-failed" ? "Draft here · save failed" : "Unsaved draft · app memory only";
    if (draft.status === "loading") return "Checking…";
    if (draft.status === "saving") return "Saving on this device…";
    if (draft.status === "deleting") return "Deleting saved data…";
    if (["load-failed", "delete-failed"].includes(draft.status)) return "Saved data could not be checked";
    return "No saved items";
  };
  const rows = [["/saved-guides", "Saved guides", status[0]], ["/appointments", "Appointment sheet", sheetState("appointment-sheet", status[1])], ["/support-preferences", "Support preferences", sheetState("support-preferences", status[2])], ["/personal-card", "Medical and communication card", cardState(personal.status)], ["/milestone-card", "Anniversary or milestone card", cardState(milestone.status)]];
  return <AppPage><PageHeading compact eyebrow="Saved" title="Saved on this device" summary="Open a guide, sheet or card. Unsaved sheets and cards remain here while this app is open." /><View style={styles.rows}>{rows.map(([href, label, state]) => <SavedItemRow key={href} href={href} label={label} status={state} />)}</View><Text style={styles.helper}>Names, notes and health details are shown only when you open their tool. Closing or reloading loses unsaved edits.</Text><Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.clear}><Text style={styles.link}>Privacy and clear all saved data</Text></Pressable></Link></AppPage>;
}
const styles = StyleSheet.create({ rows: { gap: 10 }, helper: { color: "#33485C", fontSize: 17, lineHeight: 26, marginVertical: 15 }, clear: { justifyContent: "center" }, link: { color: "#214C70", fontSize: 18, fontWeight: "700" } });
