import { View, Text, StyleSheet } from "react-native";

export default function Login() {
  return (
    <View>
      <Text style={styles.title}>Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "white",
    padding: 32,
  },
});
