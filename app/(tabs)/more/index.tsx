import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MenuItem from "@/components/ui/MenuItem";
import * as SecureStore from "expo-secure-store";

const More = () => {
  const router = useRouter();
  const profileImage = require("@/assets/images/default-avatar.png");

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    router.push("/login");
    console.log("Logged out");
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: Colors.secondary,
          dark: Colors.secondary,
        }}
        headerImage={<View style={styles.headerContainer}></View>}
      >
        <View style={styles.bodyContainer}>
          <Text style={styles.name}>John Smith</Text>
          <Text style={styles.email}>jsmith@gmail.com</Text>
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
      <View style={styles.profileImageContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 150,
    backgroundColor: Colors.secondary,
  },
  profileImageContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    width: "100%",
    zIndex: 999,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: Colors.neutral,
    backgroundColor: Colors.secondary,
  },
  cameraButton: {
    position: "absolute",
    right: "37%",
    bottom: "-10%",
    backgroundColor: Colors.neutral,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.secondary,
    zIndex: 1000,
    elevation: 6,
  },
  bodyContainer: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: Colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 75,
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
});

export default More;
