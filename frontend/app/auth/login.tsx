import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Theme, Colors, Gradients } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Login Page</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          placeholderTextColor={Theme.text}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Theme.text}
          secureTextEntry
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.replace("/(tabs)")}
          style={{ width: "100%", marginTop: 16 }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={Gradients.gradientButton}
            style={styles.button}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View>
          <Text style={{ marginTop: 16, color: Theme.text }}>or</Text>
        </View>

        <View style={styles.gmailContainer}>
          <Image
            source={require("../../assets/images/icon/gmail.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text>Continue with Gmail</Text>
        </View>

        <View style={{ marginTop: 16, flexDirection: "row" }}>
          <Text style={{ color: Theme.text }}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={{ color: Colors.link, fontStyle: "italic" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.primary,
  },
  container: {
    padding: 12,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Theme.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  gmailContainer: {
    // padding: 6,
    paddingVertical: 6,
    marginTop: 16,
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Theme.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.primary,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 50,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
