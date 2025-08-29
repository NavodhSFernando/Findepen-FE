import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter } from "expo-router";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Selector from "@/components/ui/Selector";
import { useForm, Controller } from "react-hook-form";
import useRecurringTransactions, {
  CreateRecurringTransactionData,
} from "@/hooks/useRecurringTransactions";

interface RecurringTransactionForm {
  title: string;
  description: string;
  amount: string;
  category: string;
  type: "Income" | "Expense";
  frequency: "Weekly" | "Monthly" | "Yearly";
  startDate: string;
  endDate: string;
}

const AddRecurringTransactionPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, createRecurringTransaction, clearError } =
    useRecurringTransactions();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RecurringTransactionForm>({
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      type: "Expense" as const,
      frequency: "Monthly" as const,
      startDate: new Date().toISOString().split("T")[0], // Today's date as default
      endDate: "",
    },
  });

  const selectedType = watch("type");
  const selectedFrequency = watch("frequency");

  // Categories that match the backend ValidCategories
  const categories = [
    "Food",
    "Grocery",
    "Rent",
    "Education",
    "Health",
    "Entertainment",
    "Transportation",
    "Miscellaneous",
  ];

  const frequencyOptions = ["Weekly", "Monthly", "Yearly"];

  const typeOptions = ["Income", "Expense"];

  const submitRecurringTransaction = async (data: RecurringTransactionForm) => {
    try {
      setIsSubmitting(true);

      const apiRecurringTransactionData: CreateRecurringTransactionData = {
        Title: data.title,
        Description: data.description || undefined,
        Amount: parseFloat(data.amount),
        Category: data.category || undefined,
        Type: data.type,
        Date: data.startDate, // Use string format
        Frequency: data.frequency,
        StartDate: data.startDate,
        EndDate: data.endDate || undefined,
      };

      const result = await createRecurringTransaction(
        apiRecurringTransactionData
      );

      if (result) {
        Alert.alert("Success", "Recurring transaction created successfully", [
          {
            text: "OK",
            onPress: () => {
              reset();
              handleGoBack();
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error creating recurring transaction:", error);

      // Show specific error message if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.Title?.[0] ||
        error?.response?.data?.Category?.[0] ||
        error?.response?.data?.StartDate?.[0] ||
        error?.response?.data?.Date?.[0] ||
        "Failed to create recurring transaction";

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Robust go back handler
  const handleGoBack = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace("/more/recurring");
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
          <Title text="Add Recurring Transaction" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="type"
          rules={{ required: "Transaction type is required" }}
          render={({ field: { value } }) => (
            <Selector
              label="Transaction Type"
              options={typeOptions}
              value={value}
              onValueChange={(option) =>
                setValue("type", option as "Income" | "Expense")
              }
              disabled={false}
              loading={false}
            />
          )}
        />
        {errors.type && (
          <Text style={styles.errorText}>{errors.type.message}</Text>
        )}

        <Controller
          control={control}
          name="title"
          rules={{ required: "Transaction title is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Title"
              placeholder="Enter transaction title"
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
              placeholder="Enter transaction description (optional)"
              type="text"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
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
              label="Amount"
              placeholder="Enter amount"
              type="number"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.amount && (
          <Text style={styles.errorText}>{errors.amount.message}</Text>
        )}

        <Controller
          control={control}
          name="category"
          render={({ field: { value } }) => (
            <Selector
              label="Category"
              options={categories}
              value={value}
              onValueChange={(option) => setValue("category", option)}
              disabled={false}
              loading={false}
            />
          )}
        />

        <Controller
          control={control}
          name="frequency"
          rules={{ required: "Frequency is required" }}
          render={({ field: { value } }) => (
            <Selector
              label="Frequency"
              options={frequencyOptions}
              value={value}
              onValueChange={(option) =>
                setValue("frequency", option as "Weekly" | "Monthly" | "Yearly")
              }
              disabled={false}
              loading={false}
            />
          )}
        />
        {errors.frequency && (
          <Text style={styles.errorText}>{errors.frequency.message}</Text>
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
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="End Date (Optional)"
              placeholder="Select end date"
              type="date"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <View style={styles.buttonWrapper}>
          <Button
            title={
              isSubmitting ? "Creating..." : "Create Recurring Transaction"
            }
            onPress={handleSubmit(submitRecurringTransaction)}
            variant="primary"
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default AddRecurringTransactionPage;

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
