import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "@/components/ui/Input";

export interface FilterOptions {
  category?: string;
  startDate?: string;
  endDate?: string;
  type?: "Income" | "Expense" | "All";
  minAmount?: number;
  maxAmount?: number;
}

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  currentFilters: FilterOptions;
  categories: string[];
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onResetFilters,
  currentFilters,
  categories,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: "All",
    ...currentFilters,
  });

  useEffect(() => {
    setFilters({
      type: "All",
      ...currentFilters,
    });
  }, [currentFilters]);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({ type: "All" });
    onResetFilters();
    onClose();
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilter = (key: keyof FilterOptions) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const isFilterActive = (key: keyof FilterOptions) => {
    return filters[key] !== undefined && filters[key] !== "";
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
              <Text style={styles.title}>Filter Transactions</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Transaction Type Filter */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Transaction Type</Text>
                <View style={styles.typeButtons}>
                  {["All", "Income", "Expense"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        filters.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() =>
                        updateFilter("type", type === "All" ? undefined : type)
                      }
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          filters.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categorySelectRow}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        filters.category === category &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() => updateFilter("category", category)}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          filters.category === category &&
                            styles.categoryOptionTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date Range Filter */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date Range</Text>
                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <Input
                      label="From Date"
                      placeholder="Select start date"
                      type="date"
                      value={filters.startDate || ""}
                      onChangeText={(text) => updateFilter("startDate", text)}
                    />
                    {isFilterActive("startDate") && (
                      <TouchableOpacity
                        onPress={() => clearFilter("startDate")}
                        style={styles.clearButton}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={Colors.fadedText}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.dateInputContainer}>
                    <Input
                      label="To Date"
                      placeholder="Select end date"
                      type="date"
                      value={filters.endDate || ""}
                      onChangeText={(text) => updateFilter("endDate", text)}
                    />
                    {isFilterActive("endDate") && (
                      <TouchableOpacity
                        onPress={() => clearFilter("endDate")}
                        style={styles.clearButton}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={Colors.fadedText}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Amount Range Filter */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount Range</Text>
                <View style={styles.amountContainer}>
                  <View style={styles.amountInputContainer}>
                    <Input
                      label="Min Amount"
                      placeholder="0.00"
                      type="number"
                      value={filters.minAmount?.toString() || ""}
                      onChangeText={(text) =>
                        updateFilter(
                          "minAmount",
                          text ? parseFloat(text) : undefined
                        )
                      }
                    />
                    {isFilterActive("minAmount") && (
                      <TouchableOpacity
                        onPress={() => clearFilter("minAmount")}
                        style={styles.clearButton}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={Colors.fadedText}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.amountInputContainer}>
                    <Input
                      label="Max Amount"
                      placeholder="0.00"
                      type="number"
                      value={filters.maxAmount?.toString() || ""}
                      onChangeText={(text) =>
                        updateFilter(
                          "maxAmount",
                          text ? parseFloat(text) : undefined
                        )
                      }
                    />
                    {isFilterActive("maxAmount") && (
                      <TouchableOpacity
                        onPress={() => clearFilter("maxAmount")}
                        style={styles.clearButton}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={Colors.fadedText}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.applyButton]}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    backgroundColor: Colors.background,
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
  scrollContent: {
    maxHeight: 400,
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
  typeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    backgroundColor: Colors.neutral,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.text,
  },
  typeButtonTextActive: {
    color: Colors.white,
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
  clearButton: {
    marginLeft: 8,
    padding: 5,
  },
  dateContainer: {
    gap: 12,
  },
  dateInputContainer: {
    position: "relative",
  },
  amountContainer: {
    flexDirection: "row",
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    position: "relative",
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
  resetButton: {
    backgroundColor: Colors.neutral,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resetButtonText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
  },
  applyButton: {
    backgroundColor: Colors.primary,
  },
  applyButtonText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.white,
  },
});

export default TransactionFilterModal;
