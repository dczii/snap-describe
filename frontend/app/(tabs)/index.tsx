import ImageContainer from "@/components/cards/ImageContainer";
import { Colors, Theme } from "@/constants/theme";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import SearchBar from "@/components/cards/SearchBar";
import React, { useState, useMemo } from "react";
import CategoryChips from "@/components/cards/Category";
import BannerCarousel from "@/components/cards/Banner";
import Ratings from "@/components/cards/Ratings";
import { useRouter } from "expo-router";
import ProductPage from "@/components/cards/ProductPage";

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

  const products = [
    {
      id: 1,
      src: require("../../assets/image/coat.png"),
      title: "Winter Coat",
      price: 190,
      rating: 5,
      description: "Very comfortable coat, better for office",
      sold: 1.1,
      location: "Bulacan",
      comment: "Not bad for second hand. very comfortable.",
    },
    {
      id: 2,
      src: require("../../assets/image/shoes.png"),
      title: "Jordan Nike",
      price: 200,
      rating: 4,
      description: "Suitable for sports activities.",
      sold: 1.4,
      location: "Manila",
      comment: "Wow fantastic baby!.",
    },
    {
      id: 3,
      src: require("../../assets/image/fashion.png"),
      title: "Louis Vuitton",
      price: 300,
      rating: 5,
      description: "Very elegant look.",
      sold: 5.1,
      location: "Manila",
      comment: "Niceee bag",
    },
    {
      id: 4,
      src: require("../../assets/image/jewelry-set.png"),
      title: "Jewelry Set",
      price: 500,
      rating: 4,
      description: "So clean, so good.",
      sold: 1.4,
      location: "Laguna",
      comment: "Beautiful!!!",
    },
    {
      id: 5,
      src: require("../../assets/image/sunglass.png"),
      title: "Shades",
      price: 100,
      rating: 3,
      description: "I see what you can't",
      sold: 1.3,
      location: "Quezon City",
      comment: "I believe i can fly",
    },
    {
      id: 6,
      src: require("../../assets/image/pearl.png"),
      title: "Sling Bag",
      price: 200,
      rating: 5,
      description: "The bag for self defense.",
      sold: 12,
      location: "Manila",
      comment: "Worth it!",
    },
  ];

  // PRODUCT FILTER
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products.filter((p) => {
      const t = p.title.toLowerCase();
      const matchText = !q || t.includes(q);
      const matchCat = !category || t.includes(category.toLowerCase());
      return matchText && matchCat;
    });
  }, [query, category, products]);

  // NAVIGATION HANDLER
  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
  };

  const renderItem = ({ item }: any) => (
    <View style={Styles.card}>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <ImageContainer
          source={item.src}
          width={"100%"}
          height={100}
          borderRadius={10}
        />
      </TouchableOpacity>

      <Text style={Styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={Styles.price}>₱{item.price}</Text>

      <View style={Styles.between}>
        <Text style={Styles.location}>{item.location}</Text>
        <Ratings value={item.rating} />
      </View>
    </View>
  );

  // PRODUCT DETAIL PAGE
  if (selectedProduct) {
    return (
      <ProductPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  // PRODUCT LIST PAGE
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 64 }}>
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
