import { Pressable, Text, TextInput, View } from "../src/components/Ui";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { AppPage, Card, PageHeading } from "../src/components/AppPage";
import { Link } from "../src/components/AppLink";
import { Disclosure } from "../src/features/cards/CardUi";
import { communityCandidates, publicResources } from "../src/content/resources";

export default function ResourcesScreen() {
  const [audience, setAudience] = useState<"all" | "patients" | "carers" | "professionals">("all");
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase();
  const resources = publicResources.filter((resource) => resource.verifiedForDirectory && (audience === "all" || resource.audience.includes(audience)) && (!search || [resource.title, resource.kind, resource.note, resource.audience.join(" ")].join(" ").toLocaleLowerCase().includes(search)));
  return <AppPage><PageHeading compact eyebrow="Resource directory" title="Resources" summary="Links to other publishers. Checking a link is not a clinical review." />
    <Card title="Find a resource">
      <TextInput accessibilityLabel="Search resources" value={query} onChangeText={setQuery} maxLength={80} autoCorrect={false} placeholder="Search by topic or resource type" placeholderTextColor="#596861" style={styles.search} />
      {query.length > 0 ? <Pressable accessibilityRole="button" onPress={() => setQuery("")} style={styles.clear}><Text style={styles.clearText}>Clear search</Text></Pressable> : null}
      <Disclosure title={audience === "all" ? "Filter by audience (optional)" : `Filter by audience: ${audience}`}><Text style={styles.filterLabel}>Show resources for</Text><View style={styles.filters}>{([ ["all", "Everyone"], ["patients", "Patients"], ["carers", "Carers"], ["professionals", "Professionals"] ] as const).map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: audience === value }} onPress={() => setAudience(value)} style={[styles.filter, audience === value && styles.filterSelected]}><Text style={[styles.filterText, audience === value && styles.filterTextSelected]}>{label}</Text></Pressable>)}</View></Disclosure>
      <Text accessibilityLiveRegion="polite" style={styles.filterCount}>{resources.length} {resources.length === 1 ? "link" : "links"} shown</Text>
      {resources.length === 0 ? <Text style={styles.empty}>No links match these filters. Try another word or clear the search.</Text> : resources.map((resource) => <View key={resource.id} style={styles.resource}>
        <Link href={resource.url as any} target="_blank" rel="noopener noreferrer" asChild><Pressable accessibilityRole="link" accessibilityLabel={`Open external resource: ${resource.title}`}><Text style={styles.title}>{resource.title} ↗</Text></Pressable></Link>
        <Text style={styles.meta}>{resource.kind.replace(/-/g, " ")} · {resource.language === "en" ? "English" : resource.language}</Text>
        <Text style={styles.note}>{resource.note}</Text>
        <Text style={styles.review}>Clinical review for this app: {resource.clinicalReviewStatus === "not-reviewed" ? "not recorded" : resource.clinicalReviewStatus.replace(/-/g, " ")}</Text>
        <Disclosure title={`Source details: ${resource.title}`}>
          <Text style={styles.meta}>Link checked {resource.checkedOn} · For {resource.audience.join(", ")}</Text>
          <Text style={styles.note}>Source appraisal: {resource.editorialStatus === "candidate" ? "pending" : resource.editorialStatus.replace(/-/g, " ")}</Text>
          <Text style={styles.rights}>Rights: {resource.rights}</Text>
          <Text style={styles.note}>This directory does not endorse a treatment, service or community. External content may change. Links open an external service.</Text>
        </Disclosure>
      </View>)}
    </Card>
    <Card title="Community links are being checked"><Text style={styles.body}>Three Facebook groups have been suggested for this directory. Their current names, purpose, language, access requirements and privacy context could not yet be independently verified, so the links are not listed here. Facebook is an external service; private groups may require membership and expose your Facebook identity to the group. No member posts or personal profiles are used.</Text><Text style={styles.note}>Candidate links are kept in the project’s editorial data and remain hidden until a dated verification is recorded.</Text></Card>
    <Text accessibilityLabel="Three community group candidates are pending verification" style={styles.meta}>Verification queue: {communityCandidates.length} group candidates · none currently listed</Text>
  </AppPage>;
}

const styles = StyleSheet.create({ search: { minHeight: 48, marginTop: 8, paddingHorizontal: 13, paddingVertical: 10, color: "#183B3B", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#71817A", borderRadius: 9, fontSize: 15 }, clear: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 4 }, clearText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "700" }, filterLabel: { color: "#183B3B", fontSize: 13, lineHeight: 20, fontWeight: "700", marginTop: 4 }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 7, marginBottom: 8 }, filter: { minHeight: 42, justifyContent: "center", paddingHorizontal: 12, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: "#FFFFFF" }, filterSelected: { backgroundColor: "#E4F0ED", borderColor: "#8FBAB0" }, filterText: { color: "#195B58", fontSize: 13, lineHeight: 19, fontWeight: "700" }, filterTextSelected: { color: "#183B3B" }, filterCount: { color: "#617474", fontSize: 12, lineHeight: 18, marginBottom: 6 }, empty: { color: "#576762", fontSize: 14, lineHeight: 21, paddingVertical: 12 }, resource: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, title: { color: "#537670", fontSize: 15, lineHeight: 22, fontWeight: "600" }, meta: { color: "#596861", fontSize: 11, lineHeight: 17, marginTop: 4 }, note: { color: "#576762", fontSize: 13, lineHeight: 20, marginTop: 6 }, review: { color: "#596861", fontSize: 11, lineHeight: 17, marginTop: 6 }, rights: { color: "#596861", fontSize: 11, lineHeight: 17, marginTop: 3 }, external: { color: "#537670", fontSize: 12, fontWeight: "600", marginTop: 7 }, body: { color: "#576762", fontSize: 14, lineHeight: 22 }, pressed: { opacity: 0.72 } });
