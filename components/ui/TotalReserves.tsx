import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

type TotalReservesProps = {
  totalReserves?: number;
};

const TotalReserves: React.FC<TotalReservesProps> = ({ totalReserves = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          name="target"
          color={Colors.text}
          size={20}
          style={styles.iconContainer}
        />
        <Text style={styles.headerText}>Total Reserves</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(totalReserves)}</Text>
    </View>
  );
};

// Function to format the number as a currency string
const formatCurrency = (amount: number) => {
  const safeAmount = amount || 0;
  return `Rs ${safeAmount.toFixed(2)}`;
};

export default TotalReserves;

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
    color: Colors.text,
    fontFamily: "JakarthaRegular",
    fontSize: 12,
  },
  amount: {
    color: Colors.text,
    fontFamily: "JakarthaBold",
    fontSize: 16,
  },
});
