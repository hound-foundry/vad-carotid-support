import { AppPage, BackHome, Card, DraftNotice, PageHeading } from "../src/components/AppPage";
import { GuideList } from "../src/components/GuideList";

export default function WithStroke() {
  return <AppPage><BackHome /><PageHeading eyebrow="Dissection accompanied by stroke" title="Recovery is more than what other people can see." summary="A pathway for questions about rehabilitation, communication, fatigue, daily life and support." /><DraftNotice /><Card title="Guides for this pathway"><GuideList slugs={["understanding-dissection", "tests-and-terms", "with-stroke", "recovery-and-quality-of-life", "follow-up-questions"]} /></Card></AppPage>;
}
