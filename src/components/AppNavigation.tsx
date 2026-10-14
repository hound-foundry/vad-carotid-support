import { usePathname } from "expo-router";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Link } from "./AppLink";
import { Pressable, SafeAreaView, Text, View } from "./Ui";
import { AppIcon, type AppIconName } from "./AppIcon";
import { palette } from "./theme";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";

const destinations: { href: string; label: string; icon: AppIconName; routes: string[] }[] = [
  { href: "/", label: "Home", icon: "home", routes: ["/"] },
  { href: "/learn", label: "Guides", icon: "guides", routes: ["/learn", "/guide/", "/glossary", "/resources", "/with-stroke", "/without-stroke", "/supporting-someone"] },
  { href: "/tools", label: "Tools", icon: "tools", routes: ["/tools", "/appointments", "/cards", "/personal-card", "/milestone-card", "/support-preferences"] },
  { href: "/saved", label: "Saved", icon: "saved", routes: ["/saved", "/saved-guides"] },
];

export function AppNavigation({ onHeightChange }: { onHeightChange: (height: number) => void }) {
  const pathname = usePathname();
  const { settings } = useAccessibility();
  const { width, height } = useWindowDimensions();
  const twoRows = width < 520 && settings.textScale >= 1.5;
  const showIcons = height >= 420 && settings.textScale < 1.5;
  const rows = twoRows ? [destinations.slice(0, 2), destinations.slice(2)] : [destinations];
  return <SafeAreaView testID="app-navigation" edges={["bottom"]} onLayout={(event) => onHeightChange(event.nativeEvent.layout.height)} style={styles.safe}>
    <View role="navigation" aria-label="App navigation" style={styles.dock}>
      {rows.map((row, index) => <View key={index} style={styles.row}>{row.map((destination) => {
        const current = destination.routes.some((route) => route.endsWith("/") && route !== "/" ? pathname.startsWith(route) : pathname === route);
        return <Link key={destination.href} href={destination.href as any} asChild><Pressable accessibilityRole="link" accessibilityLabel={destination.label} aria-current={current ? "page" : undefined} style={[styles.item, current && styles.selected, current && settings.contrast === "high" && styles.selectedHigh]}>
          {showIcons ? <AppIcon name={destination.icon} size={22} /> : null}
          <Text style={[styles.label, current && styles.selectedLabel]}>{destination.label}</Text>
        </Pressable></Link>;
      })}</View>)}
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: palette.line, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8 },
  dock: { width: "100%", maxWidth: 620, alignSelf: "center", gap: 4, backgroundColor: palette.white },
  row: { flexDirection: "row", gap: 4 },
  item: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 2, paddingVertical: 7, gap: 3, borderRadius: 12, borderWidth: 1, borderColor: "transparent" },
  label: { color: palette.tealDark, fontSize: 18, fontWeight: "500", textAlign: "center" },
  selected: { backgroundColor: palette.mint },
  selectedHigh: { borderColor: palette.tealDark },
  selectedLabel: { fontWeight: "700", textDecorationLine: "underline" },
});
