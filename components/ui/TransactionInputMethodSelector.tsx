import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

type InputMethod = "manual" | "scan";

interface TransactionInputMethodSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: InputMethod) => void;
}

export const TransactionInputMethodSelector: React.FC<
  TransactionInputMethodSelectorProps
> = ({ visible, onClose, onSelect }) => {
  const methods: { id: InputMethod; label: string; icon: string }[] = [
    { id: "manual", label: "Manual Entry", icon: "text" },
    { id: "scan", label: "Scan Receipt", icon: "scan-helper" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select Input Method</Text>

          {methods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodButton}
              onPress={() => {
                onSelect(method.id);
                onClose();
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.methodLabel}>{method.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxHeight: Dimensions.get("window").height * 0.7,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "JakarthaBold",
    marginBottom: 24,
    textAlign: "center",
    color: Colors.text,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  methodLabel: {
    fontSize: 16,
    fontFamily: "JakarthaSemiBold",
    color: Colors.text,
    flex: 1,
  },
  cancelButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "JakarthaSemiBold",
    color: Colors.fadedText,
  },
});
