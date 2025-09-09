import { Theme, Colors, Gradients } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Register() {
  return (
    <View style={styles.containerTop}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require("../../assets/images/icon/back-arrow.png")} />
      </TouchableOpacity>

      <LinearGradient
        colors={Gradients.gradientRegister}
        start={{ x: 1.2, y: 1.5 }}
        end={{ x: 1.3, y: 0.6 }}
        style={styles.container}
      >
        <View>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Dela Cruz"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="juandelacruz@gmail.com"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View>
          <Text style={styles.label}>Phone +</Text>
          <TextInput
            style={styles.input}
            placeholder="0917-218-6677"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View style={styles.inputBetween}>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter Password"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    margin: 16,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 64,
    width: "100%",
    height: "auto",
    backgroundColor: Theme.primary,
    borderRadius: 12,
    gap: 20,

    elevation: 10,
    shadowColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "white",
    padding: 12,
    fontSize: 16,
    width: "100%",
  },
  inputBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  field: {
    flex: 1,
  },
  button: {
    backgroundColor: Theme.primary,
    borderRadius: 50,
    color: "white",
    padding: 12,

    marginTop: 32,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
