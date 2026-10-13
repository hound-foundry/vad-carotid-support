import { Link, Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../src/components/AppPage";
import { SiteHeader } from "../src/components/SiteHeader";
import { AccessibilityProvider } from "../src/features/accessibility/AccessibilityProvider";

export default function RootLayout() {
  useEffect(() => { if (Platform.OS === "web" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") void navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  return (
    <SafeAreaProvider>
      <AccessibilityProvider>
      <StatusBar style="dark" />
      <View style={styles.root}>
        <Head>
          <title>VAD &amp; Carotid Support</title>
          <meta name="description" content="Free, open-source information and appointment preparation for adults affected by vertebral or carotid artery dissection, families and carers." />
          <meta name="theme-color" content="#F3F7F6" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="VAD Support" />
          <style>{`html{scroll-behavior:smooth}body{margin:0}button,a,input,textarea{font:inherit}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #D69A3A;outline-offset:3px}#skip-to-content:focus-visible{opacity:1} [data-vad-theme="dark"]{color-scheme:dark} [data-vad-theme="dark"] body{background:#102626!important} [data-vad-theme="dark"] input,[data-vad-theme="dark"] textarea{background:#173636!important;color:#F4FAF8!important;border-color:#6EAAA0!important} [data-vad-contrast="high"]{color-scheme:light} [data-vad-contrast="high"] body{background:#FFFFFF!important;color:#111111!important} [data-vad-contrast="high"] a,[data-vad-contrast="high"] button{ text-decoration-thickness:2px } [data-vad-contrast="high"] button:focus-visible,[data-vad-contrast="high"] a:focus-visible,[data-vad-contrast="high"] input:focus-visible,[data-vad-contrast="high"] textarea:focus-visible{outline:4px solid #000000!important;outline-offset:4px} [data-vad-reduced-motion="true"] *,[data-vad-reduced-motion="true"] *::before,[data-vad-reduced-motion="true"] *::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0.01ms!important} @media print{body{background:#FFFFFF!important;color:#111111!important}#urgent-banner,#site-header,#skip-to-content,[data-testid="site-footer"],button,input,textarea,[role="button"]{display:none!important}a{color:#111111!important;text-decoration:none!important}*{box-shadow:none!important}}`}</style>
        </Head>
        <SafeAreaView testID="urgent-banner" style={styles.urgentSafe} edges={["top"]}>
          <Link href="/urgent-help" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Urgent help: contact local emergency services now" style={styles.urgent}>
              <Text style={styles.urgentText}>Urgent help: contact local emergency services now</Text>
              <Text aria-hidden style={styles.arrow}>›</Text>
            </Pressable>
          </Link>
        </SafeAreaView>
        <SiteHeader />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.paper } }} />
      </View>
      </AccessibilityProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.paper },
  urgentSafe: { backgroundColor: palette.alert },
  urgent: { zIndex: 1, minHeight: 46, paddingHorizontal: 19, backgroundColor: palette.alert, borderBottomWidth: 1, borderBottomColor: "#E6C7B9", flexDirection: "row", alignItems: "center", gap: 12 },
  urgentText: { flex: 1, color: palette.alertInk, fontSize: 13, lineHeight: 19, fontWeight: "800" },
  arrow: { color: palette.alertInk, fontSize: 22 },
});
