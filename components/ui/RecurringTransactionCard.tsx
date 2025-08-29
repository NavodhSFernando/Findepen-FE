import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface RecurringTransactionCardProps {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  type: "Income" | "Expense";
  frequency: "Weekly" | "Monthly" | "Yearly";
  startDate: string;
  endDate?: string;
  nextOccurrenceDate: string;
  status: "Active" | "Paused" | "Cancelled";
  occurrenceCount: number;
  lastCreatedDate?: string;
  formattedAmountWithSign: string;
  isIncome: boolean;
  isExpense: boolean;
  isActive: boolean;
  canBeProcessed: boolean;
  isExpired: boolean;
  daysUntilNextOccurrence: number;
  statusDisplayName: string;
  frequencyDisplayName: string;
  nextOccurrenceFormatted: string;
  startDateFormatted: string;
  endDateFormatted?: string;
  onView?: () => void;
}

const getStatusColor = (status: "Active" | "Paused" | "Cancelled"): string => {
  switch (status) {
    case "Active":
      return Colors.success;
    case "Paused":
      return Colors.warning;
    case "Cancelled":
      return Colors.error;
    default:
      return Colors.fadedText;
  }
};

const getStatusIcon = (status: "Active" | "Paused" | "Cancelled"): string => {
  switch (status) {
    case "Active":
      return "check-circle";
    case "Paused":
      return "pause-circle";
    case "Cancelled":
      return "close-circle";
    default:
      return "help-circle";
  }
};

const formatDateRange = (
  startDate: string,
  frequency: string,
  endDate?: string
) => {
  const start = new Date(startDate);
  let end = new Date(startDate);

  if (endDate) {
    end = new Date(endDate);
  } else {
    // Calculate end based on frequency
    if (frequency === "Monthly") {
      end.setMonth(end.getMonth() + 1);
    } else if (frequency === "Weekly") {
      end.setDate(end.getDate() + 7);
    } else if (frequency === "Yearly") {
      end.setFullYear(end.getFullYear() + 1);
    }
  }

  const format = (d: Date) =>
    `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
  return `${format(start)} - ${format(end)}`;
};

const formatCurrency = (formattedAmountWithSign: string): string => {
  // Replace £ with Rs. in the formatted amount
  return formattedAmountWithSign.replace(/£/g, "Rs ");
};

const RecurringTransactionCard: React.FC<RecurringTransactionCardProps> = ({
  id,
  title,
  description,
  amount,
  category,
  type,
  frequency,
  startDate,
  endDate,
  nextOccurrenceDate,
  status,
  occurrenceCount,
  lastCreatedDate,
  formattedAmountWithSign,
  isIncome,
  isExpense,
  isActive,
  canBeProcessed,
  isExpired,
  daysUntilNextOccurrence,
  statusDisplayName,
  frequencyDisplayName,
  nextOccurrenceFormatted,
  startDateFormatted,
  endDateFormatted,
  onView,
}) => {
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const formattedAmount = formatCurrency(formattedAmountWithSign);

  return (
    <TouchableOpacity style={styles.card} onPress={onView}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.statusContainer}>
              <Icon name={statusIcon} size={16} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusDisplayName}
              </Text>
            </View>
          </View>
          <Text style={styles.category}>{category || "Uncategorized"}</Text>
          <Text style={styles.dateRange}>
            {formatDateRange(startDate, frequency, endDate)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? Colors.income : Colors.expense },
            ]}
          >
            {formattedAmount}
          </Text>
          <Text style={styles.frequency}>{frequencyDisplayName}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Next Occurrence:</Text>
          <Text style={styles.detailValue}>{nextOccurrenceFormatted}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Days Until Next:</Text>
          <Text style={styles.detailValue}>{daysUntilNextOccurrence} days</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Occurrence Count:</Text>
          <Text style={styles.detailValue}>{occurrenceCount}</Text>
        </View>
        {description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>
        )}
      </View>

      {/* Actions Section */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewButton} onPress={onView}>
          <Icon name="eye" size={16} color={Colors.primary} />
          <Text style={[styles.actionText, { color: Colors.primary }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RecurringTransactionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.fadedPrimary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "JakarthaBold",
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "JakarthaBold",
    marginLeft: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
    marginBottom: 2,
  },
  dateRange: {
    fontSize: 11,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 100,
  },
  amount: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    marginBottom: 2,
  },
  frequency: {
    fontSize: 12,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
  },
  detailValue: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: "JakarthaBold",
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.fadedText,
    fontFamily: "JakarthaRegular",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionText: {
    fontSize: 11,
    fontFamily: "JakarthaBold",
    marginLeft: 4,
  },
});
