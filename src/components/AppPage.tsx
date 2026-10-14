import { Link } from "./AppLink";
import { Pressable, ScrollView, Text, View, SafeAreaView } from "./Ui";

import { useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { Platform, StyleSheet, type ScrollView as NativeScrollView } from "react-native";
import { useLayoutDimensions } from "./useLayoutDimensions";

import { useAccessibility } from "../features/accessibility/AccessibilityProvider";

import { palette, radii } from "./theme";
export { palette, radii } from "./theme";

export function AppPage({ children, wide = false, scrollRef }: { children: ReactNode; wide?: boolean; scrollRef?: RefObject<NativeScrollView | null> }) {
  const { settings } = useAccessibility();
  const narrow = useLayoutDimensions().width < 390;
  const internalMainRef = useRef<NativeScrollView>(null);
  const mainRef = scrollRef ?? internalMainRef;
  return <SafeAreaView style={styles.safe} edges={[]}>{Platform.OS === "web" ? <Pressable testID="skip-link" accessibilityRole="link" accessibilityLabel="Skip to main content" nativeID="skip-to-content" style={styles.skipLink} onPress={() => (mainRef.current?.getScrollableNode() as HTMLElement | undefined)?.focus()}><Text style={styles.skipText}>Skip to main content</Text></Pressable> : null}<ScrollView ref={mainRef} nativeID="main-content" {...(Platform.OS === "web" ? { role: "main" as const, tabIndex: -1 as const } : {})} contentContainerStyle={[styles.page, settings.spacing === "roomy" && styles.pageRoomy, narrow && styles.pageNarrow, wide && styles.wide]}>{children}<SiteFooter /></ScrollView></SafeAreaView>;
}

export function BackHome() {
  // The persistent dock supplies Home on a phone; avoid a duplicate row above
  // each page. Desktop keeps the established breadcrumb for longer reading.
  if (useLayoutDimensions().width < 700) return null;
  return <Link href="/" asChild><Pressable accessibilityRole="link" accessibilityLabel="Back to home" style={styles.backLink}><Text style={styles.backArrow}>←</Text><Text style={styles.back}>Home</Text></Pressable></Link>;
}

export function PageHeading({ eyebrow, title, summary, compact = false }: { eyebrow: string; title: string; summary: string; compact?: boolean }) {
  const { settings } = useAccessibility();
  return <View style={[styles.heading, settings.spacing === "roomy" && styles.headingRoomy, compact && styles.headingCompact]}>{!compact ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text accessibilityRole="header" aria-level={1} style={[styles.title, compact && styles.titleCompact]}>{title}</Text>{summary ? <Text style={[styles.summary, settings.spacing === "roomy" && styles.summaryRoomy]}>{summary}</Text> : null}</View>;
}

export function DraftNotice({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const id = `draft-review-${useId().replace(/:/g, "")}`;
  if (compact) return <View style={styles.compactNotice}>
    <Pressable accessibilityRole="button" accessibilityLabel="Draft information, review pending. Review details" accessibilityState={{ expanded }} aria-controls={id} onPress={() => setExpanded(!expanded)} style={styles.compactNoticeButton}><Text style={styles.compactNoticeTitle}>Draft information · review pending</Text><Text aria-hidden style={styles.compactNoticeArrow}>{expanded ? "−" : "+"}</Text></Pressable>
    {expanded ? <View nativeID={id} style={styles.compactNoticeDetails}><Text style={styles.noticeBody}>Clinical and patient/carer reviews are not yet recorded. For personal care questions, ask your doctor.</Text><Link href="/about" asChild><Pressable accessibilityRole="link"><Text style={styles.back}>About the review process</Text></Pressable></Link></View> : null}
  </View>;
  return <View style={styles.notice}><View style={styles.noticeCopy}><Text style={styles.noticeTitle}>Draft information · review pending</Text><Text style={styles.noticeBody}>Clinical and patient/carer reviews are not yet recorded. For personal care questions, ask your doctor.</Text><Link href="/about" asChild><Pressable accessibilityRole="link"><Text style={styles.back}>About the review process</Text></Pressable></Link></View></View>;
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
      <Link href={"/saved" as any} asChild><Pressable accessibilityRole="link" style={styles.footerLink}><Text style={styles.footerLinkText}>Saved on this device</Text></Pressable></Link>
      <Link href="/urgent-help" asChild><Pressable accessibilityRole="link" style={styles.footerLink}><Text style={styles.footerLinkText}>Medical help</Text></Pressable></Link>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  skipLink: { position: "absolute", zIndex: 10, top: 4, left: -10000, minHeight: 48, paddingHorizontal: 12, justifyContent: "center", backgroundColor: palette.ink, borderRadius: 8 },
  skipText: { color: palette.white, fontSize: 14, fontWeight: "800" },
  page: { width: "100%", maxWidth: 1120, alignSelf: "center", paddingHorizontal: 28, paddingBottom: 64 },
  pageNarrow: { paddingHorizontal: 16 },
  pageRoomy: { paddingHorizontal: 28, paddingBottom: 72 },
  wide: { maxWidth: 1120 },
  backLink: { minHeight: 44, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 9 },
  backArrow: { color: palette.teal, fontSize: 17 },
  back: { color: palette.tealDark, fontSize: 14, fontWeight: "500" },
  heading: { paddingTop: 24, paddingBottom: 24 },
  headingRoomy: { paddingTop: 22, paddingBottom: 28 },
  headingCompact: { paddingTop: 30, paddingBottom: 24 },
  eyebrow: { color: palette.muted, fontSize: 18, fontWeight: "500" },
  title: { marginTop: 8, color: palette.ink, fontSize: 30, lineHeight: 39, fontWeight: "700", letterSpacing: -0.25 },
  titleCompact: { marginTop: 0 },
  summary: { marginTop: 12, color: palette.text, fontSize: 18, lineHeight: 28, maxWidth: 720 },
  summaryRoomy: { lineHeight: 29 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 14, backgroundColor: palette.alert, borderColor: "#E9CFC3", borderWidth: 1, marginBottom: 18 },
  noticeMark: { width: 23, height: 23, borderRadius: 12, backgroundColor: "#F0D5C8", alignItems: "center", justifyContent: "center", marginTop: 1 },
  noticeMarkText: { color: palette.alertInk, fontSize: 14, fontWeight: "800" },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: palette.alertInk, fontSize: 14, lineHeight: 20, fontWeight: "800" },
  noticeBody: { marginTop: 5, color: "#704D42", fontSize: 13, lineHeight: 20 },
  compactNotice: { borderBottomWidth: 1, borderBottomColor: palette.line, marginBottom: 14 },
  compactNoticeButton: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  compactNoticeTitle: { flex: 1, color: palette.text, fontSize: 16, fontWeight: "500" },
  compactNoticeArrow: { color: palette.tealDark, fontSize: 20 },
  compactNoticeDetails: { paddingBottom: 10 },
  card: { backgroundColor: palette.white, borderColor: palette.line, borderWidth: 1, borderRadius: radii.large, padding: 22, marginBottom: 18, shadowColor: "#183248", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  cardRoomy: { padding: 24, marginBottom: 20 },
  cardTitle: { color: palette.ink, fontSize: 20, lineHeight: 30, fontWeight: "600", marginBottom: 12 },
  body: { color: palette.text, fontSize: 18, lineHeight: 27, marginTop: 7, maxWidth: 680 },
  bodyRoomy: { lineHeight: 29, marginTop: 11 },
  footer: { marginTop: 28, paddingBottom: 4 },
  footerRule: { height: 1, backgroundColor: palette.line },
  footerText: { marginTop: 13, color: palette.muted, fontSize: 12, lineHeight: 19 },
  footerLinks: { flexDirection: "row", flexWrap: "wrap", columnGap: 8, rowGap: 4, marginTop: 8 },
  footerLink: { minHeight: 44, justifyContent: "center", paddingRight: 14 },
  footerLinkText: { color: palette.tealDark, fontSize: 18, lineHeight: 27, fontWeight: "500" },
  section: { marginBottom: 20 }, sectionPlain: { backgroundColor: "transparent", borderWidth: 0, paddingHorizontal: 0 }, sectionTitle: { color: palette.ink, fontSize: 22, lineHeight: 30, fontWeight: "700", marginBottom: 10 },
  statusBadge: { alignSelf: "flex-start", minHeight: 30, justifyContent: "center", paddingHorizontal: 10, borderRadius: 999, backgroundColor: palette.mint, borderWidth: 1, borderColor: palette.line }, statusDraft: { backgroundColor: palette.alert, borderColor: "#E9CFC3" }, statusSaved: { backgroundColor: palette.mint, borderColor: palette.line }, statusText: { color: palette.tealDark, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  emptyState: { padding: 22, borderRadius: radii.large, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.mint }, emptyTitle: { color: palette.ink, fontSize: 21, lineHeight: 29, fontWeight: "700" }, emptyBody: { marginTop: 6, color: palette.text, fontSize: 18, lineHeight: 27 }, emptyAction: { marginTop: 14 }, actionGroup: { gap: 10, marginTop: 8, marginBottom: 20 },
  savedRow: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: radii.medium, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, savedRowPressed: { backgroundColor: palette.mint, borderColor: palette.tealDark }, savedRowCopy: { flex: 1, minWidth: 0 }, savedRowLabel: { color: palette.ink, fontSize: 19, lineHeight: 27, fontWeight: "700" }, savedRowDetail: { color: palette.muted, fontSize: 16, lineHeight: 24, marginTop: 3 }, savedRowEnd: { flexDirection: "row", alignItems: "center", gap: 8 }, savedRowArrow: { color: palette.tealDark, fontSize: 28, lineHeight: 30 },
});

export function Section({ children, title, tone = "surface" }: { children: ReactNode; title?: string; tone?: "surface" | "plain" }) {
  return <View style={[styles.section, tone === "plain" && styles.sectionPlain]}>{title ? <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>{title}</Text> : null}{children}</View>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "draft" | "saved" }) {
  return <View style={[styles.statusBadge, tone === "draft" && styles.statusDraft, tone === "saved" && styles.statusSaved]}><Text style={styles.statusText}>{children}</Text></View>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <View style={styles.emptyState}><Text accessibilityRole="header" aria-level={2} style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{detail}</Text>{action ? <View style={styles.emptyAction}>{action}</View> : null}</View>;
}

export function ActionGroup({ children }: { children: ReactNode }) {
  return <View style={styles.actionGroup}>{children}</View>;
}

export function SavedItemRow({ href, label, status, detail }: { href: string; label: string; status: string; detail?: string }) {
  return <Link href={href as any} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.savedRow, pressed && styles.savedRowPressed]}><View style={styles.savedRowCopy}><Text style={styles.savedRowLabel}>{label}</Text>{detail ? <Text style={styles.savedRowDetail}>{detail}</Text> : null}</View><View style={styles.savedRowEnd}><StatusBadge tone={status.startsWith("Saved") ? "saved" : "neutral"}>{status}</StatusBadge><Text aria-hidden style={styles.savedRowArrow}>›</Text></View></Pressable></Link>;
}
