import { Image } from "react-native";
import { normalizeArtwork } from "./artwork.mjs";

const images: Record<string, number> = {
  ribbon: require("../../../assets/card-art/ribbon.png"),
  leaf: require("../../../assets/card-art/leaf.png"),
  shield: require("../../../assets/card-art/shield.png"),
  brain: require("../../../assets/card-art/brain.png"),
};
export function CardArtwork({ id, size = 72 }: { id: string; size?: number }) {
  const source = images[normalizeArtwork(id)];
  return source ? <Image source={source} accessible={false} aria-hidden style={{ width: size, height: size, flexShrink: 0 }} /> : null;
}
