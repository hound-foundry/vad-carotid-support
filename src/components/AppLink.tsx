import { Link as RouterLink } from "expo-router";
import { cloneElement, isValidElement, type ComponentProps, type ReactElement } from "react";
import { StyleSheet } from "react-native";

// Expo Router's Slot requires an object style on its immediate child. Arrays or
// Pressable callbacks are otherwise merged into invalid DOM style properties.
export function Link(props: ComponentProps<typeof RouterLink>) {
  let children = props.children;
  if (props.asChild && isValidElement(children)) {
    const child = children as ReactElement<{ style?: any }>;
    const style = typeof child.props.style === "function" ? child.props.style({ pressed: false }) : child.props.style;
    children = cloneElement(child, { style: StyleSheet.flatten(style) });
  }
  return <RouterLink {...props}>{children}</RouterLink>;
}
