import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter } from "expo-router";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Selector from "@/components/ui/Selector";
import { Switch } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import useBudgets from "@/hooks/useBudgets";
import useCategories from "@/hooks/useCategories";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface BudgetForm {
  category: string;
  plannedAmount: string;
  reminder: boolean;
  startDate: string;
  renewalFrequency: string;
  autoRenewalEnabled: boolean;
}

const AddBudgetPage: React.FC = () => {
  const router = useRouter();
  const { createBudget } = useBudgets();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BudgetForm>({
    defaultValues: {
      category: "",
      plannedAmount: "",
      reminder: false,
      startDate: new Date().toISOString().split("T")[0], // Today's date as default
      renewalFrequency: "Monthly",
      autoRenewalEnabled: false,
    },
  });

  const selectedCategory = watch("category");

  const submitBudget = async (data: BudgetForm) => {
    try {
      setIsSubmitting(true);

      const apiBudgetData = {
        Category: data.category,
        PlannedAmount: parseFloat(data.plannedAmount),
        Reminder: data.reminder,
        StartDate: data.startDate,
        RenewalFrequency: data.renewalFrequency,
        AutoRenewalEnabled: data.autoRenewalEnabled,
      };

      const result = await createBudget(apiBudgetData);

      if (result) {
        Alert.alert("Success", "Budget created successfully", [
          {
            text: "OK",
            onPress: () => {
              reset();
              handleGoBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create budget. Please try again.");
      }
    } catch (err) {
      console.error("Budget creation error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Robust go back handler
  const handleGoBack = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace("/budget");
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
              onPress={handleGoBack}
              size={40}
            />
          </View>
          <Title text="Add Budget" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="category"
          rules={{ required: "Category is required" }}
          render={({ field: { value } }) => (
            <Selector
              label="Category"
              options={categories}
              value={value}
              onValueChange={(option) => setValue("category", option)}
              disabled={categoriesLoading}
              loading={categoriesLoading}
            />
          )}
        />
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}

        <Controller
          control={control}
          name="plannedAmount"
          rules={{
            required: "Amount is required",
            validate: {
              isPositive: (value) =>
                parseFloat(value) > 0 || "Amount must be greater than 0",
              isNumber: (value) =>
                !isNaN(parseFloat(value)) || "Please enter a valid number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Planned Amount"
              placeholder="Enter planned amount"
              type="number"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.plannedAmount && (
          <Text style={styles.errorText}>{errors.plannedAmount.message}</Text>
        )}

        <Controller
          control={control}
          name="startDate"
          rules={{ required: "Start date is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Start Date"
              placeholder="Select start date"
              type="date"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.startDate && (
          <Text style={styles.errorText}>{errors.startDate.message}</Text>
        )}

        <Controller
          control={control}
          name="renewalFrequency"
          rules={{ required: "Renewal frequency is required" }}
          render={({ field: { value } }) => (
            <Selector
              label="Renewal Frequency"
              options={["Weekly", "Monthly", "Yearly"]}
              value={value}
              onValueChange={(option) => setValue("renewalFrequency", option)}
              disabled={false}
              loading={false}
            />
          )}
        />
        {errors.renewalFrequency && (
          <Text style={styles.errorText}>
            {errors.renewalFrequency.message}
          </Text>
        )}

        <Controller
          control={control}
          name="autoRenewalEnabled"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Auto Renewal</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
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
            title={isSubmitting ? "Creating..." : "Create Budget"}
            onPress={handleSubmit(submitBudget)}
            variant="primary"
            disabled={isSubmitting || categoriesLoading}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default AddBudgetPage;

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
    marginTop: 20,
  },
});
