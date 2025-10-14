import { Theme } from "@/constants/theme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ViewOfferSeparator() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>View all offer</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  // LAYOUT
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.primary,
    paddingVertical: 12,
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
    marginHorizontal: 8,
  },

  // TYPOGRAPHY
  text: {
    color: "white",
    fontSize: 16,
  },
});
