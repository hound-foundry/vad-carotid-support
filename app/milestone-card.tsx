import { useEffect, useRef } from "react";
import type { View as NativeView } from "react-native";
import { AppPage, BackHome, PageHeading, palette } from "../src/components/AppPage";
import { Text, View } from "../src/components/Ui";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { Button, CardExports, CardPreview, Check, DateFields, Disclosure, Field, PrivacyNote, SavedControls } from "../src/features/cards/CardUi";
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
    return <AppPage><BackHome /><View ref={stageRef} nativeID="milestone-stage"><PageHeading compact eyebrow="Card" title={draft.mode === "preview" ? "Review your card" : draft.mode === "templates" ? "Choose a personal card design" : "Anniversary or milestone card"} summary={draft.mode === "preview" ? "Download a personal card to keep or share yourself." : draft.mode === "templates" ? "Choose a layout. Your words and dates are your choice." : "Mark a moment in your own words. Dates and “survivor” wording are optional."}/></View>
    {draft.mode === "templates" ? <CardTemplateGallery kind="milestone" value={draft.card} onChange={draft.update} onContinue={draft.edit} loaded={draft.loaded}/> : null}
    {draft.mode === "edit" ? <>
      <Field id="milestone-name" label="Display name (optional)" value={draft.card.displayName} onChange={(displayName) => draft.update({ displayName })}/>
      <Disclosure title="Title ideas (optional)"><Text style={{ color: palette.text, fontSize: 18 }}>These change the title. Your message and dates stay as you wrote them. You can write your own title below.</Text>{CARD_WORDING.map((wording) => <Pressable key={wording.label} accessibilityRole="button" onPress={() => draft.update({ title: wording.title })} style={{ minHeight: 48, justifyContent: "center", paddingVertical: 8 }}><Text style={{ color: palette.tealDark, fontSize: 18, fontWeight: "600" }}>{wording.label}</Text></Pressable>)}</Disclosure>
      <Field id="milestone-title" label="Card title" value={draft.card.title} onChange={(title) => draft.update({ title })}/>
      <Field id="milestone-message" label="Personal message (optional)" value={draft.card.message} onChange={(message) => draft.update({ message })} multiline limit={500}/>
      {cardTemplate(draft.card.templateId)?.photo || draft.card.photoRef ? <CardPhotoInput draft={draft}/> : null}
      <CardDesignPicker value={draft.card} onChange={draft.update} onChooseDesign={draft.chooseDesign} onUndo={draft.undoAppearance} canUndo={draft.canUndo}/>
      <Button title="Review card" disabled={!draft.loaded || draft.photoBusy} onPress={draft.preview}/>
      <Disclosure title={draft.card.dateKind === "none" ? "Add an optional date" : "Date (included)"}><DateFields id="milestone-date" kind={draft.card.dateKind} value={draft.card.date} onKind={(dateKind) => draft.update({ dateKind })} onValue={(date) => draft.update({ date })}/></Disclosure>
      <Disclosure title="Optional wording"><Check label="Use the word “survivor”" checked={draft.card.useSurvivorWord} onChange={() => draft.update({ useSurvivorWord: !draft.card.useSurvivorWord })}/></Disclosure>
      <Text style={{ color: palette.text, fontSize: 16, marginVertical: 8 }}>Personal story/milestone — not medical advice or proof of diagnosis.</Text>
    </> : draft.mode === "preview" ? <><CardPreview view={view} photo={draft.photo}/><Button title="Edit card" secondary onPress={draft.edit}/><CardExports view={view} photo={draft.photo} processing={draft.photoBusy}/></> : null}
    {draft.mode === "templates" ? <Text style={{ fontSize: 18, color: palette.text, marginVertical: 8 }}>Personal story/milestone — not medical advice or proof of diagnosis.</Text> : null}
    <SavedControls message={draft.message} loaded={draft.loaded} save={draft.save} remove={draft.remove} startBlank={draft.startBlank} processing={draft.photoBusy || draft.saveBusy}/><PrivacyNote />
  </AppPage>;
}
