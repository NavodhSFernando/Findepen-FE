import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import GoalProgressCard from "@/components/ui/GoalProgressCard";
import AddFundsModal from "@/components/ui/AddFundsModal";
import useGoals from "@/hooks/useGoals";
import { useFocusEffect } from "expo-router";
import { Goal } from "@/hooks/useGoals";
import useTransactions from "@/hooks/useTransactions";
import ConvertToExpenseModal from "@/components/ui/ConvertToExpenseModal";
import GoalSummaryModal from "@/components/ui/GoalSummaryModal";
import useCategories from "@/hooks/useCategories";

const index = () => {
  const router = useRouter();
  const {
    goals,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchGoals,
    fetchSummary,
    deleteGoal,
    addFundsToGoal,
    convertGoalToExpense,
  } = useGoals();

  // Get user balance and transaction refresh functions from useTransactions
  const { balance, fetchTransactions, fetchBalance } = useTransactions();

  // Modal state
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [goalSummaryModalVisible, setGoalSummaryModalVisible] = useState(false);

  // Categories for expense
  const { categories } = useCategories();

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
      fetchSummary();
    }, [])
  );

  const handleDeleteGoal = async (goalId: string, title: string) => {
    Alert.alert("Delete Goal", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteGoal(goalId);
          if (success) {
            Alert.alert("Success", "Goal deleted successfully");
          }
        },
      },
    ]);
  };

  const onRefresh = () => {
    fetchGoals();
    fetchSummary();
    fetchTransactions();
    fetchBalance();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Handle add funds
  const handleAddFunds = async (amount: number, note?: string) => {
    if (!selectedGoal) return false;

    try {
      const result = await addFundsToGoal(selectedGoal.Id, { amount, note });
      if (result) {
        // Refresh balance after adding funds to goal
        await fetchBalance();
        Alert.alert("Success", "Funds added to goal successfully!");
        return true;
      } else {
        Alert.alert("Error", "Failed to add funds to goal");
        return false;
      }
    } catch (error) {
      console.error("Error adding funds:", error);
      Alert.alert("Error", "Failed to add funds to goal");
      return false;
    }
  };

  // Open add funds modal
  const openAddFundsModal = (goal: Goal) => {
    // Only allow for active goals
    if (goal.Status === "Active" && goal.IsActive) {
      setSelectedGoal(goal);
      setAddFundsModalVisible(true);
    }
  };

  // Open convert to expense modal
  const openConvertModal = (goal: Goal) => {
    // Allow conversion for any goal with funds
    if (goal.CurrentAmount > 0) {
      setSelectedGoal(goal);
      setConvertModalVisible(true);
    }
  };

  // Handle convert to expense
  const handleConvertToExpense = async ({
    amount,
    transactionTitle,
    transactionDescription,
    category,
    markGoalAsCompleted,
  }: any) => {
    if (!selectedGoal) return false;
    try {
      console.log("handleConvertToExpense called with:", {
        goalId: selectedGoal.Id,
        amount,
        transactionTitle,
        transactionDescription,
        category,
        markGoalAsCompleted,
      });

      const result = await convertGoalToExpense(selectedGoal.Id, {
        amount,
        transactionTitle,
        transactionDescription,
        category,
        markGoalAsCompleted,
      });

      console.log("convertGoalToExpense result:", result);

      if (result) {
        // Refresh transactions and balance after successful conversion
        // Balance is only affected if goal is marked as completed
        await Promise.all([fetchTransactions(), fetchBalance()]);

        const remainingAmount = selectedGoal.CurrentAmount - amount;
        let successMessage = "Goal converted to expense successfully!";

        if (markGoalAsCompleted) {
          if (remainingAmount > 0) {
            successMessage += `\n\nRs. ${remainingAmount.toFixed(2)} has been returned to your balance.`;
          }
          successMessage += "\n\nGoal has been marked as completed.";
        } else {
          if (remainingAmount > 0) {
            successMessage += `\n\nRs. ${remainingAmount.toFixed(2)} remains in the goal for future use.`;
          }
          successMessage += "\n\nGoal remains active for future contributions.";
        }

        Alert.alert("Success", successMessage);
        return true;
      } else {
        Alert.alert("Error", "Failed to convert goal to expense");
        return false;
      }
    } catch (error) {
      console.error("Error converting goal to expense:", error);
      Alert.alert("Error", "Failed to convert goal to expense");
      return false;
    }
  };

  // Debug log to inspect goals data
  console.log("Goals data:", goals);
  console.log("Summary data:", summary);
  console.log(
    "Goals with Status and IsActive:",
    goals.map((g) => ({
      id: g.Id,
      title: g.Title,
      status: g.Status,
      isActive: g.IsActive,
    }))
  );
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Goals" />
          <View style={styles.buttonContainer}>
            <CircleButton
              icon="add"
              onPress={() => router.push("/goal/add")}
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

          {summary && summary.TotalGoals > 0 && (
            <TouchableOpacity
              onPress={() => setGoalSummaryModalVisible(true)}
              activeOpacity={0.9}
              style={styles.motivationalCardContainer}
            >
              <LinearGradient
                colors={[Colors.secondary, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.motivationalCard}
              >
                <Text style={styles.motivationalTitle}>Keep Going!</Text>
                <Text style={styles.motivationalDescription}>
                  Only{" "}
                  <Text style={{ fontFamily: "JakarthaBold" }}>
                    Rs.{(summary.TotalRemainingAmount || 0).toFixed(0)}
                  </Text>{" "}
                  left to achieve your goal
                </Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    You're {(summary.OverallProgressPercentage || 0).toFixed(1)}
                    % there!
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {goals.length > 0 && (
            <Text style={styles.budgetText}>Your Goals</Text>
          )}

          {goals.map((goal) => (
            <GoalProgressCard
              key={goal.Id}
              goal={goal}
              onEdit={() => router.push(`/goal/edit?id=${goal.Id}`)}
              onDelete={() => handleDeleteGoal(goal.Id, goal.Title)}
              onAddFunds={() => openAddFundsModal(goal)}
              onConvertToExpense={() => openConvertModal(goal)}
            />
          ))}

          {!loading && goals.length === 0 && !error && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No goals found</Text>
              <Text style={styles.emptySubtext}>
                Create your first goal to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Funds Modal */}
      <AddFundsModal
        visible={addFundsModalVisible}
        onClose={() => setAddFundsModalVisible(false)}
        goal={selectedGoal}
        userBalance={balance}
        onAddFunds={handleAddFunds}
      />

      {/* Convert To Expense Modal */}
      <ConvertToExpenseModal
        visible={convertModalVisible}
        onClose={() => setConvertModalVisible(false)}
        goal={selectedGoal}
        categories={categories}
        onConvert={handleConvertToExpense}
      />

      {/* Goal Summary Modal */}
      <GoalSummaryModal
        visible={goalSummaryModalVisible}
        onClose={() => setGoalSummaryModalVisible(false)}
        summary={summary}
      />
    </ParallaxScrollView>
  );
};

export default index;

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
  loadingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    paddingVertical: 20,
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
});
