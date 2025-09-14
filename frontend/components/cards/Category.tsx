// components/CategoryChips.tsx
import { Colors, Theme } from "@/constants/theme";
import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from "react-native";

type Props = {
  data: string[];
  onChange?: (value: string | null) => void; // returns selected or null if deselected
  initial?: string | null;
};

export default function CategoryChips({
  data,
  onChange,
  initial = null,
}: Props) {
  const [active, setActive] = useState<string | null>(initial);

  const toggle = (item: string) => {
    const next = active === item ? null : item;
    setActive(next);
    onChange?.(next);
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      ListHeaderComponent={<View style={{ width: 12 }} />}
      ListFooterComponent={<View style={{ width: 12 }} />}
      renderItem={({ item }) => {
        const selected = active === item;
        return (
          <TouchableOpacity
            onPress={() => toggle(item)}
            activeOpacity={0.8}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <Text style={[styles.text, selected && styles.textActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
  },
  chip: {
    marginRight: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Theme.primary,
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  text: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  chipActive: {
    backgroundColor: Colors.background,
  },
  textActive: {
    color: "white",
  },
});
