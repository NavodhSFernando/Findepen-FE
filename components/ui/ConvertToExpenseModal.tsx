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
  ScrollView,
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
    markGoalAsCompleted: boolean;
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
  const [amount, setAmount] = useState(0);
  const [markGoalAsCompleted, setMarkGoalAsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setTransactionTitle(goal.Title || "");
      setCategory(categories[0] || "");
      setAmount(goal.CurrentAmount || 0);
      // Default to marking as completed if goal is already completed
      setMarkGoalAsCompleted(goal.CurrentAmount >= goal.TargetAmount);
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
    if (amount <= 0) {
      Alert.alert("Validation Error", "Amount must be greater than 0.");
      return;
    }
    if (amount > goal.CurrentAmount) {
      Alert.alert(
        "Validation Error",
        "Amount cannot exceed the goal's current amount."
      );
      return;
    }
    setLoading(true);
    try {
      const success = await onConvert({
        amount,
        transactionTitle: transactionTitle.trim(),
        transactionDescription: transactionDescription.trim() || undefined,
        category,
        markGoalAsCompleted,
      });
      if (success) {
        setTransactionTitle("");
        setTransactionDescription("");
        setCategory(categories[0] || "");
        setAmount(0);
        setMarkGoalAsCompleted(false);
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
                <Text style={styles.summaryLabel}>Available Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(goal.CurrentAmount ?? 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Target Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(goal.TargetAmount ?? 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Progress:</Text>
                <Text style={styles.summaryValue}>
                  {Math.min(
                    ((goal.CurrentAmount ?? 0) / (goal.TargetAmount ?? 1)) *
                      100,
                    100
                  ).toFixed(1)}
                  %
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Amount Input */}
              <View style={styles.inputContainer}>
                <Input
                  label="Amount to Convert"
                  placeholder="Enter amount to convert"
                  type="text"
                  value={amount.toString()}
                  onChangeText={(text) => setAmount(parseFloat(text) || 0)}
                  editable={!loading}
                  keyboardType="numeric"
                />
                <Text style={styles.helperText}>
                  Maximum: Rs. {(goal.CurrentAmount ?? 0).toFixed(2)}
                </Text>
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

              {/* Goal Completion Toggle */}
              <View style={styles.inputContainer}>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Mark Goal as Completed</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      markGoalAsCompleted && styles.toggleButtonActive,
                    ]}
                    onPress={() => setMarkGoalAsCompleted(!markGoalAsCompleted)}
                    disabled={loading}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        markGoalAsCompleted && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.toggleDescription}>
                  {markGoalAsCompleted
                    ? "Goal will be marked as completed after conversion"
                    : "Goal will remain active after conversion"}
                </Text>
              </View>
            </ScrollView>

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
  scrollContent: {
    maxHeight: 300,
  },
  goalInfoSummary: {
    backgroundColor: Colors.background,
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: Colors.text,
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
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
  helperText: {
    fontSize: 12,
    color: Colors.borderLight,
    fontFamily: "JakarthaRegular",
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.borderLight,
    padding: 2,
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral,
    shadowColor: Colors.text,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  toggleDescription: {
    fontSize: 12,
    color: Colors.borderLight,
    fontFamily: "JakarthaRegular",
    fontStyle: "italic",
  },
});
