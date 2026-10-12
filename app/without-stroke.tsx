import { AppPage, BackHome, Card, DraftNotice, PageHeading } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function WithoutStroke() {
  return <AppPage><BackHome /><PageHeading eyebrow="Dissection without a diagnosed stroke" title="Your experience still counts." summary="A pathway for people whose dissection was not accompanied by a diagnosed stroke, including questions about follow-up and life after diagnosis." /><DraftNotice /><Card title="Guides for this pathway"><GuideList slugs={["understanding-dissection", "tests-and-terms", "without-stroke", "recovery-and-quality-of-life", "follow-up-questions"]} /></Card></AppPage>;
}
