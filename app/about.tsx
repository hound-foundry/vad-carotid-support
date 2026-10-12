import { Text } from "react-native";
import { AppPage, BackHome, Card, PageHeading } from "../src/components/AppPage";
import { languagePlan } from "../src/content/locales";
import market from "../src/content/marketReadiness.json";

export default function About() {
  return <AppPage><BackHome /><PageHeading eyebrow="About this project" title="Built to make the next step feel a little clearer." summary="A free, independent, open-source Hound Foundry community project for adults affected by vertebral or carotid artery dissection, families, carers and interested readers." />
    <Card title="What this project is"><Text style={styles.body}>This is an early development preview, not a charity, healthcare provider or medical service. It does not diagnose, interpret scans, recommend medication, estimate individual risk, clear activity or replace a clinician. Personal questions about diagnosis, tests and treatment belong with the person’s own care team.</Text></Card>
    <Card title="Clinical and lived-experience review"><Text style={styles.body}>All guides are original drafts with linked sources and recorded review fields. No clinician or patient/carer usability review has yet been recorded. The app must not publish these guides as approved patient information until qualified review is documented.</Text><Text style={styles.body}>The user-suggested 2017 book is listed bibliographically as an external reading resource. Its chapters and stories are not reproduced or translated.</Text></Card>
    <Card title="Privacy and open source"><Text style={styles.body}>No account, analytics, advertising, sync service or backend is part of V1. Appointment sheets are stored on your device only when you choose Save. Web storage uses your browser profile’s local storage; native storage uses Expo SecureStore. Each has different device and backup behavior, so neither guarantees privacy. See the repository privacy documentation before storing sensitive notes.</Text><Text style={styles.body}>The source code uses the project’s existing open-source licence, and authored guide content uses its existing content licence. The app is free to use; it has no donation, advertising or story-submission feature.</Text></Card>
    <Card title="Languages"><Text style={styles.body}>English is the only authored language in this preview. These languages are planned in stages, only after qualified human review of the interface and guides: {languagePlan.slice(1).map((language) => language.name).join(", ")}.</Text></Card>
    <Card title="International release"><Text style={styles.body}>Worldwide release is currently blocked. {market.notes.join(" ")} No local emergency numbers or country-specific legal claims are provided.</Text></Card>
  </AppPage>;
}

const styles = { body: { color: "#576762", fontSize: 14, lineHeight: 22, marginTop: 7 } };
