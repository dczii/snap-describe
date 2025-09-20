import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  View,
  Pressable,
  SafeAreaView,
} from "react-native";
import ImageContainer from "@/components/cards/ImageContainer";
import Ratings from "@/components/cards/Ratings";
import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface Product {
  id: number;
  src: any;
  title: string;
  price: number;
  rating: number;
  location: string;
  description: string;
  sold: string;
  comment: string;
}

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

export default function ProductPage({ product, onBack }: ProductPageProps) {
  const handleBuyNow = () => {
    // Implement buy now logic
    console.log("Buy Now pressed");
  };

  const handleAddToCart = () => {
    // Implement add to cart logic
    console.log("Add to Cart pressed");
  };

  const handleMessage = () => {
    // Implement message seller logic
    console.log("Message Seller pressed");
  };

  const handleSellerProfile = () => {
    // Implement view seller profile logic
    console.log("View Seller Profile pressed");
  };

  return (
    <View style={styles.mainContainer}>
      {/* Product Page Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Back button */}
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </Pressable>

          {/* Right buttons */}
          <View style={styles.headerRight}>
            <Pressable style={styles.shareBtn}>
              <Ionicons name="share-social-outline" size={26} color="black" />
            </Pressable>
            <Pressable style={styles.menuBtn}>
              <Ionicons name="ellipsis-vertical" size={26} color="black" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <ImageContainer
          source={product.src}
          width={"100%"}
          height={200}
          borderRadius={12}
        />

        {/* Product Details */}
        <View style={{ gap: 4 }}>
          <View style={styles.container}>
            <View style={styles.between}>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={[styles.title, { fontWeight: 600 }]}>
                {product.sold}k Sold
              </Text>
            </View>
            <Text style={styles.price}>₱{product.price}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.between}>
              <Text style={styles.location}>{product.location}</Text>
              <Ratings value={product.rating} />
            </View>
          </View>

          {/* Buyer's Review */}
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
                  <Text style={styles.comment}>{product.comment}</Text>
                  <Text style={styles.comment}>{product.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Add bottom padding to ensure content doesn't get hidden behind bottom bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomRow}>
          {/* Left side - Secondary actions */}
          <View style={styles.secondaryActions}>
            <Pressable style={styles.iconButton} onPress={handleMessage}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={Theme.primary}
              />
              <Text style={styles.iconButtonText}>Message</Text>
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleSellerProfile}>
              <Ionicons name="person-outline" size={24} color={Theme.primary} />
              <Text style={styles.iconButtonText}>Seller</Text>
            </Pressable>
          </View>

          {/* Right side - Primary actions */}
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
  bottomSpacer: {
    height: 100,
  },

  // SAFE AREA
  safeArea: {
    backgroundColor: Theme.primary,
    marginTop: 24,
    marginBottom: 10,
  },

  // LAYOUT & CONTAINER
  header: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 12,
    backgroundColor: Theme.secondary,
    width: "100%",
    paddingVertical: 12,
  },
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

  // BOTTOM BAR STYLES
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: Theme.secondary,
    paddingBottom: 34,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: Theme.primary,
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
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ACTION & BUTTON
  backBtn: {
    alignSelf: "flex-start",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareBtn: {
    padding: 6,
    borderRadius: 8,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 20,
  },
  primaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  addToCartBtn: {
    backgroundColor: Theme.secondary,
    borderWidth: 2,
    borderColor: Theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buyNowBtn: {
    backgroundColor: Theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
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
  description: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
  },
  price: {
    color: "white",
    fontSize: 20,
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  iconButtonText: {
    fontSize: 12,
    color: Theme.primary,
    marginTop: 2,
    fontWeight: "500",
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buyNowText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // POSITION
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  commentBetween: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    marginTop: 12,
    marginBottom: 4,
  },
});
