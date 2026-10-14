import { Link } from "../src/components/AppLink";
import { useEffect, useState } from "react";

import { StyleSheet } from "react-native";
import { useLayoutDimensions } from "../src/components/useLayoutDimensions";
import { AppPage, palette, SavedItemRow, Section } from "../src/components/AppPage";
import { taskAccents } from "../src/components/theme";
import { Pressable, Text, View } from "../src/components/Ui";
import { ActionLink } from "../src/components/ActionLink";
import { useAccessibility } from "../src/features/accessibility/AccessibilityProvider";
import { loadSavedSummary, type SavedSummary } from "../src/features/local-data/summary";

const actions = [
  { href: "/learn", title: "Understand dissection", detail: "Guides and unfamiliar words.", icon: "guides", accent: taskAccents.learn },
  { href: "/appointments", title: "Prepare an appointment", detail: "Choose questions for your doctor.", icon: "appointment", accent: taskAccents.prepare },
  { href: "/cards", title: "Make a card", detail: "Medical information or a personal milestone.", icon: "card", accent: taskAccents.cards },
  { href: "/supporting-someone", title: "Help someone", detail: "Practical ideas for family and carers.", icon: "support", accent: taskAccents.support },
] as const;
export default function HomeScreen() {
  const { settings } = useAccessibility();
  const { width } = useLayoutDimensions();
  const [saved, setSaved] = useState<SavedSummary | null>(null);
  useEffect(() => { let live = true; void loadSavedSummary().then((value) => { if (live) setSaved(value); }).catch(() => { if (live) setSaved(null); }); return () => { live = false; }; }, []);
  const singleColumn = width < 360 || (settings.textScale >= 1.5 && width < 700);
  const rows = singleColumn ? actions.map((action) => [action]) : [actions.slice(0, 2), actions.slice(2)];
  return <AppPage>
    <View style={styles.intro}><Text accessibilityRole="header" aria-level={1} style={styles.title}>Information and practical help</Text><Text style={styles.summary}>For adults affected by vertebral or carotid artery dissection, and the people supporting them.</Text></View>
    <View style={styles.actions}>{rows.map((row, index) => <View key={index} style={styles.row}>{row.map((action) => <ActionLink key={action.href} {...action} compact={false} inline={width < 360 && settings.textScale < 1.5} showIcon={settings.textScale < 1.5} />)}</View>)}</View>
    {saved?.hasAny ? <Section title="Continue where you left off"><Text style={styles.resumeIntro}>Saved items stay on this device. Private details appear only after you open the tool.</Text><View style={styles.resumeRows}>
      {saved.guides ? <SavedItemRow href="/saved-guides" label="Saved guides" status="Saved" detail="Open your reading list" /> : null}
      {saved.appointment ? <SavedItemRow href="/appointments" label="Appointment questions" status="Saved" detail="Review or continue your sheet" /> : null}
      {saved.support ? <SavedItemRow href="/support-preferences" label="Support preferences" status="Saved" detail="Review what helps today" /> : null}
      {saved.personalCard ? <SavedItemRow href="/personal-card" label="Medical and communication card" status="Saved" detail="Open the card creator" /> : null}
      {saved.milestoneCard ? <SavedItemRow href="/milestone-card" label="Personal milestone card" status="Saved" detail="Open the card creator" /> : null}
    </View></Section> : null}
    <View style={styles.note}>
      <Text style={styles.noteBody}>Information and preparation, not medical care. Guides are drafts awaiting review.</Text>
      <Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.about}><Text style={styles.aboutText}>About this app and privacy</Text></Pressable></Link>
    </View>
  </AppPage>;
}
const styles = StyleSheet.create({
  intro: { paddingTop: 34, paddingBottom: 24, maxWidth: 760 }, title: { color: palette.ink, fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.25 }, summary: { color: palette.text, fontSize: 19, lineHeight: 29, marginTop: 9 },
  actions: { gap: 12 }, row: { flexDirection: "row", gap: 12 },
  note: { paddingTop: 20 }, noteBody: { color: palette.muted, fontSize: 18, maxWidth: 680 }, resumeIntro: { color: palette.text, fontSize: 17, lineHeight: 26, marginBottom: 12 }, resumeRows: { gap: 10 },
  about: { alignSelf: "flex-start", justifyContent: "center" }, aboutText: { color: palette.tealDark, fontSize: 18, fontWeight: "500" },
});
