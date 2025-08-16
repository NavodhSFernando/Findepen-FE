import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import MenuItem from "@/components/ui/MenuItem";
import * as SecureStore from "expo-secure-store";
import useUser from "@/hooks/useUser";

const More = () => {
  const router = useRouter();

  // Use the user hook to get real user data
  const { profile, loading, error } = useUser();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    router.push("/login");
    console.log("Logged out");
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <ParallaxScrollView
          headerBackgroundColor={{
            light: Colors.secondary,
            dark: Colors.secondary,
          }}
          headerImage={
            <View style={styles.headerContainer}>
              <Image
                source={require("@/assets/images/logos/Asset8.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
          }
        >
          <View style={styles.bodyContainer}>
            <Text style={styles.name}>{profile?.Name || "User"}</Text>
            <Text style={styles.email}>
              {profile?.Email || "user@example.com"}
            </Text>
            <View style={styles.divider} />
            <MenuItem
              icon="user"
              title="Edit Profile"
              onPress={() => router.push("/more/profile")}
            />
            <MenuItem
              icon="repeat"
              title="Recurring Transactions"
              onPress={() => router.push("/more/recurring")}
            />
            <MenuItem
              icon="settings"
              title="Settings"
              onPress={() => router.push("/more/settings")}
            />
            <MenuItem icon="log-out" title="Logout" onPress={handleLogout} />
          </View>
        </ParallaxScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    height: 150,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 120,
    height: 60,
  },
  bodyContainer: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: Colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
    width: "100%",
  },
  email: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    opacity: 0.7,
    textAlign: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: -20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: "#FF3B30",
    textAlign: "center",
  },
});

export default More;
