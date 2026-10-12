import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { loadSavedGuides, saveSavedGuides } from "./store";

export function SaveGuideButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Checking saved guides on this device…");

  useEffect(() => {
    let active = true;
    void loadSavedGuides().then((slugs) => {
      if (!active) return;
      setSaved(slugs.includes(slug));
      setReady(true);
      setMessage(slugs.includes(slug) ? "This guide is saved on this device." : "This guide is not saved.");
    }).catch(() => {
      if (active) setMessage("Saved guides could not be read. Try again later.");
    });
    return () => { active = false; };
  }, [slug]);

  const toggle = async () => {
    if (!ready) return;
    setReady(false);
    try {
      const current = await loadSavedGuides();
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      await saveSavedGuides(next);
      const isSaved = next.includes(slug);
      setSaved(isSaved);
      setMessage(isSaved ? "Saved on this device. It is not sent to the project." : "Removed from saved guides on this device.");
    } catch {
      setMessage("Could not update saved guides on this device.");
    } finally {
      setReady(true);
    }
  };

  return <View style={styles.wrap}>
    <Text style={styles.disclosure}>Saving stores this guide’s topic on this device. Someone with access to the device or browser profile may see it; it is not sent to this project.</Text>
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: !ready, selected: saved }} disabled={!ready} onPress={() => void toggle()} style={({ pressed }) => [styles.button, !ready && styles.disabled, pressed && styles.pressed]}>
      <Text style={styles.buttonText}>{saved ? "Remove from saved guides" : "Save this guide on this device"}</Text>
    </Pressable>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
  </View>;
}

const styles = StyleSheet.create({ wrap: { marginBottom: 14 }, disclosure: { maxWidth: 680, marginBottom: 8, color: "#596861", fontSize: 12, lineHeight: 18 }, button: { minHeight: 46, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 16, borderWidth: 1, borderColor: "#26736E", borderRadius: 10, backgroundColor: "#FFFFFF" }, buttonText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" }, status: { marginTop: 5, color: "#596861", fontSize: 12, lineHeight: 18 }, disabled: { opacity: 0.6 }, pressed: { opacity: 0.75 } });
