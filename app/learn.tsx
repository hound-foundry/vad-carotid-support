import { Link } from "../src/components/AppLink";
import { Pressable, Text, TextInput, View } from "../src/components/Ui";

import { StyleSheet } from "react-native";
import { AppPage, Card, DraftNotice, PageHeading, palette } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";
import { Disclosure } from "../src/features/cards/CardUi";
import { useGuideLibrarySession } from "../src/features/reading-session/ReadingSessionProvider";

export default function LearnScreen() {
  const { query, setQuery, audience, setAudience } = useGuideLibrarySession();
  return <AppPage><PageHeading compact eyebrow="Guide library" title="Understand dissection" summary="Choose a topic, or search for a word." /><DraftNotice compact />
    <Card title="Find a guide">
      <TextInput accessibilityLabel="Search guide content" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="For example: scan, fatigue, follow-up" placeholderTextColor="#596861" returnKeyType="search" style={styles.search} />
      {query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}
      <Disclosure title={audience === "all" ? "Filter by audience (optional)" : `Filter by audience: ${audience === "patient" ? "Patients" : "Carers"}`}>
      <Text style={styles.filterLabel}>Show guides for</Text>
      <View style={styles.filters}>{([ ["all", "Everyone"], ["patient", "Patients"], ["carer", "Carers"] ] as const).map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: audience === value }} onPress={() => setAudience(value)} style={({ pressed }) => [styles.filter, audience === value && styles.filterSelected, pressed && styles.pressed]}><Text style={[styles.filterText, audience === value && styles.filterTextSelected]}>{label}</Text></Pressable>)}</View>
      </Disclosure>
      <View style={styles.results}><GuideList compact query={query} audience={audience === "all" ? undefined : audience} /></View>
    </Card>
    <Link href="/glossary" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Look up a term →</Text></Pressable></Link>
    <Link href="/saved-guides" asChild><Pressable accessibilityRole="link" style={styles.savedLink}><Text style={styles.savedLinkText}>Open saved guides →</Text></Pressable></Link>
    <Disclosure title="About this library and search"><Text style={styles.body}>Each guide links its source material and records its audience, language, jurisdiction, rights basis and review state. All current guides remain drafts until clinical and lived-experience reviews are recorded.</Text><Text style={styles.helper}>Search stays in memory while the app is open. It is not saved or added to the address.</Text></Disclosure>
  </AppPage>;
}

const styles = StyleSheet.create({ helper: { color: palette.text, fontSize: 14, lineHeight: 22, marginBottom: 10 }, filterLabel: { color: palette.ink, fontSize: 13, lineHeight: 20, fontWeight: "700", marginTop: 8 }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 7, marginBottom: 9 }, filter: { minHeight: 42, justifyContent: "center", paddingHorizontal: 12, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: palette.white }, filterSelected: { backgroundColor: palette.mint, borderColor: "#8FBAB0" }, filterText: { color: palette.tealDark, fontSize: 13, lineHeight: 19, fontWeight: "700" }, filterTextSelected: { color: palette.ink }, search: { minHeight: 48, borderWidth: 1, borderColor: "#71817A", borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10, color: palette.ink, backgroundColor: palette.white, fontSize: 15 }, clear: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 4 }, clearText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" }, results: { marginTop: 8 }, body: { color: palette.text, fontSize: 15, lineHeight: 24 }, savedLink: { display: "flex", minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: 5 }, savedLinkText: { color: palette.tealDark, fontSize: 14, fontWeight: "700" }, pressed: { opacity: 0.72 } });
