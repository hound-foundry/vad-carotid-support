import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { glossary } from "../src/content/glossary";
import references from "../content/references.json";

export default function GlossaryScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Guide library" title="Words you may see in a report." summary="Short definitions for unfamiliar terms. You do not need to understand every word at once." /><DraftNotice />
    <Card title="Using this glossary"><Text style={styles.body}>These are general definitions, not an interpretation of your scan or a description of your personal care. If a word in your report is unclear, ask the clinician who reviewed it to explain it in everyday language.</Text></Card>
    {glossary.map((entry) => {
      const source = references.sources.find((item) => item.id === entry.sourceId);
      return <Card key={entry.term} title={entry.term}>
        <Text style={styles.body}>{entry.definition}</Text>
        <Text style={styles.limit}>{entry.limit}</Text>
        {source ? <Pressable accessibilityRole="link" accessibilityLabel={`Open source: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.sourceLink}><Text style={styles.sourceText}>Source: {source.title} ↗</Text></Pressable> : null}
      </Card>;
    })}
    <Card title="Still unsure?"><Text style={styles.body}>You can ask: “Could you explain this word and tell me what it means in my situation?” This app cannot interpret reports or scans.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({
  body: { color: palette.text, fontSize: 15, lineHeight: 24 },
  limit: { marginTop: 10, color: palette.muted, fontSize: 13, lineHeight: 21 },
  sourceLink: { display: "flex", minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: 4 },
  sourceText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
});
