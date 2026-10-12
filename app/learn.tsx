import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function LearnScreen() {
  const [query, setQuery] = useState("");
  return <AppPage><BackHome /><PageHeading eyebrow="Guide library" title="Clear explanations, with sources and limits." summary="Short English drafts for adults, families, carers and interested readers." /><DraftNotice />
    <Card title="Find a guide">
      <Text style={styles.helper}>Search guide titles and page text for a topic or unfamiliar word. Search stays on this page, is not saved, and is not added to the address.</Text>
      <Link href="/saved-guides" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Open saved guides →</Text></Pressable></Link>
      <Link href="/glossary" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Open the plain-language glossary →</Text></Pressable></Link>
      <TextInput accessibilityLabel="Search guide content" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="For example: scan, fatigue, follow-up" placeholderTextColor="#596861" returnKeyType="search" style={styles.search} />
      {query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}
      <View style={styles.results}><GuideList query={query} /></View>
    </Card>
    <Card title="How to read this library"><Text style={styles.body}>Each guide links its source material and records its audience, language, jurisdiction, rights basis and review state. All current guides remain drafts until clinical and lived-experience reviews are recorded.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ helper: { color: palette.text, fontSize: 14, lineHeight: 22, marginBottom: 10 }, search: { minHeight: 48, borderWidth: 1, borderColor: "#71817A", borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10, color: palette.ink, backgroundColor: palette.white, fontSize: 15 }, clear: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 4 }, clearText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" }, results: { marginTop: 8 }, body: { color: palette.text, fontSize: 15, lineHeight: 24 }, savedLink: { display: "flex", minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: 5 }, savedLinkText: { color: palette.tealDark, fontSize: 14, fontWeight: "700" } });
