const Colors = {
  primary: "#1A2D42",
  secondary: "#2E4156",
  rates: "#FFC107",
  background: "#1A2D42",
  text: "#1A2D42",
  link: "#0069AA",
  error: "#EC6A59",
  placeholder: "rgba(26, 45, 66, 0.6)",
};

export const Theme = {
  background: Colors.background,
  text: Colors.text,
  primary: "#1A2D42",
  secondary: "#2E4156",
  rates: "#FFC107",
};

const Gradients = {
  gradientButton: ["#1A2D42", "#2E4156", "#2E4156", "#1A2D42"] as const,
  gradientRegister: ["#C5C6C7", "#1A2D42"] as const,
};

export { Colors, Gradients };
