import { Link } from "./AppLink";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "expo-router";
import { Platform, StyleSheet, useWindowDimensions, type View as NativeView } from "react-native";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "./Ui";
import { palette } from "./theme";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";
import { APP_NAME } from "../brand.mjs";
import { AppIcon } from "./AppIcon";

const links = [["/supporting-someone", "Help someone"], ["/support-preferences", "Support preferences"], ["/glossary", "Look up a term"], ["/resources", "Resources"], ["/about", "About and privacy"]] as const;
export function SiteHeader({ bottomNavigationHeight = 80 }: { bottomNavigationHeight?: number }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false); const [headerContentHeight, setHeaderContentHeight] = useState(0); const menuRef = useRef<NativeView>(null);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { settings } = useAccessibility();
  const compactBrand = settings.textScale >= 1.75 && (windowWidth < 480 || windowHeight < 420);
  // Reserve the measured dock and a usable part of the page. The menu scrolls
  // within its own bounds instead of moving medical help or navigation away.
  const menuMaxHeight = Math.max(48, windowHeight - headerContentHeight - bottomNavigationHeight - 96);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open || Platform.OS !== "web") return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); (menuRef.current as unknown as HTMLElement)?.focus(); } };
    document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <SafeAreaView testID="site-header" edges={["top"]} style={styles.shell}><View style={[styles.inner, settings.spacing === "roomy" && styles.innerRoomy, windowWidth < 390 && styles.innerNarrow]}>
    <View onLayout={(event) => setHeaderContentHeight(event.nativeEvent.layout.height)}>
      <View style={styles.identity}>
        <Text accessibilityLabel={APP_NAME} style={styles.brand}>{compactBrand ? "Companion" : APP_NAME}</Text>
        <Pressable ref={menuRef} accessibilityRole="button" accessibilityLabel={open ? "Close menu" : "Menu"} accessibilityState={{ expanded: open }} aria-controls="site-menu" onPress={() => setOpen(!open)} style={[styles.item, open && styles.current]}>{compactBrand ? <AppIcon name={open ? "close" : "menu"} size={22} /> : <Text style={styles.label}>{open ? "Close" : "Menu"}</Text>}</Pressable>
      </View>
      <View role="navigation" aria-label="Help and display" style={styles.utilities}>
        <View testID="urgent-banner" style={styles.helpSlot}><Link href="/urgent-help" asChild><Pressable accessibilityRole="link" accessibilityLabel={compactBrand ? "Unwell? Medical help" : "Feeling unwell? Medical help"} style={styles.help}><Text style={styles.label}>{compactBrand ? "Unwell?" : "Feeling unwell?"}</Text></Pressable></Link></View>
        <Link href="/accessibility" asChild><Pressable accessibilityRole="link" accessibilityLabel="Text and display" aria-current={pathname === "/accessibility" ? "page" : undefined} style={[styles.item, pathname === "/accessibility" && styles.current]}><Text aria-hidden={compactBrand || undefined} style={styles.label}>{compactBrand ? "Aa" : "Text & display"}</Text></Pressable></Link>
      </View>
    </View>
    {open ? <ScrollView nativeID="site-menu" role="navigation" aria-label="All pages" style={[styles.menu, { maxHeight: menuMaxHeight }]} contentContainerStyle={styles.menuContent} keyboardShouldPersistTaps="handled">{links.map(([href, label]) => <Link key={href} href={href as any} asChild><Pressable accessibilityRole="link" aria-current={pathname === href ? "page" : undefined} onPress={() => setOpen(false)} style={[styles.menuItem, pathname === href && styles.current]}><Text style={styles.label}>{label}</Text></Pressable></Link>)}</ScrollView> : null}
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({
  shell: { backgroundColor: palette.paper, borderBottomWidth: 1, borderBottomColor: palette.line },
  inner: { width: "100%", maxWidth: 920, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 8 },
  innerRoomy: { paddingHorizontal: 28 },
  innerNarrow: { paddingHorizontal: 16 },
  identity: { flexDirection: "row", alignItems: "center", gap: 8 },
  brand: { flex: 1, minWidth: 0, color: palette.ink, fontSize: 18, fontWeight: "700" },
  utilities: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  helpSlot: { flexShrink: 1 },
  help: { paddingHorizontal: 12, justifyContent: "center", borderRadius: 14, backgroundColor: palette.mint },
  item: { flexShrink: 1, justifyContent: "center", paddingHorizontal: 10, borderRadius: 12 },
  label: { color: palette.tealDark, fontSize: 18, fontWeight: "600" },
  current: { backgroundColor: palette.mint },
  menu: { paddingTop: 8 }, menuContent: { gap: 4 },
  menuItem: { paddingHorizontal: 12, justifyContent: "center", borderRadius: 12, borderBottomWidth: 1, borderBottomColor: palette.line },
});
