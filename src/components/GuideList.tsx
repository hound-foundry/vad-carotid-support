import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { guides, type Audience } from "../content/guides";
import { palette } from "./AppPage";

export function GuideList({ audience, slugs }: { audience?: Audience; slugs?: string[] }) {
  const items = guides.filter((guide) => (!audience || guide.audience.includes(audience)) && (!slugs || slugs.includes(guide.slug)));
  return <>{items.map((guide) => <Link key={guide.slug} href={{ pathname: "/guide/[slug]", params: { slug: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.item, pressed && styles.pressed]}><Text style={styles.title}>{guide.title}</Text><Text style={styles.summary}>{guide.summary}</Text><Text style={styles.status}>Draft · not approved for patient use</Text></Pressable></Link>)}</>;
}

const styles = StyleSheet.create({ item: { minHeight: 74, paddingVertical: 12, borderTopWidth: 1, borderTopColor: palette.line }, title: { color: palette.tealDark, fontSize: 15, lineHeight: 21, fontWeight: "700" }, summary: { color: palette.muted, marginTop: 3, fontSize: 13, lineHeight: 19 }, status: { color: palette.alertInk, marginTop: 4, fontSize: 11, lineHeight: 17, fontWeight: "700" }, pressed: { opacity: 0.7 } });
