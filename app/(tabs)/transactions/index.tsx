import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import { TransactionInputMethodSelector } from "@/components/ui/TransactionInputMethodSelector";
import { ReceiptScanner } from "@/components/ui/ReceiptScanner";
import TotalBalance from "@/components/ui/TotalBalance";
import TotalExpenses from "@/components/ui/TotalExpenses";
import TotalReserves from "@/components/ui/TotalReserves";
import Transaction from "@/components/ui/Transaction";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import useTransactions from "@/hooks/useTransactions";
// Local interface for receipt processing
interface TransactionData {
  Title: string;
  Description?: string;
  Amount: string;
  Category?: string;
  Type: "Expense" | "Income";
  Date: string;
}

// Transaction type for type safety
interface TransactionType {
  Id: string;
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: "Income" | "Expense";
  Date: string;
}

type GroupedTransactions = {
  [key: string]: TransactionType[];
};

const groupTransactionsByDate = (transactions: TransactionType[]) => {
  const groups: GroupedTransactions = {};

  transactions.forEach((transaction) => {
    const date = transaction.Date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });

  const sortedKeys = Object.keys(groups).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  return sortedKeys.map((key) => ({ date: key, transactions: groups[key] }));
};

const TransactionsPage = () => {
  const router = useRouter();
  const [isInputMethodVisible, setIsInputMethodVisible] = useState(false);
  const [isReceiptScannerVisible, setIsReceiptScannerVisible] = useState(false);
  const [search, setSearch] = useState("");
  const {
    transactions,
    balance,
    expenses,
    reserves,
    loading,
    error,
    isAuthenticated,
    fetchTransactions,
    fetchBalance,
    fetchReserves,
  } = useTransactions();

  // Refresh transactions when the page comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      fetchBalance();
      fetchReserves();
    }, [])
  );

  const filteredGroups = useMemo(() => {
    const filtered = search
      ? transactions.filter(
          (tx: TransactionType) =>
            tx.Title.toLowerCase().includes(search.toLowerCase()) ||
            (tx.Category &&
              tx.Category.toLowerCase().includes(search.toLowerCase()))
        )
      : transactions;
    return groupTransactionsByDate(filtered);
  }, [transactions, search]);

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

  const onRefresh = () => {
    fetchTransactions();
    fetchBalance();
    fetchReserves();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Transactions" />
          <View style={styles.buttonContainer}>
            <CircleButton
              icon="add"
              onPress={() => setIsInputMethodVisible(true)}
              size={40}
            />
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
          {/* Custom Search Bar Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchBarContainer}>
              <MaterialCommunityIcons
                name="clipboard-search-outline"
                size={16}
                color={Colors.fadedText}
                style={{ marginLeft: 10 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Transaction"
                placeholderTextColor={Colors.fadedText}
                value={search}
                onChangeText={setSearch}
                underlineColorAndroid="transparent"
                selectionColor={Colors.primary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={16}
                color={Colors.borderLight}
              />
            </TouchableOpacity>
          </View>
          {/* End Custom Search Bar Row */}

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

          {!loading && filteredGroups.length === 0 && !error && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>
                Add your first transaction to get started
              </Text>
            </View>
          )}

          {filteredGroups.length > 0 && (
            <View style={{ width: "100%" }}>
              {filteredGroups.map((item) => (
                <View
                  key={item.date}
                  style={{ marginBottom: 24, width: "100%" }}
                >
                  <Text style={styles.sectionHeader}>{item.date}</Text>
                  <View style={styles.transactionList}>
                    {item.transactions.map((tx) => (
                      <Transaction
                        key={tx.Id}
                        id={
                          typeof tx.Id === "number"
                            ? tx.Id
                            : parseInt(
                                String(tx.Id)
                                  .replace(/[^0-9]/g, "")
                                  .slice(0, 8)
                              ) || 0
                        }
                        title={tx.Title || ""}
                        type={
                          tx.Type && tx.Type.toLowerCase() === "income"
                            ? "income"
                            : "expense"
                        }
                        category={tx.Category || ""}
                        amount={tx.Amount || 0}
                        date={tx.Date || ""}
                        onPress={() =>
                          router.push(`/transactions/view?id=${tx.Id}`)
                        }
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
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
    </ParallaxScrollView>
  );
};

export default TransactionsPage;

const styles = StyleSheet.create({
  backgroundContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  topContainer: {
    padding: 40,
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 52,
    gap: 20,
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
    position: "absolute",
    top: 65,
    right: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    minHeight: "100%",
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 18,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 4,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontFamily: "JakarthaRegular",
    fontSize: 13,
    marginLeft: 6,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 36,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.borderLight,
    textTransform: "uppercase",
    paddingBottom: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: Colors.errorLight,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: Colors.white,
    fontFamily: "JakarthaBold",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontFamily: "JakarthaBold",
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
  },
  emptySubtext: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.fadedText,
    textAlign: "center",
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
});
