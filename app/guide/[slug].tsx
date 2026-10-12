import { Link, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import references from "../../content/references.json";
import { AppPage, BackHome, Body, Card, DraftNotice, PageHeading } from "../../src/components/AppPage";
import { getGuide, guides } from "../../src/content/guides";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export default function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const guide = getGuide(slug);
  if (!guide) return <AppPage><BackHome /><PageHeading eyebrow="Guide not found" title="This guide is unavailable." summary="Return to the guide library to choose another page." /><Link href="/learn">Browse guides</Link></AppPage>;
  const sources = references.sources.filter((source) => guide.sourceIds.includes(source.id));
  return <AppPage>
    <BackHome />
    <PageHeading eyebrow="English guide · general information" title={guide.title} summary={guide.summary} />
    <DraftNotice />
    {guide.sections.map((section) => <Card key={section.heading} title={section.heading}>
      {section.paragraphs?.map((paragraph, index) => <Body key={index}>{paragraph}</Body>)}
      {section.bullets?.map((bullet, index) => <View key={index} style={styles.bulletRow}><Text accessibilityElementsHidden style={styles.bullet}>•</Text><Text style={styles.bulletText}>{bullet}</Text></View>)}
    </Card>)}
    <Card title="Sources for this draft">
      <Text style={styles.meta}>Clinical review: {guide.clinicalReview.status} · Patient/carer review: {guide.usabilityReview.status} · Translation review: {guide.translationReview.status} · Review date: {guide.reviewedOn ?? "none"}</Text>
      {sources.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Open source: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.source}><Text style={styles.sourceTitle}>{source.title}{source.year ? ` (${source.year})` : ""}</Text><Text style={styles.sourceLimit}>Source record checked {source.checked_on}. {source.limits}</Text></Pressable>)}
    </Card>
  </AppPage>;
}

const styles = StyleSheet.create({ bulletRow: { flexDirection: "row", gap: 8, marginTop: 9 }, bullet: { color: "#537670", fontSize: 15, lineHeight: 24 }, bulletText: { flex: 1, color: "#576762", fontSize: 15, lineHeight: 24 }, meta: { color: "#596861", fontSize: 12, lineHeight: 19, marginBottom: 8 }, source: { paddingVertical: 11, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, sourceTitle: { color: "#537670", fontSize: 14, lineHeight: 20, fontWeight: "600" }, sourceLimit: { color: "#596861", marginTop: 4, fontSize: 12, lineHeight: 18 } });
