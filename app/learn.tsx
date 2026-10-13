import { Link } from "../src/components/AppLink";
import { Pressable, Text, TextInput, View } from "../src/components/Ui";
import { useState } from "react";

import { StyleSheet } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";
import type { Audience } from "../src/content/guides";

export default function LearnScreen() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<"all" | Audience>("all");
  return <AppPage><BackHome /><PageHeading eyebrow="Guide library" title="Understand dissection" summary="Short English drafts for adults, families, carers and interested readers." /><DraftNotice />
    <Card title="Find a guide">
      <Text style={styles.helper}>Search guide titles and page text for a topic or unfamiliar word. Search stays on this page, is not saved, and is not added to the address.</Text>
      <Link href="/saved-guides" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Open saved guides →</Text></Pressable></Link>
      <Link href="/glossary" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Open the plain-language glossary →</Text></Pressable></Link>
      <Text style={styles.filterLabel}>Show guides for</Text>
      <View style={styles.filters}>{([ ["all", "Everyone"], ["patient", "Patients"], ["carer", "Carers"] ] as const).map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: audience === value }} onPress={() => setAudience(value)} style={({ pressed }) => [styles.filter, audience === value && styles.filterSelected, pressed && styles.pressed]}><Text style={[styles.filterText, audience === value && styles.filterTextSelected]}>{label}</Text></Pressable>)}</View>
      <TextInput accessibilityLabel="Search guide content" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="For example: scan, fatigue, follow-up" placeholderTextColor="#596861" returnKeyType="search" style={styles.search} />
      {query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}
      <View style={styles.results}><GuideList query={query} audience={audience === "all" ? undefined : audience} /></View>
    </Card>
    <Card title="How to read this library"><Text style={styles.body}>Each guide links its source material and records its audience, language, jurisdiction, rights basis and review state. All current guides remain drafts until clinical and lived-experience reviews are recorded.</Text></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ helper: { color: palette.text, fontSize: 14, lineHeight: 22, marginBottom: 10 }, filterLabel: { color: palette.ink, fontSize: 13, lineHeight: 20, fontWeight: "700", marginTop: 8 }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 7, marginBottom: 9 }, filter: { minHeight: 42, justifyContent: "center", paddingHorizontal: 12, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: palette.white }, filterSelected: { backgroundColor: palette.mint, borderColor: "#8FBAB0" }, filterText: { color: palette.tealDark, fontSize: 13, lineHeight: 19, fontWeight: "700" }, filterTextSelected: { color: palette.ink }, search: { minHeight: 48, borderWidth: 1, borderColor: "#71817A", borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10, color: palette.ink, backgroundColor: palette.white, fontSize: 15 }, clear: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 4 }, clearText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" }, results: { marginTop: 8 }, body: { color: palette.text, fontSize: 15, lineHeight: 24 }, savedLink: { display: "flex", minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: 5 }, savedLinkText: { color: palette.tealDark, fontSize: 14, fontWeight: "700" }, pressed: { opacity: 0.72 } });
