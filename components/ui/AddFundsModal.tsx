import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Goal } from "@/hooks/useGoals";
import Input from "@/components/ui/Input";

interface AddFundsModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal | null;
  userBalance: number;
  onAddFunds: (amount: number, note?: string) => Promise<boolean>;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({
  visible,
  onClose,
  goal,
  userBalance,
  onAddFunds,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!goal) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount greater than 0"
      );
      return;
    }

    if (numAmount > userBalance) {
      Alert.alert(
        "Amount Too High",
        `The amount exceeds your current balance of Rs. ${(
          userBalance ?? 0
        ).toFixed(2)}`
      );
      return;
    }
    if (numAmount > goal.RemainingAmount) {
      Alert.alert(
        "Amount Too High",
        `The amount exceeds the remaining goal amount of Rs. ${(
          goal.RemainingAmount ?? 0
        ).toFixed(2)}`
      );
      return;
    }

    setLoading(true);
    try {
      const success = await onAddFunds(numAmount, note.trim() || undefined);
      if (success) {
        setAmount("");
        setNote("");
        onClose();
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setAmount("");
    setNote("");
    onClose();
  };

  if (!goal) return null;

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
              <Text style={styles.title}>Add Funds</Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Goal Info */}
            <View style={styles.goalInfoSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Goal:</Text>
                <Text style={styles.summaryValue}>{goal.Title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Target Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(goal.TargetAmount ?? 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Current Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(goal.CurrentAmount ?? 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Your Balance:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(userBalance ?? 0).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Input
                label="Amount to Add (Rs.)"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChangeText={setAmount}
                editable={!loading}
              />
            </View>

            {/* Note Input */}
            <View style={styles.inputContainer}>
              <Input
                label="Note (Optional)"
                placeholder="Add a note about this contribution"
                type="text"
                value={note}
                onChangeText={setNote}
                editable={!loading}
                multiline
                numberOfLines={3}
              />
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
                  styles.addButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading || !amount.trim()}
              >
                <Text style={styles.addButtonText}>
                  {loading ? "Adding..." : "Add Funds"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddFundsModal;

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
  goalInfo: {
    backgroundColor: Colors.background,
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: Colors.text,
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  amountInfo: {
    gap: 6,
  },
  currentAmount: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.success,
  },
  targetAmount: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  remainingAmount: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.primary,
  },
  boldText: {
    fontFamily: "JakarthaBold",
    color: Colors.primary,
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
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
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
  addButton: {
    backgroundColor: Colors.success,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
  },
  disabledButton: {
    opacity: 0.6,
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
});
