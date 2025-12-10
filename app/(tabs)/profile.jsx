import { View, Text, Button } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
export default function Profile() {
  const { user, signOut } = useAuth();
  return (
    <View
      style={{ flex: 1, padding: 16, paddingTop: 80, backgroundColor: "white" }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Profile
      </Text>
      <Text style={{ marginBottom: 12 }}>Signed in as {user?.email}</Text>
      <Button color="#FFC400" title="Sign Out" onPress={signOut} />
    </View>
  );
}
