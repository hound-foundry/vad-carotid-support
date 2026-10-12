import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AppPage, palette } from "../src/components/AppPage";

const routes = [
  { href: "/guide/understanding-dissection" as const, title: "Understand the diagnosis", detail: "Start with clear language about carotid and vertebral artery dissection." },
  { href: "/with-stroke" as const, title: "Living with dissection and stroke", detail: "Find questions about recovery, communication and daily life." },
  { href: "/without-stroke" as const, title: "Dissection without diagnosed stroke", detail: "Explore follow-up and questions about what comes next." },
  { href: "/supporting-someone" as const, title: "Supporting someone", detail: "Practical, patient-led ways to help family and friends." },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 880;
  return <AppPage wide>
    <View style={[styles.hero, desktop && styles.heroDesktop]}>
      <View style={[styles.heroCopy, desktop && styles.heroCopyDesktop]}>
        <View style={styles.kickerRow}><View style={styles.kickerDot} /><Text style={styles.kicker}>A SUPPORTIVE PLACE TO BEGIN</Text></View>
        <Text accessibilityRole="header" style={styles.heroTitle}>Start with the question you have today.</Text>
        <Text style={styles.heroBody}>Free, open-source information and appointment preparation for adults affected by vertebral or carotid artery dissection, and the people beside them.</Text>
        <Text style={styles.heroFoot}>Take one step. Come back when you’re ready for another.</Text>
      </View>
      <View style={styles.routeCard}>
        <View style={styles.routeCardHead}><Text style={styles.routeTitle}>Pick up where you are</Text><Text style={styles.routeCaption}>Choose a starting point</Text></View>
        <View style={styles.routeList}>
          <View pointerEvents="none" style={styles.routeSpine} />
          {routes.map((route) => <Link key={route.href} href={route.href} asChild><Pressable accessibilityRole="link" style={styles.routeLink}>
            <View style={styles.routeItem}><View style={styles.branch}><View style={styles.routeDot} /></View>
              <View style={styles.routeCopy}><Text style={styles.routeItemTitle}>{route.title}</Text><Text style={styles.routeDetail}>{route.detail}</Text></View>
              <Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.routeArrow}>→</Text>
            </View>
          </Pressable></Link>)}
        </View>
      </View>
    </View>

    <View style={[styles.tools, desktop && styles.toolsDesktop]}>
      <ActionCard href="/appointments" label="BEFORE YOUR NEXT APPOINTMENT" title="Make room for your questions" detail="Choose prompts, add private notes, and decide whether to save or export." action="Build an appointment sheet" />
      <ActionCard href="/resources" label="TRUSTED LINKS" title="Explore helpful resources" detail="Find patient, carer and professional reading from external publishers." action="Browse the directory" />
    </View>

    <View style={styles.footer}>
      <View style={styles.footerRule} />
      <Text style={styles.footerText}>A development preview. Guides have not yet received clinical or patient/carer review. This site does not replace a person’s doctor.</Text>
      <Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.aboutLink}><Text style={styles.aboutText}>About, privacy and review process</Text><Text style={styles.aboutArrow}>→</Text></Pressable></Link>
    </View>
  </AppPage>;
}

function ActionCard({ href, label, title, detail, action }: { href: "/appointments" | "/resources"; label: string; title: string; detail: string; action: string }) {
  return <Link href={href} asChild><Pressable accessibilityRole="link" style={styles.actionLink}><View style={styles.actionCard}>
    <Text style={styles.actionLabel}>{label}</Text><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text><View style={styles.actionBottom}><Text style={styles.actionText}>{action}</Text><Text style={styles.actionArrow}>→</Text></View>
  </View></Pressable></Link>;
}

const styles = StyleSheet.create({
  hero: { marginTop: 28, gap: 22 }, heroDesktop: { flexDirection: "row", alignItems: "stretch", gap: 28 },
  heroCopy: { padding: 22, borderRadius: 21, backgroundColor: palette.mint, borderWidth: 1, borderColor: "#D0E2DD" }, heroCopyDesktop: { flex: 0.92, justifyContent: "center", paddingHorizontal: 31, paddingVertical: 34 },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 8 }, kicker: { color: palette.tealDark, fontSize: 10, letterSpacing: 1.45, fontWeight: "800" }, kickerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.teal },
  heroTitle: { maxWidth: 540, marginTop: 16, color: palette.ink, fontFamily: "Georgia", fontSize: 37, lineHeight: 45, fontWeight: "600" }, heroBody: { maxWidth: 520, marginTop: 14, color: palette.text, fontSize: 16, lineHeight: 26 }, heroFoot: { marginTop: 20, color: palette.tealDark, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  routeCard: { flex: 1, minWidth: 0, paddingHorizontal: 21, paddingTop: 20, paddingBottom: 12, borderRadius: 21, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, routeCardHead: { paddingBottom: 9 }, routeTitle: { color: palette.ink, fontSize: 17, lineHeight: 23, fontWeight: "800" }, routeCaption: { marginTop: 3, color: palette.muted, fontSize: 12, lineHeight: 18 },
  routeList: { position: "relative" }, routeSpine: { position: "absolute", top: 14, bottom: 30, left: 8, width: 2, backgroundColor: "#B8D4CE" },
  routeLink: { display: "flex" }, routeItem: { display: "flex", position: "relative", minHeight: 76, flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingLeft: 37, paddingRight: 3, borderTopWidth: 1, borderTopColor: "#EDF2F0", gap: 9 },
  branch: { position: "absolute", left: 0, top: 0, bottom: 0, width: 25, justifyContent: "center" }, routeDot: { width: 12, height: 12, marginLeft: 3, borderRadius: 6, backgroundColor: palette.white, borderColor: palette.teal, borderWidth: 2 },
  routeCopy: { flex: 1 }, routeItemTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" }, routeDetail: { marginTop: 3, color: palette.muted, fontSize: 12, lineHeight: 17 }, routeArrow: { color: palette.teal, fontSize: 16, paddingHorizontal: 4 },
  tools: { marginTop: 20, gap: 13 }, toolsDesktop: { flexDirection: "row" },
  actionLink: { display: "flex", flex: 1 }, actionCard: { display: "flex", flex: 1, padding: 20, borderWidth: 1, borderColor: palette.line, borderRadius: 16, backgroundColor: palette.white }, actionLabel: { color: palette.gold, fontSize: 10, letterSpacing: 1.15, lineHeight: 15, fontWeight: "800" }, actionTitle: { marginTop: 8, color: palette.ink, fontSize: 17, lineHeight: 23, fontWeight: "800" }, actionDetail: { minHeight: 44, marginTop: 6, color: palette.text, fontSize: 13, lineHeight: 20 }, actionBottom: { display: "flex", minHeight: 32, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 8 }, actionText: { color: palette.tealDark, fontSize: 13, fontWeight: "800" }, actionArrow: { color: palette.teal, fontSize: 17 },
  footer: { marginTop: 27 }, footerRule: { height: 1, backgroundColor: palette.line }, footerText: { marginTop: 14, color: palette.muted, fontSize: 12, lineHeight: 19 }, aboutLink: { display: "flex", minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" }, aboutText: { color: palette.tealDark, fontSize: 13, fontWeight: "700" }, aboutArrow: { color: palette.teal, fontSize: 16 },
  pressed: { opacity: 0.75 },
});
