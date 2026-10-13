import { Link } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";

export const palette = {
  ink: "#183B3B",
  text: "#435A5A",
  muted: "#617474",
  teal: "#26736E",
  tealDark: "#195B58",
  mint: "#E4F0ED",
  paper: "#F3F7F6",
  white: "#FFFFFF",
  line: "#DCE7E4",
  alert: "#F9E9E2",
  alertInk: "#713A2D",
  gold: "#956020",
};

export function AppPage({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const { settings } = useAccessibility();
  const narrow = useWindowDimensions().width < 390;
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><Pressable testID="skip-link" accessibilityRole="link" accessibilityLabel="Skip to main content" nativeID="skip-to-content" style={styles.skipLink} onPress={() => { if (typeof document !== "undefined") document.getElementById("main-content")?.focus(); }}><Text style={styles.skipText}>Skip to main content</Text></Pressable><ScrollView nativeID="main-content" accessible contentContainerStyle={[styles.page, narrow && styles.pageNarrow, settings.spacing === "roomy" && styles.pageRoomy, wide && styles.wide]}>{children}<SiteFooter /></ScrollView></SafeAreaView>;
}

export function BackHome() {
  return <Link href="/" asChild><Pressable accessibilityRole="link" accessibilityLabel="Back to home" style={styles.backLink}><Text style={styles.backArrow}>←</Text><Text style={styles.back}>Home</Text></Pressable></Link>;
}

export function PageHeading({ eyebrow, title, summary }: { eyebrow: string; title: string; summary: string }) {
  const { settings } = useAccessibility();
  return <View style={[styles.heading, settings.spacing === "roomy" && styles.headingRoomy]}><Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={[styles.summary, settings.spacing === "roomy" && styles.summaryRoomy]}>{summary}</Text></View>;
}

export function DraftNotice() {
  return <View accessibilityRole="alert" style={styles.notice}><View style={styles.noticeMark}><Text style={styles.noticeMarkText}>!</Text></View><View style={styles.noticeCopy}><Text style={styles.noticeTitle}>Draft — not approved for patient use</Text><Text style={styles.noticeBody}>Clinical review and patient/carer usability review have not been recorded. This information cannot assess or guide your individual care.</Text></View></View>;
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  const { settings } = useAccessibility();
  return <View style={[styles.card, settings.spacing === "roomy" && styles.cardRoomy]}><Text accessibilityRole="header" aria-level={2} style={styles.cardTitle}>{title}</Text>{children}</View>;
}

export function Body({ children }: { children: ReactNode }) {
  const { settings } = useAccessibility();
  return <Text style={[styles.body, settings.spacing === "roomy" && styles.bodyRoomy]}>{children}</Text>;
}

function SiteFooter() {
  return <View testID="site-footer" style={styles.footer}>
    <View style={styles.footerRule} />
    <Text style={styles.footerText}>Development preview · general information only · not a medical service</Text>
    <View style={styles.footerLinks}>
      <Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.footerLink}><Text style={styles.footerLinkText}>About and privacy</Text></Pressable></Link>
      <Link href="/accessibility" asChild><Pressable accessibilityRole="link" style={styles.footerLink}><Text style={styles.footerLinkText}>Accessibility</Text></Pressable></Link>
      <Link href="/urgent-help" asChild><Pressable accessibilityRole="link" style={styles.footerLink}><Text style={styles.footerLinkText}>Urgent help</Text></Pressable></Link>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  skipLink: { position: "absolute", zIndex: 10, top: 4, left: 8, minHeight: 44, paddingHorizontal: 12, justifyContent: "center", backgroundColor: palette.ink, borderRadius: 8, opacity: 0 },
  skipText: { color: palette.white, fontSize: 14, fontWeight: "800" },
  page: { width: "100%", maxWidth: 920, alignSelf: "center", paddingHorizontal: 24, paddingBottom: 56 },
  pageNarrow: { paddingHorizontal: 16 },
  pageRoomy: { paddingHorizontal: 28, paddingBottom: 72 },
  wide: { maxWidth: 1120 },
  backLink: { minHeight: 44, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 9 },
  backArrow: { color: palette.teal, fontSize: 17 },
  back: { color: palette.tealDark, fontSize: 14, fontWeight: "700" },
  heading: { paddingTop: 16, paddingBottom: 20 },
  headingRoomy: { paddingTop: 22, paddingBottom: 28 },
  eyebrow: { color: palette.tealDark, fontSize: 11, fontWeight: "800", letterSpacing: 1.65 },
  title: { marginTop: 11, color: palette.ink, fontFamily: "Georgia", fontSize: 32, lineHeight: 40, fontWeight: "600" },
  summary: { marginTop: 10, color: palette.text, fontSize: 16, lineHeight: 25, maxWidth: 720 },
  summaryRoomy: { lineHeight: 29 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 14, backgroundColor: palette.alert, borderColor: "#E9CFC3", borderWidth: 1, marginBottom: 18 },
  noticeMark: { width: 23, height: 23, borderRadius: 12, backgroundColor: "#F0D5C8", alignItems: "center", justifyContent: "center", marginTop: 1 },
  noticeMarkText: { color: palette.alertInk, fontSize: 14, fontWeight: "800" },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: palette.alertInk, fontSize: 14, lineHeight: 20, fontWeight: "800" },
  noticeBody: { marginTop: 5, color: "#704D42", fontSize: 13, lineHeight: 20 },
  card: { backgroundColor: palette.white, borderColor: palette.line, borderWidth: 1, borderRadius: 15, padding: 18, marginBottom: 13 },
  cardRoomy: { padding: 23, marginBottom: 18 },
  cardTitle: { color: palette.ink, fontSize: 17, lineHeight: 24, fontWeight: "700", marginBottom: 8 },
  body: { color: palette.text, fontSize: 15, lineHeight: 24, marginTop: 7 },
  bodyRoomy: { lineHeight: 29, marginTop: 11 },
  footer: { marginTop: 28, paddingBottom: 4 },
  footerRule: { height: 1, backgroundColor: palette.line },
  footerText: { marginTop: 13, color: palette.muted, fontSize: 12, lineHeight: 19 },
  footerLinks: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 5 },
  footerLink: { minHeight: 44, justifyContent: "center", paddingRight: 14 },
  footerLinkText: { color: palette.tealDark, fontSize: 13, lineHeight: 19, fontWeight: "700" },
});
