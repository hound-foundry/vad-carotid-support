import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, type View as NativeView } from "react-native";
import { Card, palette } from "./AppPage";
import { Pressable, Text, View } from "./Ui";

/** Keep destructive choices in the page, with Cancel receiving keyboard focus. */
export function ConfirmDelete({ label, question, detail, onConfirm, disabled = false }: {
  label: string; question: string; detail: string; onConfirm: () => Promise<void>; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const triggerRef = useRef<NativeView>(null);
  const cancelRef = useRef<NativeView>(null);
  const previouslyOpen = useRef(false);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (open) (cancelRef.current as unknown as HTMLElement | null)?.focus();
    else if (previouslyOpen.current) {
      const trigger = triggerRef.current as unknown as HTMLElement | null;
      (disabled ? trigger?.closest<HTMLElement>('[role="main"]') : trigger)?.focus();
    }
    previouslyOpen.current = open;
  }, [open, disabled]);
  useEffect(() => {
    if (!open || Platform.OS !== "web") return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !busy) { event.preventDefault(); setOpen(false); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, busy]);
  const confirm = async () => {
    setBusy(true); setFailure("");
    try { await onConfirm(); setOpen(false); }
    catch { setFailure("Deletion did not complete. You can cancel or try again."); }
    finally { setBusy(false); }
  };
  return <View style={styles.wrapper}>
    <Pressable ref={triggerRef} accessibilityRole="button" accessibilityState={{ disabled: disabled || busy, expanded: open }} disabled={disabled || busy} onPress={() => setOpen(true)} style={styles.button}><Text style={styles.label}>{label}</Text></Pressable>
    {open ? <View accessibilityLiveRegion="polite"><Card title={question}>
      <Text style={styles.detail}>{detail}</Text>
      {failure ? <Text accessibilityLiveRegion="polite" style={styles.detail}>{failure}</Text> : null}
      <Pressable ref={cancelRef} accessibilityRole="button" disabled={busy} accessibilityState={{ disabled: busy }} onPress={() => setOpen(false)} style={styles.button}><Text style={styles.label}>Cancel deletion</Text></Pressable>
      <Pressable accessibilityRole="button" disabled={busy} accessibilityState={{ disabled: busy, busy }} onPress={() => void confirm()} style={styles.button}><Text style={styles.label}>{busy ? "Deleting…" : "Confirm deletion"}</Text></Pressable>
    </Card></View> : null}
  </View>;
}
const styles = StyleSheet.create({ wrapper: { marginVertical: 5 }, button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white, justifyContent: "center", alignItems: "center", marginVertical: 4 }, label: { color: palette.tealDark, fontSize: 18, fontWeight: "700", textAlign: "center" }, detail: { color: palette.text, fontSize: 18, marginBottom: 8 } });
