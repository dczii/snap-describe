import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Login Page</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ marginTop: 16, color: "#1A2D42" }}>or</Text>
        </View>

        <View style={styles.gmailContainer}>
          <Image
            source={require("../../assets/images/icon/gmail.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text>Continue with Gmail</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={{ marginTop: 16, color: "#1A2D42" }}>
            Don’t have an account?{" "}
            <Text style={{ color: "#0069AA", fontStyle: "italic" }}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A2D42",
  },
  container: {
    padding: 12,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
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
    shadowColor: "#000",
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
    color: "#1A2D42",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1A2D42",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 50,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1A2D42",
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
