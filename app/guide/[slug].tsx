import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, Pressable, Share, StyleSheet, Text, View } from "react-native";
import references from "../../content/references.json";
import { AppPage, BackHome, Card, DraftNotice, PageHeading } from "../../src/components/AppPage";
import { getGuide, guides } from "../../src/content/guides";
import { GuideList } from "../../src/components/GuideList";
import { SaveGuideButton } from "../../src/features/saved-guides/SaveGuideButton";
import { useAccessibility } from "../../src/features/accessibility/AccessibilityProvider";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export default function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { settings } = useAccessibility();
  const [oneAtATime, setOneAtATime] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [largeText, setLargeText] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); setOneAtATime(settings.simplifiedReading); setSectionIndex(0); setLargeText(settings.simplifiedReading); setShareMessage(""); setIsSpeaking(false); speechRef.current = null; }, [slug, settings.simplifiedReading]);
  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);
  const guide = getGuide(slug);
  if (!guide) return <AppPage><BackHome /><PageHeading eyebrow="Guide not found" title="This guide is unavailable." summary="Return to the guide library to choose another page." /><Link href="/learn">Browse guides</Link></AppPage>;
  const sources = references.sources.filter((source) => guide.sourceIds.includes(source.id));
  const wordCount = guide.sections.reduce((total, section) => total + [...(section.paragraphs ?? []), ...(section.bullets ?? []), section.heading].join(" ").split(/\s+/).filter(Boolean).length, 0);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const relatedSlugs = (guide.slug === "understanding-dissection" ? ["tests-and-terms", "follow-up-questions"] : guide.slug === "tests-and-terms" ? ["understanding-dissection", "follow-up-questions"] : guide.slug === "recovery-and-quality-of-life" ? ["follow-up-questions", "supporting-someone"] : guide.slug === "supporting-someone" ? ["recovery-and-quality-of-life", "follow-up-questions"] : ["recovery-and-quality-of-life", "follow-up-questions"]) as string[];
  const simplified = settings.simplifiedReading;
  const visibleSections = oneAtATime || simplified ? [guide.sections[sectionIndex]].filter(Boolean) : guide.sections;
  return <AppPage>
    <BackHome />
    <PageHeading eyebrow="English guide · general information" title={guide.title} summary={`${guide.summary} About ${readingMinutes} min read; you can take one section at a time.`} />
    <DraftNotice />
    <SaveGuideButton slug={guide.slug} />
    <View style={styles.pageActions}>
      {Platform.OS === "web" ? <Pressable accessibilityRole="button" onPress={() => globalThis.print?.()} style={({ pressed }) => [styles.printButton, pressed && styles.pressed]}><Text style={styles.printButtonText}>Print this guide</Text></Pressable> : null}
      {Platform.OS === "web" ? <Pressable accessibilityRole="button" accessibilityState={{ busy: isSpeaking }} onPress={() => {
        if (typeof window === "undefined" || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") { setShareMessage("Read-aloud is not available in this browser. You can use the larger text option instead."); return; }
        if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
        const spokenText = [guide.title, guide.summary, ...guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(". ");
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => { setIsSpeaking(false); setShareMessage("Read-aloud could not start. You can use the larger text option instead."); };
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }} style={({ pressed }) => [styles.printButton, pressed && styles.pressed]}><Text style={styles.printButtonText}>{isSpeaking ? "Stop reading aloud" : "Read guide aloud"}</Text></Pressable> : null}
      <Pressable accessibilityRole="button" onPress={async () => {
        try {
          const url = Platform.OS === "web" && typeof window !== "undefined" ? window.location.href : `VAD & Carotid Support: ${guide.title}`;
          if (Platform.OS === "web" && globalThis.navigator?.clipboard) {
            await globalThis.navigator.clipboard.writeText(url);
            setShareMessage("Guide link copied. Share it only with people you choose.");
          } else if (Platform.OS !== "web") {
            await Share.share({ title: guide.title, message: `${guide.title}\n${url}` });
          } else {
            setShareMessage("Copying is unavailable in this browser. You can use the page address to share this guide.");
          }
        } catch { setShareMessage("The guide link could not be copied. You can use the page address to share this guide."); }
      }} style={({ pressed }) => [styles.printButton, pressed && styles.pressed]}><Text style={styles.printButtonText}>{Platform.OS === "web" ? "Copy guide link" : "Share this guide"}</Text></Pressable>
    </View>
    {shareMessage ? <Text accessibilityLiveRegion="polite" style={styles.shareMessage}>{shareMessage}</Text> : null}
    <Card title="Make reading work for you">
      <Text style={styles.nextStep}>{simplified ? "Simplified reading is on: this guide shows one section at a time with larger text." : "If the page feels tiring to read, increase the text size. This setting applies only while this guide is open and is not saved."}</Text>
      <View accessibilityRole="radiogroup" aria-label="Guide text size" style={styles.textSizeChoices}>
        <Pressable accessibilityRole="radio" accessibilityState={{ selected: !largeText }} onPress={() => setLargeText(false)} style={({ pressed }) => [styles.textSizeButton, !largeText && styles.textSizeSelected, pressed && styles.pressed]}><Text style={[styles.textSizeLabel, !largeText && styles.textSizeSelectedLabel]}>Standard text</Text></Pressable>
        <Pressable accessibilityRole="radio" accessibilityState={{ selected: largeText }} onPress={() => setLargeText(true)} style={({ pressed }) => [styles.textSizeButton, largeText && styles.textSizeSelected, pressed && styles.pressed]}><Text style={[styles.textSizeLabel, largeText && styles.textSizeSelectedLabel]}>Larger text</Text></Pressable>
      </View>
      <Text style={styles.settingHint}>You can also pause, use one section at a time, or come back later.</Text>
    </Card>
    <Card title="Turn reading into a next step">
      <Text style={styles.nextStep}>If this guide raises a question, add it to a private appointment sheet. You choose what to include; nothing is sent to this project.</Text>
      <Link href={{ pathname: "/appointments", params: { guide: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.nextStepLink, pressed && styles.pressed]}><Text style={styles.nextStepLinkText}>Start with questions from this guide →</Text></Pressable></Link>
      {guide.slug === "supporting-someone" || guide.slug === "with-stroke" || guide.slug === "recovery-and-quality-of-life" ? <><Text style={[styles.nextStep, styles.secondaryNextStep]}>If another person is supporting you, you can also choose preferences to review together. You decide what to share.</Text><Link href={{ pathname: "/support-preferences", params: { guide: guide.slug } }} asChild><Pressable accessibilityRole="link" style={({ pressed }) => [styles.nextStepLink, pressed && styles.pressed]}><Text style={styles.nextStepLinkText}>Start a support preferences sheet →</Text></Pressable></Link></> : null}
    </Card>
    {guide.sections.length > 1 ? <Card title="Choose your reading pace">
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Read one section at a time" accessibilityState={{ checked: oneAtATime }} onPress={() => { setSectionIndex(0); setOneAtATime((current) => !current); }} style={styles.paceOption}>
        <View style={[styles.checkbox, oneAtATime && styles.checked]}>{oneAtATime ? <Text style={styles.check}>✓</Text> : null}</View>
        <Text style={styles.paceLabel}>Read one section at a time{simplified ? " (set by simplified reading)" : ""}</Text>
      </Pressable>
      <Text style={styles.paceHint}>All sections are shown by default. This option changes only how the guide is displayed; it does not save your place.</Text>
      {oneAtATime ? <View style={styles.paging}>
        <Text accessibilityLiveRegion="polite" style={styles.progress}>Section {sectionIndex + 1} of {guide.sections.length}: {guide.sections[sectionIndex]?.heading}</Text>
        <View style={styles.pagingButtons}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous section" accessibilityState={{ disabled: sectionIndex === 0 }} disabled={sectionIndex === 0} onPress={() => setSectionIndex((index) => Math.max(0, index - 1))} style={({ pressed }) => [styles.pagingButton, sectionIndex === 0 && styles.disabledButton, pressed && sectionIndex > 0 && styles.pressed]}><Text style={styles.pagingButtonText}>Previous</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Next section" accessibilityState={{ disabled: sectionIndex === guide.sections.length - 1 }} disabled={sectionIndex === guide.sections.length - 1} onPress={() => setSectionIndex((index) => Math.min(guide.sections.length - 1, index + 1))} style={({ pressed }) => [styles.pagingButton, sectionIndex === guide.sections.length - 1 && styles.disabledButton, pressed && sectionIndex < guide.sections.length - 1 && styles.pressed]}><Text style={styles.pagingButtonText}>Next</Text></Pressable>
        </View>
      </View> : null}
    </Card> : null}
    {visibleSections.map((section) => { const sectionSources = references.sources.filter((source) => section.sourceIds?.includes(source.id)); return <Card key={section.heading} title={section.heading}>
      {section.paragraphs?.map((paragraph, index) => <Text key={index} style={[styles.body, largeText && styles.largeBody]}>{paragraph}</Text>)}
      {section.bullets?.map((bullet, index) => <View key={index} style={styles.bulletRow}><Text accessibilityElementsHidden style={[styles.bullet, largeText && styles.largeBullet]}>•</Text><Text style={[styles.bulletText, largeText && styles.largeBody]}>{bullet}</Text></View>)}
      {sectionSources.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Open source for ${section.heading}: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.inlineSource}><Text style={[styles.inlineSourceText, largeText && styles.largeSource]}>Read source: {source.title}</Text></Pressable>)}
    </Card>; })}
    <Card title="Sources for this draft">
      <Text style={styles.meta}>Clinical review: {guide.clinicalReview.status} · Patient/carer review: {guide.usabilityReview.status} · Translation review: {guide.translationReview.status} · Review date: {guide.reviewedOn ?? "none"}</Text>
      {sources.map((source) => <Pressable key={source.id} accessibilityRole="link" accessibilityLabel={`Open source: ${source.title}`} onPress={() => void Linking.openURL(source.url)} style={styles.source}><Text style={styles.sourceTitle}>{source.title}{source.year ? ` (${source.year})` : ""}</Text><Text style={styles.sourceLimit}>Source record checked {source.checked_on}. {source.limits}</Text></Pressable>)}
    </Card>
    <Card title="Continue with a related guide"><GuideList slugs={relatedSlugs} /></Card>
  </AppPage>;
}

