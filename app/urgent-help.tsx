import { Linking, StyleSheet } from "react-native";
import { Pressable, Text, View } from "../src/components/Ui";
import { AppPage, BackHome, Body, Card, PageHeading, palette } from "../src/components/AppPage";
import { urgentHelp } from "../src/content/urgentHelp";

const sources = [
  { label: "American Stroke Association: B.E. F.A.S.T. and stroke signs", url: "https://www.stroke.org/en/about-stroke/stroke-symptoms" },
  { label: "NHS: symptoms of a stroke", url: "https://www.nhs.uk/conditions/stroke/symptoms/" },
];

export default function UrgentHelpScreen() {
  return <AppPage>
    <BackHome />
    <PageHeading eyebrow="Urgent help" title="Urgent help" summary={urgentHelp.action} compact />
    <View style={styles.action}>
      <Text style={styles.actionText}>{urgentHelp.doNotWait}</Text>
      <Text style={styles.actionText}>{urgentHelp.quickAction}</Text>
    </View>
    <Card title="B.E. F.A.S.T. — stroke warning signs">
      <Body>{urgentHelp.signsIntro}</Body>
      {urgentHelp.signs.map((sign) => <View key={sign.letter} style={styles.sign}>
        <Text accessibilityRole="header" aria-level={3} style={styles.signTitle}>{sign.letter} — {sign.label}</Text>
        <Body>{sign.text}</Body>
      </View>)}
      <Body>{urgentHelp.signsLimit}</Body>
    </Card>
    <Card title="Feeling unwell or concerned?">
      <Body>{urgentHelp.feelingUnwell}</Body>
    </Card>
    <Card title="Information, not medical care">
      <Body>{urgentHelp.appLimit}</Body>
    </Card>
    <Card title="Sources and review">
      <Body>Wording updated 13 October 2026. Clinical review is pending.</Body>
      {sources.map((source) => <Pressable key={source.url} accessibilityRole="link" accessibilityLabel={`${source.label} (external website)`} onPress={() => void Linking.openURL(source.url)} style={styles.sourceLink}>
        <Text style={styles.linkText}>{source.label} ↗</Text>
      </Pressable>)}
      <Body>These sources cover stroke generally. Emergency numbers on their websites apply to their own countries. Use the emergency number where you are.</Body>
    </Card>
  </AppPage>;
}

const styles = StyleSheet.create({
  action: { padding: 18, marginBottom: 13, borderRadius: 15, backgroundColor: palette.alert },
  actionText: { color: palette.alertInk, fontSize: 18, lineHeight: 27, fontWeight: "700", marginBottom: 7, maxWidth: 680 },
  sign: { marginVertical: 10 },
  signTitle: { color: palette.ink, fontSize: 20, lineHeight: 30, fontWeight: "700" },
  sourceLink: { paddingVertical: 8 },
  linkText: { color: palette.tealDark, fontSize: 18, lineHeight: 27, fontWeight: "700" },
});
