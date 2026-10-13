import { Platform, Share } from "react-native";
import * as SecureStore from "expo-secure-store";
import { MILESTONE_CARD_KEY, PERSONAL_CARD_KEY, formatMilestoneCardExport, formatPersonalCardExport, parseMilestoneCard, parsePersonalCard, serializeMilestoneCard, serializePersonalCard, type MilestoneCard, type PersonalCard } from "./model.mjs";

const getItem = async (key: string) => Platform.OS === "web" ? globalThis.localStorage?.getItem(key) ?? null : SecureStore.getItemAsync(key);
const setItem = async (key: string, value: string) => { if (Platform.OS === "web") { if (!globalThis.localStorage) throw new Error("Browser local storage is unavailable"); globalThis.localStorage.setItem(key, value); return; } await SecureStore.setItemAsync(key, value); };
const removeItem = async (key: string) => { if (Platform.OS === "web") globalThis.localStorage?.removeItem(key); else await SecureStore.deleteItemAsync(key); };

export async function loadPersonalCard(): Promise<PersonalCard> { return parsePersonalCard(await getItem(PERSONAL_CARD_KEY)); }
export async function savePersonalCard(card: PersonalCard) { await setItem(PERSONAL_CARD_KEY, serializePersonalCard(card)); }
export async function deletePersonalCard() { await removeItem(PERSONAL_CARD_KEY); }
export async function loadMilestoneCard(): Promise<MilestoneCard> { return parseMilestoneCard(await getItem(MILESTONE_CARD_KEY)); }
export async function saveMilestoneCard(card: MilestoneCard) { await setItem(MILESTONE_CARD_KEY, serializeMilestoneCard(card)); }
export async function deleteMilestoneCard() { await removeItem(MILESTONE_CARD_KEY); }

async function exportText(title: string, text: string, filename: string) {
  if (Platform.OS === "web") { const blob = new Blob([text], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); return; }
  await Share.share({ title, message: text });
}
export const exportPersonalCard = (card: PersonalCard) => exportText("Personal information card", formatPersonalCardExport(card), "personal-information-card.txt");
export const exportMilestoneCard = (card: MilestoneCard) => exportText("Personal milestone card", formatMilestoneCardExport(card), "personal-milestone-card.txt");
export { MILESTONE_CARD_KEY, PERSONAL_CARD_KEY };
