import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function WithStroke() {
  return <AppPage><BackHome /><PageHeading eyebrow="Dissection accompanied by stroke" title="Recovery is more than what other people can see." summary="A pathway for questions about rehabilitation, communication, fatigue, daily life and support." /><DraftNotice /><Card title="Guides for this pathway"><GuideList slugs={["understanding-dissection", "tests-and-terms", "with-stroke", "recovery-and-quality-of-life", "follow-up-questions"]} /></Card><Link href="/appointments" asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Text style={styles.actionTitle}>Prepare questions for your next appointment →</Text><Text style={styles.actionBody}>Choose only what matters today; you can save or export after reviewing.</Text></Pressable></Link></AppPage>;
}

const styles = StyleSheet.create({ action: { marginTop: 4, padding: 17, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, actionTitle: { color: palette.tealDark, fontSize: 15, lineHeight: 21, fontWeight: "800" }, actionBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }, pressed: { opacity: 0.72 } });
