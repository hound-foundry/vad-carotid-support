import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function SupportingSomeone() {
  return <AppPage><BackHome /><PageHeading eyebrow="For family, friends and carers" title="Being there can start with listening." summary="Support the person’s choices, help with practical steps when invited, and ask what would make care conversations easier." /><DraftNotice /><Card title="Guides for carers"><GuideList audience="carer" slugs={["understanding-dissection", "tests-and-terms", "with-stroke", "recovery-and-quality-of-life", "supporting-someone", "follow-up-questions"]} /></Card><Link href="/support-preferences" asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Text style={styles.actionTitle}>Make a support preferences sheet →</Text><Text style={styles.actionBody}>Choose statements to review and share only when the person wants to.</Text></Pressable></Link><Card title="Respect the person’s privacy"><Text style={{ color: "#576762", fontSize: 15, lineHeight: 24 }}>Do not share another person’s health information unless they have chosen to share it. You can keep your own questions separately and ask the care team what support is available to carers.</Text></Card></AppPage>;
}

const styles = StyleSheet.create({ action: { marginTop: 4, marginBottom: 13, padding: 17, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, actionTitle: { color: palette.tealDark, fontSize: 15, lineHeight: 21, fontWeight: "800" }, actionBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }, pressed: { opacity: 0.72 } });
