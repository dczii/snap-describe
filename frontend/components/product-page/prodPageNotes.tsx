import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";

export default function ProdPageNotes() {
  return (
    <View style={styles.container}>
      <View style={styles.notesWrapper}>
        <Text style={styles.title}>Notes:</Text>
        <Text style={styles.subTitle}>
          Offer request preferred same type of clothing, blue and can wear in
          cold place also need to be formal.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // LAYOUT & CONTAINER
  container: {
    paddingHorizontal: 12,
    backgroundColor: Theme.secondary,
    width: "100%",
    paddingVertical: 12,
  },

  notesWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 9,
    gap: 4,
  },

  // TYPOGRAPHY
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    color: "white",
    fontSize: 12,
    lineHeight: 16,
  },
});
