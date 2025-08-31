import { View, Text, StyleSheet, ScrollView } from "react-native";
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
import { useState, useCallback } from "react";
import useTransactions from "@/hooks/useTransactions";
import HistoricalDataChart from "@/components/ui/HistoricalDataChart";
import useHistoricalData from "@/hooks/useHistoricalData";
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
    <View style={styles.mainContainer}>
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
              <View style={styles.summaryCard}>
                <TotalBalance totalBalance={balance} />
              </View>
              <View style={styles.summaryCard}>
                <TotalReserves totalReserves={reserves} />
              </View>
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
    </View>
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
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    flexShrink: 0,
    backgroundColor: Colors.background,
    paddingTop: 30,
    paddingBottom: 20,
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
});
