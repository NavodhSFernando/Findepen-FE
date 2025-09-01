import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import TotalBalance from "@/components/ui/TotalBalance";
import { Colors } from "@/constants/Colors";
import TotalReserves from "@/components/ui/TotalReserves";
import CircleButton from "@/components/ui/CircleButton";
import Insight from "@/components/ui/Insight";
import Transaction from "@/components/ui/Transaction";
import { useRouter, useFocusEffect } from "expo-router";
import CircularProgress from "@/components/ui/CircularProgress";
import { TransactionInputMethodSelector } from "@/components/ui/TransactionInputMethodSelector";
import { ReceiptScanner } from "@/components/ui/ReceiptScanner";
import { useState, useCallback, useEffect, useRef } from "react";
import useTransactions from "@/hooks/useTransactions";
import HistoricalDataChart from "@/components/ui/HistoricalDataChart";
import useHistoricalData from "@/hooks/useHistoricalData";
import SummaryCardSkeleton from "@/components/ui/SummaryCardSkeleton";
import TransactionSkeleton from "@/components/ui/TransactionSkeleton";

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
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const {
    transactions,
    balance,
    expenses,
    reserves,
    loading: transactionsLoading,
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

  // Global loading state - true if any critical data is still loading
  const isGlobalLoading = transactionsLoading || chartLoading;

  // Load all data in parallel on initial mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchTransactions(),
          fetchBalance(),
          fetchReserves(),
          refetchChart(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Refresh data when the page comes into focus, but only if we haven't loaded data yet
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we haven't loaded any data yet (transactions array is empty)
      if (transactions.length === 0 && !transactionsLoading && !chartLoading) {
        fetchTransactions();
        fetchBalance();
        fetchReserves();
        refetchChart();
      }
    }, [transactions.length, transactionsLoading, chartLoading])
  );

  // Redirect to welcome page if balance is -1
  useEffect(() => {
    if (balance === -1) {
      router.replace("/welcome");
    }
  }, [balance, router]);

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

  // Always show the main content, let individual components handle their loading states

  return (
    <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
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

          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              {transactionsLoading ? (
                <>
                  <SummaryCardSkeleton />
                  <SummaryCardSkeleton />
                </>
              ) : (
                <>
                  <View style={styles.summaryCard}>
                    <TotalBalance totalBalance={balance} />
                  </View>
                  <View style={styles.summaryCard}>
                    <TotalReserves totalReserves={reserves} />
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Chart Section */}
          <HistoricalDataChart
            balanceHistory={historicalData?.BalanceHistory || []}
            reserveHistory={historicalData?.ReserveHistory || []}
            loading={chartLoading}
            error={chartError}
          />
        </View>

        <View style={styles.recentTransactionsContainer}>
          <View style={styles.recentTransactions}>
            <View style={styles.transactionHeader}>
              <Text style={styles.titleText}>Recent Transactions</Text>
              <Text
                style={styles.transactionLink}
                onPress={() => router.push("/(tabs)/transactions")}
              >
                See more
              </Text>
            </View>
            <View style={styles.transactionList}>
              {transactionsLoading ? (
                <>
                  <TransactionSkeleton />
                  <TransactionSkeleton />
                </>
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
                    type={
                      transaction.Type.toLowerCase() as "income" | "expense"
                    }
                    category={transaction.Category || "Other"}
                    amount={transaction.Amount}
                    date={transaction.Date}
                  />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>

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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Reduced padding to prevent over-scrolling
  },
  headerSection: {
    paddingTop: 40,
    backgroundColor: Colors.secondary,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 52,
    paddingTop: 30,
    width: "100%",
    paddingHorizontal: 20,
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
    fontSize: 18,
    color: Colors.neutral,
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    shadowOpacity: 1,
  },
  titleText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
  },
  greetingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 16,
    color: Colors.neutral,
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
    shadowOpacity: 1,
  },
  buttonContainer: {
    flexGrow: 0,
    height: 40,
    width: 40,
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 12,
    gap: 20,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
    gap: 20,
    paddingBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  recentTransactionsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginBottom: 20, // Add extra bottom margin for proper spacing
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: "100%",
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
});
