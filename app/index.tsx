import { Link } from "../src/components/AppLink";

import { StyleSheet, useWindowDimensions } from "react-native";
import { AppPage, palette } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";
import { ActionLink } from "../src/components/ActionLink";
import { useAccessibility } from "../src/features/accessibility/AccessibilityProvider";

const actions = [
  { href: "/learn", title: "Understand dissection", detail: "Guides and unfamiliar words.", icon: "guides" },
  { href: "/appointments", title: "Prepare an appointment", detail: "Choose questions for your doctor.", icon: "appointment" },
  { href: "/cards", title: "Make a card", detail: "Medical information or a personal milestone.", icon: "card" },
  { href: "/supporting-someone", title: "Help someone", detail: "Practical ideas for family and carers.", icon: "support" },
] as const;
export default function HomeScreen() {
  const { settings } = useAccessibility();
  const { width } = useWindowDimensions();
  const singleColumn = width < 360 || (settings.textScale >= 1.5 && width < 700);
  const rows = singleColumn ? actions.map((action) => [action]) : [actions.slice(0, 2), actions.slice(2)];
  return <AppPage>
    <View style={styles.intro}><Text accessibilityRole="header" aria-level={1} style={styles.title}>Home</Text>{settings.textScale < 1.5 ? <Text style={styles.summary}>Vertebral and carotid artery support.</Text> : null}</View>
    <View style={styles.actions}>{rows.map((row, index) => <View key={index} style={styles.row}>{row.map((action) => <ActionLink key={action.href} {...action} compact={width < 700} inline={width < 360 && settings.textScale < 1.5} showIcon={settings.textScale < 1.5} />)}</View>)}</View>
    <View style={styles.note}>
      <Text style={styles.noteBody}>Information and preparation, not medical care. Guides are drafts awaiting review.</Text>
      <Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.about}><Text style={styles.aboutText}>About this app and privacy</Text></Pressable></Link>
    </View>
  </AppPage>;
}
const styles = StyleSheet.create({
  intro: { paddingTop: 24, paddingBottom: 20 }, title: { color: palette.ink, fontSize: 28, fontWeight: "600" }, summary: { color: palette.text, fontSize: 18, marginTop: 5 },
  actions: { gap: 12 }, row: { flexDirection: "row", gap: 12 },
  note: { paddingTop: 20 }, noteBody: { color: palette.muted, fontSize: 18, maxWidth: 680 },
  about: { alignSelf: "flex-start", justifyContent: "center" }, aboutText: { color: palette.tealDark, fontSize: 18, fontWeight: "500" },
});
