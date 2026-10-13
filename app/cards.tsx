import { Link } from "../src/components/AppLink";

import { StyleSheet } from "react-native";
import { AppPage, BackHome, PageHeading, palette } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";
export default function CardsScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Cards" title="Choose a card" summary="Write only what you want to include. Review it before downloading." /><View style={styles.options}>
    <Link href="/personal-card" asChild><Pressable accessibilityRole="link" style={styles.card}><Text style={styles.title}>Medical and communication card</Text><Text style={styles.body}>Contacts, optional health information and things that help you communicate.</Text></Pressable></Link>
    <Link href="/milestone-card" asChild><Pressable accessibilityRole="link" style={styles.card}><Text style={styles.title}>Anniversary or milestone card</Text><Text style={styles.body}>A personal moment, in your words. Download an image to share if you choose.</Text></Pressable></Link>
  </View></AppPage>;
}
const styles = StyleSheet.create({ options: { gap: 14 }, card: { padding: 22, borderRadius: 22, backgroundColor: palette.mint, borderColor: palette.line, borderWidth: 1 }, title: { color: palette.ink, fontSize: 20, fontWeight: "700" }, body: { color: palette.text, fontSize: 18, marginTop: 6 } });
