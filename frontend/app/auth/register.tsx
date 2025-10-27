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
import { Formik } from "formik";
import * as Yup from "yup";

type FormProps = {
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required("Fullname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .min(11, "Min 11 digits")
    .required("Phone number is required"),
  password: Yup.string().min(6, "Min 6 char").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const apiURL = process.env.EXPO_PUBLIC_API_URL;

export default function Register() {
  const handleRegister = async (values: FormProps) => {
    try {
      const {
        fullname = "",
        email = "",
        phoneNumber = "",
        password = "",
        confirmPassword = "",
      } = values;
      const url = `${apiURL}/v1/auth/mobile/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          phoneNumber,
          email,
          password,
          confirmPassword,
        }),
      });

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

      <Formik
        initialValues={{
          fullname: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleRegister(values)}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleChange, handleSubmit, errors, values }) => (
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
                value={values.fullname}
                onChangeText={handleChange("fullname")}
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
                value={values.email}
                onChangeText={handleChange("email")}
              />
              {errors.email && (
                <Text style={styles.errorFull}>{errors.email}</Text>
              )}
            </View>

            <View>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="0917-218-6677"
                placeholderTextColor={Colors.placeholder}
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
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
                value={values.password}
                onChangeText={handleChange("password")}
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
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorFull}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </Formik>
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
