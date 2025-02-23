import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface BudgetProgressCardProps {
  category: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  spentAmount: number;
}

const getNoteByProgress = (progress: number): string => {
  if (progress < 0.25) {
    return "";
  } else if (progress < 0.5) {
    return "Keep an eye on your spending.";
  } else if (progress < 0.75) {
    return "You've spent quite a bit.";
  } else if (progress < 1) {
    return "Be careful, you're nearing your budget limit.";
  } else {
    return "You've exceeded your budget!";
  }
};

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  category,
  startDate,
  endDate,
  totalAmount,
  spentAmount,
}) => {
  const progress = spentAmount / totalAmount; // Progress percentage
  const note = getNoteByProgress(progress);

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.date}>
            {startDate} - {endDate}
          </Text>
        </View>
        <View>
          <Text style={styles.amount}>Rs. {spentAmount.toFixed(2)}</Text>
          <Text style={styles.amountLeft}>
            left of Rs. {totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={30}
          borderRadius={50}
          color="#003366"
          unfilledColor="#B3D9FF"
          borderWidth={0}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Rs. {spentAmount.toFixed(2)}</Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      {/* Note & Action Icons */}
      <View style={styles.footer}>
        <Text style={styles.note}>{note}</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Icon name="pencil-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash-can-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BudgetProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.fadedPrimary,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#333",
    fontFamily: "JakarthaBold",
  },
  date: {
    fontSize: 10,
    color: "#666",
    fontFamily: "JakarthaRegular",
  },
  amount: {
    fontSize: 14,
    textAlign: "right",
    fontFamily: "JakarthaBold",
  },
  amountLeft: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    fontFamily: "JakarthaRegular",
  },
  progressContainer: {
    position: "relative",
    marginVertical: 10,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
    top: 5,
  },
  progressText: {
    fontSize: 12,
    color: Colors.neutral,
    fontFamily: "JakarthaBold",
  },
  progressPercentage: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: "JakarthaBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  note: {
    fontSize: 12,
    color: "#555",
    fontFamily: "JakarthaRegular",
  },
  icons: {
    flexDirection: "row",
    gap: 10,
  },
});
