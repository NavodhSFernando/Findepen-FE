import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SelectorProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  disabled = false,
  loading = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selectorWrapper, disabled && styles.disabled]}
        onPress={() => setShowModal(true)}
        disabled={disabled || loading}
      >
        <Text style={[styles.selectorText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={Colors.text} />
      </TouchableOpacity>

      {/* Options Selection Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    marginBottom: 5,
  },
  selectorWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  selectorText: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    textAlignVertical: "center",
  },
  placeholderText: {
    color: Colors.borderLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: "#333",
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  optionItemText: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: "#333",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default Selector;
