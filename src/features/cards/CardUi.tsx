import { useEffect,useId, useState, type ReactNode, type Ref } from "react";
import { Platform, StyleSheet, type View as NativeView } from "react-native";
import { Text, TextInput, Pressable, View } from "../../components/Ui";
import { palette } from "../../components/AppPage";
import { ConfirmDelete } from "../../components/ConfirmDelete";
import type { CardPresentation } from "./model.mjs";
import { exportCard, printCard, type CardFormat } from "./export";
import { cardDesign } from "./design.mjs";
import { cardArtwork } from "./artwork.mjs";
import { CardArtwork } from "./CardArtwork";
import { useAccessibility } from "../accessibility/AccessibilityProvider";
import { themeFor } from "../../components/theme";
import { CardCompositionPreview } from "./CardCompositionPreview";
import type { CardPhotoAsset, CardStep } from "./CardDraftProvider";
import { cardComposition } from "./composition";
import { sceneSvg } from "./scene-svg.mjs";

export function Button({ title, onPress, secondary = false, disabled = false, buttonRef }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean; buttonRef?: Ref<NativeView> }) {
  return <Pressable ref={buttonRef} accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && { opacity: 0.65 }]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}
export function Field({ id, label, value, onChange, multiline = false, limit = 240, hint }: { id: string; label: string; value: string; onChange: (value: string) => void; multiline?: boolean; limit?: number; hint?: string }) {
  return <View style={styles.field}><Text nativeID={id + "-label"} style={styles.label}>{label}</Text>{hint ? <Text nativeID={id + "-hint"} style={styles.hint}>{hint}</Text> : null}<TextInput nativeID={id} accessibilityLabel={label} aria-describedby={hint ? id + "-hint" : undefined} value={value} onChangeText={onChange} maxLength={limit} multiline={multiline} textAlignVertical="top" style={[styles.input, multiline && styles.multiline]} />{value.length >= limit ? <Text accessibilityLiveRegion="polite" style={styles.hint}>You have reached the {limit}-character limit.</Text> : null}</View>;
}
export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked }} onPress={onChange} style={styles.checkRow}><View style={[styles.box, checked && styles.boxChecked]}>{checked ? <Text style={styles.tick}>✓</Text> : null}</View><Text style={styles.checkText}>{label}</Text></Pressable>;
}
export function Disclosure({ title, children, initiallyOpen = false, accessibilityLabel }: { title: string; children: ReactNode; initiallyOpen?: boolean; accessibilityLabel?: string }) {
  const [open, setOpen] = useState(initiallyOpen); const id = useId();
  return <View style={styles.disclosure}><Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? `${title} · ${open ? "Hide" : "Show"}`} aria-controls={id} accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={styles.disclosureButton}><Text style={styles.disclosureText}>{title} · {open ? "Hide" : "Show"}</Text></Pressable>{open ? <View nativeID={id} style={styles.disclosureContent}>{children}</View> : null}</View>;
}
export function CardSteps({ current, onStep }: { current: CardStep; onStep: (step: CardStep) => void }) {
  const labels: Array<[CardStep, string]> = [[1, "Your words"], [2, "Optional extras"], [3, "Choose a design"], [4, "Review and finish"]];
  return <View style={styles.stepRail}><View style={styles.stepRailTop}><View style={styles.stepRailCopy}><Text style={styles.stepRailKicker}>CARD CREATOR</Text><Text style={styles.stepRailTitle}>{labels[current - 1][1]}</Text></View><Text style={styles.stepRailCount}>Step {current} of 4</Text></View><View style={styles.progressTrack}>{labels.map(([step]) => <View key={step} style={[styles.progressDot, step <= current && styles.progressDotActive]} />)}</View><Disclosure title={`Card steps · Step ${current} of 4`} initiallyOpen={false}>
    <Text style={styles.hint}>You can return to an earlier step. Your words stay in place.</Text>
    {labels.map(([step, label]) => <Button key={step} title={`${step}. ${label}${step === current ? " · current" : ""}`} secondary={step !== current} onPress={() => onStep(step)} />)}
  </Disclosure></View>;
}
export function DateFields({ id, kind, value, onKind, onValue, hiddenMessage = "No date will appear on the card." }: { id: string; kind: string; value: string; onKind: (value: string) => void; onValue: (value: string) => void; hiddenMessage?: string }) {
  const choices = [["none", "No date"], ["exact", "Exact date"], ["month-year", "Month and year"], ["year", "Year only"], ["approximate", "Approximate date"]] as const;
  return <View><View role="radiogroup" aria-label="Date precision" style={styles.dateOptions}>{choices.map(([key, label], index) => <Pressable key={key} nativeID={`${id}-${index}`} accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{ checked: key === kind }} {...(Platform.OS === "web" ? { tabIndex: (key === kind ? 0 : -1) as 0 | -1 } : {})} onPress={() => onKind(key)} onKeyDown={(event) => { const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0; if (!direction) return; event.preventDefault(); const next = (index + direction + choices.length) % choices.length; onKind(choices[next][0]); event.currentTarget.parentElement?.querySelectorAll('[role="radio"]')[next]?.focus(); }} style={[styles.dateChoice, key === kind && styles.dateChosen]}><Text style={styles.dateLabel}>{key === kind ? "● " : "○ "}{label}</Text></Pressable>)}</View>{kind !== "none" ? <Field id={id + "-value"} label="Date or date description (optional)" value={value} onChange={onValue} hint={kind === "exact" ? "For example, 24 October 2020." : kind === "month-year" ? "For example, October 2020." : kind === "year" ? "For example, 2020." : "For example, around autumn 2020."} /> : <Text style={styles.hint}>{hiddenMessage}</Text>}</View>;
}
export function CardPreview({ view,photo=null }: { view: CardPresentation;photo?:CardPhotoAsset|null }) {
  const design = cardDesign(view.designId); const { settings } = useAccessibility(); const theme = themeFor(settings);
  const display = settings.theme === "dark" || settings.contrast === "high" ? { ...design, background: theme.white, ink: theme.ink, muted: theme.text, accent: theme.tealDark, border: theme.line, header: theme.mint, headerInk: theme.ink } : design;
  const rgb = (hex: string) => `rgb(${hex.slice(1).match(/../g)!.map((channel) => parseInt(channel, 16)).join(",")})`;
  if(view.templateId)return <CardCompositionPreview view={view} photo={photo} />;
  return <><Text style={styles.hint}>{design.name} · {cardArtwork(view.artworkId).name}{settings.theme === "dark" || settings.contrast === "high" ? ". Preview follows your display settings." : ""}</Text><View testID="card-preview" style={[styles.preview, { backgroundColor: rgb(display.background), borderColor: rgb(display.border), borderTopColor: rgb(display.accent) }]}>
    <View style={[styles.previewHeading, { backgroundColor: rgb(display.header) }]}><View style={styles.previewHeadingCopy}><Text style={[styles.kind, { color: rgb(display.headerInk) }]}>{view.subtitle}</Text><Text accessibilityRole="header" aria-level={2} style={[styles.previewTitle, { color: rgb(display.headerInk) }]}>{view.title}</Text></View><CardArtwork id={view.artworkId} /></View>
    {view.fields.map((item) => <View key={item.id} style={styles.previewField}><Text style={[styles.label, { color: rgb(display.accent) }]}>{item.label}</Text><Text style={[styles.previewValue, { color: rgb(display.ink) }]}>{item.value}</Text></View>)}<Text style={[styles.previewFooter, { color: rgb(display.muted), borderTopColor: rgb(display.border) }]}>{view.footer}</Text></View></>;
}
export function SavedControls({ message, loaded, save, remove, startBlank,processing=false }: { message: string; loaded: boolean; save: () => Promise<void>; remove: () => Promise<boolean>; startBlank: () => void;processing?:boolean }) {
  const [busy, setBusy] = useState(false);
  return <View style={styles.saved}>
    <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
    <Button title="Save on this device" disabled={!loaded || busy || processing} onPress={() => { setBusy(true); void save().finally(() => setBusy(false)); }} secondary />
    <Disclosure title="Start blank or delete saved card">
      <Button title="Start a blank draft" secondary disabled={!loaded || busy} onPress={startBlank} />
      <ConfirmDelete label="Delete saved card" question="Delete saved card?"
        detail="This clears the draft and removes its saved card and photo from this device. Downloaded and printed copies are unchanged."
        disabled={!loaded || busy} onConfirm={async () => { setBusy(true); try { return await remove(); } finally { setBusy(false); } }} />
    </Disclosure>
  </View>;
}
export function CardExports({view,photo=null,processing=false}:{view:CardPresentation;photo?:CardPhotoAsset|null;processing?:boolean}){
  const [status,setStatus]=useState(""),[busy,setBusy]=useState(false),[panels,setPanels]=useState<string[]>([]),[ready,setReady]=useState(false);
  useEffect(()=>{let live=true;setReady(false);if(view.templateId&&Platform.OS==="web")void cardComposition(view,photo).then(({layout,metrics,assets})=>{for(const page of layout.pages)sceneSvg(page,metrics,assets);if(live){setPanels(layout.pages.map((page:any)=>page.side));setReady(true);}}).catch(()=>{if(live)setStatus("Visual downloads are unavailable until the design can be shown. You can use the text alternative.");});return()=>{live=false;};},[view,photo]);
  const run=async(format:CardFormat|"print",side?:number)=>{setBusy(true);setStatus(format==="print"?"Requesting the print dialog…":"Preparing your file…");try{if(format==="print"){await printCard(view,photo);setStatus("Print requested. Your browser or device controls printing. Your saved card is unchanged.");}else{const result=await exportCard(view,format,{photo,side});setStatus(result==="cancelled"?"Sharing cancelled. Your card is still here.":result==="shared"?"Share dialog closed. A copy is shared only if you completed that action.":(format==="wallet-pdf"?"Wallet PDF":format.toUpperCase())+" download requested. Check your browser’s downloads.");}}catch(error){setStatus(error instanceof Error&&/^(PDF cannot|Image download|Image could|PDF font|File sharing|Print is|The photo|Card artwork|Some characters)/.test(error.message)?error.message:"The file could not be created. Your card is still here; try again or use text.");}finally{setBusy(false);}};
  const designed=!!view.templateId,disabled=busy||processing||(designed&&Platform.OS==="web"&&!ready);
  return <View style={styles.exports}><Text style={styles.hint}>Downloads use the design and information above. Print uses white paper. Copies leave this app’s control.</Text>
    {designed&&view.kind==="personal"&&Platform.OS==="web"?<><Button title="Download wallet PDF" disabled={disabled} onPress={()=>void run("wallet-pdf")} /><Text style={styles.hint}>Front, back and any continued panels are 85.6 × 54 mm. Print at actual size.</Text><Button title="Download larger-text PDF" secondary disabled={disabled} onPress={()=>void run("pdf")} /><Disclosure title="Image downloads">{panels.map((side,n)=><Button key={n} title={"Download "+side.toLowerCase()+" (PNG)"} secondary disabled={disabled} onPress={()=>void run("png",n)} />)}</Disclosure></>:<>{view.kind==="milestone"&&Platform.OS==="web"?<Button title="Download image (PNG)" disabled={disabled} onPress={()=>void run("png")} />:null}<Button title="Download PDF" disabled={disabled} secondary={view.kind==="milestone"} onPress={()=>void run("pdf")} />{view.kind==="personal"&&Platform.OS==="web"?<><Button title="Download image (PNG)" secondary disabled={disabled} onPress={()=>void run("png")} /><Disclosure title="Wallet-size PDF"><Text style={styles.hint}>Long text continues onto more panels. Use the standard PDF for larger text.</Text><Button title="Download wallet PDF" secondary disabled={disabled} onPress={()=>void run("wallet-pdf")} /></Disclosure></>:null}</>}
    <Button title="Print card" secondary disabled={disabled} onPress={()=>void run("print")} /><Disclosure title="Text alternative"><Text style={styles.hint}>Text contains your wording, not photos or artwork.</Text><Button title="Download text" secondary disabled={busy} onPress={()=>void run("txt")} /></Disclosure><Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text>
  </View>;
}
export function PrivacyNote() { return <Disclosure title="Privacy and leaving this page"><Text style={styles.hint}>Anyone with access to this browser profile or device may be able to open saved cards and photos. Unsaved edits and selected photos stay in memory while the app is open. Closing or reloading loses unsaved changes. Browser storage can be cleared or removed by the browser; device backups, downloads, printouts and social-platform copies are outside this app’s deletion control.</Text></Disclosure>; }

