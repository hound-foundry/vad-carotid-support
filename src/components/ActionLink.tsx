import { StyleSheet, useWindowDimensions } from "react-native";
import { Link } from "./AppLink";
import { Pressable, Text, View } from "./Ui";
import { AppIcon, type AppIconName } from "./AppIcon";
import { palette } from "./theme";

export function ActionLink({ href, title, detail, icon, compact = false, inline = false, showIcon = true }: { href: string; title: string; detail: string; icon: AppIconName; compact?: boolean; inline?: boolean; showIcon?: boolean }) {
  const narrow = useWindowDimensions().width < 360;
  return <Link href={href as any} asChild><Pressable accessibilityRole="link" accessibilityLabel={title} style={[styles.card, compact && styles.compact, inline && styles.inline]}>
    {showIcon ? <View style={[styles.icon, inline && styles.inlineIcon]}><AppIcon name={icon} /></View> : null}
    <Text style={[styles.title, narrow && styles.narrowTitle, inline && styles.inlineTitle]}>{title}</Text>
    {!compact ? <Text style={styles.detail}>{detail}</Text> : null}
  </Pressable></Link>;
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, padding: 20, borderRadius: 22, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  compact: { padding: 16 },
  inline: { flexDirection: "row", alignItems: "center", gap: 12 },
  inlineIcon: { marginBottom: 0 },
  inlineTitle: { flex: 1, minWidth: 0 },
  icon: { alignSelf: "flex-start", padding: 9, borderRadius: 14, backgroundColor: palette.mint, marginBottom: 12 },
  title: { color: palette.ink, fontSize: 20, fontWeight: "700" },
  narrowTitle: { fontSize: 18 },
  detail: { color: palette.text, fontSize: 18, marginTop: 5 },
});
