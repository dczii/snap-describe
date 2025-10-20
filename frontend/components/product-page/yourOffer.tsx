import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";

export default function OfferCard() {
  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image
          source={require("@/assets/image/josh-profile.png")}
          style={styles.profile}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Your Offer</Text>
          <Text style={styles.description}>
            Offering: Blue leather jacket{"\n"}only 2 used
          </Text>
        </View>
        <Text style={styles.price}>₱ 190</Text>
      </View>

      {/* Bottom Section */}
      <TouchableOpacity style={styles.bottomSection} activeOpacity={0.7}>
        <Text style={styles.bottomText}>Set date expiration:</Text>
        <Ionicons name="chevron-forward" size={18} color={Theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // LAYOUT
  card: {
    backgroundColor: Theme.secondary,
    overflow: "hidden",
    marginVertical: 10,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d1d5db",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // TYPOGRAPHY
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 18,
  },
  price: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomText: {
    color: "#000",
    fontSize: 15,
  },

  // IMAGE
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.primary,
  },
});
