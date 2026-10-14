import { View } from "../src/components/Ui";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { palette } from "../src/components/AppPage";
import { webStyles } from "../src/components/webStyles";
import { SiteHeader } from "../src/components/SiteHeader";
import { AppNavigation } from "../src/components/AppNavigation";
import { AccessibilityProvider, useAccessibility } from "../src/features/accessibility/AccessibilityProvider";
import { CardDraftProvider } from "../src/features/cards/CardDraftProvider";
import { ReadingSessionProvider } from "../src/features/reading-session/ReadingSessionProvider";
import { themeFor } from "../src/components/theme";
import { APP_NAME } from "../src/brand.mjs";

export default function RootLayout() {
  useEffect(() => { if (Platform.OS === "web" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") void navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  return (
    <SafeAreaProvider>
      <AccessibilityProvider>
      <CardDraftProvider>
      <ReadingSessionProvider>
      <View style={styles.root}>
        <Head>
          <title>{APP_NAME}</title>
          <meta name="description" content="Free, open-source information and appointment preparation for adults affected by vertebral or carotid artery dissection, families and carers." />
          <meta name="theme-color" content={palette.paper} />
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="VAD Support" />
          <style>{webStyles}</style>
        </Head>
        <AppShell />
      </View>
      </ReadingSessionProvider>
      </CardDraftProvider>
      </AccessibilityProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const [navigationHeight, setNavigationHeight] = useState(80);
  return <View style={styles.shell}>
    <SiteHeader bottomNavigationHeight={navigationHeight} />
    <View style={styles.screen}><AppStack /></View>
    <AppNavigation onHeightChange={setNavigationHeight} />
  </View>;
}

function AppStack() { const { settings } = useAccessibility(); return <><StatusBar style={settings.theme === "dark" ? "light" : "dark"} /><Stack screenOptions={{ headerShown: false, animation: "none", contentStyle: { backgroundColor: themeFor(settings).paper } }} /></>; }

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.paper },
  shell: { flex: 1, minHeight: 0 },
  screen: { flex: 1, minHeight: 0 },
});
