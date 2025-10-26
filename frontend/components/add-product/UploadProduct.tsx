import { Theme } from "@/constants/theme";
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function UploadImage() {
  const prepareProductData = (asset: ImagePicker.ImagePickerAsset) => {
    return {
      imageUri: asset.uri,
      fileName: asset.fileName ?? asset.uri.split("/").pop() ?? "photo.jpg",
      type: asset.type ?? "image",
      name: "",
      category: "",
      price: 0,
    };
  };

  // CAMERA
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const productData = prepareProductData(asset);
      console.log(
        "📸 JSON Payload (Camera):",
        JSON.stringify(productData, null, 2)
      );

      // Navigate to product info page
      router.push({
        pathname: "/ProductInfo",
        params: productData,
      });
    }
  };

  // GALLERY
  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const productData = prepareProductData(asset);
      console.log(
        "🖼️ JSON Payload (Gallery):",
        JSON.stringify(productData, null, 2)
      );

      // Navigate to product info page
      router.push({
        pathname: "/ProductInfo",
        params: productData,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* GALLERY */}
        <TouchableOpacity style={styles.card} onPress={handleGalleryPress}>
          <Image
            source={require("@/assets/icon/upload-image.png")}
            style={styles.image}
          />
          <Text style={styles.title}>Upload from Gallery</Text>
          <Text style={styles.subtitle}>
            Choose an existing image from your device
          </Text>
        </TouchableOpacity>

        <Text style={styles.separator}>OR</Text>

        {/* CAMERA */}
        <TouchableOpacity style={styles.card} onPress={handleCameraPress}>
          <Image
            source={require("@/assets/icon/camera-ai.png")}
            style={styles.image}
          />
          <Text style={styles.title}>AI Camera Capture</Text>
          <Text style={styles.subtitle}>
            Take a new photo for product recognition
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // LAYOUT
  safeArea: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  // CONTAINER
  card: {
    backgroundColor: Theme.secondary,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "85%",
    maxWidth: 350,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 12,
  },

  // IMAGE FORMAT
  image: {
    width: 123,
    height: 117,
    marginBottom: 16,
  },

  // TYPOGRAPHY
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    lineHeight: 20,
  },
  separator: {
    fontSize: 14,
    color: "white",
    marginVertical: 8,
  },
});
