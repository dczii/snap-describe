import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
  View,
  ViewStyle,
  DimensionValue,
} from "react-native";

interface ImageContainerProps {
  source: ImageSourcePropType;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
  imageStyle?: ImageStyle | ImageStyle[];
  title?: string;
  description?: string;
  price?: number;
  sold?: number;
  location?: string;
  comment?: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  source,
  width = 100,
  height = 100,
  borderRadius = 10,
  style,
  imageStyle,
  title,
  description,
  price,
  sold,
  location,
  comment,
}) => {
  return (
    <View style={[{ width, height, borderRadius, overflow: "hidden" }, style]}>
      <Image
        source={source}
        style={[{ width: "100%", height: "100%", borderRadius }, imageStyle]}
        resizeMode="cover"
      />
    </View>
  );
};

export default ImageContainer;
