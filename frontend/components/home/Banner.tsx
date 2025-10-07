import { Colors, Theme } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const BannerCarousel = ({ images }: { images: any[] }) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<any>>(null);

  const slideWidth = width - 24;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / slideWidth);
    setIndex(i);
  };

  return (
    <View style={styles.banner}>
      <FlatList
        ref={listRef}
        data={images}
        horizontal
        pagingEnabled
        snapToInterval={slideWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => `banner-${i}`}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={[styles.image, { width: slideWidth }]}
            resizeMode="cover"
          />
        )}
      />
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: { marginTop: 6, gap: 12 },
  image: { aspectRatio: 16 / 9, borderRadius: 12, gap: 12 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  dotActive: { backgroundColor: "white" },
});

export default BannerCarousel;
