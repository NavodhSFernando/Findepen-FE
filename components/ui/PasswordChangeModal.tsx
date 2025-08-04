import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import InputField from "./Input";
import Button from "./Button";
import { ChangePasswordData } from "@/hooks/useUser";

interface PasswordChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordData) => Promise<boolean>;
  loading?: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ChangePasswordData>({
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.CurrentPassword.trim()) {
      newErrors.CurrentPassword = "Current password is required";
    }

    if (!formData.NewPassword.trim()) {
      newErrors.NewPassword = "New password is required";
    } else if (formData.NewPassword.length < 6) {
      newErrors.NewPassword = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.NewPassword)) {
      newErrors.NewPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.ConfirmPassword.trim()) {
      newErrors.ConfirmPassword = "Please confirm your new password";
    } else if (formData.NewPassword !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      CurrentPassword: "",
      NewPassword: "",
      ConfirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Change Password</Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Current Password Input */}
            <View style={styles.inputContainer}>
              <InputField
                label="Current Password"
                placeholder="Enter your current password"
                type="password"
                value={formData.CurrentPassword}
                onChangeText={(value) =>
                  handleInputChange("CurrentPassword", value)
                }
              />
              {errors.CurrentPassword && (
                <Text style={styles.errorText}>{errors.CurrentPassword}</Text>
              )}
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <InputField
                label="New Password"
                placeholder="Enter your new password"
                type="password"
                value={formData.NewPassword}
                onChangeText={(value) =>
                  handleInputChange("NewPassword", value)
                }
              />
              {errors.NewPassword && (
                <Text style={styles.errorText}>{errors.NewPassword}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <InputField
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type="password"
                value={formData.ConfirmPassword}
                onChangeText={(value) =>
                  handleInputChange("ConfirmPassword", value)
                }
              />
              {errors.ConfirmPassword && (
                <Text style={styles.errorText}>{errors.ConfirmPassword}</Text>
              )}
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
              <Text style={styles.requirement}>• At least 6 characters</Text>
              <Text style={styles.requirement}>
                • Contains uppercase letter
              </Text>
              <Text style={styles.requirement}>
                • Contains lowercase letter
              </Text>
              <Text style={styles.requirement}>• Contains number</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.changeButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.changeButtonText}>
                  {loading ? "Changing..." : "Change Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: Colors.neutral,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.text,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  closeButton: {
    marginLeft: 10,
    padding: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 4,
  },
  requirementsContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  changeButton: {
    backgroundColor: Colors.success,
  },
  changeButtonText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PasswordChangeModal;
