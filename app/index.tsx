import { Link } from "../src/components/AppLink";

import { StyleSheet } from "react-native";
import { useLayoutDimensions } from "../src/components/useLayoutDimensions";
import { AppPage, palette } from "../src/components/AppPage";
import { Pressable, Text, View } from "../src/components/Ui";
import { ActionLink } from "../src/components/ActionLink";
import { useAccessibility } from "../src/features/accessibility/AccessibilityProvider";

const actions = [
  { href: "/learn", title: "Understand dissection", detail: "Guides and unfamiliar words.", icon: "guides", accent: palette.teal },
  { href: "/appointments", title: "Prepare an appointment", detail: "Choose questions for your doctor.", icon: "appointment", accent: "#5B3D7F" },
  { href: "/cards", title: "Make a card", detail: "Medical information or a personal milestone.", icon: "card", accent: "#9F3049" },
  { href: "/supporting-someone", title: "Help someone", detail: "Practical ideas for family and carers.", icon: "support", accent: "#376657" },
] as const;
export default function HomeScreen() {
  const { settings } = useAccessibility();
  const { width } = useLayoutDimensions();
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
  intro: { paddingTop: 34, paddingBottom: 24 }, title: { color: palette.ink, fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.25 }, summary: { color: palette.text, fontSize: 19, marginTop: 7 },
  actions: { gap: 12 }, row: { flexDirection: "row", gap: 12 },
  note: { paddingTop: 20 }, noteBody: { color: palette.muted, fontSize: 18, maxWidth: 680 },
  about: { alignSelf: "flex-start", justifyContent: "center" }, aboutText: { color: palette.tealDark, fontSize: 18, fontWeight: "500" },
});
