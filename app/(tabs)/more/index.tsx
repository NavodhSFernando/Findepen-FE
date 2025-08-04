import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MenuItem from "@/components/ui/MenuItem";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import UploadModal from "@/components/ui/UploadModal";
import useUser from "@/hooks/useUser";

const More = () => {
  const router = useRouter();
  const defaultImage = require("@/assets/images/default-avatar.png");
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use the user hook to get real user data
  const { profile, loading, error } = useUser();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    router.push("/login");
    console.log("Logged out");
  };

  const uploadDp = async (mode?: string) => {
    try {
      setIsLoading(true);
      let result: ImagePicker.ImagePickerResult;

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage({ uri: result.assets[0].uri });
      } else {
        setIsLoading(false);
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const removeImage = async () => {
    try {
      setIsLoading(true);
      await saveImage(null);
    } catch (message) {
      alert(message);
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const saveImage = async (image: { uri: string } | null) => {
    try {
      // Simulate API upload delay
      setTimeout(() => {
        setImage(image);
        setIsLoading(false);
        setModalVisible(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
          headerImage={<View style={styles.headerContainer}></View>}
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

        <View style={styles.profileImageContainer}>
          <Image
            source={image ? image : defaultImage}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="camera" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal rendered separately outside the main component hierarchy */}
      {modalVisible && (
        <UploadModal
          modalVisible={modalVisible}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={() => uploadDp("camera")}
          onGalleryPress={() => uploadDp("gallery")}
          onRemovePress={() => removeImage()}
          isLoading={isLoading}
        />
      )}
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
