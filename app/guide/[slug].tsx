import { Link } from "../../src/components/AppLink";
import { Pressable, Text, View } from "../../src/components/Ui";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, Share, StyleSheet } from "react-native";
import references from "../../content/references.json";
import { AppPage, Card, DraftNotice, PageHeading } from "../../src/components/AppPage";
import { getGuide, guides } from "../../src/content/guides";
import { GuideList } from "../../src/components/GuideList";
import { SaveGuideButton } from "../../src/features/saved-guides/SaveGuideButton";
import { useAccessibility } from "../../src/features/accessibility/AccessibilityProvider";
import { useReadingSession } from "../../src/features/reading-session/ReadingSessionProvider";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export default function GuideScreen() {
  const { slug: routeSlug } = useLocalSearchParams<{ slug: string }>();
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  const { settings } = useAccessibility();
  const guide = getGuide(slug);
  const sectionCount = guide?.sections.length ?? 0;
  const reading = useReadingSession(slug ?? "", sectionCount, settings.simplifiedReading);
  const [shareMessage, setShareMessage] = useState("");
  const [speechMessage, setSpeechMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingOptionsOpen, setReadingOptionsOpen] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setShareMessage("");
    setSpeechMessage("");
    setIsSpeaking(false);
    speechRef.current = null;
  }, [slug, reading.pageIndex, reading.oneAtATime]);
  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  if (!guide) return <AppPage><Link href="/learn" asChild><Pressable accessibilityRole="link" style={styles.backLink}><Text style={styles.backLinkText}>← Back to guides</Text></Pressable></Link><PageHeading eyebrow="Guide not found" title="This guide is unavailable." summary="Return to the guide library to choose another page." /><Link href="/learn">Browse guides</Link></AppPage>;

  const sources = references.sources.filter((source) => guide.sourceIds.includes(source.id));
  const wordCount = guide.sections.reduce((total, section) => total + [...(section.paragraphs ?? []), ...(section.bullets ?? []), section.heading].join(" ").split(/\s+/).filter(Boolean).length, 0);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const relatedSlugs = (guide.slug === "understanding-dissection" ? ["tests-and-terms", "follow-up-questions"] : guide.slug === "tests-and-terms" ? ["understanding-dissection", "follow-up-questions"] : guide.slug === "recovery-and-quality-of-life" ? ["follow-up-questions", "supporting-someone"] : guide.slug === "supporting-someone" ? ["recovery-and-quality-of-life", "follow-up-questions"] : ["recovery-and-quality-of-life", "follow-up-questions"]) as string[];
  const visibleSections = reading.oneAtATime ? [guide.sections[reading.pageIndex]].filter(Boolean) : guide.sections;
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") { setSpeechMessage("Read-aloud is not available in this browser. You can use Text and display to change text size."); return; }
    if (isSpeaking) { speechRef.current = null; window.speechSynthesis.cancel(); setIsSpeaking(false); setSpeechMessage("Read-aloud stopped."); return; }
    const spokenText = ["Draft information. Clinical and patient/carer reviews are not yet recorded. For personal care questions, ask your doctor.", guide.title, guide.summary, ...visibleSections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(". ");
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.onend = () => { if (speechRef.current !== utterance) return; setIsSpeaking(false); setSpeechMessage("Read-aloud finished."); };
    utterance.onerror = (event) => { if (speechRef.current !== utterance) return; setIsSpeaking(false); if (!["canceled", "interrupted"].includes(event.error)) setSpeechMessage("Read-aloud could not start. You can use Text and display to change text size."); };
    speechRef.current = utterance;
    setIsSpeaking(true);
    setSpeechMessage("Read-aloud requested.");
    try { window.speechSynthesis.speak(utterance); } catch { setIsSpeaking(false); setSpeechMessage("Read-aloud could not start. You can use Text and display to change text size."); }
  };

  return <AppPage>
    <Link href="/learn" asChild><Pressable accessibilityRole="link" style={styles.backLink}><Text style={styles.backLinkText}>← Back to guides</Text></Pressable></Link>
    <PageHeading compact eyebrow="English guide · general information" title={guide.title} summary={`${guide.summary} About ${readingMinutes} min read.`} />
    <DraftNotice compact />

    <View style={styles.paceToolbar}>
      {Platform.OS === "web" ? <Pressable accessibilityRole="button" accessibilityState={{ busy: isSpeaking }} onPress={toggleSpeech} style={styles.actionButton}><Text style={styles.actionText}>{isSpeaking ? "Stop reading aloud" : reading.oneAtATime ? "Read section aloud" : "Read guide aloud"}</Text></Pressable> : null}
      {speechMessage ? <Text accessibilityLiveRegion="polite" style={styles.paceHint}>{speechMessage}</Text> : null}
      {guide.sections.length > 1 ? <>
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Read one section at a time" accessibilityState={{ checked: reading.oneAtATime }} onPress={() => reading.setOneAtATime(!reading.oneAtATime)} style={styles.paceOption}>
        <View style={[styles.checkbox, reading.oneAtATime && styles.checked]}>{reading.oneAtATime ? <Text style={styles.check}>✓</Text> : null}</View>
        <Text style={styles.paceLabel}>Read one section at a time</Text>
      </Pressable>
      {reading.oneAtATime ? <View style={styles.paging}>
        <Text accessibilityLiveRegion="polite" style={styles.progress}>Section {reading.pageIndex + 1} of {guide.sections.length}: {guide.sections[reading.pageIndex]?.heading}</Text>
        <View style={styles.pagingButtons}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous section" accessibilityState={{ disabled: reading.pageIndex === 0 }} disabled={reading.pageIndex === 0} onPress={() => reading.setPageIndex(reading.pageIndex - 1)} style={({ pressed }) => [styles.pagingButton, reading.pageIndex === 0 && styles.disabledButton, pressed && reading.pageIndex > 0 && styles.pressed]}><Text style={styles.pagingButtonText}>Previous</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Next section" accessibilityState={{ disabled: reading.pageIndex === guide.sections.length - 1 }} disabled={reading.pageIndex === guide.sections.length - 1} onPress={() => reading.setPageIndex(reading.pageIndex + 1)} style={({ pressed }) => [styles.pagingButton, reading.pageIndex === guide.sections.length - 1 && styles.disabledButton, pressed && reading.pageIndex < guide.sections.length - 1 && styles.pressed]}><Text style={styles.pagingButtonText}>Next</Text></Pressable>
        </View>
      </View> : null}
      </> : null}
    </View>

    {visibleSections.map((section) => { const sectionSources = references.sources.filter((source) => section.sourceIds?.includes(source.id)); return <Card key={section.heading} title={section.heading}>
      {section.paragraphs?.map((paragraph, index) => <Text key={index} style={[styles.body, settings.spacing === "roomy" && styles.roomyBody]}>{paragraph}</Text>)}
      {section.bullets?.map((bullet, index) => <View key={index} style={[styles.bulletRow, settings.spacing === "roomy" && styles.roomyBulletRow]}><Text accessibilityElementsHidden style={styles.bullet}>•</Text><Text style={[styles.bulletText, settings.spacing === "roomy" && styles.roomyBulletText]}>{bullet}</Text></View>)}
      {sectionSources.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Open source for ${section.heading}: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.inlineSource}><Text style={styles.inlineSourceText}>Read source: {source.title}</Text></Pressable>)}
    </Card>; })}

    <Card title="More reading options">
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: readingOptionsOpen }} aria-expanded={readingOptionsOpen} onPress={() => setReadingOptionsOpen((open) => !open)} style={styles.disclosureButton}>
        <Text style={styles.settingLinkText}>About reading pace and text size</Text><Text aria-hidden style={styles.disclosureMark}>{readingOptionsOpen ? "−" : "+"}</Text>
      </Pressable>
      {readingOptionsOpen ? <View>
        <Text style={styles.paceHint}>Your place is kept as you move between these pages. Closing or reloading starts from the first section.</Text>
        {reading.modeOverride === null
          ? <Text style={styles.paceHint}>This guide follows Simplified reading in Text and display ({settings.simplifiedReading ? "on" : "off"}). Your place stays here when the pace changes.</Text>
          : <><Text style={styles.paceHint}>This guide has its own reading pace ({reading.oneAtATime ? "one section at a time" : "all sections"}). It lasts only while the app is open.</Text><Pressable accessibilityRole="button" onPress={reading.useGlobalMode} style={styles.settingLink}><Text style={styles.settingLinkText}>Use the Text and display pace</Text></Pressable></>}
        <Link href="/accessibility" asChild><Pressable accessibilityRole="link" style={styles.settingLink}><Text style={styles.settingLinkText}>Text and display →</Text></Pressable></Link>
      </View> : null}
    </Card>

    <Card title="More ways to use this guide">
      <SaveGuideButton slug={guide.slug} />
      <View style={styles.pageActions}>
        {Platform.OS === "web" ? <Pressable accessibilityRole="button" onPress={() => globalThis.print?.()} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}><Text style={styles.actionText}>Print this guide</Text></Pressable> : null}
        <Pressable accessibilityRole="button" onPress={async () => {
          try {
            const url = Platform.OS === "web" && typeof window !== "undefined" ? window.location.href : `VAD & Carotid Support: ${guide.title}`;
            if (Platform.OS === "web" && globalThis.navigator?.clipboard) { await globalThis.navigator.clipboard.writeText(url); setShareMessage("Guide link copied. Share it only with people you choose."); }
            else if (Platform.OS !== "web") await Share.share({ title: guide.title, message: `${guide.title}\n${url}` });
            else setShareMessage("Copying is unavailable in this browser. You can use the page address to share this guide.");
          } catch { setShareMessage("The guide link could not be copied. You can use the page address to share this guide."); }
        }} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}><Text style={styles.actionText}>{Platform.OS === "web" ? "Copy guide link" : "Share this guide"}</Text></Pressable>
      </View>
      {shareMessage ? <Text accessibilityLiveRegion="polite" style={styles.shareMessage}>{shareMessage}</Text> : null}
      <Text style={[styles.nextStep, styles.nextStepIntro]}>If this guide raises a question, add it to a private appointment sheet. You choose what to include; nothing is sent to this project.</Text>
      <Link href={{ pathname: "/appointments", params: { guide: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.nextStepLink, pressed && styles.pressed]}><Text style={styles.nextStepLinkText}>Start with questions from this guide →</Text></Pressable></Link>
      {guide.slug === "supporting-someone" || guide.slug === "with-stroke" || guide.slug === "recovery-and-quality-of-life" ? <><Text style={[styles.nextStep, styles.secondaryNextStep]}>If another person is supporting you, you can also choose preferences to review together. You decide what to share.</Text><Link href={{ pathname: "/support-preferences", params: { guide: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.nextStepLink, pressed && styles.pressed]}><Text style={styles.nextStepLinkText}>Start a support preferences sheet →</Text></Pressable></Link></> : null}
    </Card>

    <Card title="Sources and review for this draft">
      <Text style={styles.meta}>Clinical review: {guide.clinicalReview.status === "not-reviewed" ? "not recorded" : "approved"} · Patient/carer review: {guide.usabilityReview.status === "not-reviewed" ? "not recorded" : "approved"} · Translation review: {guide.translationReview.status === "not-applicable" ? "English original" : guide.translationReview.status === "not-reviewed" ? "not recorded" : "approved"} · Review date: {guide.reviewedOn ?? "not recorded"}</Text>
      {sources.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Open source: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.source}><Text style={styles.sourceTitle}>{source.title}{source.year ? ` (${source.year})` : ""}</Text><Text style={styles.sourceLimit}>Source record checked {source.checked_on}. {source.limits}</Text></Pressable>)}
    </Card>
    <Card title="Continue with a related guide"><GuideList slugs={relatedSlugs} /></Card>
  </AppPage>;
}

