import { StyleSheet } from "react-native";
import { AppPage, BackHome, PageHeading } from "../src/components/AppPage";
import { ActionLink } from "../src/components/ActionLink";
import { View } from "../src/components/Ui";
export default function CardsScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Cards" title="Choose a card" summary="Write only what you want to include. Review it before downloading." /><View style={styles.options}>
    <View style={styles.row}><ActionLink href="/personal-card" title="Medical and communication card" detail="Contacts, optional health information and things that help you communicate." icon="card" inline /></View>
    <View style={styles.row}><ActionLink href="/milestone-card" title="Anniversary or milestone card" detail="A personal moment, in your words. Download an image to share if you choose." icon="milestone" inline /></View>
  </View></AppPage>;
}
const styles = StyleSheet.create({ options: { gap: 12 }, row: { flexDirection: "row" } });
