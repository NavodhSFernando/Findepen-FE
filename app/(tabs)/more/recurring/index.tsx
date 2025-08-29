import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import RecurringTransactionCard from "@/components/ui/RecurringTransactionCard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import useRecurringTransactions from "@/hooks/useRecurringTransactions";

const RecurringTransactionsPage = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    recurringTransactions,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchRecurringTransactions,
    fetchSummary,
    updateRecurringTransactionStatus,
    clearError,
  } = useRecurringTransactions();

  const refreshData = useCallback(async () => {
    try {
      await Promise.all([fetchRecurringTransactions(), fetchSummary()]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  }, [fetchRecurringTransactions, fetchSummary]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Refresh data when the page comes into focus - remove dependency on refreshData
  useFocusEffect(
    useCallback(() => {
      fetchRecurringTransactions();
      fetchSummary();
    }, [])
  );

  const handleAddRecurringTransaction = () => {
    router.push("/more/recurring/add");
  };

  const handleViewRecurringTransaction = (transaction: any) => {
    router.push({
      pathname: "/more/recurring/view",
      params: { id: transaction.Id },
    });
  };

  const handleStatusChange = async (
    transaction: any,
    newStatus: "Active" | "Paused" | "Cancelled"
  ) => {
    try {
      Alert.alert(
        "Update Status",
        `Are you sure you want to ${newStatus.toLowerCase()} "${transaction.Title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: async () => {
              try {
                const success = await updateRecurringTransactionStatus(
                  transaction.Id,
                  newStatus
                );
                if (success) {
                  await refreshData(); // Refresh data
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

  const handleBack = () => {
    router.push("/more");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          Loading recurring transactions...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color={Colors.error}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            clearError();
            refreshData();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
            <CircleButton icon="chevron-back" onPress={handleBack} size={40} />
          </View>
          <Title text="Recurring Transactions" />
          <View style={styles.addButtonContainer}>
            <CircleButton
              icon="add"
              onPress={handleAddRecurringTransaction}
              size={40}
            />
          </View>
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {summary && summary.TotalRecurringTransactions > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>
              Recurring Transaction Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Transactions:</Text>
              <Text style={styles.summaryValue}>
                {summary.TotalRecurringTransactions}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Active:</Text>
              <Text style={styles.summaryValue}>
                {summary.ActiveRecurringTransactions}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Paused:</Text>
              <Text style={styles.summaryValue}>
                {summary.PausedRecurringTransactions}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cancelled:</Text>
              <Text style={styles.summaryValue}>
                {summary.CancelledRecurringTransactions}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monthly Total:</Text>
              <Text style={styles.summaryValue}>
                Rs. {summary.TotalMonthlyAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {recurringTransactions.length > 0 && (
          <Text style={styles.transactionText}>
            Your Recurring Transactions
          </Text>
        )}

        {recurringTransactions.map((transaction) => (
          <RecurringTransactionCard
            key={transaction.Id}
            id={transaction.Id}
            title={transaction.Title}
            description={transaction.Description}
            amount={transaction.Amount}
            category={transaction.Category}
            type={transaction.Type}
            frequency={transaction.Frequency}
            startDate={transaction.StartDate}
            endDate={transaction.EndDate}
            nextOccurrenceDate={transaction.NextOccurrenceDate}
            status={transaction.Status}
            occurrenceCount={transaction.OccurrenceCount}
            lastCreatedDate={transaction.LastCreatedDate}
            formattedAmountWithSign={transaction.FormattedAmountWithSign}
            isIncome={transaction.IsIncome}
            isExpense={transaction.IsExpense}
            isActive={transaction.IsActive}
            canBeProcessed={transaction.CanBeProcessed}
            isExpired={transaction.IsExpired}
            daysUntilNextOccurrence={transaction.DaysUntilNextOccurrence}
            statusDisplayName={transaction.StatusDisplayName}
            frequencyDisplayName={transaction.FrequencyDisplayName}
            nextOccurrenceFormatted={transaction.NextOccurrenceFormatted}
            startDateFormatted={transaction.StartDateFormatted}
            endDateFormatted={transaction.EndDateFormatted}
            onView={() => handleViewRecurringTransaction(transaction)}
          />
        ))}

        {!loading && recurringTransactions.length === 0 && !error && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No recurring transactions found
            </Text>
            <Text style={styles.emptySubtext}>
              Create your first recurring transaction to get started
            </Text>
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
    minHeight: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  transactionText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.borderLight,
    textTransform: "uppercase",
    paddingBottom: 10,
  },
  backButtonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  addButtonContainer: {
    position: "absolute",
    top: 70,
    right: 40,
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "JakarthaBold",
  },
  summaryContainer: {
    backgroundColor: Colors.errorLight,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.borderLight,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.borderLight,
    textAlign: "center",
  },
});

export default RecurringTransactionsPage;
