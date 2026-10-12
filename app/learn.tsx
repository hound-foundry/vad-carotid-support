import { Text } from "react-native";
import { AppPage, BackHome, Card, DraftNotice, PageHeading } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function LearnScreen() {
  return <AppPage><BackHome /><PageHeading eyebrow="Guide library" title="Clear explanations, with sources and limits." summary="Short English drafts for adults, families, carers and interested readers." /><DraftNotice /><Card title="Start with what you need"><GuideList /></Card><Card title="How to read this library"><Text style={{ color: "#576762", fontSize: 15, lineHeight: 24 }}>Each guide links its source material and records its audience, language, jurisdiction, rights basis and review state. All current guides remain drafts until clinical and lived-experience reviews are recorded.</Text></Card></AppPage>;
}
