import { StyleSheet } from "react-native";
import { ExternalLink } from "../src/components/ExternalLink";
import { Text, View } from "../src/components/Ui";
import { AppPage, BackHome, Body, Card, PageHeading, palette } from "../src/components/AppPage";
import { urgentHelp } from "../src/content/urgentHelp";

const sources = [
  { label: "American Stroke Association: B.E. F.A.S.T. and stroke signs", url: "https://www.stroke.org/en/about-stroke/stroke-symptoms" },
  { label: "NHS: symptoms of a stroke", url: "https://www.nhs.uk/conditions/stroke/symptoms/" },
];

export default function UrgentHelpScreen() {
  return <AppPage>
    <BackHome />
    <PageHeading eyebrow="Medical help" title="Medical help" summary="" compact />
    <Card title="Possible stroke or another emergency">
      <Body>{urgentHelp.action}</Body>
      <Body>{urgentHelp.doNotWait}</Body>
      <Text style={styles.quickAction}>{urgentHelp.quickAction}</Text>
    </Card>
    <Card title="Feeling unwell or concerned?">
      <Body>{urgentHelp.feelingUnwell}</Body>
    </Card>
    <Card title="B.E. F.A.S.T. — stroke warning signs">
      <Body>{urgentHelp.signsIntro}</Body>
      {urgentHelp.signs.map((sign) => <View key={sign.letter} style={styles.sign}>
        <Text accessibilityRole="header" aria-level={3} style={styles.signTitle}>{sign.letter} — {sign.label}</Text>
        <Body>{sign.text}</Body>
      </View>)}
      <Body>{urgentHelp.signsLimit}</Body>
    </Card>
    <Card title="Information, not medical care">
      <Body>{urgentHelp.appLimit}</Body>
    </Card>
    <Card title="Sources and review">
      <Body>Wording updated 13 October 2026. Clinical review is pending.</Body>
      {sources.map((source) => <ExternalLink key={source.url} url={source.url} label={source.label} />)}
      <Body>These sources cover stroke generally. Emergency numbers on their websites apply to their own countries. Use the emergency number where you are.</Body>
    </Card>
  </AppPage>;
}

const styles = StyleSheet.create({
  quickAction: { color: palette.ink, fontSize: 18, lineHeight: 27, fontWeight: "600", marginTop: 12, maxWidth: 680 },
  sign: { marginVertical: 10 },
  signTitle: { color: palette.ink, fontSize: 20, lineHeight: 30, fontWeight: "700" },
});
