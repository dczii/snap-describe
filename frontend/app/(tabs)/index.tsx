import ImageContainer from "@/components/cards/ImageContainer";
import { Colors, Theme } from "@/constants/theme";
import { View, StyleSheet, Image, FlatList, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const products = [
    {
      id: 1,
      src: require("../../assets/image/coat.png"),
      title: "Winter Coat",
      price: 190,
      rating: 4,
    },
    {
      id: 2,
      src: require("../../assets/image/shoes.png"),
      title: "Jordan Nike",
      price: 200,
      rating: 5,
    },
    {
      id: 3,
      src: require("../../assets/image/fashion.png"),
      title: "Louis Vuitton",
      price: 300,
      rating: 5,
    },
    {
      id: 4,
      src: require("../../assets/image/jewelry-set.png"),
      title: "Jewelry Set",
      price: 500,
      rating: 4,
    },
    {
      id: 5,
      src: require("../../assets/image/sunglass.png"),
      title: "Shades",
      price: 100,
      rating: 3,
    },
    {
      id: 6,
      src: require("../../assets/image/pearl.png"),
      title: "Sling Bag",
      price: 200,
      rating: 5,
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={Styles.card}>
      <ImageContainer
        source={item.src}
        width={"100%"}
        height={100}
        borderRadius={10}
      />

      <Text style={Styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={Styles.price}>₱{item.price}</Text>

      <View style={Styles.between}>
        <Text style={Styles.location}>Bulacan</Text>
        <View style={Styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? "star" : "star-outline"}
              size={10}
              color={Colors.rates}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={Styles.banner}>
        <Image
          source={require("../../assets/image/ads-sample.png")}
          style={Styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={Styles.productsContainer}>
        <FlatList
          data={products}
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
  banner: {
    padding: 12,
    marginTop: 64,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  grid: {
    paddingHorizontal: 2,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: Theme.primary,
    borderRadius: 10,
    padding: 6,
    elevation: 8,
  },
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
    marginTop: 6,
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  productsContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "rgba(46, 65, 86, 0.8)",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
