import { StyleSheet } from "react-native";
import { AppPage, BackHome, PageHeading } from "../src/components/AppPage";
import { ActionLink } from "../src/components/ActionLink";
import { View } from "../src/components/Ui";

const tools = [
  { href: "/appointments", title: "Prepare an appointment", detail: "Choose questions and add your own notes.", icon: "appointment" },
  { href: "/cards", title: "Make a card", detail: "A medical and communication card, or a separate personal milestone.", icon: "card" },
  { href: "/support-preferences", title: "Describe what helps", detail: "Choose communication and support preferences.", icon: "support" },
] as const;

export default function ToolsScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Tools" title="Tools" summary="Prepare questions, make a card or describe what helps." compact />
    <View style={styles.list}>{tools.map((tool) => <View key={tool.href} style={styles.row}><ActionLink {...tool} inline /></View>)}</View>
  </AppPage>;
}
const styles = StyleSheet.create({ list: { gap: 12, marginTop: 4 }, row: { flexDirection: "row" } });
