import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import { Goal } from "@/hooks/useGoals";

interface GoalProgressCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddFunds?: () => void;
  onConvertToExpense?: () => void;
}

const getNoteByProgress = (progress: number): string => {
  if (progress < 0.25) {
    return "Just getting started!";
  } else if (progress < 0.5) {
    return "Good start, keep it up!";
  } else if (progress < 0.75) {
    return "Over halfway there!";
  } else if (progress < 1) {
    return "So close to your goal!";
  } else {
    return "Goal completed — great job!";
  }
};

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onAddFunds,
  onConvertToExpense,
}) => {
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);

  // Add null checks and default values to prevent runtime errors
  const safeCurrentAmount = goal.CurrentAmount || 0;
  const safeTargetAmount = goal.TargetAmount || 0;
  const progress =
    safeTargetAmount > 0 ? safeCurrentAmount / safeTargetAmount : 0; // Progress percentage
  const note = getNoteByProgress(progress);

  const targetDate = new Date(goal.TargetDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return Colors.error;
      case "Medium":
        return "#FF9800";
      case "Low":
        return Colors.success;
      default:
        return Colors.text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return "play-circle-outline";
      case "Completed":
        return "check-circle-outline";
      case "Paused":
        return "pause-circle-outline";
      case "Cancelled":
        return "close-circle-outline";
      default:
        return "circle-outline";
    }
  };

  const getActionButtonStyle = (
    type: "add" | "convert" | "edit" | "delete"
  ) => {
    const baseStyle = {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 2,
      gap: 8,
      minWidth: 0,
    };

    switch (type) {
      case "add":
        return {
          ...baseStyle,
          // backgroundColor: "#E8F5E8",
          borderColor: Colors.success,
        };
      case "convert":
        return {
          ...baseStyle,
          // backgroundColor: "#E3F2FD",
          borderColor: Colors.primary,
        };
      case "edit":
        return {
          ...baseStyle,
          // backgroundColor: "#FFF3E0",
          borderColor: Colors.warning,
        };
      case "delete":
        return {
          ...baseStyle,
          // backgroundColor: "#FFEBEE",
          borderColor: Colors.error,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: Colors.neutral,
          borderColor: Colors.borderLight,
        };
    }
  };

  const getActionButtonTextStyle = (
    type: "add" | "convert" | "edit" | "delete"
  ) => {
    const baseStyle = {
      fontSize: 12,
      fontFamily: "JakarthaBold" as const,
      textAlign: "center" as const,
      flexShrink: 1,
    };

    switch (type) {
      case "add":
        return {
          ...baseStyle,
          color: Colors.success,
        };
      case "convert":
        return {
          ...baseStyle,
          color: Colors.primary,
        };
      case "edit":
        return {
          ...baseStyle,
          color: Colors.warning,
        };
      case "delete":
        return {
          ...baseStyle,
          color: Colors.error,
        };
      default:
        return {
          ...baseStyle,
          color: Colors.text,
        };
    }
  };

  const toggleActions = () => {
    setIsActionsExpanded(!isActionsExpanded);
  };

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.categoryRow}>
                <Text style={styles.category}>{goal.Title}</Text>
                {goal.Reminder && (
                  <Icon name="bell-outline" size={16} color={Colors.primary} />
                )}
                <Icon
                  name={getStatusIcon(goal.Status)}
                  size={16}
                  color={getPriorityColor(goal.Priority)}
                />
              </View>
              <Text style={styles.date}>Deadline: {targetDate}</Text>
              {goal.Description && (
                <Text style={styles.description}>{goal.Description}</Text>
              )}
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.current}>
                Rs. {(safeCurrentAmount ?? 0).toFixed(2)}
              </Text>
              <Text style={styles.target}>
                of Rs. {(safeTargetAmount ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={30}
          borderRadius={50}
          color={Colors.primary}
          unfilledColor={Colors.secondary}
          borderWidth={0}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            Rs. {(safeCurrentAmount ?? 0).toFixed(2)}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      {/* Note & Actions Button */}
      <View style={styles.footer}>
        <Text style={styles.note}>{note}</Text>
        {/* Only show actions button for active goals */}
        {goal.Status === "Active" && goal.IsActive && (
          <TouchableOpacity
            style={styles.actionsButton}
            onPress={toggleActions}
          >
            <Icon
              name={isActionsExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.actionsButtonText}>Actions</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Expandable Actions Section */}
      {isActionsExpanded && goal.Status === "Active" && goal.IsActive && (
        <View style={styles.expandedActions}>
          <View style={styles.actionButtonsContainer}>
            {/* First Row */}
            <View style={styles.actionRow}>
              {onAddFunds && (
                <TouchableOpacity
                  style={getActionButtonStyle("add")}
                  onPress={onAddFunds}
                >
                  <Icon name="plus" size={18} color={Colors.success} />
                  <Text style={getActionButtonTextStyle("add")}>Add Funds</Text>
                </TouchableOpacity>
              )}
              {onConvertToExpense && goal.CurrentAmount > 0 && (
                <TouchableOpacity
                  style={getActionButtonStyle("convert")}
                  onPress={onConvertToExpense}
                >
                  <Icon name="transfer" size={18} color={Colors.primary} />
                  <Text style={getActionButtonTextStyle("convert")}>
                    Save as Expense
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Second Row */}
            <View style={styles.actionRow}>
              {onEdit && (
                <TouchableOpacity
                  style={getActionButtonStyle("edit")}
                  onPress={onEdit}
                >
                  <Icon
                    name="pencil-outline"
                    size={18}
                    color={Colors.warning}
                  />
                  <Text style={getActionButtonTextStyle("edit")}>Edit</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={getActionButtonStyle("delete")}
                  onPress={onDelete}
                >
                  <Icon
                    name="trash-can-outline"
                    size={18}
                    color={Colors.error}
                  />
                  <Text style={getActionButtonTextStyle("delete")}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GoalProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  category: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "JakarthaBold",
  },
  date: {
    fontSize: 10,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  description: {
    fontSize: 12,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
    marginTop: 2,
  },
  current: {
    fontSize: 14,
    textAlign: "right",
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  target: {
    fontSize: 12,
    color: Colors.fadedText,
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
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    shadowOpacity: 1,
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
  actionsButton: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: Colors.primary,
    gap: 6,
  },
  actionsButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: "JakarthaBold",
  },
  expandedActions: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButtonsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    gap: 8,
    minWidth: 0,
  },
  actionButtonLabel: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: "JakarthaBold",
    textAlign: "center",
    flexShrink: 1,
  },
});