const styles = StyleSheet.create({
  backLink: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center" }, backLinkText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" },
  body: { color: "#435A5A", fontSize: 15, lineHeight: 24, marginTop: 7 }, roomyBody: { lineHeight: 29, marginTop: 11 },
  bulletRow: { flexDirection: "row", gap: 8, marginTop: 9 }, roomyBulletRow: { marginTop: 14, gap: 11 }, bullet: { color: "#537670", fontSize: 15, lineHeight: 24 }, bulletText: { flex: 1, color: "#576762", fontSize: 15, lineHeight: 24 }, roomyBulletText: { lineHeight: 29 },
  paceToolbar: { paddingHorizontal: 6, paddingTop: 4, paddingBottom: 9, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#DDE7E3" }, paceOption: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10 }, checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: "#71817A", borderRadius: 5, alignItems: "center", justifyContent: "center" }, checked: { backgroundColor: "#195B58", borderColor: "#195B58" }, check: { color: "#FFFFFF", fontSize: 14, lineHeight: 18, fontWeight: "800" }, paceLabel: { color: "#183B3B", fontSize: 15, lineHeight: 22, fontWeight: "700" }, paceHint: { color: "#596861", fontSize: 13, lineHeight: 19, marginTop: 4 }, settingLink: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingRight: 8 }, settingLinkText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "700" }, disclosureButton: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, disclosureMark: { color: "#195B58", fontSize: 20, fontWeight: "700" },
  paging: { marginTop: 3, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, progress: { color: "#435A5A", fontSize: 13, lineHeight: 20 }, pagingButtons: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 }, pagingButton: { minHeight: 44, minWidth: 96, paddingHorizontal: 16, borderRadius: 9, borderWidth: 1, borderColor: "#26736E", alignItems: "center", justifyContent: "center" }, pagingButtonText: { color: "#195B58", fontSize: 14, fontWeight: "700" }, disabledButton: { borderColor: "#DCE7E4", opacity: 0.55 }, pressed: { opacity: 0.7 },
  inlineSource: { paddingTop: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, inlineSourceText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "600" }, pageActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }, actionButton: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 14, marginBottom: 6, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: "#FFFFFF" }, actionText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "700" }, shareMessage: { color: "#52635C", fontSize: 13, lineHeight: 20, marginTop: 7 },
  nextStep: { color: "#576762", fontSize: 15, lineHeight: 24 }, nextStepIntro: { marginTop: 10 }, secondaryNextStep: { marginTop: 12 }, nextStepLink: { display: "flex", minHeight: 44, alignSelf: "flex-start", justifyContent: "center", marginTop: 4 }, nextStepLinkText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" },
  meta: { color: "#596861", fontSize: 12, lineHeight: 19, marginBottom: 8 }, source: { paddingVertical: 11, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, sourceTitle: { color: "#537670", fontSize: 14, lineHeight: 20, fontWeight: "600" }, sourceLimit: { color: "#596861", marginTop: 4, fontSize: 12, lineHeight: 18 },
});
