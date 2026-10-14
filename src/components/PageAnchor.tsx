import { useRef, type ReactNode, type RefObject } from "react";
import { Platform, type LayoutChangeEvent, type ScrollView as NativeScrollView, type View as NativeView } from "react-native";
import { View } from "./Ui";

/** Move inside the page without scrolling the persistent header off screen. */
export function usePageAnchor(scrollRef: RefObject<NativeScrollView | null>) {
  const ref = useRef<NativeView>(null);
  const y = useRef(0);
  return {
    ref,
    onLayout: (event: LayoutChangeEvent) => { y.current = event.nativeEvent.layout.y; },
    jump: () => {
      scrollRef.current?.scrollTo({ y: y.current, animated: false });
      if (Platform.OS === "web") (ref.current as unknown as HTMLElement | null)?.focus({ preventScroll: true });
    },
  };
}

export function PageAnchor({ anchor, label, children }: { anchor: ReturnType<typeof usePageAnchor>; label: string; children: ReactNode }) {
  return <View ref={anchor.ref} onLayout={anchor.onLayout} collapsable={false}
    {...(Platform.OS === "web" ? { role: "group" as const, tabIndex: -1 as const, "aria-label": label } : {})}>
    {children}
  </View>;
}
