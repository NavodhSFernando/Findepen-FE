import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Selector from "@/components/ui/Selector";
import { useForm, Controller } from "react-hook-form";
import useTransactions from "@/hooks/useTransactions";
import useCategories from "@/hooks/useCategories";
// Local interface for receipt processing
interface TransactionData {
  Title: string;
  Description?: string;
  Amount: string;
  Category?: string;
  Type: "Expense" | "Income";
  Date: string;
}

interface TransactionForm {
  title: string;
  description: string;
  amount: string;
  category: string;
  type: "Income" | "Expense";
  date: string;
}

const AddTransactionPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ prefill?: string }>();
  const { createTransaction, balance, fetchBalance } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransactionForm>({
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      type: "Expense" as const,
      date: new Date().toISOString().split("T")[0], // Today's date as default
    },
  });

  // Fetch balance when component mounts
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Handle pre-filled data from receipt scanning
  useEffect(() => {
    if (params.prefill) {
      try {
        const prefillData: TransactionData = JSON.parse(params.prefill);

        // Set form values with pre-filled data
        setValue("title", prefillData.Title || "");
        setValue("description", prefillData.Description || "");
        setValue("amount", prefillData.Amount || "");
        setValue("category", prefillData.Category || "");
        setValue("type", prefillData.Type || "Expense");
        setValue(
          "date",
          prefillData.Date || new Date().toISOString().split("T")[0]
        );

        console.log("Pre-filled transaction data:", prefillData);
      } catch (error) {
        console.error("Error parsing prefill data:", error);
      }
    }
  }, [params.prefill, setValue]);

  const selectedType = watch("type");

  const submitTransaction = async (data: TransactionForm) => {
    try {
      setIsSubmitting(true);

      const transactionAmount = parseFloat(data.amount);

      // Validate balance for expense transactions
      if (data.type === "Expense" && balance < transactionAmount) {
        Alert.alert(
          "Insufficient Balance",
          `Your current balance is Rs. ${balance.toFixed(2)}. This transaction would exceed your available funds.`,
          [{ text: "OK" }]
        );
        return;
      }

      const apiTransactionData = {
        Title: data.title,
        Description: data.description || undefined,
        Amount: transactionAmount,
        Category: data.category || undefined,
        Type: data.type,
        Date: data.date,
      };

      const result = await createTransaction(apiTransactionData);

      if (result) {
        Alert.alert("Success", "Transaction created successfully", [
          {
            text: "OK",
            onPress: () => {
              reset();
              handleGoBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create transaction. Please try again.");
      }
    } catch (err) {
      console.error("Transaction creation error:", err);
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
      router.replace("/transactions");
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
          <Title text="Add Transaction" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Balance Display */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Balance</Text>
          <Text style={styles.infoValue}>Rs. {balance.toFixed(2)}</Text>
        </View>

        <Controller
          control={control}
          name="type"
          rules={{ required: "Transaction type is required" }}
          render={({ field: { value } }) => (
            <Selector
              label="Transaction Type"
              options={["Income", "Expense"]}
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
              disabled={categoriesLoading}
              loading={categoriesLoading}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Date"
              placeholder="Select date"
              type="date"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.date && (
          <Text style={styles.errorText}>{errors.date.message}</Text>
        )}

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Creating..." : "Create"}
            onPress={handleSubmit(submitTransaction)}
            variant="primary"
            disabled={isSubmitting || categoriesLoading}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default AddTransactionPage;

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
  balanceContainer: {
    backgroundColor: Colors.neutral,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.borderLight,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "JakarthaSemiBold",
    color: Colors.text,
  },
});
