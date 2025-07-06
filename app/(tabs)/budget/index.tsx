import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import BudgetProgressCard from "@/components/ui/BudgetProgressCard";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import CircleButton from "@/components/ui/CircleButton";
import useBudgets from "@/hooks/useBudgets";
import { useFocusEffect } from "expo-router";

const Index = () => {
  const {
    budgets,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchBudgets,
    fetchSummary,
    deleteBudget,
    toggleAutoRenewal,
  } = useBudgets();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchBudgets();
      fetchSummary();
    }, [])
  );

  const handleDeleteBudget = async (budgetId: string, category: string) => {
    Alert.alert(
      "Delete Budget",
      `Are you sure you want to delete the ${category} budget?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteBudget(budgetId);
            if (success) {
              Alert.alert("Success", "Budget deleted successfully");
            }
          },
        },
      ]
    );
  };

  const handleEditBudget = (budgetId: string) => {
    console.log("Routing to edit page for budgetId:", budgetId);
    router.push(`/budget/edit?id=${budgetId}`);
  };

  const handleToggleAutoRenewal = async (
    budgetId: string,
    enabled: boolean
  ) => {
    const success = await toggleAutoRenewal(budgetId, enabled);
    if (success) {
      // Success message could be shown here if needed
      console.log(
        `Auto-renewal ${
          enabled ? "enabled" : "disabled"
        } for budget ${budgetId}`
      );
    }
  };

  const onRefresh = () => {
    fetchBudgets();
    fetchSummary();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Debug log to inspect budgets data
  console.log("Budgets data:", budgets);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Budget" />
          <View style={styles.buttonContainer}>
            <CircleButton
              icon="add"
              onPress={() => router.push("/budget/add")}
              size={40}
            />
          </View>
        </View>
      }
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bodyContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              {!isAuthenticated && (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {summary && summary.TotalBudgets > 0 && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Budget Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Budgets:</Text>
                <Text style={styles.summaryValue}>{summary.TotalBudgets}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Planned:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(summary.TotalPlannedAmount || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Spent:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(summary.TotalSpentAmount || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Remaining:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(summary.TotalRemainingAmount || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Progress:</Text>
                <Text style={styles.summaryValue}>
                  {(summary.OverallProgressPercentage || 0).toFixed(1)}%
                </Text>
              </View>
            </View>
          )}

          {budgets.length > 0 && (
            <Text style={styles.budgetText}>Your Budgets</Text>
          )}

          {budgets.map((budget) => (
            <BudgetProgressCard
              key={budget.Id}
              id={budget.Id}
              category={budget.Category}
              plannedAmount={budget.PlannedAmount || 0}
              spentAmount={budget.SpentAmount || 0}
              reminder={budget.Reminder}
              startDate={budget.StartDate}
              renewalFrequency={budget.RenewalFrequency}
              autoRenewalEnabled={budget.AutoRenewalEnabled}
              lastRenewalDate={budget.LastRenewalDate}
              endDate={budget.EndDate}
              onEdit={() => handleEditBudget(budget.Id)}
              onDelete={() => handleDeleteBudget(budget.Id, budget.Category)}
              onToggleAutoRenewal={(enabled) =>
                handleToggleAutoRenewal(budget.Id, enabled)
              }
            />
          ))}

          {!loading && budgets.length === 0 && !error && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No budgets found</Text>
              <Text style={styles.emptySubtext}>
                Create your first budget to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  scrollView: {
    flex: 1,
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
  budgetText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.borderLight,
    textTransform: "uppercase",
    paddingBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    top: 65,
    right: 40,
  },
  errorContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    textAlign: "center",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "JakarthaBold",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
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
