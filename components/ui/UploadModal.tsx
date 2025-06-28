import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

interface UploadModalProps {
  modalVisible: boolean;
  onBackPress: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
  isLoading?: boolean;
}

const { width, height } = Dimensions.get("window");

const UploadModal: React.FC<UploadModalProps> = ({
  modalVisible,
  onBackPress,
  onCameraPress,
  onGalleryPress,
  onRemovePress,
  isLoading = false,
}) => {
  // Don't render anything if modal is not visible
  if (!modalVisible) return null;

  return (
    <View style={styles.absoluteContainer}>
      <Pressable style={styles.backdrop} onPress={onBackPress} />
      <View style={styles.modalContainer}>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Profile Photo</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.option} onPress={onCameraPress}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={30}
                  color={Colors.primary}
                />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onGalleryPress}>
                <MaterialCommunityIcons
                  name="image-outline"
                  size={30}
                  color={Colors.primary}
                />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onRemovePress}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={30}
                  color={Colors.error}
                />
                <Text style={styles.optionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: width,
    height: height,
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 10000,
  },
  title: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  option: {
    alignItems: "center",
    padding: 10,
  },
  optionText: {
    marginTop: 8,
    fontFamily: "JakarthaRegular",
    fontSize: 12,
  },
  loadingWrapper: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 15,
    fontFamily: "JakarthaRegular",
    fontSize: 16,
  },
});

export default UploadModal;
