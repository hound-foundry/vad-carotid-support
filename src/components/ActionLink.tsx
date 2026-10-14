import { StyleSheet, useWindowDimensions } from "react-native";
import { useId } from "react";
import { Link } from "./AppLink";
import { Pressable, Text, View } from "./Ui";
import { AppIcon, type AppIconName } from "./AppIcon";
import { palette } from "./theme";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";

export function ActionLink({ href, title, detail, icon, compact = false, inline = false, showIcon = true }: { href: string; title: string; detail: string; icon: AppIconName; compact?: boolean; inline?: boolean; showIcon?: boolean }) {
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const { settings } = useAccessibility();
  const detailId = `action-detail-${useId().replace(/:/g, "")}`;
  const horizontal = inline && settings.textScale < 1.5;
  const iconsVisible = showIcon && settings.textScale < 1.5 && (!inline || width >= 520);
  return <Link href={href as any} asChild><Pressable testID="task-action" accessibilityRole="link" accessibilityLabel={title} aria-describedby={!compact ? detailId : undefined} style={({ pressed }) => [styles.card, compact && styles.compact, horizontal && styles.inline, pressed && styles.pressed]}>
    {!horizontal && iconsVisible ? <View style={styles.topline}><View style={styles.icon}><AppIcon name={icon} size={22} /></View><AppIcon name="chevron" size={18} /></View> : null}
    {horizontal && iconsVisible ? <View style={styles.icon}><AppIcon name={icon} size={22} /></View> : null}
    <View style={styles.copy}><Text style={[styles.title, narrow && styles.narrowTitle]}>{title}</Text>
      {!compact ? <Text nativeID={detailId} style={styles.detail}>{detail}</Text> : null}</View>
    {horizontal ? <AppIcon name="chevron" size={18} /> : null}
  </Pressable></Link>;
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, padding: 24, borderRadius: 16, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  compact: { padding: 18 },
  inline: { flexDirection: "row", alignItems: "center", gap: 14, padding: 20 },
  topline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  icon: { padding: 8, borderRadius: 10, backgroundColor: palette.mint },
  copy: { flex: 1, minWidth: 0 },
  title: { color: palette.ink, fontSize: 20, fontWeight: "600" },
  narrowTitle: { fontSize: 18 },
  detail: { color: palette.muted, fontSize: 18, marginTop: 6 },
  pressed: { backgroundColor: palette.mint, borderColor: palette.tealDark },
});
