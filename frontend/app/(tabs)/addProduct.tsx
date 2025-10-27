import React from "react";
import { StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";
// import ProductInfo from "@/components/add-product/ProductInfo";
import UploadImage from "@/components/add-product/UploadProduct";

export default function ProductPage() {
  return (
    <View style={styles.mainContainer}>
      <UploadImage />
      {/* <ProductInfo /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
});
