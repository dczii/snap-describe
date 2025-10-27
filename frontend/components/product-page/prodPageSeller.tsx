import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";

export default function ProdPageSeller() {
  return (
    <View style={styles.container}>
      {/* PROFILE & DETAILS */}
      <View style={styles.leftSection}>
        <Image
          source={require("@/assets/image/josh-profile.png")}
          style={styles.profile}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>Joshua colobong</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="white" />
            <Text style={styles.locationText}>Novaliches</Text>
          </View>
        </View>
      </View>

      {/* RATING */}
      <View style={styles.ratingContainer}>
        <View style={styles.between}>
          <Text style={styles.ratingText}>4.9</Text>
          <Ionicons name="star" size={12} color={Theme.rates} />
        </View>
        <Text style={styles.ratingLabel}>Ratings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // POSITION & LAYOUT
  container: {
    backgroundColor: Theme.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
    marginBottom: 4,
  },

  // IMAGE
  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.primary,
  },

  // TEXT & TYPOGRAPHY
  infoContainer: {
    marginLeft: 10,
    flexDirection: "column",
  },

  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    color: "white",
    fontSize: 13,
    marginLeft: 2,
  },

  ratingContainer: {
    flexDirection: "column",
    alignItems: "center",
  },

  ratingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  ratingLabel: {
    color: "white",
    fontSize: 12,
  },
});
