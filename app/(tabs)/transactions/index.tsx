import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import { TransactionInputMethodSelector } from "@/components/ui/TransactionInputMethodSelector";
import TotalBalance from "@/components/ui/TotalBalance";
import TotalExpenses from "@/components/ui/TotalExpenses";
import Transaction from "@/components/ui/Transaction";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import useTransactions from "@/hooks/useTransactions";

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

const groupTransactionsByDate = (
  transactions: TransactionType[]
): { date: string; transactions: TransactionType[] }[] => {
  const groups: GroupedTransactions = {};
  transactions.forEach((tx: TransactionType) => {
    const date = new Date(tx.Date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let group = date.toDateString();
    if (date.toDateString() === today.toDateString()) group = "Today";
    else if (date.toDateString() === yesterday.toDateString())
      group = "Yesterday";
    if (!groups[group]) groups[group] = [];
    groups[group].push(tx);
  });
  // Sort groups: Today, Yesterday, then by date descending
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });
  return sortedKeys.map((key) => ({ date: key, transactions: groups[key] }));
};

const TransactionsPage = () => {
  const router = useRouter();
  const [isInputMethodVisible, setIsInputMethodVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { transactions, balance, expenses, loading, error, isAuthenticated } =
    useTransactions();

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

  const handleInputMethodSelect = (method: "manual" | "scan" | "file") => {
    // Handle the selected input method
    console.log("Selected method:", method);
    // Add logic to navigate or handle the selected method
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
            <TotalBalance totalBalance={balance} />
            <View style={styles.vl} />
            <TotalExpenses totalExpenses={expenses} />
          </View>
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Custom Search Bar Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <MaterialCommunityIcons
              name="search"
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
              name="options-outline"
              size={16}
              color={Colors.borderLight}
            />
          </TouchableOpacity>
        </View>
        {/* End Custom Search Bar Row */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text style={{ color: Colors.error, marginTop: 40 }}>{error}</Text>
        ) : filteredGroups.length === 0 ? (
          <Text style={{ color: Colors.text, marginTop: 40 }}>
            No transactions found.
          </Text>
        ) : (
          <View style={{ width: "100%" }}>
            {filteredGroups.map((item) => (
              <View key={item.date} style={{ marginBottom: 24, width: "100%" }}>
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
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <TransactionInputMethodSelector
        visible={isInputMethodVisible}
        onClose={() => setIsInputMethodVisible(false)}
        onSelect={handleInputMethodSelect}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 52,
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
});
