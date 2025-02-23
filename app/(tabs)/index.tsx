import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "@/components/ui/ProgressBar";
import TotalBalance from "@/components/ui/TotalBalance";
import { Colors } from "@/constants/Colors";
import TotalExpenses from "@/components/ui/TotalExpenses";
import CircleButton from "@/components/ui/CircleButton";
import Insight from "@/components/ui/Insight";
import Transaction from "@/components/ui/Transaction";
import { useRouter } from "expo-router";
import CircularProgress from "@/components/ui/CircularProgress";
import ParallaxScrollView from "@/components/ParallaxScrollView";

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
              <CircleButton icon="add" onPress={() => {}} size={40} />
            </View>
          </View>
          <View style={styles.summaryContainer}>
            <TotalBalance />
            <View style={styles.vl} />
            <TotalExpenses />
          </View>
          <ProgressBar totalBudget={14000} totalExpenses={3000} />
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
              onPress={() => router.push("/transactions")}
            >
              See more
            </Text>
          </View>
          <View style={styles.transactionList}>
            <Transaction
              id={1}
              title="Keells SuperMarket"
              type="expense"
              category="Food"
              amount={1345}
              date="2025-02-10"
            />
            <Transaction
              id={2}
              title="Allowance"
              type="income"
              category="Income"
              amount={80000}
              date="2025-02-11"
            />
          </View>
        </View>
        <View style={[styles.summaryContainer, { marginBottom: 20 }]}>
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
    padding: 40,
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
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
    flexGrow: 0,
    height: 40,
    width: 40,
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
});
