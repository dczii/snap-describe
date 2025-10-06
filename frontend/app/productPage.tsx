import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";
import ProdPageHeader from "@/components/product-page/prodPageHeader";
import ProdPageDetails from "@/components/product-page/prodPageDetails";
import ProdPageReview from "@/components/product-page/prodPageReview";
import ProdPageBar from "@/components/product-page/prodPageBar";

// interface Product {
//   id: number;
//   src: any;
//   title: string;
//   price: number;
//   rating: number;
//   location: string;
//   description: string;
//   sold: string;
//   comment: string;
// }

// interface ProductPageProps {
//   product: Product;
// }

export default function ProductPage() {
  return (
    <View style={styles.mainContainer}>
      {/* PRODUCT PAGE HEADER */}
      <ProdPageHeader />

      <ScrollView style={styles.scrollView}>
        <View style={{ gap: 4 }}>
          {/* PRODUCT DETAILS */}
          <ProdPageDetails />

          {/* BUYER'S REVIEW */}
          <ProdPageReview />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <ProdPageBar />
    </View>
  );
}

const styles = StyleSheet.create({
  // MAIN LAYOUT
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  scrollView: {
    flex: 1,
  },
});
