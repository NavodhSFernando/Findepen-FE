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
import { BalanceAdjustmentData } from "@/hooks/useUser";

interface BalanceAdjustmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: BalanceAdjustmentData) => Promise<boolean>;
  currentBalance?: number;
  loading?: boolean;
}

const BalanceAdjustmentModal: React.FC<BalanceAdjustmentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentBalance = 0,
  loading = false,
}) => {
  const [formData, setFormData] = useState<BalanceAdjustmentData>({
    Amount: 0,
    Reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.Amount || formData.Amount <= 0) {
      newErrors.Amount = "Amount must be greater than 0";
    }

    if (!formData.Reason?.trim()) {
      newErrors.Reason = "Reason is required";
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
        Amount: 0,
        Reason: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      Amount: 0,
      Reason: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    field: keyof BalanceAdjustmentData,
    value: string | number
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
              <Text style={styles.title}>Adjust Balance</Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Current Balance Display */}
            <View style={styles.balanceInfoSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Current Balance:</Text>
                <Text style={styles.summaryValue}>
                  Rs {currentBalance.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <InputField
                label="New Balance Amount (Rs.)"
                placeholder="Enter new balance amount"
                type="number"
                value={formData.Amount.toString()}
                onChangeText={(value) =>
                  handleInputChange("Amount", parseFloat(value) || 0)
                }
              />
              {errors.Amount && (
                <Text style={styles.errorText}>{errors.Amount}</Text>
              )}
            </View>

            {/* Reason Input */}
            <View style={styles.inputContainer}>
              <InputField
                label="Reason for Adjustment"
                placeholder="e.g., Initial setup, Manual adjustment"
                type="text"
                value={formData.Reason}
                onChangeText={(value) => handleInputChange("Reason", value)}
              />
              {errors.Reason && (
                <Text style={styles.errorText}>{errors.Reason}</Text>
              )}
            </View>

            {/* Warning */}
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={16} color="#FF9500" />
              <Text style={styles.warningText}>
                This will replace your current balance. This action cannot be
                undone.
              </Text>
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
                  styles.updateButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.updateButtonText}>
                  {loading ? "Updating..." : "Update Balance"}
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
  balanceInfoSummary: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.borderLight,
    fontFamily: "JakarthaRegular",
    flex: 1,
  },
  summaryValue: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: "JakarthaBold",
    textAlign: "right",
    minWidth: 90,
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
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    padding: 15,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  warningText: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: "#856404",
    marginLeft: 8,
    flex: 1,
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
  updateButton: {
    backgroundColor: Colors.success,
  },
  updateButtonText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default BalanceAdjustmentModal;
