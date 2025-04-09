import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import BudgetProgressCard from "@/components/ui/BudgetProgressCard";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import CircleButton from "@/components/ui/CircleButton";

type Budget = {
  category: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  spentAmount: number;
};

const MOCK_BUDGET_DATA: Budget[] = [
  {
    category: "Groceries",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-01-31"),
    totalAmount: 10000,
    spentAmount: 5000,
  },
  {
    category: "Entertainment",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-01-31"),
    totalAmount: 5000,
    spentAmount: 1000,
  },
  {
    category: "Health",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-01-31"),
    totalAmount: 3000,
    spentAmount: 2000,
  },
  {
    category: "Transport",
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-01-31"),
    totalAmount: 5000,
    spentAmount: 3000,
  },
];

const Index = () => {
  const [budgetData, setBudgetData] = useState<Budget[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate API fetch
    const fetchBudgetData = async () => {
      // simulate delay
      await new Promise((res) => setTimeout(res, 500));
      setBudgetData(MOCK_BUDGET_DATA);
    };

    fetchBudgetData();
  }, []);

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
      <View style={styles.bodyContainer}>
        {budgetData.length > 0 && (
          <Text style={styles.budgetText}>Your Regular Budgets</Text>
        )}
        {budgetData.map((budget, index) => (
          <BudgetProgressCard
            key={index}
            category={budget.category}
            startDate={budget.startDate}
            endDate={budget.endDate}
            totalAmount={budget.totalAmount}
            spentAmount={budget.spentAmount}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
    height: "100%",
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
});
