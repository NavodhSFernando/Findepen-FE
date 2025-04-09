import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import GoalProgressCard from "@/components/ui/GoalProgressCard";

type Goal = {
  title: string;
  deadline: Date;
  currentAmount: number;
  targetAmount: number;
};

const MOCK_GOAL_DATA: Goal[] = [
  {
    title: "New Laptop",
    deadline: new Date("2025-06-30"),
    currentAmount: 350,
    targetAmount: 1200,
  },
  {
    title: "Vacation in Japan",
    deadline: new Date("2026-01-15"),
    currentAmount: 1000,
    targetAmount: 5000,
  },
  {
    title: "Emergency Fund",
    deadline: new Date("2025-12-31"),
    currentAmount: 1500,
    targetAmount: 3000,
  },
  {
    title: "Online Course Certificate",
    deadline: new Date("2025-08-01"),
    currentAmount: 200,
    targetAmount: 500,
  },
];

const index = () => {
  const [goalData, setGoalData] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate API fetch
    const fetchGoalData = async () => {
      // simulate delay
      await new Promise((res) => setTimeout(res, 500));
      setGoalData(MOCK_GOAL_DATA);
    };

    fetchGoalData();
  }, []);
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
      <View style={styles.bodyContainer}>
        {goalData.length > 0 && (
          <Text style={styles.budgetText}>Your Goals</Text>
        )}
        {goalData.map((goal, index) => (
          <GoalProgressCard
            key={index}
            title={goal.title}
            deadline={goal.deadline}
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
          />
        ))}
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
  buttonContainer: {
    position: "absolute",
    top: 65,
    right: 40,
  },
});
