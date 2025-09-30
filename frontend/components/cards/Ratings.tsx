import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface RatingsProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
}

export default function Ratings({
  value,
  max = 5,
  size = 8,
  color = Colors.rates,
}: RatingsProps) {
  return (
    <View style={Styles.between}>
      {Array.from({ length: max }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < value ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      ))}
    </View>
  );
}

const Styles = StyleSheet.create({
  // POSITION
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
