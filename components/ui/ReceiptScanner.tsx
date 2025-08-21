import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import api from "@/utilities/axiosInstance";

// Local interfaces
interface TransactionData {
  Title: string;
  Description?: string;
  Amount: string;
  Category?: string;
  Type: "Expense" | "Income";
  Date: string;
}

interface ReceiptWithTransactionResponse {
  Success: boolean;
  Data?: any;
  TransactionData?: TransactionData;
  Error?: string;
  Message?: string;
}

interface ReceiptScannerProps {
  visible: boolean;
  onClose: () => void;
  onReceiptProcessed: (transactionData: TransactionData) => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  visible,
  onClose,
  onReceiptProcessed,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please grant camera permission to scan receipts."
      );
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;

        if (base64) {
          setCapturedImage(imageUri);
          setShowConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera. Please try again.");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowConfirmation(false);
    openCamera();
  };

  const processReceiptWithTransaction = async (
    base64Image: string,
    retryCount = 0
  ): Promise<ReceiptWithTransactionResponse> => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000;

    try {
      console.log(
        `Processing receipt with transaction (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`
      );

      const response = await api.post(
        "/receipt/process-with-transaction",
        {
          fileBase64: base64Image,
        },
        {
          timeout: 30000, // 30 second timeout
        }
      );

      const result = response.data;

      // Validate response structure
      if (!result || typeof result.Success !== "boolean") {
        throw new Error("Invalid response format from server");
      }

      console.log("Receipt with transaction response:", {
        success: result.Success,
        hasData: !!result.Data,
        hasTransactionData: !!result.TransactionData,
        error: result.Error,
        title: result.TransactionData?.Title,
        amount: result.TransactionData?.Amount,
      });

      return result;
    } catch (error: any) {
      console.error(
        `Receipt with transaction processing error (attempt ${retryCount + 1}):`,
        error
      );

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorMessage = getErrorMessage(status, error.response.data);

        // Retry on certain server errors
        if (shouldRetry(status) && retryCount < MAX_RETRIES) {
          console.log(`Retrying due to status ${status}...`);
          await delay(RETRY_DELAY);
          return processReceiptWithTransaction(base64Image, retryCount + 1);
        }

        return {
          Success: false,
          Error: errorMessage,
          Message: error.response.data?.message || error.response.data,
        };
      } else if (error.request) {
        // Network error
        if (retryCount < MAX_RETRIES) {
          console.log("Retrying due to network error...");
          await delay(RETRY_DELAY);
          return processReceiptWithTransaction(base64Image, retryCount + 1);
        }

        return {
          Success: false,
          Error: "Network error. Please check your connection and try again.",
        };
      } else {
        // Other error (timeout, etc.)
        if (error.code === "ECONNABORTED" && retryCount < MAX_RETRIES) {
          console.log("Retrying due to timeout...");
          await delay(RETRY_DELAY);
          return processReceiptWithTransaction(base64Image, retryCount + 1);
        }

        return {
          Success: false,
          Error: error.message || "Unknown error occurred",
        };
      }
    }
  };

  const shouldRetry = (status: number): boolean => {
    // Retry on 5xx server errors and 408 timeout
    return status >= 500 || status === 408;
  };

  const getErrorMessage = (status: number, data: any): string => {
    switch (status) {
      case 400:
        return (
          data?.error ||
          "Invalid request. Please check your image and try again."
        );
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "Access denied. You don't have permission to process receipts.";
      case 408:
        return "Request timeout. Please try again.";
      case 413:
        return "Image too large. Please use a smaller image.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
      case 504:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return data?.error || `Server error (${status}). Please try again.`;
    }
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const confirmPhoto = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      // Get the base64 data from the captured image
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix
          const base64Data = base64String.split(",")[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(blob);
      });

      // Process receipt and get transaction data directly from backend
      const receiptResponse = await processReceiptWithTransaction(base64);

      if (!receiptResponse.Success) {
        throw new Error(receiptResponse.Error || "Failed to process receipt");
      }

      if (!receiptResponse.TransactionData) {
        throw new Error("Failed to extract transaction data from receipt");
      }

      const transactionData = receiptResponse.TransactionData;

      // Close the scanner and pass the processed data
      onReceiptProcessed(transactionData);
      onClose();
    } catch (error) {
      console.error("Receipt processing error:", error);
      Alert.alert(
        "Processing Error",
        error instanceof Error
          ? error.message
          : "Failed to process receipt. Please try again or use manual entry."
      );
    } finally {
      setIsProcessing(false);
      setCapturedImage(null);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setShowConfirmation(false);
    setIsProcessing(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.processingText}>Processing Receipt...</Text>
              <Text style={styles.processingSubtext}>
                Please wait while we extract transaction details
              </Text>
            </View>
          ) : showConfirmation && capturedImage ? (
            <View style={styles.confirmationContainer}>
              <Text style={styles.title}>Confirm Receipt Photo</Text>
              <Image
                source={{ uri: capturedImage }}
                style={styles.previewImage}
              />
              <View style={styles.confirmationButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.retakeButton]}
                  onPress={retakePhoto}
                >
                  <MaterialCommunityIcons
                    name="camera-retake"
                    size={20}
                    color={Colors.error}
                  />
                  <Text style={[styles.buttonText, styles.retakeText]}>
                    Retake
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={confirmPhoto}
                >
                  <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  <Text style={[styles.buttonText, styles.confirmText]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <Text style={styles.title}>Scan Receipt</Text>
              <Text style={styles.subtitle}>
                Take a clear photo of your receipt to automatically extract
                transaction details
              </Text>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={openCamera}
              >
                <MaterialCommunityIcons name="camera" size={40} color="#fff" />
                <Text style={styles.cameraButtonText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  cameraContainer: {
    alignItems: "center",
  },
  cameraButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  cancelButton: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
  confirmationContainer: {
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  retakeButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  retakeText: {
    color: Colors.error,
  },
  confirmText: {
    color: "#fff",
  },
  processingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 15,
    marginBottom: 5,
  },
  processingSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
