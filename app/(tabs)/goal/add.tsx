import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import InputField from "@/components/ui/Input";
import Selector from "@/components/ui/Selector";
import { Switch } from "react-native-gesture-handler";
import Button from "@/components/ui/Button";
import useGoals from "@/hooks/useGoals";

interface GoalForm {
  title: string;
  description: string;
  targetAmount: string;
  targetDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "Paused" | "Cancelled";
  reminder: boolean;
}

const AddGoalPage: React.FC = () => {
  const router = useRouter();
  const { createGoal } = useGoals();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalForm>({
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      targetDate: new Date().toISOString().split("T")[0],
      priority: "Medium" as const,
      status: "Active" as const,
      reminder: false,
    },
  });

  const submitGoal = async (data: GoalForm) => {
    try {
      console.log("Goal data:", data);

      const apiGoalData = {
        Title: data.title,
        Description: data.description,
        TargetAmount: parseFloat(data.targetAmount),
        TargetDate: data.targetDate,
        Priority: data.priority,
        Status: data.status,
        Reminder: data.reminder,
      };

      const result = await createGoal(apiGoalData);
      if (result) {
        Alert.alert("Success", "Goal created successfully!");
        handleGoBack();
      }
    } catch (err) {
      console.error("Goal creation error:", err);
      Alert.alert("Error", "Failed to create goal. Please try again.");
    }
  };

  // Robust go back handler
  const handleGoBack = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace("/goal");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <View style={styles.buttonContainer}>
            <CircleButton
              icon="chevron-back"
              onPress={() => handleGoBack()}
              size={40}
            />
          </View>
          <Title text="Add Goal" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Goal title is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Title"
              placeholder="Enter goal title"
              type="text"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Description"
              placeholder="Enter goal description (optional)"
              type="text"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="targetAmount"
          rules={{
            required: "Target amount is required",
            validate: {
              isPositive: (value) =>
                parseFloat(value) > 0 || "Amount must be greater than 0",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Target Amount"
              placeholder="Enter target amount"
              type="number"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.targetAmount && (
          <Text style={styles.errorText}>{errors.targetAmount.message}</Text>
        )}

        <Controller
          control={control}
          name="targetDate"
          rules={{ required: "Target date is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Target Date"
              placeholder="Select target date"
              type="date"
              value={value}
              onChangeText={onChange}
              iconName="calendar"
            />
          )}
        />
        {errors.targetDate && (
          <Text style={styles.errorText}>{errors.targetDate.message}</Text>
        )}

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <Selector
              label="Priority"
              placeholder="Select priority"
              options={["High", "Medium", "Low"]}
              value={value}
              onValueChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Selector
              label="Status"
              placeholder="Select status"
              options={["Active", "Completed", "Paused", "Cancelled"]}
              value={value}
              onValueChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="reminder"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Reminder</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Saving..." : "Save Goal"}
            onPress={handleSubmit(submitGoal)}
            variant="primary"
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default AddGoalPage;

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
    paddingHorizontal: 40,
    paddingVertical: 40,
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
    top: 70,
    left: 40,
    zIndex: 1000,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 40,
  },
  switchLabel: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
  },
  errorText: {
    color: Colors.error,
    fontSize: 10,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "JakarthaRegular",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
});
