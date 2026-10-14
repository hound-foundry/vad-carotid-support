import { Pressable, Text, TextInput, View } from "../src/components/Ui";
import { Link } from "../src/components/AppLink";
import { ExternalLink } from "../src/components/ExternalLink";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { AppPage, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { Disclosure } from "../src/features/cards/CardUi";
import { glossary } from "../src/content/glossary";
import references from "../content/references.json";

export default function GlossaryScreen() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase();
  const entries = glossary.filter((entry) => !search || `${entry.term} ${entry.definition}`.toLocaleLowerCase().includes(search));
  return <AppPage><PageHeading compact eyebrow="Guide library" title="Look up a term" summary="Short definitions for unfamiliar words." /><DraftNotice compact />
    <Card title="Find a term"><TextInput accessibilityLabel="Search glossary terms" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="For example: artery, imaging, stroke" placeholderTextColor={palette.muted} style={styles.search} />{query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}<Text accessibilityLiveRegion="polite" style={styles.count}>{entries.length} {entries.length === 1 ? "term" : "terms"} shown</Text></Card>
    {entries.map((entry) => {
      const source = references.sources.find((item) => item.id === entry.sourceId);
      return <Card key={entry.term} title={entry.term}>
        <Text style={styles.body}>{entry.definition}</Text>
        <Text style={styles.limit}>{entry.limit}</Text>
        {source ? <ExternalLink url={source.url} label={`Open source: ${source.title}`}>{`Source: ${source.title} ↗`}</ExternalLink> : null}
      </Card>;
    })}
    {entries.length === 0 ? <Card title="No matching term"><Text style={styles.body}>Try a shorter word or ask the clinician who reviewed your report to explain the term.</Text><Link href="/guide/tests-and-terms" asChild><Pressable accessibilityRole="link" style={styles.sourceLink}><Text style={styles.sourceText}>Read the tests and terms guide →</Text></Pressable></Link><Link href="/appointments" asChild><Pressable accessibilityRole="link" style={styles.sourceLink}><Text style={styles.sourceText}>Prepare a question for your appointment →</Text></Pressable></Link></Card> : null}
    <Disclosure title="Using this glossary"><Text style={styles.body}>These are general definitions, not an interpretation of your scan or a description of your personal care. If a word in your report is unclear, ask the clinician who reviewed it to explain it in everyday language.</Text></Disclosure>
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
