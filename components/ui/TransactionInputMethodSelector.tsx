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

type InputMethod = "manual" | "scan" | "file";

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
    { id: "file", label: "Import File", icon: "file-outline" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
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
              <MaterialCommunityIcons
                name={method.icon}
                size={24}
                color="#000"
              />
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxHeight: Dimensions.get("window").height * 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 12,
  },
  methodLabel: {
    fontSize: 16,
    marginLeft: 16,
    color: "#000",
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
});
