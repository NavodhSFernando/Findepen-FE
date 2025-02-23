import { View, Text, StyleSheet } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Ensure this package is installed
import Title from "./Title";

interface CircularProgressProps {
  type: "income" | "expense";
  totalAmount: number;
  currentAmount: number;
  category: string;
  title: string;
}

const getIconName = (category: string): string => {
  const categoryIconMap: { [key: string]: string } = {
    food: "silverware-fork-knife",
    rent: "key-chain-variant",
    education: "school-outline",
    transport: "bus-multiple",
    grocery: "shopping-outline",
    entertainment: "television-classic",
    health: "heart-pulse",
    miscellaneous: "checkbox-multiple-blank-outline",
    income: "cash-plus",

    // Add more mappings as needed
  };
  return categoryIconMap[category] || "help-circle"; // Default icon if category not found
};

const calculateProgress = (
  currentAmount: number,
  totalAmount: number
): number => {
  if (totalAmount <= 0) return 0; // Prevent division by zero
  const progress = currentAmount / totalAmount;
  return Math.min(Math.max(progress, 0), 1); // Keep within [0,1]
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  type,
  totalAmount,
  currentAmount,
  category,
  title,
}) => {
  const progress = calculateProgress(currentAmount, totalAmount);
  return (
    <View
      style={[
        styles.container,
        {
          borderColor:
            type === "expense" ? Colors.fadedPrimary : Colors.fadedText,
        },
      ]}
    >
      <View style={styles.progressContainer}>
        <Progress.Circle
          size={80}
          progress={progress}
          color={Colors.primary}
          unfilledColor={Colors.secondary}
          borderWidth={0}
          strokeCap="round"
          thickness={5}
        />
        {/* Centered Icon */}
        <View style={styles.iconContainer}>
          <Icon name={getIconName(category)} size={28} color={Colors.text} />
        </View>
      </View>
      <Text style={styles.description}>title</Text>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.neutral,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 16,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    marginTop: 5,
    color: Colors.text,
    fontFamily: "JakarthaRegular",
    fontSize: 10,
  },
});
