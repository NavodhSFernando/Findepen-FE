import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/Button";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import useRecurringTransactions, {
  RecurringTransactionType,
} from "@/hooks/useRecurringTransactions";

const ViewRecurringTransactionPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [recurringTransaction, setRecurringTransaction] =
    useState<RecurringTransactionType | null>(null);

  const {
    loading,
    error,
    fetchRecurringTransaction,
    updateRecurringTransactionStatus,
    clearError,
  } = useRecurringTransactions();

  const loadRecurringTransaction = async () => {
    if (!params.id) return;

    try {
      const data = await fetchRecurringTransaction(params.id);
      if (data) {
        setRecurringTransaction(data);
      }
    } catch (err) {
      console.error("Error fetching recurring transaction:", err);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadRecurringTransaction();
    }
  }, [params.id]);

  const handleStatusChange = async (
    newStatus: "Active" | "Paused" | "Cancelled"
  ) => {
    if (!recurringTransaction) return;

    try {
      Alert.alert(
        "Update Status",
        `Are you sure you want to ${newStatus.toLowerCase()} "${recurringTransaction.Title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: async () => {
              try {
                const success = await updateRecurringTransactionStatus(
                  recurringTransaction.Id,
                  newStatus
                );
                if (success) {
                  await loadRecurringTransaction(); // Refresh data
                  Alert.alert("Success", `Status updated to ${newStatus}`);
                }
              } catch (error) {
                console.error("Error updating status:", error);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const formatCurrency = (amount: number, type: string) => {
    const safeAmount = amount || 0;
    const sign = type === "Expense" ? "-" : "+";
    return `${sign} Rs ${safeAmount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading recurring transaction...</Text>
      </View>
    );
  }

  if (error || !recurringTransaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {error || "Recurring transaction not found"}
        </Text>
        {error && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              clearError();
              loadRecurringTransaction();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <View style={styles.backButtonContainer}>
            <CircleButton
              icon="chevron-back"
              onPress={() => router.back()}
              size={40}
            />
          </View>
          <Title text="Recurring Transaction Details" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Transaction Type Badge */}
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  recurringTransaction.Type === "Expense"
                    ? Colors.primary
                    : Colors.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                recurringTransaction.Type === "Expense"
                  ? "arrow-down"
                  : "arrow-up"
              }
              size={16}
              color={Colors.background}
            />
            <Text
              style={[
                styles.typeText,
                {
                  color: Colors.background,
                },
              ]}
            >
              {recurringTransaction.Type}
            </Text>
          </View>
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(
              recurringTransaction.Amount,
              recurringTransaction.Type
            )}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  recurringTransaction.Status === "Active"
                    ? Colors.success
                    : recurringTransaction.Status === "Paused"
                      ? Colors.warning
                      : Colors.error,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                recurringTransaction.Status === "Active"
                  ? "check-circle"
                  : recurringTransaction.Status === "Paused"
                    ? "pause-circle"
                    : "close-circle"
              }
              size={16}
              color={Colors.background}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: Colors.background,
                },
              ]}
            >
              {recurringTransaction.StatusDisplayName}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailValue}>{recurringTransaction.Title}</Text>
          </View>

          {recurringTransaction.Description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>
                {recurringTransaction.Description}
              </Text>
            </View>
          )}

          {recurringTransaction.Category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {recurringTransaction.Category}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>
              {recurringTransaction.FrequencyDisplayName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>
              {recurringTransaction.StartDateFormatted}
            </Text>
          </View>

          {recurringTransaction.EndDateFormatted && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>
                {recurringTransaction.EndDateFormatted}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Occurrence</Text>
            <Text style={styles.detailValue}>
              {recurringTransaction.NextOccurrenceFormatted}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Days Until Next</Text>
            <Text style={styles.detailValue}>
              {recurringTransaction.DaysUntilNextOccurrence} days
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occurrence Count</Text>
            <Text style={styles.detailValue}>
              {recurringTransaction.OccurrenceCount}
            </Text>
          </View>

          {recurringTransaction.LastCreatedDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Created</Text>
              <Text style={styles.detailValue}>
                {recurringTransaction.LastCreatedDate}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {recurringTransaction.Status === "Active" && (
            <Button
              title="Pause"
              onPress={() => handleStatusChange("Paused")}
              variant="secondary"
            />
          )}

          {recurringTransaction.Status === "Paused" && (
            <Button
              title="Resume"
              onPress={() => handleStatusChange("Active")}
              variant="primary"
            />
          )}

          {recurringTransaction.Status !== "Cancelled" && (
            <Button
              title="Cancel"
              onPress={() => handleStatusChange("Cancelled")}
              variant="danger"
            />
          )}
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default ViewRecurringTransactionPage;

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  backButtonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  typeContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    textTransform: "uppercase",
  },
  amountContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  statusContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    textTransform: "uppercase",
  },
  detailsContainer: {
    width: "100%",
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    flex: 2,
    textAlign: "right",
  },
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: "auto",
    paddingTop: 40,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontFamily: "JakarthaBold",
  },
});
