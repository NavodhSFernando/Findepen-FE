import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface TransactionProps {
  id: number;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  onPress?: () => void;
}

// Function to get category-specific icon for expenses
const getCategoryIcon = (category: string) => {
  const categoryIcons: { [key: string]: string } = {
    Food: "restaurant",
    Grocery: "cart",
    Rent: "business", // changed from "home" to "business" for a more rent/real estate feel
    Education: "school",
    Health: "medical",
    Entertainment: "film", // changed from "musical-notes" to "film" for broader entertainment
    Transportation: "car",
    Miscellaneous: "apps", // changed from "ellipsis-horizontal" to "apps" for a more general/miscellaneous icon
  };

  return categoryIcons[category] || categoryIcons["Miscellaneous"];
};

// Function to get income icon
const getIncomeIcon = () => {
  return "cash";
};

// Function to format the number as a currency string
const formatCurrency = (amount: number, type: string) => {
  const safeAmount = amount || 0;
  const sign = type === "expense" ? "-" : "+";
  return `${sign} Rs ${safeAmount.toFixed(2)}`;
};

const Transaction: React.FC<TransactionProps> = ({
  id,
  title,
  type,
  category,
  amount,
  date,
  onPress,
}) => {
  const iconName =
    type === "income" ? getIncomeIcon() : getCategoryIcon(category);

  const TransactionContent = () => (
    <View
      style={[
        styles.transactionItem,
        {
          shadowColor: type === "expense" ? Colors.primary : "#2D3748",
          shadowOpacity: type === "expense" ? 0.15 : 0.12,
          shadowRadius: type === "expense" ? 10 : 8,
          elevation: type === "expense" ? 4 : 3,
        },
      ]}
    >
      <View style={styles.description}>
        <Ionicons name={iconName as any} size={24} color="#2D3748" />
        <View style={styles.descriptionBody}>
          <Text style={styles.descriptionTitle}>{title}</Text>
          <Text style={styles.descriptionCategory}>{category}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.amount,
          { color: type === "expense" ? Colors.error : Colors.success },
        ]}
      >
        {formatCurrency(amount, type)}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <TransactionContent />
      </TouchableOpacity>
    );
  }

  return <TransactionContent />;
};

const styles = StyleSheet.create({
  transactionItem: {
    display: "flex",
    padding: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  descriptionBody: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  descriptionTitle: {
    fontSize: 15,
    fontFamily: "JakarthaBold",
    color: "#2D3748",
    fontWeight: "600",
    lineHeight: 20,
  },
  descriptionCategory: {
    fontSize: 13,
    fontFamily: "JakarthaRegular",
    color: "#6B7280",
    lineHeight: 18,
  },
  amount: {
    display: "flex",
    fontSize: 15,
    fontFamily: "JakarthaBold",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    lineHeight: 20,
  },
});

export default Transaction;
