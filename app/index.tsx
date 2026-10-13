import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AppPage, palette } from "../src/components/AppPage";

const routes = [
  { href: "/guide/understanding-dissection" as const, title: "I’m new to this or want the basics", detail: "Start with a plain-language introduction to carotid and vertebral artery dissection." },
  { href: "/with-stroke" as const, title: "A dissection happened alongside a stroke", detail: "Explore draft guides about recovery, communication and daily life." },
  { href: "/without-stroke" as const, title: "I have a dissection without a diagnosed stroke", detail: "Explore draft guides about follow-up and questions about what comes next." },
  { href: "/supporting-someone" as const, title: "I’m supporting someone", detail: "Find patient-led ideas for family, friends and carers." },
  { href: "/learn" as const, title: "I’m here to learn", detail: "Browse short guides, unfamiliar terms and helpful resources." },
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
        <Text style={styles.heroTrust}>No account · no analytics · no backend health-data store</Text>
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

    <View style={styles.quickStart}>
      <Text accessibilityRole="header" aria-level={2} style={styles.quickTitle}>What do you need right now?</Text>
      <Text style={styles.quickIntro}>Choose one small next step. You can come back to the rest later.</Text>
      <View style={styles.quickLinks}>
        <QuickLink href="/guide/understanding-dissection" title="Understand the words" />
        <QuickLink href="/glossary" title="Look up a term" />
        <QuickLink href="/appointments" title="Choose an appointment question" />
        <QuickLink href="/support-preferences" title="Tell people what helps" />
        <QuickLink href="/personal-card" title="Vision or communication support" />
        <QuickLink href="/supporting-someone" title="Find carer guidance" />
        <QuickLink href="/urgent-help" title="I need urgent help" />
        <QuickLink href="/saved-guides" title="Open saved guides" />
        <QuickLink href="/milestone-card" title="Make a milestone card" />
      </View>
    </View>

    <View style={styles.boundaryCard}>
      <View style={styles.boundaryCopy}><Text accessibilityRole="header" aria-level={2} style={styles.boundaryTitle}>What this app can and cannot do</Text><Text style={styles.boundaryBody}>It can help you understand words, prepare questions, describe access needs and find reviewed external resources. It cannot diagnose, interpret a scan, choose medicines, predict your recovery or replace your doctor.</Text></View>
      <Link href="/urgent-help" asChild><Pressable accessibilityRole="link" style={styles.boundaryLink}><Text style={styles.boundaryLinkText}>Sudden stroke-like symptoms? Get urgent help →</Text></Pressable></Link>
    </View>

    <Link href="/guide/recovery-and-quality-of-life" asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.featuredLink, pressed && styles.pressed]}>
      <View style={styles.featured}>
        <View style={styles.featuredCopy}>
          <Text style={styles.featuredLabel}>A GUIDE FOR TODAY</Text>
          <Text accessibilityRole="header" aria-level={2} style={styles.featuredTitle}>Recovery, fatigue and quality of life</Text>
          <Text style={styles.featuredBody}>Make room for energy limits, confidence, mood and changes other people may not see. It also introduces spoon theory as a metaphor some people find useful—not a test or a measure.</Text>
        </View>
        <Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.featuredArrow}>→</Text>
      </View>
    </Pressable></Link>

    <View style={[styles.tools, desktop && styles.toolsDesktop]}>
      <ActionCard href="/appointments" label="BEFORE YOUR NEXT APPOINTMENT" title="Make room for your questions" detail="Choose prompts, add private notes, and decide whether to save or export." action="Build an appointment sheet" />
      <ActionCard href="/support-preferences" label="FOR THE PEOPLE AROUND YOU" title="Tell people what helps" detail="Choose support preferences and review a shareable sheet before exporting." action="Make a support sheet" />
      <ActionCard href="/resources" label="TRUSTED LINKS" title="Explore helpful resources" detail="Find patient, carer and professional reading from external publishers." action="Browse the directory" />
      <ActionCard href="/personal-card" label="COMMUNICATION SUPPORT" title="Make a personal card" detail="Write down access needs, what helps and optional health information for people you choose." action="Create a personal card" />
    </View>

    <View style={styles.footer}>
      <View style={styles.footerRule} />
      <Text style={styles.footerText}>A development preview. Guides have not yet received clinical or patient/carer review. This site does not replace a person’s doctor.</Text>
      <Link href="/about" asChild><Pressable accessibilityRole="link" style={styles.aboutLink}><Text style={styles.aboutText}>About, privacy and review process</Text><Text style={styles.aboutArrow}>→</Text></Pressable></Link>
    </View>
  </AppPage>;
}

function ActionCard({ href, label, title, detail, action }: { href: "/appointments" | "/support-preferences" | "/resources" | "/personal-card"; label: string; title: string; detail: string; action: string }) {
  return <Link href={href as any} asChild><Pressable accessibilityRole="link" style={styles.actionLink}><View style={styles.actionCard}>
    <Text style={styles.actionLabel}>{label}</Text><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text><View style={styles.actionBottom}><Text style={styles.actionText}>{action}</Text><Text style={styles.actionArrow}>→</Text></View>
  </View></Pressable></Link>;
}

function QuickLink({ href, title }: { href: "/glossary" | "/appointments" | "/supporting-someone" | "/saved-guides" | "/personal-card" | "/milestone-card" | "/urgent-help" | "/guide/understanding-dissection" | "/support-preferences"; title: string }) {
  return <Link href={href as any} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.quickLink, pressed && styles.quickPressed]}><Text style={styles.quickLinkText}>{title} <Text accessibilityElementsHidden>→</Text></Text></Pressable></Link>;
}

