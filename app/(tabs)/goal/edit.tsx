import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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

const EditGoalPage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getGoalById, updateGoal, loading } = useGoals();
  const [goal, setGoal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalForm>({
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      targetDate: "",
      priority: "Medium",
      status: "Active",
      reminder: false,
    },
  });

  useEffect(() => {
    const fetchGoal = async () => {
      if (id) {
        try {
          const goalData = await getGoalById(id as string);
          if (goalData) {
            setGoal(goalData);
            reset({
              title: goalData.Title,
              description: goalData.Description,
              targetAmount: goalData.TargetAmount.toString(),
              targetDate: new Date(goalData.TargetDate)
                .toISOString()
                .split("T")[0],
              priority: goalData.Priority,
              status: goalData.Status,
              reminder: goalData.Reminder,
            });
          }
        } catch (error) {
          Alert.alert("Error", "Failed to load goal details");
          router.back();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGoal();
  }, [id]);

  const submitGoal = async (data: GoalForm) => {
    try {
      if (!id) {
        Alert.alert("Error", "Goal ID is required");
        return;
      }

      const goalData = {
        Title: data.title,
        Description: data.description,
        TargetAmount: parseFloat(data.targetAmount),
        CurrentAmount: goal?.CurrentAmount || 0, // Preserve the current amount
        TargetDate: new Date(data.targetDate).toISOString(),
        Priority: data.priority,
        Status: data.status,
        IsActive: goal?.IsActive ?? true, // Preserve the IsActive status
        Reminder: data.reminder,
      };

      const success = await updateGoal(id as string, goalData);
      if (success) {
        Alert.alert("Success", "Goal updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update goal");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading goal details...</Text>
      </View>
    );
  }

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
              onPress={() => router.back()}
              size={40}
            />
          </View>
          <Title text="Edit Goal" />
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
              <Text style={styles.switchLabel}>Set Reminder</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Updating..." : "Update Goal"}
            onPress={handleSubmit(submitGoal)}
            variant="primary"
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default EditGoalPage;

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
  buttonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
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
    marginTop: 20,
  },
});
