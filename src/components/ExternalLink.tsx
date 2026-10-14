import { Pressable, Text } from "./Ui";
import { createElement, type ReactNode } from "react";
import { Linking, Platform, StyleSheet } from "react-native";

/** Keep external destinations as real anchors on web and use Linking on native. */
export function ExternalLink({ url, label, children }: { url: string; label: string; children?: ReactNode }) {
  const content = children ?? `${label} ↗`;
  const accessibilityLabel = `${label} (external website)`;
  const body = typeof content === "string" ? <Text style={styles.text}>{content}</Text> : content;
  if (Platform.OS === "web") return createElement("a", { href: url, target: "_blank", rel: "noopener noreferrer", "aria-label": accessibilityLabel, style: styles.link as any }, body);
  return <Pressable accessibilityRole="link" accessibilityLabel={accessibilityLabel} onPress={() => void Linking.openURL(url)} style={styles.link}>{body}</Pressable>;
}

const styles = StyleSheet.create({ link: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingVertical: 8 }, text: { color: "#214C70", fontSize: 18, lineHeight: 27, fontWeight: "700" } });
