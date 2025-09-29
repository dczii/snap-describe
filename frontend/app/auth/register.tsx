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
import { useState } from "react";

type Errors = {
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!fullname.trim()) newErrors.fullname = "Required to fill.";

    if (!email.trim()) newErrors.email = "Required to fill.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";

    const phoneRegex = /^(\+63|0)\d{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Required to fill.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format.";
    }

    if (!password) {
      newErrors.password = "Required to fill.";
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).*$/.test(password)
    ) {
      newErrors.password =
        "Password must be 8+ characters, include 1 uppercase, 1 number, and 1 special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Required to fill.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://snap-describe-production.up.railway.app/v1/auth/mobile/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname, phoneNumber, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registered successfully");
        router.replace("/auth/login");
      } else {
        const message =
          data.message !== "Incorrect email or password."
            ? "Register failed"
            : data.message;
        alert(message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.containerTop}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require("../../assets/icon/back-arrow.png")} />
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
            value={fullname}
            onChangeText={setFullname}
          />
          {errors.fullname && (
            <Text style={styles.errorFull}>{errors.fullname}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="juandelacruz@gmail.com"
            placeholderTextColor={Colors.placeholder}
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorFull}>{errors.email}</Text>}
        </View>

        <View>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="0917-218-6677"
            placeholderTextColor={Colors.placeholder}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorFull}>{errors.phoneNumber}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={styles.errorFull}>{errors.password}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorFull}>{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  //  CONTAINERS
  containerTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    margin: 16,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    width: "100%",
    backgroundColor: Theme.primary,
    borderRadius: 12,
    gap: 20,

    // SHADOW STYLING
    elevation: 10,
    shadowColor: "white",
  },

  //  NAVIGATION / ICONS
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

  //  TYPOGRAPHY
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
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
    textAlign: "center",
  },

  //  INPUT FIELDS
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

  //  BUTTONS
  button: {
    backgroundColor: Theme.primary,
    borderRadius: 50,
    padding: 12,
    marginTop: 32,
  },
});
