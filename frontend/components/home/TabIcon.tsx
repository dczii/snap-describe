import React from "react";
import { Image } from "react-native";

type Props = {
  source: any;
  focused: boolean;
};

export default function TabIcon({ source, focused }: Props) {
  return (
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? "#1A2D42" : "gray",
      }}
      resizeMode="contain"
    />
  );
}
