import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface BudgetProgressCardProps {
  id: string;
  category: string;
  plannedAmount: number;
  spentAmount: number;
  reminder: boolean;
  startDate?: string;
  renewalFrequency?: string;
  onEdit?: () => void;
  onDelete?: () => void;
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

const getProgressColor = (progress: number): string => {
  if (progress < 0.5) {
    return Colors.success; // Green
  } else if (progress < 0.8) {
    return "#FF9800"; // Orange (keeping this as it's not in Colors.ts)
  } else {
    return Colors.error; // Red
  }
};

function formatDateRange(startDate?: string, renewalFrequency?: string) {
  if (!startDate) return "";
  const start = new Date(startDate);
  let end = new Date(startDate);
  if (renewalFrequency === "Monthly") {
    end.setMonth(end.getMonth() + 1);
  } else if (renewalFrequency === "Weekly") {
    end.setDate(end.getDate() + 7);
  } else if (renewalFrequency === "Yearly") {
    end.setFullYear(end.getFullYear() + 1);
  }
  const format = (d: Date) =>
    `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
  return `${format(start)} - ${format(end)}`;
}

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  id,
  category,
  plannedAmount,
  spentAmount,
  reminder,
  startDate,
  renewalFrequency,
  onEdit,
  onDelete,
}) => {
  // Debug: Log received props
  console.log("BudgetProgressCard received props:", {
    id,
    category,
    plannedAmount,
    spentAmount,
    reminder,
    startDate,
    renewalFrequency,
  });

  // Add null checks and default values to prevent runtime errors
  const safePlannedAmount = Number(plannedAmount) || 0;
  const safeSpentAmount = Number(spentAmount) || 0;
  const progress =
    safePlannedAmount > 0 ? safeSpentAmount / safePlannedAmount : 0; // Progress percentage
  const note = getNoteByProgress(progress);
  const progressColor = getProgressColor(progress);
  const remainingAmount = safePlannedAmount - safeSpentAmount;
  const percentLeft = 100 - Math.round(progress * 100);

  // Debug: Log calculated values
  console.log("BudgetProgressCard calculated values:", {
    safePlannedAmount,
    safeSpentAmount,
    progress,
    remainingAmount,
    note,
    progressColor,
  });

  return (
    <View style={styles.card}>
      {/* Top Section - Compact Layout */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.dateRangeText}>
                {startDate ? formatDateRange(startDate, renewalFrequency) : ""}
              </Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.amount}>
                Rs. {remainingAmount.toFixed(2)}
              </Text>
              <Text style={styles.amountLeft}>
                left of Rs. {safePlannedAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.reminderContainer}>
          {reminder && (
            <Icon name="bell-outline" size={16} color={Colors.primary} />
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={30}
          borderRadius={50}
          color={progressColor}
          unfilledColor={Colors.secondary}
          borderWidth={0}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            Rs. {safeSpentAmount.toFixed(2)}
          </Text>
          <Text style={styles.progressPercentage}>{percentLeft}% left</Text>
        </View>
      </View>

      {/* Note & Action Icons */}
      <View style={styles.footer}>
        <Text style={styles.note}>{note}</Text>
        <View style={styles.icons}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Icon name="pencil-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Icon name="trash-can-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BudgetProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.fadedPrimary,
    shadowColor: Colors.text,
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  amountColumn: {
    alignItems: "flex-end",
    minWidth: 110,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dateRangeText: {
    fontSize: 11,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  category: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "JakarthaBold",
  },
  amount: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  amountLeft: {
    fontSize: 12,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  reminderContainer: {
    alignItems: "flex-end",
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
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
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
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
    flex: 1,
    marginRight: 10,
  },
  icons: {
    flexDirection: "row",
    gap: 15,
  },
  leftFadedText: {
    fontSize: 11,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
    marginTop: 2,
    textAlign: "right",
  },
});
