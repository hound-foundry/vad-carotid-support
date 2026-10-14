import { Text, View } from "../../components/Ui";
import type { CardPresentation } from "./model.mjs";
import type { CardPhotoAsset } from "./CardDraftProvider";
export function CardCompositionPreview({ view }: {
    view: CardPresentation;
    photo?: CardPhotoAsset | null;
}) { return <View><Text accessibilityRole="header" aria-level={2}>{view.title}</Text>{view.fields.map(field => <View key={field.id}><Text>{field.label}</Text><Text>{field.value}</Text></View>)}<Text>{view.footer}</Text><Text>Designed image previews are available on the website.</Text></View>; }
