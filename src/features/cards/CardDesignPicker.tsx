import { useId, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Pressable, Text, View } from "../../components/Ui";
import { palette } from "../../components/theme";
import { Button, Disclosure } from "./CardUi";
import { CARD_DESIGNS, cardDesign } from "./design.mjs";
import { CARD_ARTWORK, cardArtwork } from "./artwork.mjs";
import { CardArtwork } from "./CardArtwork";

type DesignChoice = { designId: string; artworkId: string };
const fixed = (hex: string) => `rgb(${hex.slice(1).match(/../g)!.map((channel) => parseInt(channel, 16)).join(",")})`;

export function CardDesignPicker({ value, onChange }: { value: DesignChoice; onChange: (value: DesignChoice) => void }) {
  const [previous, setPrevious] = useState<DesignChoice>();
  const choose = (next: DesignChoice) => { if (next.designId === value.designId && next.artworkId === value.artworkId) return; setPrevious({ designId: value.designId, artworkId: value.artworkId }); onChange(next); };
  return <Disclosure title={`Design: ${cardDesign(value.designId).name}`}>
    <Text style={styles.hint}>Changing the design keeps your words and dates. Saving and downloading are separate.</Text>
    <ChoiceGroup label="Card design" value={value.designId} choices={CARD_DESIGNS} onChange={(designId) => choose({ designId, artworkId: value.artworkId })} render={(id) => { const design = cardDesign(id); return <View accessible={false} aria-hidden style={[styles.swatch, { backgroundColor: fixed(design.background), borderColor: fixed(design.border) }]}><View style={[styles.swatchHeader, { backgroundColor: fixed(design.header) }]}><View style={[styles.swatchTitle, { backgroundColor: fixed(design.headerInk) }]} /></View><View style={[styles.swatchLine, { backgroundColor: fixed(design.accent) }]} /><View style={[styles.swatchLine, styles.shortLine, { backgroundColor: fixed(design.muted) }]} /></View>; }} />
    <Disclosure title={`Artwork: ${cardArtwork(value.artworkId).name}`}>
      <Text style={styles.hint}>Optional decoration. Choose No artwork to remove it.</Text>
      <ChoiceGroup label="Card artwork" value={value.artworkId} choices={CARD_ARTWORK} onChange={(artworkId) => choose({ designId: value.designId, artworkId })} render={(id) => id === "none" ? null : <CardArtwork id={id} size={52} />} />
    </Disclosure>
    <Button title="Use a plain design" secondary onPress={() => choose({ designId: "clear", artworkId: "none" })} />
    <Button title="Undo last design change" secondary disabled={!previous} onPress={() => { if (previous) onChange(previous); setPrevious(undefined); }} />
  </Disclosure>;
}

function ChoiceGroup({ label, value, choices, onChange, render }: { label: string; value: string; choices: { id: string; name: string; description: string }[]; onChange: (id: string) => void; render: (id: string) => React.ReactNode }) {
  const id = useId().replace(/:/g, "");
  return <View role="radiogroup" aria-label={label} style={styles.choices}>{choices.map((choice, index) => <Pressable key={choice.id} accessibilityRole="radio" accessibilityLabel={choice.name} aria-describedby={`${id}-${choice.id}`} accessibilityState={{ checked: choice.id === value }} {...(Platform.OS === "web" ? { tabIndex: (choice.id === value ? 0 : -1) as 0 | -1 } : {})}
    onPress={() => onChange(choice.id)} onKeyDown={(event) => { const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0; if (!direction) return; event.preventDefault(); const next = (index + direction + choices.length) % choices.length; onChange(choices[next].id); event.currentTarget.parentElement?.querySelectorAll('[role="radio"]')[next]?.focus(); }}
    style={[styles.choice, value === choice.id && styles.selected]}>
    <View style={styles.choiceHeading}><Text style={styles.marker}>{value === choice.id ? "●" : "○"}</Text><View style={styles.copy}><Text style={styles.name}>{choice.name}{value === choice.id ? " · selected" : ""}</Text><Text nativeID={`${id}-${choice.id}`} style={styles.description}>{choice.description}</Text></View></View>
    <View style={styles.sample}>{render(choice.id)}</View>
  </Pressable>)}</View>;
}

const styles = StyleSheet.create({
  hint: { fontSize: 18, color: palette.text, marginVertical: 8 }, choices: { gap: 10, marginVertical: 12 },
  choice: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white }, selected: { backgroundColor: palette.mint, borderColor: palette.tealDark },
  choiceHeading: { flexDirection: "row", alignItems: "flex-start", gap: 10 }, marker: { color: palette.tealDark, fontSize: 18 }, copy: { flex: 1, minWidth: 0 }, name: { fontSize: 18, color: palette.ink, fontWeight: "600" }, description: { color: palette.text, fontSize: 18, marginTop: 4 }, sample: { marginTop: 10 },
  swatch: { width: 124, height: 72, borderWidth: 1, borderRadius: 8, overflow: "hidden" }, swatchHeader: { padding: 10 }, swatchTitle: { width: 64, height: 5, borderRadius: 3 }, swatchLine: { marginTop: 8, marginLeft: 10, width: 94, height: 3, borderRadius: 2 }, shortLine: { width: 64 },
});
