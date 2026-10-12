import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { Text } from "react-native";

export default function UrgentHelpScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Urgent help" title="Contact local emergency services now." summary="If you think someone may be having a stroke or another medical emergency, contact the emergency services where you are now." /><Card title="Do not wait for this app"><Text style={{ color: "#576762", fontSize: 15, lineHeight: 24 }}>This app cannot assess symptoms, tell you whether it is a stroke or contact emergency services. Do not wait for an appointment or use these pages to decide whether urgent help is needed.</Text></Card><Text style={{ color: "#596861", fontSize: 13, lineHeight: 20, marginTop: 8 }}>This page provides no local phone number because country-specific emergency information has not been verified for release.</Text></AppPage>;
}
