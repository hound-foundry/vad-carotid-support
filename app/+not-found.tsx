import { AppPage, BackHome, PageHeading } from "../src/components/AppPage";

export default function NotFound() {
  return <AppPage><PageHeading compact eyebrow="Page unavailable" title="Page not found" summary="That link is unavailable. Choose Home or Menu to find a guide or tool." /><BackHome /></AppPage>;
}
