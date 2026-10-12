import { Text } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function SupportingSomeone() {
  return <AppPage><BackHome /><PageHeading eyebrow="For family, friends and carers" title="Being there can start with listening." summary="Support the person’s choices, help with practical steps when invited, and ask what would make care conversations easier." /><DraftNotice /><Card title="Guides for carers"><GuideList audience="carer" slugs={["understanding-dissection", "tests-and-terms", "with-stroke", "recovery-and-quality-of-life", "supporting-someone", "follow-up-questions"]} /></Card><Card title="Respect the person’s privacy"><Text style={{ color: "#576762", fontSize: 15, lineHeight: 24 }}>Do not share another person’s health information unless they have chosen to share it. You can keep your own questions separately and ask the care team what support is available to carers.</Text></Card></AppPage>;
}
