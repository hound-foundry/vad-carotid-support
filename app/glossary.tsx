import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { glossary } from "../src/content/glossary";
import references from "../content/references.json";

export default function GlossaryScreen() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase();
  const entries = glossary.filter((entry) => !search || `${entry.term} ${entry.definition}`.toLocaleLowerCase().includes(search));
  return <AppPage><BackHome /><PageHeading eyebrow="Guide library" title="Words you may see in a report." summary="Short definitions for unfamiliar terms. You do not need to understand every word at once." /><DraftNotice />
    <Card title="Using this glossary"><Text style={styles.body}>These are general definitions, not an interpretation of your scan or a description of your personal care. If a word in your report is unclear, ask the clinician who reviewed it to explain it in everyday language.</Text></Card>
    <Card title="Find a term"><TextInput accessibilityLabel="Search glossary terms" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="For example: artery, imaging, stroke" placeholderTextColor={palette.muted} style={styles.search} />{query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}<Text accessibilityLiveRegion="polite" style={styles.count}>{entries.length} {entries.length === 1 ? "term" : "terms"} shown</Text></Card>
    {entries.map((entry) => {
      const source = references.sources.find((item) => item.id === entry.sourceId);
      return <Card key={entry.term} title={entry.term}>
        <Text style={styles.body}>{entry.definition}</Text>
        <Text style={styles.limit}>{entry.limit}</Text>
        {source ? <Pressable accessibilityRole="link" accessibilityLabel={`Open source: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.sourceLink}><Text style={styles.sourceText}>Source: {source.title} ↗</Text></Pressable> : null}
      </Card>;
    })}
    {entries.length === 0 ? <Card title="No matching term"><Text style={styles.body}>Try a shorter word or ask the clinician who reviewed your report to explain the term.</Text></Card> : null}
    <Card title="Still unsure?"><Text style={styles.body}>You can ask: “Could you explain this word and tell me what it means in my situation?” This app cannot interpret reports or scans.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({
  body: { color: palette.text, fontSize: 15, lineHeight: 24 },
  search: { minHeight: 48, borderWidth: 1, borderColor: "#71817A", borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10, color: palette.ink, backgroundColor: palette.white, fontSize: 15 },
  clear: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 4 },
  clearText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  count: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  limit: { marginTop: 10, color: palette.muted, fontSize: 13, lineHeight: 21 },
  sourceLink: { display: "flex", minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: 4 },
  sourceText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" },
});
