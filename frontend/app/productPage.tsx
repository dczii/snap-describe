import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";
import ProdPageHeader from "@/components/product-page/prodPageHeader";
import ProdPageDetails from "@/components/product-page/prodPageDetails";
import ProdPageNotes from "@/components/product-page/prodPageNotes";
import ProdPageSeller from "@/components/product-page/prodPageSeller";
import ProdPageBar from "@/components/product-page/prodPageBar";
import ViewOfferSeparator from "@/components/product-page/viewOfferSeparator";
import OfferCard from "@/components/product-page/yourOffer";

export default function ProductPage() {
  return (
    <View style={styles.mainContainer}>
      {/* HEADER */}
      <ProdPageHeader />

      {/* CONTENT */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProdPageDetails />
        <ProdPageNotes />
        <ProdPageSeller />
        <ViewOfferSeparator />
        <OfferCard />
      </ScrollView>

      {/* BOTTOM BAR */}
      <ProdPageBar />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
    gap: 4,
  },
});
