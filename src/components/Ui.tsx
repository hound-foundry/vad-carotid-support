import { createContext, createElement, forwardRef, useContext } from "react";
import { Platform, Pressable as NativePressable, ScrollView as NativeScrollView, StyleSheet, Text as NativeText, TextInput as NativeTextInput, View as NativeView, type PressableProps, type ScrollViewProps, type TextInputProps, type TextProps, type ViewProps } from "react-native";
import { SafeAreaView as NativeSafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";
import { useAccessibility } from "../features/accessibility/AccessibilityProvider";
import type { AccessibilitySettings } from "../features/accessibility/model.mjs";
import { themeFor, themedColour, defaultTextColour, fontStack } from "./theme";

const TextNesting = createContext(false);
function resolveStyle(style: any, settings: AccessibilitySettings, text = false, nested = false) {
  const flattened = StyleSheet.flatten(style) ?? {};
  const numeric = Object.keys(flattened).filter((key) => /^\d+$/.test(key));
  const flat = { ...(numeric.length ? StyleSheet.flatten(numeric.map((key) => (flattened as any)[key])) : {}), ...flattened } as Record<string, any>;
  for (const key of numeric) delete flat[key];
  for (const key of Object.keys(flat)) if (key.endsWith("Color") || key === "color") flat[key] = themedColour(flat[key], key, settings);
  if (text) { flat.fontFamily = Platform.OS === "web" ? fontStack : undefined; flat.color = defaultTextColour(flat.color, nested, settings); }
  if (text && (!nested || typeof flat.fontSize === "number")) {
    const base = typeof flat.fontSize === "number" ? flat.fontSize : 18;
    const size = Math.max(18, base) * settings.textScale;
    flat.fontSize = size;
    flat.lineHeight = Math.max(size * (settings.spacing === "roomy" ? 1.75 : 1.5), (flat.lineHeight ?? 0) * settings.textScale);
  }
  return flat;
}

export const Text = forwardRef<NativeText, TextProps>(function Text(props, ref) {
  const { settings } = useAccessibility(); const nested = useContext(TextNesting);
  return <TextNesting.Provider value={true}><NativeText {...props} ref={ref} style={resolveStyle(props.style, settings, true, nested)} /></TextNesting.Provider>;
});
export const View = forwardRef<NativeView, ViewProps>(function View(props, ref) {
  const { settings } = useAccessibility(); return <NativeView {...props} ref={ref} style={resolveStyle(props.style, settings)} />;
});
export const Pressable = forwardRef<NativeView, PressableProps & { onKeyDown?: (event: any) => void }>(function Pressable(props, ref) {
  const { settings } = useAccessibility();
  const state = props.accessibilityState;
  const webState = Platform.OS === "web" ? { "aria-checked": state?.checked, "aria-expanded": state?.expanded, "aria-disabled": state?.disabled, "aria-busy": state?.busy, ...(props.accessibilityRole === "button" ? { "aria-pressed": state?.selected } : { "aria-selected": state?.selected }) } : {};
  const keyboard = Platform.OS === "web" ? { onKeyDown: (event: any) => {
    props.onKeyDown?.(event);
    // React Native Web does not activate a div with role=link on Enter.
    // Router anchors already have native keyboard activation.
    const nonNative = !["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(event.currentTarget.tagName);
    const enterLink = event.key === "Enter" && props.accessibilityRole === "link";
    const spaceChoice = event.key === " " && ["checkbox", "radio"].includes(props.accessibilityRole ?? "");
    if (!event.defaultPrevented && nonNative && (enterLink || spaceChoice) && !props.disabled) {
      event.preventDefault(); props.onPress?.(event);
    }
  } } : {};
  return <NativePressable {...props} {...webState} {...keyboard} ref={ref} style={(state) => { const style = resolveStyle(typeof props.style === "function" ? props.style(state) : props.style, settings); return { ...style, minHeight: Math.max(48, style.minHeight ?? 0) }; }} />;
});
export const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput(props, ref) {
  const { settings } = useAccessibility();
  const inputName = (props as any).name ?? props.nativeID ?? props.accessibilityLabel?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "text-input";
  const inputId = props.nativeID ?? inputName;
  const resolvedStyle: any = { ...resolveStyle(props.style, settings, true), minHeight: 52, borderColor: themeFor(settings).controlLine };
  if (Platform.OS === "web") {
    const nativeProps = props as any;
    const describedBy = nativeProps["aria-describedby"];
    const { paddingHorizontal, paddingVertical, ...resolvedForWeb } = resolvedStyle;
    const webStyle = {
      ...resolvedForWeb,
      lineHeight: typeof resolvedStyle.lineHeight === "number" ? `${resolvedStyle.lineHeight}px` : resolvedStyle.lineHeight,
      paddingLeft: paddingHorizontal ?? resolvedStyle.paddingLeft,
      paddingRight: paddingHorizontal ?? resolvedStyle.paddingRight,
      paddingTop: paddingVertical ?? resolvedStyle.paddingTop,
      paddingBottom: paddingVertical ?? resolvedStyle.paddingBottom,
    } as any;
    const webProps = {
      id: inputId,
      name: inputName,
      autoComplete: nativeProps.autoComplete ?? "off",
      "aria-label": props.accessibilityLabel,
      "aria-describedby": describedBy,
      value: props.value,
      defaultValue: props.defaultValue,
      placeholder: props.placeholder,
      maxLength: props.maxLength,
      disabled: props.editable === false || nativeProps.disabled,
      readOnly: props.editable === false,
      spellCheck: props.autoCorrect !== false,
      type: props.secureTextEntry ? "password" : props.returnKeyType === "search" ? "search" : "text",
      rows: props.multiline ? 4 : undefined,
      onChange: (event: any) => props.onChangeText?.(event.currentTarget.value),
      onFocus: props.onFocus,
      onBlur: props.onBlur,
      onKeyDown: props.onKeyPress,
      ref: ref as any,
      style: webStyle,
    };
    return createElement(props.multiline ? "textarea" : "input", webProps);
  }
  return <NativeTextInput {...props} nativeID={inputId} ref={ref} placeholderTextColor={themeFor(settings).muted} style={resolvedStyle} />;
});
export const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(function ScrollView(props, ref) {
  const { settings } = useAccessibility(); return <NativeScrollView {...props} ref={ref} style={resolveStyle(props.style, settings)} contentContainerStyle={resolveStyle(props.contentContainerStyle, settings)} />;
});
export const SafeAreaView = forwardRef<NativeView, SafeAreaViewProps>(function SafeAreaView(props, ref) {
  const { settings } = useAccessibility(); return <NativeSafeAreaView {...props} ref={ref} style={resolveStyle(props.style, settings)} />;
});
