import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UrgentHelpScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.page}>
        <Link href="/" asChild><Pressable accessibilityRole="link"><Text style={styles.back}>‹  Home</Text></Pressable></Link>
        <Text style={styles.label}>URGENT HELP</Text>
        <Text style={styles.title}>Sudden stroke signs need emergency help.</Text>
        <Text style={styles.body}>Call the emergency number where you are now. Do not wait for an appointment or rely on this app to assess symptoms.</Text>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>This page is a draft</Text>
          <Text style={styles.body}>Local emergency numbers, warning signs and approved wording need review for each country before this app is released there.</Text>
        </View>
        <Text style={styles.footer}>This project cannot diagnose symptoms or contact emergency services for you.</Text>
      </View>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:"#F7F8F5"},page:{width:"100%",maxWidth:760,alignSelf:"center",padding:26},back:{color:"#537670",fontSize:14,paddingVertical:18},label:{marginTop:25,color:"#A24B34",fontSize:11,fontWeight:"700",letterSpacing:1.5},title:{marginTop:12,color:"#263D3A",fontSize:31,lineHeight:39,fontWeight:"600"},body:{marginTop:14,color:"#576762",fontSize:16,lineHeight:25},callout:{marginTop:29,padding:19,borderRadius:15,backgroundColor:"#FFF2E9",borderWidth:1,borderColor:"#E9C4A9"},calloutTitle:{color:"#743C2E",fontSize:16,fontWeight:"600"},footer:{marginTop:34,color:"#7B8781",fontSize:13,lineHeight:21}});
