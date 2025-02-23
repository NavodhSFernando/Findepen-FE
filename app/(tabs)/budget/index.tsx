import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BudgetProgressCard from "@/components/ui/BudgetProgressCard";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import CircleButton from "@/components/ui/CircleButton";

const index = () => {
  const [budgetData, setBudgetData] = React.useState([
    {
      category: "Groceries",
      startDate: "01-01-2021",
      endDate: "31-01-2021",
      totalAmount: 10000,
      spentAmount: 5000,
    },
    {
      category: "Entertainment",
      startDate: "01-01-2021",
      endDate: "31-01-2021",
      totalAmount: 5000,
      spentAmount: 1000,
    },
    {
      category: "Health",
      startDate: "01-01-2021",
      endDate: "31-01-2021",
      totalAmount: 3000,
      spentAmount: 2000,
    },
    {
      category: "Transport",
      startDate: "01-01-2021",
      endDate: "31-01-2021",
      totalAmount: 5000,
      spentAmount: 3000,
    },
  ]);
  const router = useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Budget" />
          <CircleButton
            icon="add"
            onPress={() => router.push("/budget/add")}
            size={40}
          />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {budgetData.length > 0 && (
          <Text style={styles.budgetText}>Your Regular Budgets</Text>
        )}
        {budgetData.map(
          (
            budget: {
              category: string;
              startDate: string;
              endDate: string;
              totalAmount: number;
              spentAmount: number;
            },
            index: number
          ) => (
            <BudgetProgressCard
              key={index}
              category={budget.category}
              startDate={budget.startDate}
              endDate={budget.endDate}
              totalAmount={budget.totalAmount}
              spentAmount={budget.spentAmount}
            />
          )
        )}
      </View>
    </ParallaxScrollView>
  );
};

export default index;

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
});
