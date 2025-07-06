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
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import GoalProgressCard from "@/components/ui/GoalProgressCard";
import useGoals from "@/hooks/useGoals";
import { useFocusEffect } from "expo-router";

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
    withdrawFundsFromGoal,
    convertGoalToExpense,
  } = useGoals();

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
  };

  const handleLogin = () => {
    router.push("/login");
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
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Goal Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Goals:</Text>
                <Text style={styles.summaryValue}>{summary.TotalGoals}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Active Goals:</Text>
                <Text style={styles.summaryValue}>{summary.ActiveGoals}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Completed Goals:</Text>
                <Text style={styles.summaryValue}>
                  {summary.CompletedGoals}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Target Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(summary.TotalTargetAmount || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Current Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rs. {(summary.TotalCurrentAmount || 0).toFixed(2)}
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

          {goals.length > 0 && (
            <Text style={styles.budgetText}>Your Goals</Text>
          )}

          {goals.map((goal) => (
            <GoalProgressCard
              key={goal.Id}
              goal={goal}
              onEdit={() => router.push(`/goal/edit?id=${goal.Id}`)}
              onDelete={() => handleDeleteGoal(goal.Id, goal.Title)}
              onAddFunds={() => {
                // TODO: Implement add funds modal
                Alert.alert(
                  "Add Funds",
                  "Add funds functionality coming soon!"
                );
              }}
              onWithdrawFunds={() => {
                // TODO: Implement withdraw funds modal
                Alert.alert(
                  "Withdraw Funds",
                  "Withdraw funds functionality coming soon!"
                );
              }}
              onConvertToExpense={() => {
                // TODO: Implement convert to expense modal
                Alert.alert(
                  "Convert to Expense",
                  "Convert to expense functionality coming soon!"
                );
              }}
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
  buttonContainer: {
    position: "absolute",
    top: 65,
    right: 40,
  },
});
