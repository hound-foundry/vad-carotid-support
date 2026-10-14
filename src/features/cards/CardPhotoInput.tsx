import { Text } from "../../components/Ui";
import type { DraftController } from "./CardDraftProvider";
export function CardPhotoInput({ draft }: {
    draft: DraftController<any>;
}) { return draft.card.photoRef ? <Text>Personal photos can be edited and exported on the website.</Text> : <Text>Optional personal photos are available on the website.</Text>; }
