import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../src/components/AppPage";
import { SiteHeader } from "../src/components/SiteHeader";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.root}>
        <SafeAreaView style={styles.urgentSafe} edges={["top"]}>
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
