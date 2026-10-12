import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { guides } from "../src/content/guides";
import { deleteSavedGuides, exportSavedGuides, loadSavedGuides } from "../src/features/saved-guides/store";
import { formatSavedGuidesExport } from "../src/features/saved-guides/model.mjs";

export default function SavedGuidesScreen() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [message, setMessage] = useState("Loading saved guides from this device…");
  const [loaded, setLoaded] = useState(false);
  const saved = guides.filter((guide) => slugs.includes(guide.slug));

  const refresh = useCallback(async () => {
    setLoaded(false);
    try {
      const value = await loadSavedGuides();
      setSlugs(value);
      setMessage(value.length ? `${value.length} ${value.length === 1 ? "guide" : "guides"} saved on this device.` : "No guides are saved yet.");
    } catch {
      setMessage("Saved guides could not be read from this device.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const removeAll = async () => {
    try {
      await deleteSavedGuides();
      setSlugs([]);
      setMessage("Saved guides deleted from this app’s device storage.");
    } catch {
      setMessage("Could not delete saved guides from device storage.");
    }
  };

  const confirmRemoveAll = () => {
    if (!loaded) return;
    if (Platform.OS === "web") {
      if (globalThis.confirm("Delete all saved guides from this device?")) void removeAll();
      return;
    }
    Alert.alert("Delete saved guides?", "This clears saved guide links from this app’s device storage.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { void removeAll(); } }]);
  };

  const exportList = async () => {
    try {
      const baseUrl = Platform.OS === "web" && typeof window !== "undefined" ? window.location.origin : "";
      await exportSavedGuides(formatSavedGuidesExport(saved.map(({ slug, title }) => ({ slug, title })), baseUrl));
      setMessage("Export opened after your request. The destination app or file is outside this project’s control.");
    } catch {
      setMessage("Export did not complete.");
    }
  };

  return <AppPage>
    <BackHome />
    <PageHeading eyebrow="Your reading list" title="Saved guides." summary="Keep a short list of guides on this device so you can find them again later." />
    <DraftNotice />
    <Card title="Saved on this device">
      {saved.length ? saved.map((guide) => <Link key={guide.slug} href={{ pathname: "/guide/[slug]", params: { slug: guide.slug } }} asChild><Pressable accessibilityRole="link" style={styles.item}><Text style={styles.title}>{guide.title}</Text><Text style={styles.summary}>{guide.summary}</Text><Text style={styles.draft}>Draft · not approved for patient use</Text></Pressable></Link>) : <Text style={styles.body}>{loaded ? "Open a guide and choose ‘Save this guide on this device’ to add it here." : "Reading saved guides…"}</Text>}
    </Card>
    <View style={styles.actions}>
      <ActionButton title="Export saved guide list" onPress={() => void exportList()} disabled={!loaded} />
      <ActionButton title="Delete all saved guides" onPress={confirmRemoveAll} secondary disabled={!loaded || saved.length === 0} />
    </View>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
    <Card title="Privacy and storage"><Text style={styles.body}>Saving a guide may reveal an interest in this topic to anyone who can access this browser profile or device. On the web, this app uses browser local storage, which is not encrypted by the app and may be included in browser sync or backup. On iOS and Android, it uses Expo SecureStore; device and backup behavior can vary. Saving does not send the list to this project. Export creates a separate copy only after you choose Export; deleting here cannot remove exported or backed-up copies.</Text></Card>
  </AppPage>;
}

function ActionButton({ title, onPress, disabled, secondary = false }: { title: string; onPress: () => void; disabled: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}

const styles = StyleSheet.create({ item: { minHeight: 74, paddingVertical: 12, borderTopWidth: 1, borderTopColor: palette.line }, title: { color: palette.tealDark, fontSize: 15, lineHeight: 21, fontWeight: "700" }, summary: { color: palette.muted, marginTop: 3, fontSize: 13, lineHeight: 19 }, draft: { color: palette.alertInk, marginTop: 4, fontSize: 11, lineHeight: 17, fontWeight: "700" }, body: { color: palette.text, fontSize: 13, lineHeight: 21 }, actions: { gap: 8, marginVertical: 8 }, button: { minHeight: 46, paddingHorizontal: 15, borderRadius: 10, backgroundColor: palette.teal, alignItems: "center", justifyContent: "center" }, secondary: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line }, buttonText: { color: palette.white, fontSize: 14, lineHeight: 20, fontWeight: "700" }, secondaryText: { color: palette.tealDark }, disabled: { opacity: 0.55 }, status: { color: palette.muted, marginVertical: 8, fontSize: 13, lineHeight: 20 }, pressed: { opacity: 0.75 } });
