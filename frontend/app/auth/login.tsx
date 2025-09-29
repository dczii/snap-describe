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
import { useState } from "react";

type Errors = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email.trim()) newErrors.email = "Required to fill.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password.trim()) newErrors.password = "Required to fill.";
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://snap-describe-production.up.railway.app/v1/auth/mobile/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login Successfully");
        router.replace("/(tabs)");
      } else {
        const message =
          data.message !== "Incorrect email or password."
            ? "Login failed"
            : data.message;
        alert(message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Login Page</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          placeholderTextColor={Theme.text}
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorFull}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Theme.text}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.email && (
          <Text style={styles.errorFull}>{errors.password}</Text>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogin}
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
            source={require("../../assets/icon/gmail.png")}
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
  // CONTAINERS
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

    // SHADOW STYLING
    shadowColor: Theme.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  gmailContainer: {
    paddingVertical: 6,
    marginTop: 16,
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    shadowColor: Theme.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },

  // TYPOGRAPHY
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.text,
  },
  errorFull: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
    flexWrap: "wrap",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // INPUTS
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

  // BUTTONS
  button: {
    backgroundColor: Theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
});
