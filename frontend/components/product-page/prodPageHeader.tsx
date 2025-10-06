import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProdPageHeader() {
  const handleOnBack = () => {
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleOnBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={26} color="black" />
          </Pressable>
          <Pressable style={styles.menuBtn}>
            <Ionicons name="ellipsis-vertical" size={26} color="black" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SAFE AREA
  safeArea: {
    backgroundColor: Theme.primary,
    marginBottom: 12,
  },

  // LAYOUT & CONTAINER
  header: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ACTION & BUTTON
  backBtn: {
    alignSelf: "flex-start",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareBtn: {
    padding: 6,
    borderRadius: 8,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
  },
});
