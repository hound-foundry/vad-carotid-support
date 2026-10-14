import { Image, StyleSheet } from "react-native";
import { AppPage, BackHome, PageHeading } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";
import { Link } from "../src/components/AppLink";
import { taskAccents } from "../src/components/theme";
export default function CardsScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Cards" title="Choose a card" summary="Write only what you want to include. Review it before downloading." /><View style={styles.options}>
    <CardChoice href="/personal-card" title="Medical and communication card" detail="A practical card for communication and user-entered information." image={require("../assets/card-collection/communication.png")} ratio={856 / 540} accent={taskAccents.cards} />
    <CardChoice href="/milestone-card" title="Personal milestone card" detail="A separate card for a date, message or story in your own words." image={require("../assets/card-collection/ribbon-poster.png")} ratio={1080 / 1500} accent={taskAccents.prepare} />
  </View></AppPage>;
}
function CardChoice({ href, title, detail, image, ratio, accent }: { href: string; title: string; detail: string; image: number; ratio: number; accent: string }) {
  return <Link href={href as any} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.choice, { borderTopColor: accent }, pressed && styles.pressed]}><View style={[styles.previewFrame, ratio < 1 && styles.portraitFrame]}><Image source={image} accessibilityIgnoresInvertColors style={[styles.preview, { aspectRatio: ratio }]} resizeMode="contain" /></View><View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text><Text style={styles.link}>Choose this card →</Text></View></Pressable></Link>;
}
const styles = StyleSheet.create({ options: { gap: 16 }, choice: { overflow: "hidden", borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D3DFE7", borderTopWidth: 5, shadowColor: "#183248", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 }, previewFrame: { width: "100%", maxWidth: 640, alignSelf: "center", paddingHorizontal: 20, paddingTop: 20 }, portraitFrame: { maxWidth: 360 }, preview: { width: "100%", backgroundColor: "#F5F6F4" }, copy: { padding: 20 }, title: { color: "#183248", fontSize: 22, lineHeight: 30, fontWeight: "700" }, detail: { color: "#33485C", fontSize: 18, lineHeight: 27, marginTop: 6, maxWidth: 720 }, link: { color: "#214C70", fontSize: 18, lineHeight: 27, fontWeight: "700", marginTop: 14 }, pressed: { backgroundColor: "#E8EFF4" } });
