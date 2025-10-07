import React from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";

export default function ProdPageReview() {
  const { product } = useLocalSearchParams();
  const parsedProduct = product ? JSON.parse(product as string) : null;

  if (!parsedProduct) return null;
  return (
    <>
      {/* BUYER'S REVIEW */}
      <View style={styles.subContainer}>
        <View style={{ gap: 12 }}>
          <View style={styles.between}>
            <Text style={[styles.title, { fontStyle: "italic" }]}>
              Buyer's Review
            </Text>
            <Text style={styles.subTitle}>5.0 Ratings</Text>
          </View>
          <View style={styles.commentContainer}>
            <View style={[styles.between, { paddingHorizontal: 9 }]}>
              <Image
                source={require("@/assets/image/josh-profile.png")}
                style={styles.profile}
                resizeMode="cover"
              />
              <Text style={styles.comment}>{parsedProduct.comment}</Text>
              <Text style={styles.comment}>{parsedProduct.rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // LAYOUT & CONTAINER
  subContainer: {
    paddingHorizontal: 12,
    backgroundColor: Theme.secondary,
    width: "100%",
    paddingVertical: 12,
  },
  commentContainer: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 12,
  },
  profile: {
    backgroundColor: Theme.primary,
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  // TYPOGRAPHY
  title: {
    color: "white",
    fontSize: 20,
  },
  subTitle: {
    color: "white",
    fontSize: 16,
  },
  comment: {
    color: Theme.text,
    fontSize: 14,
    padding: 4,
  },

  // POSITION
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },
});
