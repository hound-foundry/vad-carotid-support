import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { palette } from "./AppPage";

const links = [
  { href: "/learn" as const, label: "Guides", mobileLabel: "Guides", area: "guides" },
  { href: "/appointments" as const, label: "Appointment sheet", mobileLabel: "Appointments", area: "appointments" },
  { href: "/support-preferences" as const, label: "Support sheet", mobileLabel: "Support", area: "support" },
  { href: "/resources" as const, label: "Resources", mobileLabel: "Resources", area: "resources" },
  { href: "/saved-guides" as const, label: "Saved guides", mobileLabel: "Saved", area: "saved" },
  { href: "/accessibility" as const, label: "Accessibility", mobileLabel: "Access", area: "accessibility" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const compact = useWindowDimensions().width < 760;
  const activeArea = pathname === "/appointments" ? "appointments" : pathname === "/support-preferences" ? "support" : pathname === "/resources" ? "resources" : pathname === "/saved-guides" ? "saved" : pathname === "/accessibility" ? "accessibility" : pathname === "/" || pathname === "/about" || pathname === "/urgent-help" ? null : "guides";

  return <View style={styles.shell}><View style={[styles.inner, compact ? styles.innerCompact : styles.innerWide]}>
    <Link href="/" asChild><Pressable accessibilityRole="link" accessibilityLabel="VAD and Carotid Support home" accessibilityState={{ selected: pathname === "/" }} style={styles.brandRow}>
      <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
      <View><Text style={styles.brand}>VAD & Carotid Support</Text><Text style={styles.brandNote}>Information made with care</Text></View>
    </Pressable></Link>
    <View role="navigation" aria-label="Main navigation" style={[styles.nav, compact ? styles.navCompact : styles.navWide]}>
      {links.map((item) => { const selected = activeArea === item.area; return <Link key={item.href} href={item.href as any} asChild><Pressable accessibilityRole="link" aria-current={selected ? "page" : undefined}>
        <View style={[styles.navLink, compact && styles.navLinkCompact, selected && styles.navLinkSelected]}><Text style={[styles.navText, compact && styles.navTextCompact, selected && styles.navTextSelected]}>{compact ? item.mobileLabel : item.label}</Text></View>
      </Pressable></Link>; })}
    </View>
  </View></View>;
}

const styles = StyleSheet.create({
  shell: { width: "100%", backgroundColor: palette.paper, borderBottomWidth: 1, borderBottomColor: palette.line },
  inner: { width: "100%", maxWidth: 1120, alignSelf: "center", paddingHorizontal: 24 },
  innerWide: { minHeight: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 },
  innerCompact: { paddingTop: 8, paddingBottom: 7, gap: 4 },
  brandRow: { display: "flex", minHeight: 54, flexDirection: "row", alignItems: "center", gap: 11 },
  brandMark: { width: 36, height: 36, borderRadius: 19, backgroundColor: palette.mint, alignItems: "center", justifyContent: "center" },
  brandMarkInner: { width: 14, height: 14, borderRadius: 8, borderWidth: 2, borderColor: palette.teal, transform: [{ rotate: "35deg" }] },
  brand: { color: palette.ink, fontSize: 15, fontWeight: "800" },
  brandNote: { marginTop: 2, color: palette.muted, fontSize: 11, letterSpacing: 0.15 },
  nav: { display: "flex", alignItems: "center" },
  navWide: { flexDirection: "row", gap: 5 },
  navCompact: { width: "100%", flexDirection: "row", justifyContent: "space-between", gap: 3 },
  navLink: { display: "flex", minHeight: 42, justifyContent: "center", paddingHorizontal: 11, borderRadius: 9 },
  navLinkCompact: { minWidth: 0, alignItems: "center", paddingHorizontal: 5 },
  navLinkSelected: { backgroundColor: palette.mint },
  navText: { color: palette.tealDark, fontSize: 13, fontWeight: "700" },
  navTextCompact: { fontSize: 12 },
  navTextSelected: { color: palette.ink },
});
