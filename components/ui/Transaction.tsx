import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Image } from "react-native";

interface TransactionProps {
  id: number;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

// Function to format the number as a currency string
const formatCurrency = (amount: number, type: string) => {
  const sign = type === "expense" ? "-" : "+";
  return `${sign} Rs ${amount.toFixed(2)}`;
};

const Transaction: React.FC<TransactionProps> = ({
  id,
  title,
  type,
  category,
  amount,
  date,
}) => {
  return (
    <View
      style={[
        styles.transactionItem,
        {
          borderColor:
            type === "expense" ? Colors.fadedPrimary : Colors.fadedText,
        },
      ]}
    >
      <View style={styles.description}>
        <Image
          source={{
            uri: "https://img.icons8.com/?size=100&id=35072&format=png&color=000000",
          }}
          style={styles.descriptionIcon}
        />
        <View style={styles.descriptionBody}>
          <Text style={styles.descriptionTitle}>{title}</Text>
          <Text style={styles.descriptionCategory}>{category}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(amount, type)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    display: "flex",
    padding: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignSelf: "stretch",
    backgroundColor: Colors.neutral,
    borderRadius: 10,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 16,
    flexDirection: "row",
  },
  descriptionIcon: {
    width: 24,
    height: 24,
    display: "flex",
    alignSelf: "center",
  },
  descriptionBody: {
    display: "flex",
    flexDirection: "column",
  },
  descriptionTitle: {
    fontSize: 12,
    fontFamily: "JakarthaBold",
  },
  descriptionCategory: {
    fontSize: 10,
    fontFamily: "JakarthaRegular",
  },
  amount: {
    display: "flex",
    fontSize: 12,
    fontFamily: "JakarthaBold",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Transaction;
