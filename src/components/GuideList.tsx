import { Link } from "./AppLink";
import { Pressable, Text } from "./Ui";

import { StyleSheet } from "react-native";
import { guides, type Audience } from "../content/guides";
import { palette } from "./AppPage";

export function GuideList({ audience, slugs, query = "", compact = false }: { audience?: Audience; slugs?: string[]; query?: string; compact?: boolean }) {
  const search = query.trim().toLocaleLowerCase();
  const items = guides.filter((guide) => {
    const matchesScope = (!audience || guide.audience.includes(audience)) && (!slugs || slugs.includes(guide.slug));
    const searchableText = [guide.title, guide.summary, ...guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(" ").toLocaleLowerCase();
    return matchesScope && (!search || searchableText.includes(search));
  });
  if (items.length === 0) return <Text accessibilityLiveRegion="polite" style={styles.empty}>No guides match that search. Try a different word or clear the search.</Text>;
  return <>{query.trim() ? <Text accessibilityLiveRegion="polite" style={styles.count}>{items.length} {items.length === 1 ? "guide" : "guides"} found</Text> : null}{items.map((guide) => { const words = guide.sections.reduce((total, section) => total + [...(section.paragraphs ?? []), ...(section.bullets ?? []), section.heading].join(" ").split(/\s+/).filter(Boolean).length, 0); const minutes = Math.max(1, Math.ceil(words / 180)); return <Link key={guide.slug} href={{ pathname: "/guide/[slug]", params: { slug: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.item, pressed && styles.pressed]}><Text style={styles.title}>{guide.title}</Text><Text style={styles.summary}>{guide.summary}</Text>{!compact ? <><Text style={styles.audience}>For {guide.audience.map((audience) => audience === "patient" ? "patients" : audience === "carer" ? "carers" : "interested readers").join(", ")} · About {minutes} min</Text><Text style={styles.status}>Draft · not approved for patient use</Text></> : null}</Pressable></Link>; })}</>;
}

const styles = StyleSheet.create({ item: { minHeight: 74, paddingVertical: 16, borderTopWidth: 1, borderTopColor: palette.line }, title: { color: palette.tealDark, fontSize: 18, lineHeight: 27, fontWeight: "600" }, summary: { color: palette.muted, marginTop: 5, fontSize: 18, lineHeight: 27 }, audience: { color: palette.tealDark, marginTop: 6, fontSize: 18, lineHeight: 27, fontWeight: "500" }, status: { color: palette.alertInk, marginTop: 2, fontSize: 18, lineHeight: 27, fontWeight: "500" }, count: { color: palette.muted, fontSize: 18, lineHeight: 27, marginTop: 8 }, empty: { color: palette.text, fontSize: 18, lineHeight: 27, paddingVertical: 12 }, pressed: { backgroundColor: palette.mint } });