const styles = StyleSheet.create({ pageActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 7 }, shareMessage: { color: "#52635C", fontSize: 13, lineHeight: 20, marginBottom: 10 }, body: { color: "#435A5A", fontSize: 15, lineHeight: 24, marginTop: 7 }, largeBody: { fontSize: 18, lineHeight: 29 }, textSizeChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 11 }, textSizeButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: 13, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: "#FFFFFF" }, textSizeSelected: { backgroundColor: "#E4F0ED", borderColor: "#8FBAB0" }, textSizeLabel: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "700" }, textSizeSelectedLabel: { color: "#183B3B" }, settingHint: { color: "#596861", fontSize: 13, lineHeight: 20, marginTop: 9 }, bulletRow: { flexDirection: "row", gap: 8, marginTop: 9 }, bullet: { color: "#537670", fontSize: 15, lineHeight: 24 }, largeBullet: { fontSize: 18, lineHeight: 29 }, bulletText: { flex: 1, color: "#576762", fontSize: 15, lineHeight: 24 }, printButton: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 14, marginBottom: 14, borderWidth: 1, borderColor: "#CAD8D1", borderRadius: 9, backgroundColor: "#FFFFFF" }, printButtonText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "700" }, nextStep: { color: "#576762", fontSize: 15, lineHeight: 24 }, secondaryNextStep: { marginTop: 12 }, nextStepLink: { display: "flex", minHeight: 44, alignSelf: "flex-start", justifyContent: "center", marginTop: 8 }, nextStepLinkText: { color: "#195B58", fontSize: 14, lineHeight: 20, fontWeight: "700" }, paceOption: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10 }, checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: "#71817A", borderRadius: 5, alignItems: "center", justifyContent: "center" }, checked: { backgroundColor: "#195B58", borderColor: "#195B58" }, check: { color: "#FFFFFF", fontSize: 14, lineHeight: 18, fontWeight: "800" }, paceLabel: { color: "#183B3B", fontSize: 15, lineHeight: 22, fontWeight: "700" }, paceHint: { color: "#596861", fontSize: 13, lineHeight: 19, marginTop: 4 }, paging: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, progress: { color: "#435A5A", fontSize: 13, lineHeight: 20 }, pagingButtons: { flexDirection: "row", gap: 10, marginTop: 10 }, pagingButton: { minHeight: 44, minWidth: 96, paddingHorizontal: 16, borderRadius: 9, borderWidth: 1, borderColor: "#26736E", alignItems: "center", justifyContent: "center" }, pagingButtonText: { color: "#195B58", fontSize: 14, fontWeight: "700" }, disabledButton: { borderColor: "#DCE7E4", opacity: 0.55 }, pressed: { opacity: 0.7 }, inlineSource: { paddingTop: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, inlineSourceText: { color: "#195B58", fontSize: 13, lineHeight: 20, fontWeight: "600" }, largeSource: { fontSize: 15, lineHeight: 23 }, meta: { color: "#596861", fontSize: 12, lineHeight: 19, marginBottom: 8 }, source: { paddingVertical: 11, borderTopWidth: 1, borderTopColor: "#EDF0EC" }, sourceTitle: { color: "#537670", fontSize: 14, lineHeight: 20, fontWeight: "600" }, sourceLimit: { color: "#596861", marginTop: 4, fontSize: 12, lineHeight: 18 } });
