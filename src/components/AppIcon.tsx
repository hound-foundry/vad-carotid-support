import { Platform } from "react-native";
import { Text } from "./Ui";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";
import { themeFor } from "./theme";

export type AppIconName = "home" | "guides" | "tools" | "saved" | "appointment" | "card" | "support" | "menu" | "close";
const paths: Record<AppIconName, string[]> = {
  home: ["M3 10.5 12 3l9 7.5", "M5 9v12h5v-7h4v7h5V9"],
  guides: ["M12 5v16", "M12 6C9 3 5 3 2 4v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 2Z"],
  tools: ["M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z", "M8 4V2h8v2", "M3 10h18", "M10 10v4h4v-4"],
  saved: ["M6 3h12v18l-6-4-6 4V3Z"],
  appointment: ["M4 5h16v16H4V5Z", "M8 3v4M16 3v4M4 10h16", "M8 14h2M14 14h2M8 17h2"],
  card: ["M3 5h18v14H3V5Z", "M7 9h3v3H7V9ZM14 9h4M14 12h4M7 16h11"],
  support: ["M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M2 20v-2a6 6 0 0 1 12 0v2", "M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 4 4v2"],
  menu: ["M4 6h16M4 12h16M4 18h16"], close: ["M5 5l14 14M19 5 5 19"],
};

export function AppIcon({ name, size = 24 }: { name: AppIconName; size?: number }) {
  const { settings } = useAccessibility();
  const colour = themeFor(settings).tealDark;
  const scaled = size * Math.min(settings.textScale, 1.5);
  if (Platform.OS !== "web") return <Text accessible={false} aria-hidden style={{ color: colour, fontSize: size }}>{name === "menu" ? "≡" : name === "close" ? "×" : name === "home" ? "⌂" : name === "saved" ? "▱" : name === "support" ? "+" : "▤"}</Text>;
  return <svg width={scaled} height={scaled} viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name].map((path) => <path key={path} d={path} />)}</svg>;
}
