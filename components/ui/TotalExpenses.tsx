import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

type TotalExpensesProps = {
  totalExpenses?: number;
};

const TotalExpenses: React.FC<TotalExpensesProps> = ({
  totalExpenses = 10000,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          name="arrow-bottom-right-bold-box-outline"
          color={Colors.primary}
          size={20}
          style={styles.iconContainer}
        />
        <Text style={styles.headerText}>Total Expenses</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(totalExpenses)}</Text>
    </View>
  );
};

// Function to format the number as a currency string
const formatCurrency = (amount: number) => {
  return `Rs ${amount.toFixed(2)}`;
};

export default TotalExpenses;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: 120,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },
  iconContainer: {
    display: "flex",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "JakarthaRegular",
    fontSize: 12,
  },
  amount: {
    color: Colors.primary,
    fontFamily: "JakarthaBold",
    fontSize: 16,
  },
});
