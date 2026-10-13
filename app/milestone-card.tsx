import { useEffect, useRef } from "react";
import type { View as NativeView } from "react-native";
import { AppPage, BackHome, PageHeading, palette } from "../src/components/AppPage";
import { Text, View } from "../src/components/Ui";
import { useCardDrafts } from "../src/features/cards/CardDraftProvider";
import { Button, CardExports, CardPreview, Check, DateFields, Disclosure, Field, PrivacyNote, SavedControls } from "../src/features/cards/CardUi";
import { milestoneCardPresentation } from "../src/features/cards/model.mjs";

export default function MilestoneCardScreen() {
  const { milestone: draft } = useCardDrafts(); const first = useRef(true); const stageRef = useRef<NativeView>(null);
  const view = milestoneCardPresentation(draft.card);
  useEffect(() => { if (first.current) { first.current = false; return; } if (typeof document === "undefined") return; const target = stageRef.current as unknown as HTMLElement | null; if (target?.getClientRects().length) { target.setAttribute("tabindex", "-1"); target.focus(); target.scrollIntoView({ block: "start", behavior: "instant" }); } }, [draft.mode]);
  return <AppPage><BackHome /><View ref={stageRef} nativeID="milestone-stage"><PageHeading eyebrow={draft.mode === "preview" ? "Card · preview" : "Card · edit"} title={draft.mode === "preview" ? "Review your card" : "Anniversary or milestone card"} summary={draft.mode === "preview" ? "Download a personal card to keep or share yourself." : "Mark a moment in your own words. Dates and “survivor” wording are optional."} /></View>
    {draft.mode === "edit" ? <>
      <Field id="milestone-name" label="Display name (optional)" value={draft.card.displayName} onChange={(displayName) => draft.update({ displayName })} />
      <Field id="milestone-title" label="Card title" value={draft.card.title} onChange={(title) => draft.update({ title })} />
      <Field id="milestone-message" label="Personal message (optional)" value={draft.card.message} onChange={(message) => draft.update({ message })} multiline limit={500} />
      <Button title="Review card" disabled={!draft.loaded} onPress={draft.preview} />
      <Disclosure title={draft.card.dateKind === "none" ? "Add an optional date" : "Date (included)"}><DateFields id="milestone-date" kind={draft.card.dateKind} value={draft.card.date} onKind={(dateKind) => draft.update({ dateKind })} onValue={(date) => draft.update({ date })} /></Disclosure>
      <Disclosure title="Optional wording"><Check label="Use the word “survivor”" checked={draft.card.useSurvivorWord} onChange={() => draft.update({ useSurvivorWord: !draft.card.useSurvivorWord })} /></Disclosure>
      <Text style={{ color: palette.text, fontSize: 16, marginVertical: 8 }}>Personal story/milestone — not medical advice or proof of diagnosis.</Text>
    </> : <><CardPreview view={view} /><Button title="Edit card" secondary onPress={draft.edit} /><CardExports view={view} /></>}
    <SavedControls message={draft.message} loaded={draft.loaded} save={draft.save} remove={draft.remove} startBlank={draft.startBlank} /><PrivacyNote />
  </AppPage>;
}
