import React, { useState, useEffect } from "react";
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Goal } from "@/hooks/useGoals";
import Input from "@/components/ui/Input";

interface ConvertToExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal | null;
  categories: string[];
  onConvert: (data: {
    amount: number;
    transactionTitle: string;
    transactionDescription?: string;
    category: string;
  }) => Promise<boolean>;
}

const ConvertToExpenseModal: React.FC<ConvertToExpenseModalProps> = ({
  visible,
  onClose,
  goal,
  categories,
  onConvert,
}) => {
  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setTransactionTitle(goal.Title || "");
      setCategory(categories[0] || "");
    }
  }, [goal, categories]);

  if (!goal) return null;

  const handleSubmit = async () => {
    if (!transactionTitle.trim()) {
      Alert.alert("Validation Error", "Transaction title is required.");
      return;
    }
    if (!category) {
      Alert.alert("Validation Error", "Please select a category.");
      return;
    }
    setLoading(true);
    try {
      const success = await onConvert({
        amount: goal.CurrentAmount,
        transactionTitle: transactionTitle.trim(),
        transactionDescription: transactionDescription.trim() || undefined,
        category,
      });
      if (success) {
        setTransactionTitle("");
        setTransactionDescription("");
        setCategory(categories[0] || "");
        onClose();
      }
    } catch (error) {
      console.error("Error converting goal to expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Convert Goal to Expense</Text>
              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Goal Info Summary */}
            <View style={styles.goalInfoSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Goal:</Text>
                <Text style={styles.summaryValue}>{goal.Title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(goal.CurrentAmount ?? 0).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Transaction Title */}
            <View style={styles.inputContainer}>
              <Input
                label="Transaction Title"
                placeholder="Enter transaction title"
                type="text"
                value={transactionTitle}
                onChangeText={setTransactionTitle}
                editable={!loading}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categorySelectRow}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Input
                label="Description (Optional)"
                placeholder="Add a description"
                type="text"
                value={transactionDescription}
                onChangeText={setTransactionDescription}
                editable={!loading}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.convertButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.convertButtonText}>
                  {loading ? "Converting..." : "Convert"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ConvertToExpenseModal;

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
    marginBottom: 10,
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
  goalInfoSummary: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
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
  label: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 5,
  },
  categorySelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: "JakarthaRegular",
  },
  categoryOptionTextSelected: {
    color: Colors.neutral,
    fontFamily: "JakarthaBold",
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
  convertButton: {
    backgroundColor: Colors.primary,
  },
  convertButtonText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
