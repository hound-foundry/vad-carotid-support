import { Platform, Share } from "react-native";
import * as SecureStore from "expo-secure-store";
import { coordinateCardClearing, createCardStore } from "./storage.mjs";
import { MILESTONE_CARD_KEY, PERSONAL_CARD_KEY, formatMilestoneCardExport, formatPersonalCardExport, type MilestoneCard, type PersonalCard } from "./model.mjs";
import { cardPhotoStore } from "./photos.mjs";
import { registerLocalDataResource } from "../local-data/keys.mjs";

const getItem = async (key: string) => Platform.OS === "web" ? globalThis.localStorage?.getItem(key) ?? null : SecureStore.getItemAsync(key);
const setItem = async (key: string, value: string) => { if (Platform.OS === "web") { if (!globalThis.localStorage) throw new Error("Browser local storage is unavailable"); globalThis.localStorage.setItem(key, value); return; } await SecureStore.setItemAsync(key, value); };
const removeItem = async (key: string) => { if (Platform.OS === "web") { if (!globalThis.localStorage) throw new Error("Browser local storage is unavailable"); globalThis.localStorage.removeItem(key); } else await SecureStore.deleteItemAsync(key); };

const adapter = { getItem, setItem, removeItem };
export const personalCardStore = createCardStore(adapter, "personal",Platform.OS === "web"?cardPhotoStore:undefined);
export const milestoneCardStore = createCardStore(adapter, "milestone",Platform.OS === "web"?cardPhotoStore:undefined);
coordinateCardClearing([personalCardStore, milestoneCardStore]);
if(Platform.OS === "web")registerLocalDataResource("card-photos",()=>cardPhotoStore.clear());
export async function loadPersonalCard(): Promise<PersonalCard> { return await personalCardStore.load() as PersonalCard; }
export async function savePersonalCard(card: PersonalCard) { await personalCardStore.save(card); }
export async function deletePersonalCard() { await personalCardStore.remove(); }
export async function loadMilestoneCard(): Promise<MilestoneCard> { return await milestoneCardStore.load() as MilestoneCard; }
export async function saveMilestoneCard(card: MilestoneCard) { await milestoneCardStore.save(card); }
export async function deleteMilestoneCard() { await milestoneCardStore.remove(); }

async function exportText(title: string, text: string, filename: string) {
  if (Platform.OS === "web") { const blob = new Blob([text], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); return; }
  await Share.share({ title, message: text });
}
export const exportPersonalCard = (card: PersonalCard) => exportText("Personal information card", formatPersonalCardExport(card), "personal-information-card.txt");
export const exportMilestoneCard = (card: MilestoneCard) => exportText("Personal milestone card", formatMilestoneCardExport(card), "personal-milestone-card.txt");
export { MILESTONE_CARD_KEY, PERSONAL_CARD_KEY };
