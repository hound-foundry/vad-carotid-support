import { useId, type ReactNode } from "react";
import { Image, Platform, StyleSheet } from "react-native";
import { Pressable, Text, View } from "../../components/Ui";
import { palette } from "../../components/theme";
import { useLayoutDimensions } from "../../components/useLayoutDimensions";
import { useAccessibility } from "../accessibility/AccessibilityProvider";
import { Button, Disclosure } from "./CardUi";
import { CARD_DESIGNS } from "./design.mjs";
import { CARD_ARTWORK } from "./artwork.mjs";
import { CardArtwork } from "./CardArtwork";
import { CARD_TEMPLATES, CARD_PALETTES, ILLUSTRATIONS, cardTemplate } from "./templates.mjs";
type DesignChoice = {
    designId: string;
    artworkId: string;
    templateId: string;
    colourId: string;
    illustrationId: string;
};
const thumbnails: Record<string, number> = {
    communication: require("../../../assets/card-collection/communication.png"),
    portrait: require("../../../assets/card-collection/portrait.png"),
    statement: require("../../../assets/card-collection/statement.png"),
    "ribbon-poster": require("../../../assets/card-collection/ribbon-poster.png"),
    warrior: require("../../../assets/card-collection/warrior.png"),
    "brain-poster": require("../../../assets/card-collection/brain-poster.png"),
    botanical: require("../../../assets/card-collection/botanical.png"),
    "photo-story": require("../../../assets/card-collection/photo-story.png"),
    "quiet-white": require("../../../assets/card-collection/quiet-white.png"),
    "engraved-slate": require("../../../assets/card-collection/engraved-slate.png"),
    "embossed-cream": require("../../../assets/card-collection/embossed-cream.png"),
    "letterpress-blue": require("../../../assets/card-collection/letterpress-blue.png"),
    "message-band": require("../../../assets/card-collection/message-band.png"),
    "fox-story": require("../../../assets/card-collection/fox-story.png"),
    "bird-ribbon": require("../../../assets/card-collection/bird-ribbon.png"),
    "cat-badge": require("../../../assets/card-collection/cat-badge.png"),
};
export function CardTemplateGallery({ kind, value, onChange, onContinue, loaded, canReturn=false }: {
    kind: "personal" | "milestone";
    value: DesignChoice;
    onChange: (value: Partial<DesignChoice>) => void;
    onContinue: () => void;
    loaded: boolean;
    canReturn?: boolean;
}) {
    const { width } = useLayoutDimensions();
    const { settings } = useAccessibility();
    const columns = width >= 700 && settings.textScale < 1.5;
    const compact = width < 700 && settings.textScale < 1.5;
    const thumbnailWidth=compact?100:Math.min(250,width-88);
    const thumbnailHeight=thumbnailWidth/(kind === "personal"?856/540:1080/1500);
    return <View>
      <Text style={styles.hint}>Step 3 of 4 · These are examples. Choosing a design keeps your words and dates.</Text>
      <View style={styles.gallery}>{CARD_TEMPLATES.filter(t => t.kind === kind).map(t =>
        <Pressable key={t.id} accessibilityRole="button" accessibilityLabel={"Choose " + t.name}
          disabled={!loaded} accessibilityState={{ disabled: !loaded }}
          onPress={() => {
            if (value.templateId !== t.id) onChange({ templateId: t.id, colourId: t.colours[0], illustrationId: "auto" });
            onContinue();
          }}
          style={[styles.tile, columns && styles.halfTile, value.templateId === t.id && styles.selected]}>
          <View style={{flexDirection:compact?"row":"column",gap:16,alignItems:compact?"center":"stretch"}}>
            <Image source={thumbnails[t.id]} accessible={false} aria-hidden resizeMode="contain"
              style={{width:thumbnailWidth,height:thumbnailHeight,alignSelf:"center"}} />
            <View style={{flex:compact?1:undefined}}>
              <View style={styles.tileMeta}><Text style={styles.category}>{categoryLabel(t.category)}</Text>{t.finish ? <Text style={styles.finish}>{finishLabel(t.finish)}</Text> : null}</View>
              <Text style={styles.name}>{t.name}{value.templateId === t.id ? " · current design" : ""}</Text>
              <Text style={styles.description}>{t.description}</Text>
            </View>
          </View>
        </Pressable>
      )}</View>
      <Button title="Use a plain layout" secondary disabled={!loaded} onPress={() => {
        onChange({ templateId:"plain", colourId:"blue", illustrationId:"none", designId:"clear", artworkId:"none" });
        onContinue();
      }} />
      {canReturn ? <Button title="Back to my words" secondary disabled={!loaded} onPress={onContinue}/> : null}
    </View>;
}
export function CardDesignPicker({ value, onChange, onChooseDesign, onUndo, canUndo, preview }: {
    value: DesignChoice;
    onChange: (value: Partial<DesignChoice>) => void;
    onChooseDesign: () => void;
    onUndo: () => void;
    canUndo: boolean;
  preview?: ReactNode;
}) {
    const t = cardTemplate(value.templateId);
    return <View>{preview ? <View style={styles.livePreview}><Text style={styles.livePreviewTitle}>Live preview</Text><Text style={styles.description}>The front and back update as you change the design, colour or artwork.</Text>{preview}</View> : null}<View style={styles.currentDesign}>{t && thumbnails[t.id] ? <Image source={thumbnails[t.id]} accessible={false} aria-hidden resizeMode="contain" style={styles.currentThumb}/> : null}<View style={styles.currentCopy}><Text style={styles.category}>CURRENT DESIGN</Text><Text style={styles.name}>{t ? t.name : "Plain or previous layout"}</Text><Text style={styles.description}>{t?.description || "Your older saved appearance is preserved."}</Text></View></View><Button title="Change design" secondary onPress={onChooseDesign}/><Button title="Undo last appearance change" secondary disabled={!canUndo} onPress={onUndo}/><Disclosure title={t ? "Colours and artwork" : "Previous colours and artwork"}>
    {t ? <><ChoiceGroup label="Card colour combination" value={value.colourId || t.colours[0]} choices={t.colours.map(id => ({ id, name: CARD_PALETTES[id].name }))} onChange={colourId => onChange({ colourId })}/><ChoiceGroup label="Card artwork" value={value.illustrationId === "auto" ? t.illustration : value.illustrationId} choices={ILLUSTRATIONS.filter(i => t.illustrations.includes(i.id))} onChange={illustrationId => onChange({ illustrationId })}/></> : <><ChoiceGroup label="Previous card design" value={value.designId} choices={CARD_DESIGNS} onChange={designId => onChange({ designId })}/><ChoiceGroup label="Previous artwork" value={value.artworkId} choices={CARD_ARTWORK} onChange={artworkId => onChange({ artworkId })} render={id => id === "none" ? null : <CardArtwork id={id} size={48}/>}/></>}
    <Text style={styles.hint}>Changing the appearance does not save or download your card.</Text>
    <Button title="Use a plain layout" secondary onPress={() => onChange({ templateId: "plain", colourId: "blue", illustrationId: "none", designId: "clear", artworkId: "none" })}/>

  </Disclosure></View>;
}
function categoryLabel(category?: string) { return ({ clear: "Clear", serious: "Serious", gentle: "Gentle", textured: "Textured", expression: "Expression" } as Record<string, string>)[category || ""] || "Plain"; }
function finishLabel(finish?: string) { return ({ engraved: "Engraved", embossed: "Embossed", letterpress: "Letterpress", foil: "Foil detail", quiet: "Quiet" } as Record<string, string>)[finish || ""] || ""; }
function ChoiceGroup({ label, value, choices, onChange, render }: {
    label: string;
    value: string;
    choices: {
        id: string;
        name: string;
        description?: string;
    }[];
    onChange: (id: string) => void;
    render?: (id: string) => React.ReactNode;
}) {
    const id = useId().replace(/:/g, "");
    return <View role="radiogroup" aria-label={label} style={styles.choices}>{choices.map((choice, index) => <Pressable key={choice.id} accessibilityRole="radio" accessibilityLabel={choice.name} accessibilityState={{ checked: choice.id === value }} {...(Platform.OS === "web" ? { tabIndex: (choice.id === value ? 0 : -1) as 0 | -1 } : {})} onPress={() => onChange(choice.id)} onKeyDown={event => { const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0; if (!direction)
        return; event.preventDefault(); const next = (index + direction + choices.length) % choices.length; onChange(choices[next].id); event.currentTarget.parentElement?.querySelectorAll('[role="radio"]')[next]?.focus(); }} style={[styles.choice, value === choice.id && styles.selected]}><Text nativeID={id + "-" + choice.id} style={styles.name}>{value === choice.id ? "● " : "○ "}{choice.name}{value === choice.id ? " · selected" : ""}</Text>{choice.description ? <Text style={styles.description}>{choice.description}</Text> : null}{render?.(choice.id)}</Pressable>)}</View>;
}
const styles = StyleSheet.create({ hint: { fontSize: 18, color: palette.text, marginVertical: 10 }, name: { fontSize: 18, color: palette.ink, fontWeight: "700" }, description: { fontSize: 18, color: palette.text, marginTop: 6, lineHeight: 27 }, gallery: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginVertical: 12 }, tile: { width: "100%", padding: 18, borderRadius: 18, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white, shadowColor: "#183248", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 }, halfTile: { width: "48%" }, selected: { borderColor: palette.tealDark, backgroundColor: palette.mint }, choices: { gap: 10, marginVertical: 12 }, choice: { padding: 14, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, tileMeta: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 6 }, category: { color: palette.tealDark, fontSize: 13, letterSpacing: 1.1, fontWeight: "800", textTransform: "uppercase" }, finish: { color: palette.muted, fontSize: 13, fontWeight: "600" }, currentDesign: { flexDirection: "row", alignItems: "center", gap: 16, padding: 14, borderRadius: 16, backgroundColor: palette.mint, borderWidth: 1, borderColor: palette.line, marginBottom: 10 }, currentThumb: { width: 112, height: 80, borderRadius: 8 }, currentCopy: { flex: 1, minWidth: 0 }, livePreview: { marginBottom: 18, padding: 16, borderRadius: 18, backgroundColor: palette.mint, borderWidth: 1, borderColor: palette.line }, livePreviewTitle: { color: palette.ink, fontSize: 21, lineHeight: 29, fontWeight: "800" } });
