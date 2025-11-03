import ImageContainer from "@/components/home/ImageContainer";
import { Colors } from "@/constants/theme";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import SearchBar from "@/components/home/SearchBar";
import React, { useState, useMemo } from "react";
import CategoryChips from "@/components/home/Category";
import BannerCarousel from "@/components/home/Banner";
import Ratings from "@/components/home/Ratings";
import { useRouter } from "expo-router";
import { useProductStore } from "@/store/productStore";

const CATEGORIES = [
  "Likes",
  "Accessory",
  "Top picks",
  "Gadget",
  "Trayhde",
  "Fashion",
];

const BANNERS = [
  require("../../assets/image/ads-sample.png"),
  require("../../assets/image/ads-sample.png"),
  require("../../assets/image/ads-sample.png"),
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const router = useRouter();

  const { products } = useProductStore();

  // PRODUCT FILTER
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products.filter((p: { title: string }) => {
      const t = p.title.toLowerCase();
      const matchText = !q || t.includes(q);
      const matchCat = !category || t.includes(category.toLowerCase());
      return matchText && matchCat;
    });
  }, [query, category, products]);

  // NAVIGATION HANDLER
  const handleProductPress = (product: string) => {
    router.push({
      pathname: "/productPage",
      params: { product: JSON.stringify(product) },
    });
  };

  const renderItem = ({ item }: any) => (
    <View style={Styles.card}>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <ImageContainer
          source={item.imageUri ? { uri: item.imageUri } : item.src}
          width={"100%"}
          height={100}
          borderRadius={10}
        />

        <Text style={Styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={Styles.price}>₱{item.price}</Text>

        <View style={Styles.between}>
          <Text style={Styles.location}>{item.location}</Text>
          <Ratings value={item.rating} />
        </View>
      </TouchableOpacity>
    </View>
  );

  // PRODUCT LIST PAGE
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 32 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSearch={() => console.log("Searching:", query)}
        />
      </View>

      <View>
        <CategoryChips data={CATEGORIES} onChange={setCategory} />
      </View>

      {/* Banner */}
      <View style={Styles.banner}>
        <BannerCarousel images={BANNERS} />
      </View>

      {/* Products */}
      <View style={Styles.productsContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={Styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  // CONTAINERS & LAYOUT
  banner: {
    padding: 12,
    marginTop: 6,
  },
  grid: {
    paddingHorizontal: 2,
    paddingBottom: 24,
  },
  productsContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },

  // CARDS
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 6,
    elevation: 8,
    minWidth: "30%", // 👈 ensures 3 columns stay aligned
    maxWidth: "30%",
    alignSelf: "stretch",
  },

  // TYPOGRAPHY
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    marginTop: 6,
  },
  location: {
    fontSize: 8,
    fontWeight: "600",
    color: "white",
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
  },

  // BUTTONS & ACTIONS
  backBtn: {
    color: "white",
    marginBottom: 24,
    marginTop: 32,
  },
});
