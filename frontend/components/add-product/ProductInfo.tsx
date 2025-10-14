import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddProductHeader from "./AddProductHeader";
import { Theme } from "@/constants/theme";

export default function ProductInfo() {
  return (
    <>
      <AddProductHeader />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* IMAGE PLACEHOLDER */}
          <View style={styles.leftWrapper}>
            <Text style={styles.title}>SELL ITEM</Text>
          </View>

          <View style={styles.centerWrapper}>
            <View style={[styles.card, { paddingVertical: 16 }]}>
              <Text style={styles.placeholderText}>+ Add Product Image</Text>
            </View>
          </View>

          {/* PRODUCT INFO */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>PRODUCT INFO</Text>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="NAME"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CONDITION"
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="PRICE"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="QUANTITY"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="PRODUCT DESCRIPTION"
              placeholderTextColor="#ccc"
              multiline
              maxLength={200}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="NOTES"
              placeholderTextColor="#ccc"
              multiline
              maxLength={200}
            />

            <TextInput
              style={styles.input}
              placeholder="CATEGORY"
              placeholderTextColor="#ccc"
            />

            {/* PUBLISH BUTTON */}
            <TouchableOpacity style={styles.publishButton}>
              <Text style={styles.publishText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // LAYOUTS
  safeArea: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  centerWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  leftWrapper: {
    width: "85%",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  formContainer: {
    width: "85%",
    maxWidth: 400,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  // CONTAINERS
  card: {
    backgroundColor: Theme.secondary,
    width: "85%",
    height: 252,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLarge: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  input: {
    backgroundColor: Theme.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    color: "white",
    opacity: 0.8,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  publishButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  // TYPOGRAPHY
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "left",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
  publishText: {
    color: Theme.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
