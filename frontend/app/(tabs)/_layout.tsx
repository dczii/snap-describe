import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabIcon from "@/components/cards/TabIcon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabConfig = {
    index: {
      title: "Home",
      icon: require("../../assets/images/icon/home.png"),
    },
    trade: {
      title: "Trade",
      icon: require("../../assets/images/icon/trade.png"),
    },
    message: {
      title: "Messages",
      icon: require("../../assets/images/icon/message.png"),
    },
    cart: {
      title: "Cart",
      icon: require("../../assets/images/icon/cart.png"),
    },
    profile: {
      title: "Profile",
      icon: require("../../assets/images/icon/profile.png"),
    },
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {Object.entries(tabConfig).map(([name, { title, icon }]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icon} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
