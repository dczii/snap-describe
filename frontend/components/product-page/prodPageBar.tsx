import React from "react";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import { Theme } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProdPageBar() {
  const insets = useSafeAreaInsets();

  const handleMakeItYours = () => {};

  const handleTrade = () => {};

  return (
    <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.primaryActions}>
        <Pressable style={styles.tradeBtn} onPress={handleTrade}>
          <View style={styles.btnContent}>
            <Image
              source={require("@/assets/icon/trade-white.png")}
              style={styles.imageIcon}
              resizeMode="contain"
            />
            <Text style={styles.tradeText}>Exchange</Text>
          </View>
        </Pressable>

        <Pressable style={styles.makeItYoursBtn} onPress={handleMakeItYours}>
          <View style={styles.btnContent}>
            <Image
              source={require("@/assets/icon/bag.png")}
              style={styles.imageIcon}
              resizeMode="contain"
            />
            <Text style={styles.makeItYoursText}>Make It Yours</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // LAYOUT
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: Theme.secondary,
    paddingTop: 12,
    paddingHorizontal: 12,
    shadowColor: Theme.secondary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },

  primaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  // BUTTONS
  tradeBtn: {
    backgroundColor: Theme.secondary,
    borderWidth: 2,
    borderColor: Theme.primary,
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  makeItYoursBtn: {
    backgroundColor: Theme.primary,
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  // TYPHOGRAPHY
  tradeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  makeItYoursText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  // ICON
  imageIcon: {
    width: 20,
    height: 20,
  },
});
