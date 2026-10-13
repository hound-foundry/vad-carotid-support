import { Link } from "./AppLink";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "expo-router";
import { Platform, StyleSheet, useWindowDimensions, type View as NativeView } from "react-native";
import { Pressable, ScrollView, Text, View } from "./Ui";
import { palette } from "./theme";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";

const links = [["/learn", "Guides"], ["/appointments", "Prepare an appointment"], ["/cards", "Make a card"], ["/supporting-someone", "Help someone"], ["/support-preferences", "Support preferences"], ["/glossary", "Look up a term"], ["/resources", "Resources"], ["/saved", "Saved on this device"], ["/about", "About and privacy"]] as const;
export function SiteHeader() {
  const pathname = usePathname(); const [open, setOpen] = useState(false); const [headerTop, setHeaderTop] = useState(0); const [headerContentHeight, setHeaderContentHeight] = useState(0); const menuRef = useRef<NativeView>(null);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { settings } = useAccessibility();
  const compactBrand = settings.textScale >= 1.75 && (windowWidth < 480 || windowHeight < 420);
  // onLayout reports this header's y position in its root, including the
  // actual urgent-banner height. Subtract the measured wrapped content and
  // inner padding, then leave a little room for the page below the header.
  const menuMaxHeight = Math.max(48, windowHeight - headerTop - headerContentHeight - 40);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open || Platform.OS !== "web") return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); (menuRef.current as unknown as HTMLElement)?.focus(); } };
    document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <View testID="site-header" onLayout={(event) => setHeaderTop(event.nativeEvent.layout.y)} style={styles.shell}><View style={styles.inner}>
    <View onLayout={(event) => setHeaderContentHeight(event.nativeEvent.layout.height)}>
      <Text accessibilityLabel="VAD & Carotid Support" style={styles.brand}>{compactBrand ? "VAD & Carotid" : "VAD & Carotid Support"}</Text>
      <View role="navigation" aria-label="Main navigation" style={styles.nav}>
        <Link href="/" asChild><Pressable accessibilityRole="link" aria-current={pathname === "/" ? "page" : undefined} style={[styles.item, pathname === "/" && styles.current]}><Text style={styles.label}>Home</Text></Pressable></Link>
        <Pressable ref={menuRef} accessibilityRole="button" accessibilityState={{ expanded: open }} aria-controls="site-menu" onPress={() => setOpen(!open)} style={[styles.item, open && styles.current]}><Text style={styles.label}>{open ? "Close menu" : "Menu"}</Text></Pressable>
        <Link href="/accessibility" asChild><Pressable accessibilityRole="link" accessibilityLabel="Text and display" aria-current={pathname === "/accessibility" ? "page" : undefined} style={[styles.item, pathname === "/accessibility" && styles.current]}><Text style={styles.label}>{compactBrand ? "Text & display" : "Text and display"}</Text></Pressable></Link>
      </View>
    </View>
    {open ? <ScrollView nativeID="site-menu" role="navigation" aria-label="All pages" style={[styles.menu, { maxHeight: menuMaxHeight }]} contentContainerStyle={styles.menuContent} keyboardShouldPersistTaps="handled">{links.map(([href, label]) => <Link key={href} href={href as any} asChild><Pressable accessibilityRole="link" aria-current={pathname === href ? "page" : undefined} onPress={() => setOpen(false)} style={[styles.menuItem, pathname === href && styles.current]}><Text style={styles.label}>{label}</Text></Pressable></Link>)}</ScrollView> : null}
  </View></View>;
}
const styles = StyleSheet.create({ shell: { backgroundColor: palette.paper, borderBottomWidth: 1, borderBottomColor: palette.line }, inner: { width: "100%", maxWidth: 980, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 8 }, brand: { color: palette.ink, fontSize: 18, fontWeight: "700" }, nav: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 3 }, item: { justifyContent: "center", paddingHorizontal: 10, borderRadius: 12 }, label: { color: palette.tealDark, fontSize: 16, fontWeight: "700" }, current: { backgroundColor: palette.mint }, menu: { paddingTop: 8 }, menuContent: { gap: 4 }, menuItem: { paddingHorizontal: 12, justifyContent: "center", borderRadius: 12, borderBottomWidth: 1, borderBottomColor: palette.line } });
