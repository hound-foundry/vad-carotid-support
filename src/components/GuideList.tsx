import { Link } from "./AppLink";
import { Pressable, Text, View } from "./Ui";

import { StyleSheet } from "react-native";
import { guides, type Audience } from "../content/guides";
import { palette, StatusBadge } from "./AppPage";

export function GuideList({ audience, slugs, query = "", compact = false }: { audience?: Audience; slugs?: string[]; query?: string; compact?: boolean }) {
  const search = query.trim().toLocaleLowerCase();
  const items = guides.filter((guide) => {
    const matchesScope = (!audience || guide.audience.includes(audience)) && (!slugs || slugs.includes(guide.slug));
    const searchableText = [guide.title, guide.summary, ...guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(" ").toLocaleLowerCase();
    return matchesScope && (!search || searchableText.includes(search));
  });
  if (items.length === 0) return <Text accessibilityLiveRegion="polite" style={styles.empty}>No guides match that search. Try a different word or clear the search.</Text>;
  return <>{query.trim() ? <Text accessibilityLiveRegion="polite" style={styles.count}>{items.length} {items.length === 1 ? "guide" : "guides"} found</Text> : null}{items.map((guide) => { const words = guide.sections.reduce((total, section) => total + [...(section.paragraphs ?? []), ...(section.bullets ?? []), section.heading].join(" ").split(/\s+/).filter(Boolean).length, 0); const minutes = Math.max(1, Math.ceil(words / 180)); return <Link key={guide.slug} href={{ pathname: "/guide/[slug]", params: { slug: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.item, pressed && styles.pressed]}><View style={styles.itemTop}><Text style={styles.title}>{guide.title}</Text><Text aria-hidden style={styles.arrow}>›</Text></View><Text style={styles.summary}>{guide.summary}</Text><View style={styles.meta}><StatusBadge tone="draft">Draft</StatusBadge><Text style={styles.audience}>For {guide.audience.map((audience) => audience === "patient" ? "patients" : audience === "carer" ? "carers" : "interested readers").join(", ")} · About {minutes} min</Text></View>{!compact ? <Text style={styles.limit}>Not approved for patient use · review pending</Text> : null}</Pressable></Link>; })}</>;
}

const styles = StyleSheet.create({ item: { width: "100%", minWidth: 0, minHeight: 92, paddingVertical: 16, borderTopWidth: 1, borderTopColor: palette.line }, itemTop: { width: "100%", minWidth: 0, flexDirection: "row", alignItems: "flex-start", gap: 12 }, title: { flex: 1, minWidth: 0, color: palette.tealDark, fontSize: 19, lineHeight: 27, fontWeight: "700" }, arrow: { flexShrink: 0, color: palette.tealDark, fontSize: 28, lineHeight: 27 }, summary: { color: palette.muted, marginTop: 5, fontSize: 18, lineHeight: 27 }, meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 9, marginTop: 9 }, audience: { color: palette.tealDark, fontSize: 16, lineHeight: 24, fontWeight: "500" }, limit: { color: palette.alertInk, marginTop: 5, fontSize: 16, lineHeight: 24 }, count: { color: palette.muted, fontSize: 18, lineHeight: 27, marginTop: 8 }, empty: { color: palette.text, fontSize: 18, lineHeight: 27, paddingVertical: 12 }, pressed: { backgroundColor: palette.mint } });
