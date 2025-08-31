import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import BudgetProgressCard from "@/components/ui/BudgetProgressCard";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import CircleButton from "@/components/ui/CircleButton";
import useBudgets from "@/hooks/useBudgets";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import BudgetSummaryModal from "@/components/ui/BudgetSummaryModal";

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

  // Modal state
  const [budgetSummaryModalVisible, setBudgetSummaryModalVisible] =
    useState(false);

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
            <TouchableOpacity
              onPress={() => setBudgetSummaryModalVisible(true)}
              activeOpacity={0.9}
              style={styles.motivationalCardContainer}
            >
              <LinearGradient
                colors={[Colors.secondary, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.motivationalCard}
              >
                <Text style={styles.motivationalTitle}>Stay on Track!</Text>
                <Text style={styles.motivationalDescription}>
                  You've spent{" "}
                  <Text style={{ fontFamily: "JakarthaBold" }}>
                    Rs.{(summary.TotalSpentAmount || 0).toFixed(0)}
                  </Text>{" "}
                  of your budget
                </Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    {(summary.OverallProgressPercentage || 0).toFixed(1)}% used
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
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

      {/* Budget Summary Modal */}
      <BudgetSummaryModal
        visible={budgetSummaryModalVisible}
        onClose={() => setBudgetSummaryModalVisible(false)}
        summary={summary}
      />
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
  motivationalCardContainer: {
    width: "100%",
    marginBottom: 20,
  },
  motivationalCard: {
    padding: 25,
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationalTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
    marginBottom: 12,
    textAlign: "center",
  },
  motivationalDescription: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.neutral,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.95,
  },
  progressBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  progressBadgeText: {
    fontSize: 12,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: Colors.errorLight,
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
