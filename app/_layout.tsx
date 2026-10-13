import { Link } from "../src/components/AppLink";
import { Pressable, Text, View, SafeAreaView } from "../src/components/Ui";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { palette } from "../src/components/AppPage";
import { webStyles } from "../src/components/webStyles";
import { SiteHeader } from "../src/components/SiteHeader";
import { AccessibilityProvider, useAccessibility } from "../src/features/accessibility/AccessibilityProvider";
import { CardDraftProvider } from "../src/features/cards/CardDraftProvider";
import { themeFor } from "../src/components/theme";

export default function RootLayout() {
  useEffect(() => { if (Platform.OS === "web" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") void navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  return (
    <SafeAreaProvider>
      <AccessibilityProvider>
      <CardDraftProvider>
      <View style={styles.root}>
        <Head>
          <title>VAD &amp; Carotid Support</title>
          <meta name="description" content="Free, open-source information and appointment preparation for adults affected by vertebral or carotid artery dissection, families and carers." />
          <meta name="theme-color" content="#F3F7F6" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="VAD Support" />
          <style>{webStyles}</style>
        </Head>
        <SafeAreaView testID="urgent-banner" style={styles.urgentSafe} edges={["top"]}>
          <Link href="/urgent-help" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Urgent help" style={styles.urgent}>
              <Text style={styles.urgentText}>Urgent help</Text>
              <Text aria-hidden style={styles.arrow}>›</Text>
            </Pressable>
          </Link>
        </SafeAreaView>
        <SiteHeader />
        <AppStack />
      </View>
      </CardDraftProvider>
      </AccessibilityProvider>
    </SafeAreaProvider>
  );
}

function AppStack() { const { settings } = useAccessibility(); return <><StatusBar style={settings.theme === "dark" ? "light" : "dark"} /><Stack screenOptions={{ headerShown: false, animation: "none", contentStyle: { backgroundColor: themeFor(settings).paper } }} /></>; }

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.paper },
  urgentSafe: { backgroundColor: palette.alert },
  urgent: { zIndex: 1, minHeight: 46, paddingHorizontal: 19, backgroundColor: palette.alert, borderBottomWidth: 1, borderBottomColor: "#E6C7B9", flexDirection: "row", alignItems: "center", gap: 12 },
  urgentText: { flex: 1, color: palette.alertInk, fontSize: 13, lineHeight: 19, fontWeight: "800" },
  arrow: { color: palette.alertInk, fontSize: 22 },
});
