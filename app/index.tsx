import { Link } from "../src/components/AppLink";

import { StyleSheet } from "react-native";
import { AppPage, palette } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";

const actions = [
  { href: "/learn", title: "Understand dissection", detail: "Guides and unfamiliar words." },
  { href: "/appointments", title: "Prepare an appointment", detail: "Choose questions for your doctor." },
  { href: "/cards", title: "Make a card", detail: "Medical information or a personal milestone." },
  { href: "/supporting-someone", title: "Help someone", detail: "Practical ideas for family and carers." },
] as const;
export default function HomeScreen() {
  return <AppPage>
    <View style={styles.intro}><Text accessibilityRole="header" style={styles.title}>Information and practical help</Text><Text style={styles.summary}>For adults affected by vertebral or carotid artery dissection, and the people supporting them.</Text></View>
    <View style={styles.actions}>{actions.map((action) => <Link key={action.href} href={action.href as any} asChild><Pressable accessibilityRole="link" style={styles.action}><Text style={styles.actionTitle}>{action.title}</Text><Text style={styles.detail}>{action.detail}</Text></Pressable></Link>)}</View>
    <Link href={"/saved" as any} asChild><Pressable accessibilityRole="link" style={styles.saved}><Text style={styles.savedText}>Open saved guides, sheets and cards</Text></Pressable></Link>
    <View style={styles.note}><Text accessibilityRole="header" aria-level={2} style={styles.noteTitle}>What this app can and cannot do</Text><Text style={styles.noteBody}>Free information and tools to prepare questions and describe what helps. Guides are drafts awaiting clinical and patient/carer review. For your own care, ask your doctor.</Text></View>
  </AppPage>;
}
const styles = StyleSheet.create({ intro: { paddingTop: 20, paddingBottom: 18 }, title: { color: palette.ink, fontSize: 28, fontFamily: "Georgia", fontWeight: "600" }, summary: { color: palette.text, fontSize: 18, marginTop: 6 }, actions: { gap: 10 }, action: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 22, backgroundColor: palette.mint, borderWidth: 1, borderColor: palette.line }, actionTitle: { color: palette.ink, fontSize: 20, fontWeight: "700" }, detail: { color: palette.text, fontSize: 16, marginTop: 2 }, saved: { marginVertical: 10, justifyContent: "center" }, savedText: { color: palette.tealDark, fontSize: 16, fontWeight: "700", textDecorationLine: "underline" }, note: { paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.line }, noteTitle: { color: palette.ink, fontSize: 18, fontWeight: "700" }, noteBody: { color: palette.text, fontSize: 16, marginTop: 5 } });
