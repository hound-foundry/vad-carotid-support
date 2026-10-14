import { useEffect, useRef, useState } from "react";
import { StyleSheet, type View as NativeView } from "react-native";
import { AppPage, BackHome, PageHeading, palette } from "../src/components/AppPage";
import { Text, View } from "../src/components/Ui";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { Button, CardExports, CardPreview, Check, DateFields, Disclosure, Field, PrivacyNote, SavedControls } from "../src/features/cards/CardUi";
import { personalCardPresentation, type PersonalCard } from "../src/features/cards/model.mjs";
import { CardDesignPicker, CardTemplateGallery } from "../src/features/cards/CardDesignPicker";
import { CardPhotoInput } from "../src/features/cards/CardPhotoInput";
import { cardTemplate } from "../src/features/cards/templates.mjs";
const statements = ["Please give me time to answer.", "Please write important things down.", "Please use short, clear sentences.", "Please ask before helping me."];
export default function PersonalCardScreen() {
    const { personal: draft } = useCardDrafts();
    const [hint, setHint] = useState("");
    const first = useRef(true);
    const stageRef = useRef<NativeView>(null);
    useEffect(() => { if (first.current) {
        first.current = false;
        return;
    } if (typeof document === "undefined")
        return; const target = stageRef.current as unknown as HTMLElement | null; if (target?.getClientRects().length) {
        target.setAttribute("tabindex", "-1");
        target.focus();
        target.scrollIntoView({ block: "start", behavior: "instant" });
    } }, [draft.mode]);
    const update = (key: keyof PersonalCard, value: string) => draft.update({ [key]: value });
    type TextKey = {
        [K in keyof PersonalCard]: PersonalCard[K] extends string ? K : never;
    }[keyof PersonalCard];
    const field = (key: TextKey, label: string, multiline = false, hint?: string) => <Field key={key} id={"personal-" + key} label={label} value={draft.card[key]} onChange={(v) => update(key, v)} multiline={multiline} limit={key === "medicines" || key === "allergies" ? 500 : 240} hint={hint}/>;
    const hasExtra = ["description", "emergencyContact", "clinicianContact", "medicines", "allergies", "whatHelps", "avoid", "eventDate"].some((key) => draft.card[key as keyof PersonalCard]);
    const view = personalCardPresentation(draft.card);
    return <AppPage><BackHome /><View ref={stageRef} nativeID="personal-stage"><PageHeading compact eyebrow="Card" title={draft.mode === "preview" ? "Review your card" : draft.mode === "templates" ? "Choose a practical card design" : "Medical and communication card"} summary={draft.mode === "preview" ? "Check the front, back and any continued details before downloading." : draft.mode === "templates" ? "Pick a layout, then write only what you want to include." : "Choose what helps. Every field is optional."}/></View>
    {draft.mode === "templates" ? <CardTemplateGallery kind="personal" value={draft.card} onChange={draft.update} onContinue={draft.edit} loaded={draft.loaded} canReturn={draft.loaded && draft.status !== "absent"}/> : null}
    {draft.mode === "edit" ? <>
      <Field id="personal-heading" label="Card heading (optional)" value={draft.card.heading} onChange={(heading) => update("heading", heading)} limit={80} hint="Write a short statement for the front, or leave it blank."/>
      {field("preferredName", "Preferred name (optional)")}
      <Text style={styles.label}>Communication statements (optional)</Text>
      {statements.map((statement) => <Check key={statement} label={statement} checked={draft.card.communicationNeeds.split("\n").includes(statement)} onChange={() => { const lines = draft.card.communicationNeeds.split("\n").filter(Boolean); const next = (lines.includes(statement) ? lines.filter((line) => line !== statement) : [...lines, statement]).join("\n"); if (next.length > 240) {
            setHint("Remove some text before adding another statement.");
            return;
        } setHint(""); update("communicationNeeds", next); }}/>)}{hint ? <Text accessibilityLiveRegion="polite" style={styles.note}>{hint}</Text> : null}
      <Disclosure title="More communication words (optional)">
        {field("communicationNeeds", "Communication and access needs (optional)", true)}
      </Disclosure>
      {cardTemplate(draft.card.templateId)?.photo || draft.card.photoRef ? <CardPhotoInput draft={draft}/> : null}
      <CardDesignPicker value={draft.card} onChange={draft.update} onChooseDesign={draft.chooseDesign} onUndo={draft.undoAppearance} canUndo={draft.canUndo}/>
      <Button title="Review card" disabled={!draft.loaded || draft.photoBusy} onPress={draft.preview}/>
      <Disclosure title={hasExtra ? "Additional details (contains entries)" : "Add optional details"}>
        {field("description", "How I describe my situation (optional)", true)}
        {field("whatHelps", "What helps me (optional)", true)}{field("avoid", "Please avoid (optional)", true)}
        {field("emergencyContact", "Emergency contact (optional)", true)}{field("clinicianContact", "Clinician or service contact (optional)", true)}
        {field("medicines", "Medicines (optional)", true, "Entered by you; check that this is current.")}{field("allergies", "Allergies (optional)", true, "Entered by you; check that this is current.")}
        <Text style={styles.label}>When it happened (optional)</Text><DateFields id="personal-date" kind={draft.card.eventDateKind} value={draft.card.eventDate} onKind={(v) => update("eventDateKind", v)} onValue={(v) => update("eventDate", v)} hiddenMessage="No event date will appear. The card still shows when it was last updated."/>
        <Button title="Review card" onPress={draft.preview}/>
      </Disclosure>
      <Text style={styles.note}>Personal information card — not an official medical record or emergency plan.</Text>
    </> : draft.mode === "preview" ? <><CardPreview view={view} photo={draft.photo}/><Button title="Edit card" secondary onPress={draft.edit}/><CardExports view={view} photo={draft.photo} processing={draft.photoBusy}/></> : null}
    {draft.mode === "templates" ? <Text style={styles.note}>Personal information card — not an official medical record or emergency plan.</Text> : null}
    <SavedControls message={draft.message} loaded={draft.loaded} save={draft.save} remove={draft.remove} startBlank={draft.startBlank} processing={draft.photoBusy || draft.saveBusy}/><PrivacyNote />
  </AppPage>;
}
const styles = StyleSheet.create({ note: { color: palette.text, fontSize: 16, marginVertical: 8 }, label: { color: palette.ink, fontSize: 18, fontWeight: "700", marginTop: 8 } });
