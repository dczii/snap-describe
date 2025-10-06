import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProdPageBar() {
  const handleBuyNow = () => {};

  const handleAddToCart = () => {};

  const handleMessage = () => {};

  const handleSellerProfile = () => {};

  return (
    <>
      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomRow}>
          <View style={styles.secondaryActions}>
            <Pressable style={styles.iconButton} onPress={handleSellerProfile}>
              <Ionicons name="person" size={32} color={Theme.primary} />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleMessage}>
              <Ionicons name="chatbubble" size={32} color={Theme.primary} />
            </Pressable>
          </View>

          <View style={styles.primaryActions}>
            <Pressable style={styles.addToCartBtn} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </Pressable>

            <Pressable style={styles.buyNowBtn} onPress={handleBuyNow}>
              <Text style={styles.buyNowText}>Buy Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // BOTTOM BAR STYLES
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: Theme.secondary,
    paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 12,
    shadowColor: Theme.secondary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },

  // ACTION & BUTTON
  secondaryActions: {
    flexDirection: "row",
    gap: 32,
  },
  primaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  addToCartBtn: {
    backgroundColor: Theme.secondary,
    borderWidth: 2,
    borderColor: Theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: 117,
    height: 44,
  },
  buyNowBtn: {
    backgroundColor: Theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: 117,
    height: 44,
  },

  // TYPOGRAPHY
  addToCartText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  buyNowText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
