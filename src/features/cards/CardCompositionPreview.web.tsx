import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Text, View } from "../../components/Ui";
import { useAccessibility } from "../accessibility/AccessibilityProvider";
import { palette } from "../../components/theme";
import { Disclosure } from "./CardUi";
import type { CardPresentation } from "./model.mjs";
import type { CardPhotoAsset } from "./CardDraftProvider";
import { cardComposition } from "./composition";
import { sceneSvg } from "./scene-svg.mjs";
import { cardTemplate } from "./templates.mjs";
export function CardCompositionPreview({ view, photo = null }: {
    view: CardPresentation;
    photo?: CardPhotoAsset | null;
}) {
    const [panels, setPanels] = useState<{
        uri: string;
        width: number;
        height: number;
        side: string;
    }[]>([]), [error, setError] = useState("");
    const { settings } = useAccessibility();
    const automaticText=!!error||settings.simplifiedReading||settings.textScale>=1.5||settings.contrast==="high";
    useEffect(() => { let live = true; const urls: string[] = []; setPanels([]); setError(""); void cardComposition(view, photo).then(({ layout, metrics, assets }) => { for (const page of layout.pages) {
        const uri = URL.createObjectURL(new Blob([sceneSvg(page, metrics, assets)], { type: "image/svg+xml;charset=utf-8" }));
        urls.push(uri);
    } if (live)
        setPanels(layout.pages.map((page: any, n: number) => ({ uri: urls[n], width: page.width, height: page.height, side: page.side })));
    else
        urls.forEach(url => URL.revokeObjectURL(url)); }).catch(() => { if (live)
        setError("The designed preview could not be shown. Your wording remains available in the text version. Replace a missing photo, or try again before a visual export."); }); return () => { live = false; urls.forEach(url => URL.revokeObjectURL(url)); }; }, [view, photo]);
    const words=<Disclosure key={automaticText ? "readability" : "standard"} title="Read card as text" initiallyOpen={automaticText}>
      <Text style={styles.hint}>{view.subtitle}</Text>
      <Text accessibilityRole="header" aria-level={2} style={styles.heading}>{view.title}</Text>
      {view.fields.map(item => <View key={item.id} style={styles.field}>
        {view.kind === "personal" ? <Text style={styles.label}>{item.label}</Text> : null}<Text>{item.value}</Text>
      </View>)}
      <Text style={styles.hint}>{view.footer}</Text>
      {photo ? <Text style={styles.hint}>{cardTemplate(view.templateId)?.photo ? "Your chosen photo is included in this design." : "Your photo is retained in the draft but is not included in this design."}</Text> : null}
    </Disclosure>;
    return <View testID="card-preview">
      <Text style={styles.hint}>The design is used for downloads. Your text and display settings apply to the text version.</Text>
      {automaticText?words:null}
      {error ? <Text accessibilityLiveRegion="polite" style={styles.hint}>{error}</Text>
        : !panels.length ? <Text accessibilityLiveRegion="polite">Preparing the card preview…</Text>
        : panels.map((panel, n) => <View key={n} style={styles.panel}>
          <Text accessibilityRole="header" aria-level={2} style={styles.side}>{panel.side}</Text>
          <Image source={{ uri:panel.uri }} accessible={false} aria-hidden style={{width:"100%",aspectRatio:panel.width/panel.height}} />
        </View>)}
      {!automaticText?words:null}
    </View>;
}
const styles = StyleSheet.create({ hint: { fontSize: 18, color: palette.text, marginVertical: 10, lineHeight: 27 }, panel: { marginVertical: 14, borderWidth: 1, borderColor: palette.line, borderRadius: 18, padding: 14, backgroundColor: palette.white, shadowColor: "#183248", shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 }, side: { fontSize: 18, fontWeight: "800", color: palette.ink, marginBottom: 10, letterSpacing: 0.2 }, heading: { fontSize: 24, fontWeight: "700", color: palette.ink }, field: { marginVertical: 10 }, label: { fontSize: 18, fontWeight: "700", color: palette.ink } });
