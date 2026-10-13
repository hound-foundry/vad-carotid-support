import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function WithoutStroke() {
  return <AppPage><BackHome /><PageHeading eyebrow="Dissection without a diagnosed stroke" title="Your experience still counts." summary="A pathway for people whose dissection was not accompanied by a diagnosed stroke, including questions about follow-up and life after diagnosis." /><DraftNotice /><Card title="Guides for this pathway"><GuideList slugs={["understanding-dissection", "tests-and-terms", "without-stroke", "recovery-and-quality-of-life", "follow-up-questions"]} /></Card><Link href="/appointments" asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Text style={styles.actionTitle}>Prepare questions for your next appointment →</Text><Text style={styles.actionBody}>Choose only what matters today; you can save or export after reviewing.</Text></Pressable></Link></AppPage>;
}

const styles = StyleSheet.create({ action: { marginTop: 4, padding: 17, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, actionTitle: { color: palette.tealDark, fontSize: 15, lineHeight: 21, fontWeight: "800" }, actionBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }, pressed: { opacity: 0.72 } });
