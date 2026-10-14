import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Text, View, Pressable } from "../../components/Ui";
import { palette } from "../../components/theme";
import { Button, Disclosure } from "./CardUi";
import type { DraftController } from "./CardDraftProvider";
import { normalisePhoto } from "./photos.mjs";
import { cardTemplate } from "./templates.mjs";
export function CardPhotoInput({ draft }: {
    draft: DraftController<any>;
}) {
    const input = useRef<HTMLInputElement>(null), [uri, setUri] = useState("");
    useEffect(() => { if (!draft.photo) {
        setUri("");
        return;
    } const url = URL.createObjectURL(draft.photo.blob); setUri(url); return () => URL.revokeObjectURL(url); }, [draft.photo]);
    const choose = async (file: File) => { const token = draft.beginPhoto(); try {
        const photo = await normalisePhoto(file);
        draft.acceptPhoto(photo as any, token);
    }
    catch {
        draft.finishPhoto(token, "Choose a JPEG, PNG or WebP photo up to 10 MB. Your previous photo is unchanged.");
    } };
    const step = (key: "photoX" | "photoY" | "photoZoom", value: number) => draft.update({ [key]: value });
    const included = cardTemplate(draft.card.templateId)?.photo;
    return <Disclosure title={draft.card.photoRef ? "Photo (chosen)" : "Photo (optional)"}><Text style={styles.hint}>Choose from your device. The photo stays here until you save or download it. It is not uploaded to this project.</Text>{!included && draft.card.photoRef ? <Text style={styles.hint}>This design does not show your photo. It is retained here until you remove it.</Text> : null}<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a personal photo" tabIndex={-1} style={{ display: "none" }} onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file)
        void choose(file); }}/><Button title={draft.card.photoRef ? "Replace photo" : "Choose photo"} secondary disabled={draft.photoBusy} onPress={() => input.current?.click()}/>{draft.photoBusy ? <Text accessibilityLiveRegion="polite" style={styles.hint}>Reading and preparing your photo…</Text> : null}{uri ? <><Image source={{ uri }} accessible={false} aria-hidden style={{ width: 160, height: 160, resizeMode: "contain", alignSelf: "center" }}/><Disclosure title="Photo positioning"><Text style={styles.hint}>Use the buttons, then review the card to check the crop.</Text><View style={styles.controls}>{[["Zoom in", () => step("photoZoom", Math.min(3, draft.card.photoZoom + .25)), draft.card.photoZoom >= 3], ["Zoom out", () => step("photoZoom", Math.max(1, draft.card.photoZoom - .25)), draft.card.photoZoom <= 1], ["Move left", () => step("photoX", Math.max(0, draft.card.photoX - .1)), draft.card.photoX <= 0], ["Move right", () => step("photoX", Math.min(1, draft.card.photoX + .1)), draft.card.photoX >= 1], ["Move up", () => step("photoY", Math.max(0, draft.card.photoY - .1)), draft.card.photoY <= 0], ["Move down", () => step("photoY", Math.min(1, draft.card.photoY + .1)), draft.card.photoY >= 1]].map(([name, action, disabled]) => <Pressable key={name as string} accessibilityRole="button" disabled={disabled as boolean} accessibilityState={{ disabled: disabled as boolean }} onPress={action as () => void} style={styles.move}><Text style={styles.moveText}>{name as string}</Text></Pressable>)}</View><Button title="Reset photo position" secondary onPress={() => draft.update({ photoZoom: 1, photoX: .5, photoY: .5 })}/></Disclosure></> : null}{draft.card.photoRef ? <Button title="Remove photo from draft" secondary onPress={draft.removePhoto}/> : null}<Text style={styles.hint}>Saving also stores the photo on this device. Anyone with access to this browser profile may be able to see it. Text downloads do not contain photos.</Text></Disclosure>;
}
const styles = StyleSheet.create({ hint: { fontSize: 18, color: palette.text, marginVertical: 8 }, controls: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, move: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: palette.tealDark, backgroundColor: palette.white }, moveText: { fontSize: 18, color: palette.tealDark, fontWeight: "600" } });
