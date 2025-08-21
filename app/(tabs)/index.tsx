import { View, Text, StyleSheet } from "react-native";
import TotalBalance from "@/components/ui/TotalBalance";
import { Colors } from "@/constants/Colors";
import TotalExpenses from "@/components/ui/TotalExpenses";
import TotalReserves from "@/components/ui/TotalReserves";
import CircleButton from "@/components/ui/CircleButton";
import Insight from "@/components/ui/Insight";
import Transaction from "@/components/ui/Transaction";
import { useRouter, useFocusEffect } from "expo-router";
import CircularProgress from "@/components/ui/CircularProgress";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { TransactionInputMethodSelector } from "@/components/ui/TransactionInputMethodSelector";
import { ReceiptScanner } from "@/components/ui/ReceiptScanner";
import { useState, useCallback } from "react";
import useTransactions from "@/hooks/useTransactions";
import HistoricalDataChart from "@/components/ui/HistoricalDataChart";
import { useHistoricalData } from "@/hooks/useHistoricalData";
// Local interface for receipt processing
interface TransactionData {
  Title: string;
  Description?: string;
  Amount: string;
  Category?: string;
  Type: "Expense" | "Income";
  Date: string;
}

function getGreeting(): string {
  const currentHour = new Date().getHours();
  return currentHour < 12
    ? "Good Morning"
    : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";
}

export default function Overview() {
  const router = useRouter();
  const [isInputMethodVisible, setIsInputMethodVisible] = useState(false);
  const [isReceiptScannerVisible, setIsReceiptScannerVisible] = useState(false);
  const {
    transactions,
    balance,
    expenses,
    reserves,
    loading,
    error,
    fetchTransactions,
    fetchBalance,
    fetchReserves,
  } = useTransactions();

  const {
    data: historicalData,
    loading: chartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useHistoricalData(30); // Get last 30 days of data

  // Refresh data when the page comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      fetchBalance();
      fetchReserves();
      refetchChart();
    }, [])
  );

  const handleInputMethodSelect = (method: "manual" | "scan") => {
    console.log("Selected method:", method);
    if (method === "manual") {
      router.push("/transactions/add");
    } else if (method === "scan") {
      setIsReceiptScannerVisible(true);
    }
  };

  const handleReceiptProcessed = (transactionData: TransactionData) => {
    // Navigate to add transaction page with pre-filled data
    router.push({
      pathname: "/transactions/add",
      params: {
        prefill: JSON.stringify(transactionData),
      },
    });
  };

  // Get the latest 2 transactions
  const latestTransactions = transactions.slice(0, 2);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Hi, Welcome back</Text>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <CircleButton
                icon="add"
                onPress={() => setIsInputMethodVisible(true)}
                size={40}
              />
            </View>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <TotalBalance totalBalance={balance} />
              <View style={styles.vl} />
              <TotalExpenses totalExpenses={expenses} />
            </View>
            <View style={styles.summaryRow}>
              <TotalReserves totalReserves={reserves} />
            </View>
          </View>
          <View style={styles.chartContainer}>
            {/* Historical Data Chart */}
            <HistoricalDataChart
              balanceHistory={historicalData?.balanceHistory || []}
              reserveHistory={historicalData?.reserveHistory || []}
              loading={chartLoading}
              error={chartError}
            />
          </View>
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Insight message="Your spending is on track!" />

        <View style={styles.recentTransactions}>
          <View style={styles.transactionHeader}>
            <Text style={styles.headerText}>Recent Transactions</Text>
            <Text
              style={styles.transactionLink}
              onPress={() => router.push("/(tabs)/transactions")}
            >
              See more
            </Text>
          </View>
          <View style={styles.transactionList}>
            {loading ? (
              <Text style={styles.loadingText}>Loading transactions...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : latestTransactions.length === 0 ? (
              <Text style={styles.noTransactionsText}>
                No recent transactions
              </Text>
            ) : (
              latestTransactions.map((transaction) => (
                <Transaction
                  key={transaction.Id}
                  id={parseInt(transaction.Id)}
                  title={transaction.Title}
                  type={transaction.Type.toLowerCase() as "income" | "expense"}
                  category={transaction.Category || "Other"}
                  amount={transaction.Amount}
                  date={transaction.Date}
                />
              ))
            )}
          </View>
        </View>
        <View style={styles.budgetGoalContainer}>
          <View style={styles.budgetGoalRow}>
            <View>
              <Text style={styles.headerText}>Budget</Text>
              <CircularProgress
                type="expense"
                totalAmount={3000}
                currentAmount={1345}
                category="food"
                title="Food"
              />
            </View>
            <View>
              <Text style={styles.headerText}>Goal</Text>
              <CircularProgress
                type="income"
                totalAmount={5000}
                currentAmount={2000}
                category="income"
                title="Savings"
              />
            </View>
          </View>
        </View>
      </View>

      <TransactionInputMethodSelector
        visible={isInputMethodVisible}
        onClose={() => setIsInputMethodVisible(false)}
        onSelect={handleInputMethodSelect}
      />
      <ReceiptScanner
        visible={isReceiptScannerVisible}
        onClose={() => setIsReceiptScannerVisible(false)}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  topContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 52,
    gap: 20,
    paddingHorizontal: 40,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
  },
  vl: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.neutral,
    height: 34,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 52,
    paddingTop: 30,
    width: "100%",
    paddingHorizontal: 40,
  },
  headerTextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  headerText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
  },
  greetingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    flexGrow: 0,
    height: 40,
    width: 40,
  },
  chartContainer: {
    paddingBottom: 10,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    height: "100%",
    flexShrink: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
  },
  recentTransactions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: 20,
  },
  transactionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  transactionLink: {
    fontFamily: "JakarthaRegular",
    fontSize: 10,
    color: Colors.text,
  },
  transactionList: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
  loadingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
    paddingVertical: 10,
  },
  errorText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.primary,
    textAlign: "center",
    paddingVertical: 10,
  },
  noTransactionsText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.neutral,
    textAlign: "center",
    paddingVertical: 10,
  },
  budgetGoalContainer: {
    marginBottom: 20,
  },
  budgetGoalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
  },
});
