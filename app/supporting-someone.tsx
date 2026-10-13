import { Link } from "../src/components/AppLink";
import { Pressable, Text } from "../src/components/Ui";

import { StyleSheet } from "react-native";
import { AppPage, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";
import { Disclosure } from "../src/features/cards/CardUi";

export default function SupportingSomeone() {
  return <AppPage>
    <PageHeading compact eyebrow="For family, friends and carers" title="Help someone" summary="Ask what would help today. Choose one small step together." />
    <Link href="/support-preferences" asChild><Pressable accessibilityRole="link" style={styles.action}><Text style={styles.actionTitle}>Ask what helps →</Text><Text style={styles.actionBody}>Choose support statements together, when the person wants to.</Text></Pressable></Link>
    <Link href="/appointments" asChild><Pressable accessibilityRole="link" style={styles.action}><Text style={styles.actionTitle}>Prepare an appointment question →</Text><Text style={styles.actionBody}>Keep your own questions separate and decide what to ask the care team.</Text></Pressable></Link>
    <Link href="/personal-card" asChild><Pressable accessibilityRole="link" style={styles.action}><Text style={styles.actionTitle}>Make a communication card →</Text><Text style={styles.actionBody}>Let the person choose what they want others to know.</Text></Pressable></Link>
    <DraftNotice compact />
    <Disclosure title="Guides for carers"><GuideList compact audience="carer" slugs={["understanding-dissection", "tests-and-terms", "with-stroke", "recovery-and-quality-of-life", "supporting-someone", "follow-up-questions"]} /></Disclosure>
    <Card title="Respect the person’s privacy"><Text style={styles.body}>Do not share another person’s health information unless they have chosen to share it. You can keep your own questions separately and ask the care team what support is available to carers.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ action: { marginBottom: 12, padding: 17, borderRadius: 15, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, actionTitle: { color: palette.tealDark, fontSize: 18, fontWeight: "700" }, actionBody: { color: palette.text, fontSize: 16, marginTop: 4 }, body: { color: palette.text, fontSize: 18 } });
