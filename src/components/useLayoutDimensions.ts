import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

const exportedDimensions = { width: 0, height: 0, scale: 1, fontScale: 1 };

// Static HTML has no viewport. Match that first render during web hydration,
// then use the actual responsive layout. Native screens use their size at once.
export function useLayoutDimensions() {
  const dimensions = useWindowDimensions();
  const [ready, setReady] = useState(Platform.OS !== "web");
  useEffect(() => { setReady(true); }, []);
  return ready ? dimensions : exportedDimensions;
}
