import React from "react";
import { Text, StyleSheet, View } from "react-native";
import ImageContainer from "@/components/home/ImageContainer";
import { Theme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";

export default function ProdPageDetails() {
  const { product } = useLocalSearchParams();
  const parsedProduct = product ? JSON.parse(product as string) : null;

  if (!parsedProduct) return null;

  return (
    <View style={styles.container}>
      {/* PRODUCT IMAGE */}
      <View style={styles.imageWrapper}>
        <ImageContainer
          source={parsedProduct.src}
          width={432}
          height={200}
          style={styles.imageBorder}
        />
      </View>

      {/* PRODUCT DETAILS */}
      <View style={{ gap: 4 }}>
        <View style={styles.between}>
          <Text style={styles.title}>{parsedProduct.title}</Text>
          <Text style={[styles.title, { fontWeight: 600 }]}>
            QTY: {parsedProduct.qty}
          </Text>
        </View>
        <Text style={styles.price}>₱{parsedProduct.price}</Text>
        <View style={styles.between}>
          <Text style={styles.description}>{parsedProduct.description}</Text>
          <Text style={styles.tagChip}>Likely Used</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // MAIN LAYOUT
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.primary,
  },

  // LAYOUT & CONTAINER
  container: {
    paddingHorizontal: 12,
    backgroundColor: Theme.secondary,
    width: "100%",
    paddingVertical: 12,
  },

  // TYPOGRAPHY
  title: {
    color: "white",
    fontSize: 16,
  },
  description: {
    color: "white",
    fontSize: 12,
    fontStyle: "italic",
  },
  price: {
    color: "white",
    fontSize: 16,
  },
  location: {
    fontSize: 8,
    fontWeight: "600",
    color: "white",
  },

  // IMAGE BORDER
  imageBorder: {
    borderRadius: 12,
    overflow: "hidden",
  },

  // IMAGE WRAPPER
  imageWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  // POSITION
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  // TAG CHIP
  tagChip: {
    color: Theme.primary,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
  },
});