const styles = StyleSheet.create({
  field: { marginBottom: 20 }, label: { color: palette.ink, fontSize: 18, fontWeight: "600" }, hint: { color: palette.text, fontSize: 18, marginVertical: 6 },
  input: { marginTop: 8, borderWidth: 1, borderColor: "#657C73", borderRadius: 12, padding: 12, backgroundColor: palette.white, color: palette.ink, fontSize: 18 }, multiline: { minHeight: 110 },
  button: { marginVertical: 7, paddingHorizontal: 20, paddingVertical: 13, backgroundColor: palette.teal, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: "#183248", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  secondary: { backgroundColor: palette.white, borderWidth: 1, borderColor: "#657C73", shadowOpacity: 0 }, buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", textAlign: "center", letterSpacing: 0.1 }, secondaryText: { color: palette.tealDark },
  checkRow: { width: "100%", minWidth: 0, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }, box: { width: 26, height: 26, borderWidth: 1.5, borderColor: "#657C73", borderRadius: 6, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  boxChecked: { backgroundColor: palette.teal }, tick: { color: "#FFFFFF", fontSize: 18 }, checkText: { flex: 1, minWidth: 0, color: palette.text, fontSize: 18 },
  disclosure: { marginVertical: 8, borderTopWidth: 1, borderTopColor: palette.line }, disclosureButton: { justifyContent: "center", paddingVertical: 11 }, disclosureText: { color: palette.tealDark, fontSize: 18, fontWeight: "600" }, disclosureContent: { paddingTop: 4, paddingBottom: 16 },
  dateOptions: { gap: 8, marginBottom: 12 }, dateChoice: { padding: 12, borderWidth: 1, borderColor: "#657C73", borderRadius: 12 }, dateChosen: { backgroundColor: palette.mint, borderColor: palette.tealDark }, dateLabel: { color: palette.tealDark, fontSize: 18 },
  preview: { padding: 24, borderWidth: 1, borderColor: palette.line, borderTopWidth: 4, borderTopColor: palette.tealDark, borderRadius: 18, backgroundColor: palette.white, marginBottom: 16, shadowColor: "#183248", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 }, milestone: { backgroundColor: palette.mint },
  previewHeading: { padding: 16, marginHorizontal: -8, marginTop: -8, marginBottom: 4, borderRadius: 10, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 16 }, previewHeadingCopy: { flex: 1, minWidth: 120 },
  kind: { color: palette.tealDark, fontSize: 18, fontWeight: "500" }, previewTitle: { color: palette.ink, fontSize: 26, fontWeight: "600", marginTop: 8 }, previewField: { marginTop: 20 }, previewValue: { color: palette.text, fontSize: 18, marginTop: 4 },
  previewFooter: { color: palette.text, fontSize: 18, marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: palette.line }, saved: { marginTop: 12 }, status: { color: palette.text, fontSize: 18, marginVertical: 12 }, exports: { marginTop: 8 },
  stepRail: { marginBottom: 18, padding: 18, borderRadius: 18, backgroundColor: palette.mint, borderWidth: 1, borderColor: palette.line }, stepRailTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }, stepRailCopy: { flex: 1 }, stepRailKicker: { color: palette.tealDark, fontSize: 13, letterSpacing: 1.4, fontWeight: "800" }, stepRailTitle: { color: palette.ink, fontSize: 20, fontWeight: "700", marginTop: 4 }, stepRailCount: { color: palette.tealDark, fontSize: 16, fontWeight: "700" }, progressTrack: { flexDirection: "row", gap: 6, marginTop: 15 }, progressDot: { flex: 1, height: 5, borderRadius: 5, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line }, progressDotActive: { backgroundColor: palette.teal, borderColor: palette.teal },
});