const styles = StyleSheet.create({
  hero: { marginTop: 28, gap: 22 }, heroDesktop: { flexDirection: "row", alignItems: "stretch", gap: 28 },
  heroCopy: { padding: 22, borderRadius: 21, backgroundColor: palette.mint, borderWidth: 1, borderColor: "#D0E2DD" }, heroCopyDesktop: { flex: 0.92, justifyContent: "center", paddingHorizontal: 31, paddingVertical: 34 },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 8 }, kicker: { color: palette.tealDark, fontSize: 10, letterSpacing: 1.45, fontWeight: "800" }, kickerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.teal },
  heroTitle: { maxWidth: 540, marginTop: 16, color: palette.ink, fontFamily: "Georgia", fontSize: 37, lineHeight: 45, fontWeight: "600" }, heroBody: { maxWidth: 520, marginTop: 14, color: palette.text, fontSize: 16, lineHeight: 26 }, heroTrust: { marginTop: 14, color: palette.tealDark, fontSize: 12, lineHeight: 19, fontWeight: "700" }, heroFoot: { marginTop: 20, color: palette.tealDark, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  routeCard: { flex: 1, minWidth: 0, paddingHorizontal: 21, paddingTop: 20, paddingBottom: 12, borderRadius: 21, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, routeCardHead: { paddingBottom: 9 }, routeTitle: { color: palette.ink, fontSize: 17, lineHeight: 23, fontWeight: "800" }, routeCaption: { marginTop: 3, color: palette.muted, fontSize: 12, lineHeight: 18 },
  routeList: { position: "relative" }, routeSpine: { position: "absolute", top: 14, bottom: 30, left: 8, width: 2, backgroundColor: "#B8D4CE" },
  routeLink: { display: "flex" }, routeItem: { display: "flex", position: "relative", minHeight: 76, flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingLeft: 37, paddingRight: 3, borderTopWidth: 1, borderTopColor: "#EDF2F0", gap: 9 },
  branch: { position: "absolute", left: 0, top: 0, bottom: 0, width: 25, justifyContent: "center" }, routeDot: { width: 12, height: 12, marginLeft: 3, borderRadius: 6, backgroundColor: palette.white, borderColor: palette.teal, borderWidth: 2 },
  routeCopy: { flex: 1 }, routeItemTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" }, routeDetail: { marginTop: 3, color: palette.muted, fontSize: 12, lineHeight: 17 }, routeArrow: { color: palette.teal, fontSize: 16, paddingHorizontal: 4 },
  tools: { marginTop: 20, gap: 13 }, toolsDesktop: { flexDirection: "row" },
  quickStart: { marginTop: 18, padding: 18, borderRadius: 15, backgroundColor: palette.white, borderColor: palette.line, borderWidth: 1 }, quickTitle: { color: palette.ink, fontSize: 16, lineHeight: 23, fontWeight: "800" }, quickIntro: { marginTop: 3, color: palette.muted, fontSize: 13, lineHeight: 20 }, quickLinks: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 11 }, quickLink: { minHeight: 44, justifyContent: "center", paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: "#FFFFFF" }, quickLinkText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "700" }, quickPressed: { opacity: 0.72, backgroundColor: palette.mint },
  boundaryCard: { marginTop: 14, padding: 18, borderRadius: 15, backgroundColor: "#FFF9F1", borderColor: "#EAD9BD", borderWidth: 1 }, boundaryCopy: { flex: 1 }, boundaryTitle: { color: palette.ink, fontSize: 16, lineHeight: 23, fontWeight: "800" }, boundaryBody: { marginTop: 5, color: palette.text, fontSize: 13, lineHeight: 20 }, boundaryLink: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", marginTop: 6 }, boundaryLinkText: { color: palette.tealDark, fontSize: 13, lineHeight: 20, fontWeight: "800" },
  featuredLink: { display: "flex", marginTop: 14 }, featured: { display: "flex", flexDirection: "row", alignItems: "center", gap: 16, padding: 20, borderRadius: 16, backgroundColor: "#F2EEE3", borderWidth: 1, borderColor: "#E4DCC9" }, featuredCopy: { flex: 1 }, featuredLabel: { color: palette.gold, fontSize: 10, lineHeight: 15, letterSpacing: 1.2, fontWeight: "800" }, featuredTitle: { marginTop: 7, color: palette.ink, fontSize: 19, lineHeight: 25, fontWeight: "800" }, featuredBody: { marginTop: 6, color: palette.text, fontSize: 13, lineHeight: 20 }, featuredArrow: { color: palette.teal, fontSize: 22, paddingHorizontal: 2 },
  actionLink: { display: "flex", flex: 1 }, actionCard: { display: "flex", flex: 1, padding: 20, borderWidth: 1, borderColor: palette.line, borderRadius: 16, backgroundColor: palette.white }, actionLabel: { color: palette.gold, fontSize: 10, letterSpacing: 1.15, lineHeight: 15, fontWeight: "800" }, actionTitle: { marginTop: 8, color: palette.ink, fontSize: 17, lineHeight: 23, fontWeight: "800" }, actionDetail: { minHeight: 44, marginTop: 6, color: palette.text, fontSize: 13, lineHeight: 20 }, actionBottom: { display: "flex", minHeight: 32, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 8 }, actionText: { color: palette.tealDark, fontSize: 13, fontWeight: "800" }, actionArrow: { color: palette.teal, fontSize: 17 },
  footer: { marginTop: 27 }, footerRule: { height: 1, backgroundColor: palette.line }, footerText: { marginTop: 14, color: palette.muted, fontSize: 12, lineHeight: 19 }, aboutLink: { display: "flex", minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" }, aboutText: { color: palette.tealDark, fontSize: 13, fontWeight: "700" }, aboutArrow: { color: palette.teal, fontSize: 16 },
  pressed: { opacity: 0.75 },
});
