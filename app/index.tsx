import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paths = [
  {
    href: "/without-stroke" as const,
    title: "I have a dissection",
    detail: "A place to start, with or without a stroke",
    mark: "01",
    color: "#E8F1EF",
  },
  {
    href: "/with-stroke" as const,
    title: "I had a stroke",
    detail: "Information for the next part of recovery",
    mark: "02",
    color: "#ECEBFA",
  },
  {
    href: "/supporting-someone" as const,
    title: "I’m here for someone",
    detail: "Ways to listen, help and understand",
    mark: "03",
    color: "#F7EDE6",
  },
  {
    href: "/learn" as const,
    title: "I want to understand",
    detail: "Clear explanations and carefully chosen sources",
    mark: "04",
    color: "#EAF0F7",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
          <Text style={styles.brand}>VAD & Carotid Support</Text>
          <Text style={styles.headerNote}>A project built with care</Text>
        </View>

        <Link href="/urgent-help" asChild>
          <Pressable
            accessibilityRole="link"
            style={({ pressed }) => [styles.urgent, pressed && styles.pressed]}
          >
            <View style={styles.urgentDot} />
            <Text style={styles.urgentText}>New, sudden stroke symptoms? Get emergency help now.</Text>
            <Text style={styles.urgentArrow}>›</Text>
          </Pressable>
        </Link>

        <View style={styles.hero}>
          <View style={styles.heroArt} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.orbitOne} />
            <View style={styles.orbitTwo} />
            <View style={styles.orbitThree} />
            <View style={styles.orbitCenter}><View style={styles.orbitCore} /></View>
          </View>
          <Text style={styles.eyebrow}>A QUIETER PLACE TO BEGIN</Text>
          <Text style={styles.title}>You don’t have to figure it all out today.</Text>
          <Text style={styles.intro}>
            Clear information and thoughtful support for life after a carotid or vertebral artery dissection.
          </Text>
          <Text style={styles.personal}>
            Your questions are welcome here. Your own care team is the right place for advice about your diagnosis and treatment.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>What brings you here?</Text>
          <Text style={styles.sectionNote}>Choose what feels closest. You can change direction any time.</Text>
        </View>

        <View style={styles.pathList}>
          {paths.map((path) => (
            <Link key={path.href} href={path.href} asChild>
              <Pressable
                accessibilityRole="link"
                style={({ pressed }) => [styles.pathCard, pressed && styles.pressed]}
              >
                <View style={[styles.pathMark, { backgroundColor: path.color }]}>
                  <Text style={styles.pathMarkText}>{path.mark}</Text>
                </View>
                <View style={styles.pathCopy}>
                  <Text style={styles.pathTitle}>{path.title}</Text>
                  <Text style={styles.pathDetail}>{path.detail}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureEyebrow}>FOR THE NEXT CONVERSATION</Text>
          <Text style={styles.featureTitle}>A little more ready for your appointment.</Text>
          <Text style={styles.featureText}>
            Collect the questions you want to ask and choose what you’d like to bring with you.
          </Text>
          <Link href="/appointments" asChild>
            <Pressable style={styles.featureAction} accessibilityRole="link">
              <Text style={styles.featureActionText}>Explore appointment support</Text>
              <Text style={styles.featureArrow}>→</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Made with patients and the people beside them.</Text>
          <Text style={styles.footerText}>
            Free, independent and open source. This project is being developed; its health information has not yet been clinically reviewed.
          </Text>
          <Link href="/about" asChild>
            <Pressable accessibilityRole="link" style={styles.aboutLink}>
              <Text style={styles.aboutLinkText}>About the project and its sources</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8F5" },
  page: { width: "100%", maxWidth: 900, alignSelf: "center", paddingHorizontal: 26, paddingBottom: 54 },
  header: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: 12 },
  brandMark: { width: 31, height: 31, borderRadius: 16, backgroundColor: "#DDEBE8", alignItems: "center", justifyContent: "center" },
  brandMarkInner: { width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: "#3F7773", transform: [{ rotate: "35deg" }] },
  brand: { color: "#1D3535", fontSize: 15, fontWeight: "700", letterSpacing: 0.1 },
  headerNote: { marginLeft: "auto", color: "#71807C", fontSize: 12 },
  urgent: { minHeight: 54, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#FFF2E9", borderColor: "#E9C4A9", borderWidth: 1, borderRadius: 13, gap: 11 },
  urgentDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#B64F31" },
  urgentText: { flex: 1, color: "#682F22", fontSize: 13, lineHeight: 19, fontWeight: "600" },
  urgentArrow: { color: "#8F4432", fontSize: 23 },
  hero: { position: "relative", overflow: "hidden", marginTop: 29, marginBottom: 35, paddingTop: 32, paddingBottom: 29, paddingHorizontal: 27, borderRadius: 23, backgroundColor: "#EAF2EF" },
  heroArt: { position: "absolute", right: -12, top: -41, width: 200, height: 200, opacity: 0.82 },
  orbitOne: { position: "absolute", width: 170, height: 170, top: 15, left: 18, borderRadius: 86, borderWidth: 1, borderColor: "#BCD3CE" },
  orbitTwo: { position: "absolute", width: 126, height: 126, top: 37, left: 40, borderRadius: 64, borderWidth: 1, borderColor: "#B7CBC7", transform: [{ rotate: "36deg" }, { scaleX: 0.7 }] },
  orbitThree: { position: "absolute", width: 126, height: 126, top: 37, left: 40, borderRadius: 64, borderWidth: 1, borderColor: "#CAD8D5", transform: [{ rotate: "-36deg" }, { scaleX: 0.7 }] },
  orbitCenter: { position: "absolute", width: 60, height: 60, top: 70, left: 73, borderRadius: 30, backgroundColor: "#D8E7E2", alignItems: "center", justifyContent: "center" },
  orbitCore: { width: 22, height: 22, borderRadius: 12, backgroundColor: "#7FA39D" },
  eyebrow: { color: "#567873", fontSize: 10, fontWeight: "700", letterSpacing: 1.7 },
  title: { maxWidth: 520, marginTop: 14, color: "#203B3A", fontSize: 34, lineHeight: 41, fontWeight: "600", letterSpacing: -0.7 },
  intro: { maxWidth: 520, marginTop: 12, color: "#516560", fontSize: 16, lineHeight: 25 },
  personal: { maxWidth: 520, marginTop: 17, color: "#647772", fontSize: 13, lineHeight: 21 },
  sectionHeading: { marginBottom: 16 },
  sectionTitle: { color: "#263D3A", fontSize: 21, fontWeight: "600" },
  sectionNote: { marginTop: 6, color: "#78847F", fontSize: 13, lineHeight: 20 },
  pathList: { gap: 10 },
  pathCard: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 15, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7EAE5" },
  pathMark: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  pathMarkText: { color: "#42635F", fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
  pathCopy: { flex: 1 },
  pathTitle: { color: "#293D3A", fontSize: 15, fontWeight: "600" },
  pathDetail: { marginTop: 4, color: "#78837F", fontSize: 12, lineHeight: 18 },
  chevron: { color: "#82918B", fontSize: 23, paddingHorizontal: 5 },
  pressed: { opacity: 0.8 },
  featureCard: { marginTop: 25, padding: 21, borderRadius: 17, backgroundColor: "#EEEFF8", borderColor: "#E2E3F0", borderWidth: 1 },
  featureEyebrow: { color: "#676D91", fontSize: 9, fontWeight: "700", letterSpacing: 1.4 },
  featureTitle: { maxWidth: 500, marginTop: 11, color: "#383C61", fontSize: 21, lineHeight: 28, fontWeight: "600" },
  featureText: { maxWidth: 520, marginTop: 8, color: "#686D89", fontSize: 13, lineHeight: 20 },
  featureAction: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 9, marginTop: 15, paddingVertical: 8 },
  featureActionText: { color: "#4E587F", fontSize: 13, fontWeight: "600" },
  featureArrow: { color: "#4E587F", fontSize: 16 },
  footer: { marginTop: 36, paddingTop: 19, borderTopWidth: 1, borderTopColor: "#E5E9E4" },
  footerTitle: { color: "#435750", fontSize: 13, fontWeight: "600" },
  footerText: { maxWidth: 620, marginTop: 7, color: "#7B8781", fontSize: 12, lineHeight: 19 },
  aboutLink: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginTop: 10, gap: 12 },
  aboutLinkText: { color: "#537670", fontSize: 12, fontWeight: "600" },
});
