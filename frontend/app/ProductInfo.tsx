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
import { Theme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import AddProductHeader from "@/components/add-product/AddProductHeader";
import { useRouter } from "expo-router";
import { useProductStore } from "@/store/productStore";
import { useState } from "react";
import { accessToken, MOBILE_API_URL } from "@/utils/authUtils";
import { Picker } from "@react-native-picker/picker";
import { CreateListMutation } from "@/utils/graphql/mutations";

export default function ProductInfo() {
  const productData = useLocalSearchParams();
  const { addProduct } = useProductStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Brand New");

  const apiUrl = MOBILE_API_URL;
  const getSignedUrl = async (filename: string) => {
    const res = await fetch(`${apiUrl}/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        images: [
          { filename, mimeType: "image/png" },
          { filename, mimeType: "image/jpeg" },
          { filename, mimeType: "image/jpg" },
        ],
      }),
    });
    const data = await res.json();
    return data[0];
  };

  const uploadToSignedUrl = async (signedUrl: string, imageUri: string) => {
    const image = await fetch(imageUri);
    const blob = await image.blob();

    const upload = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
      },
      body: blob,
    });

    if (!upload.ok) throw new Error("Upload failed");
  };

  const createListing = async (filePath: string) => {
    const variables = {
      data: {
        title: name,
        description: "test",
        price: Number(price),
        qty: 100,
        condition: "New",
        categoryId: 1,
        notes: "Test",
        imageFilePaths: [filePath],
      },
    };

    try {
      const res = await fetch(`${apiUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: CreateListMutation, variables }),
      });

      const text = await res.text();

      // 🔍 Debugging output
      console.log("⚠️ Response status:", res.status);
      console.log("⚠️ Raw response text:", text.slice(0, 200));

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      if (text.startsWith("<")) {
        throw new Error(
          "Server returned HTML instead of JSON. Check your API URL or dev tunnel."
        );
      }

      const data = JSON.parse(text);

      if (!data?.data?.createListing?.message) {
        throw new Error("Invalid response format from server.");
      }

      return data.data.createListing.message;
    } catch (error) {
      console.error("createListing failed:", error);
      throw error;
    }
  };

  const handlePublish = async () => {
    try {
      const filename = "image_" + Date.now() + ".png";
      const { signedUrl, filePath } = await getSignedUrl(filename);
      await uploadToSignedUrl(signedUrl, productData.imageUri as string);

      const message = await createListing(filePath);

      addProduct({
        id: Date.now().toString(),
        title: name,
        price: Number(price),
        imageUri: productData.imageUri as string,
        location: "Manila",
      });

      alert(message);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Error uploading product");
    }
  };

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
              {productData?.imageUri ? (
                <Image
                  source={{ uri: productData.imageUri as string }}
                  style={styles.imageLarge}
                />
              ) : (
                <Text style={styles.placeholderText}>+ Add Product Image</Text>
              )}
            </View>
          </View>

          {/* PRODUCT INFO */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>PRODUCT INFO</Text>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="NAME"
                placeholderTextColor={Theme.primary}
                value={name}
                onChangeText={setName}
              />
              <View style={[styles.pickerContainer, { flex: 1 }]}>
                <Picker
                  selectedValue={condition}
                  onValueChange={(value) => setCondition(value)}
                  style={styles.picker}
                  dropdownIconColor={Theme.primary}
                >
                  <Picker.Item label="Brand New" value="Brand New" />
                  <Picker.Item label="Like New" value="Like New" />
                  <Picker.Item label="Used" value="Used" />
                </Picker>
              </View>
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="₱"
                placeholderTextColor={Theme.primary}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="QUANTITY"
                placeholderTextColor={Theme.primary}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="PRODUCT DESCRIPTION"
              placeholderTextColor={Theme.primary}
              multiline
              maxLength={200}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="NOTES"
              placeholderTextColor={Theme.primary}
              multiline
              maxLength={200}
            />

            <TextInput
              style={styles.input}
              placeholder="CATEGORY"
              placeholderTextColor={Theme.primary}
            />

            {/* PUBLISH BUTTON */}
            <TouchableOpacity
              style={styles.publishButton}
              onPress={handlePublish}
            >
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
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    color: Theme.primary,
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
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "center",
  },
  picker: {
    color: Theme.primary,
    opacity: 0.8,
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
    color: "white",
    fontSize: 16,
  },
  publishText: {
    color: Theme.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
