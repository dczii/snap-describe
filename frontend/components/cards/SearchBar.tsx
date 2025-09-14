import { Colors, Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Where ever you go, where ever you do."
        placeholderTextColor={Colors.text}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity style={styles.iconBtn} onPress={onSearch}>
        <Ionicons name="search" size={22} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 26,
    paddingLeft: 18,
    paddingRight: 8,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Theme.primary,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontStyle: "italic",
  },
  iconBtn: {
    height: 38,
    width: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
