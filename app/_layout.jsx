import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../src/auth/AuthContext";
import { View, ActivityIndicator } from "react-native";

function Gate({ children }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  );
}
