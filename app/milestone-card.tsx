import { useEffect, useRef } from "react";
import type { View as NativeView } from "react-native";
import { AppPage, BackHome, PageHeading, palette } from "../src/components/AppPage";
import { Text, View } from "../src/components/Ui";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { Button, CardExports, CardPreview, CardSteps, Check, DateFields, Disclosure, Field, PrivacyNote, SavedControls } from "../src/features/cards/CardUi";
import { milestoneCardPresentation } from "../src/features/cards/model.mjs";
import { CardDesignPicker, CardTemplateGallery } from "../src/features/cards/CardDesignPicker";
import { CardPhotoInput } from "../src/features/cards/CardPhotoInput";
import { cardTemplate } from "../src/features/cards/templates.mjs";
import { CARD_WORDING } from "../src/features/cards/design.mjs";
import { Pressable } from "../src/components/Ui";
export default function MilestoneCardScreen() {
    const { milestone: draft } = useCardDrafts();
    const first = useRef(true);
    const stageRef = useRef<NativeView>(null);
    const view = milestoneCardPresentation(draft.card);
    useEffect(() => { if (first.current) {
        first.current = false;
        return;
    } if (typeof document === "undefined")
        return; const target = stageRef.current as unknown as HTMLElement | null; if (target?.getClientRects().length) {
        target.setAttribute("tabindex", "-1");
        target.focus();
        target.scrollIntoView({ block: "start", behavior: "instant" });
    } }, [draft.mode]);
    return <AppPage><BackHome /><View ref={stageRef} nativeID="milestone-stage"><PageHeading compact eyebrow="Card" title={draft.mode === "preview" ? "Review your card" : draft.mode === "templates" ? "Choose a personal card design" : "Anniversary or milestone card"} summary={draft.mode === "preview" ? "Download a personal card to keep or share yourself." : draft.mode === "templates" ? "Step 3 of 4 · Choose a layout. Your words and dates are your choice." : `Step ${draft.step} of 4 · Mark a moment in your own words.`}/></View>
    {draft.mode !== "preview" ? <CardSteps current={draft.step} onStep={draft.setStep}/> : null}
    {draft.mode === "templates" ? <CardTemplateGallery kind="milestone" value={draft.card} onChange={draft.update} onContinue={() => { draft.edit(); draft.setStep(3); }} loaded={draft.loaded} canReturn={draft.loaded && draft.status !== "absent"}/> : null}
    {draft.mode === "edit" && draft.step === 1 ? <>
      <Text style={styles.stepIntro}>Start with the moment and words you want to keep.</Text>
      <Field id="milestone-name" label="Display name (optional)" value={draft.card.displayName} onChange={(displayName) => draft.update({ displayName })}/>
      <Disclosure title="Title ideas (optional)"><Text style={styles.stepIntro}>These change the title. Your message and dates stay as you wrote them.</Text>{CARD_WORDING.map((wording) => <Pressable key={wording.label} accessibilityRole="button" onPress={() => draft.update({ title: wording.title })} style={{ minHeight: 48, justifyContent: "center", paddingVertical: 8 }}><Text style={{ color: palette.tealDark, fontSize: 18, fontWeight: "600" }}>{wording.label}</Text></Pressable>)}</Disclosure>
      <Field id="milestone-title" label="Card title" value={draft.card.title} onChange={(title) => draft.update({ title })}/>
      <Field id="milestone-message" label="Personal message (optional)" value={draft.card.message} onChange={(message) => draft.update({ message })} multiline limit={500}/>
      <Button title="Continue to optional extras" disabled={!draft.loaded} onPress={() => draft.setStep(2)}/>
    </> : null}
    {draft.mode === "edit" && draft.step === 2 ? <>
      <Text style={styles.stepIntro}>Add a date or photo only if you want one. You can leave both out.</Text>
      {cardTemplate(draft.card.templateId)?.photo || draft.card.photoRef ? <CardPhotoInput draft={draft}/> : null}
      <Disclosure title={draft.card.dateKind === "none" ? "Add an optional date" : "Date (included)"}><DateFields id="milestone-date" kind={draft.card.dateKind} value={draft.card.date} onKind={(dateKind) => draft.update({ dateKind })} onValue={(date) => draft.update({ date })}/></Disclosure>
      <Disclosure title="Optional wording"><Check label="Use the word “survivor”" checked={draft.card.useSurvivorWord} onChange={() => draft.update({ useSurvivorWord: !draft.card.useSurvivorWord })}/></Disclosure>
      <Button title="Back to your words" secondary onPress={() => draft.setStep(1)}/><Button title="Continue to choose a design" onPress={() => draft.setStep(3)}/>
    </> : null}
    {draft.mode === "edit" && draft.step === 3 ? <>
      <Text style={styles.stepIntro}>Choose the feeling of the card. Your words stay unchanged.</Text>
      <CardDesignPicker value={draft.card} onChange={draft.update} onChooseDesign={draft.chooseDesign} onUndo={draft.undoAppearance} canUndo={draft.canUndo}/>
      <Button title="Back to optional extras" secondary onPress={() => draft.setStep(2)}/><Button title="Review card" disabled={!draft.loaded || draft.photoBusy} onPress={draft.preview}/>
    </> : null}
    {draft.mode === "preview" ? <><Text style={styles.stepIntro}>Step 4 of 4 · Check the design, words and date before downloading.</Text><CardPreview view={view} photo={draft.photo}/><Button title="Edit card" secondary onPress={() => draft.setStep(3)}/><CardExports view={view} photo={draft.photo} processing={draft.photoBusy}/></> : null}
    {draft.mode !== "preview" ? <Text style={{ color: palette.text, fontSize: 16, marginVertical: 8 }}>Personal story/milestone — not medical advice or proof of diagnosis.</Text> : null}
    <SavedControls message={draft.message} loaded={draft.loaded} save={draft.save} remove={draft.remove} startBlank={draft.startBlank} processing={draft.photoBusy || draft.saveBusy}/><PrivacyNote />
  </AppPage>;
}
const styles = { stepIntro: { color: palette.text, fontSize: 18, lineHeight: 27, marginVertical: 10 } };
