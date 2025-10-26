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
import { Formik } from "formik";
import * as Yup from "yup";

type FormProps = {
  email?: string;
  password?: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password is required"),
});

const apiURL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();

  const handleLogin = async (values: FormProps) => {
    try {
      const { email = "", password = "" } = values;
      const response = await fetch(`${apiURL}/v1/auth/mobile/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

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
        {/* SNAP LOGO */}
        <Image
          source={require("../../assets/logos/thrift-logo.png")}
          style={styles.logo}
        />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleChange, handleSubmit, errors, values }) => (
            <View style={styles.insideContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or Phone"
                placeholderTextColor={Theme.text}
                value={values.email}
                onChangeText={handleChange("email")}
              />
              {errors.email && (
                <Text style={styles.errorFull}>{errors.email}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Theme.text}
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
              />
              {errors.email && (
                <Text style={styles.errorFull}>{errors.password}</Text>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={(e) => handleSubmit()}
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
            </View>
          )}
        </Formik>

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
    paddingHorizontal: 32,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 32,
    width: "100%",
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
  insideContainer: {
    width: "100%",
    alignItems: "center",
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

  // LOGO
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 32,
  },

  // TYPOGRAPHY
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
