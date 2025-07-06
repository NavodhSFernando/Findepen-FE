import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Switch } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import useBudgets from "@/hooks/useBudgets";
import useCategories from "@/hooks/useCategories";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Selector from "@/components/ui/Selector";

interface BudgetForm {
  category: string;
  plannedAmount: string;
  spentAmount: string;
  reminder: boolean;
  startDate: string;
  renewalFrequency: string;
  autoRenewalEnabled: boolean;
}

const EditBudgetPage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateBudget, getBudgetById } = useBudgets();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<any>(null);

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
      spentAmount: "",
      reminder: false,
      startDate: "",
      renewalFrequency: "",
      autoRenewalEnabled: false,
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    const fetchBudget = async () => {
      if (id) {
        try {
          const budgetData = await getBudgetById(id);
          if (budgetData) {
            setBudget(budgetData);
            reset({
              category: budgetData.Category || "",
              plannedAmount: (budgetData.PlannedAmount || "").toString(),
              spentAmount: (budgetData.SpentAmount || "").toString(),
              reminder: budgetData.Reminder ?? false,
              startDate: budgetData.StartDate || "",
              renewalFrequency: budgetData.RenewalFrequency || "",
              autoRenewalEnabled: budgetData.AutoRenewalEnabled ?? false,
            });
          } else {
            Alert.alert("Error", "Budget not found. (ID: " + id + ")");
            router.replace("/budget");
          }
        } catch (error) {
          console.error("Error fetching budget:", error);
          Alert.alert("Error", "Failed to load budget");
          router.replace("/budget");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBudget();
  }, [id, reset, router]);

  const submitBudget = async (data: BudgetForm) => {
    try {
      setIsSubmitting(true);

      const budgetData = {
        Category: data.category,
        PlannedAmount: parseFloat(data.plannedAmount),
        SpentAmount: parseFloat(data.spentAmount),
        Reminder: data.reminder,
        StartDate: data.startDate,
        RenewalFrequency: data.renewalFrequency,
        AutoRenewalEnabled: data.autoRenewalEnabled,
      };

      const result = await updateBudget(id!, budgetData);

      if (result) {
        Alert.alert("Success", "Budget updated successfully", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/budget");
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to update budget. Please try again.");
      }
    } catch (err) {
      console.error("Budget update error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading budget...</Text>
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
              onPress={() => router.replace("/budget")}
              size={40}
            />
          </View>
          <Title text="Edit Budget" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="category"
          rules={{ required: "Category is required" }}
          render={({ field: { value, onChange } }) => (
            <Selector
              label="Category"
              options={categories}
              value={value}
              onValueChange={onChange}
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
            required: "Planned amount is required",
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
          name="spentAmount"
          rules={{
            required: "Spent amount is required",
            validate: {
              isPositive: (value) =>
                parseFloat(value) >= 0 || "Amount must be 0 or greater",
              isNumber: (value) =>
                !isNaN(parseFloat(value)) || "Please enter a valid number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Spent Amount"
              placeholder="Enter spent amount"
              type="number"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.spentAmount && (
          <Text style={styles.errorText}>{errors.spentAmount.message}</Text>
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
          name="reminder"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set Reminder</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />

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

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Updating..." : "Update Budget"}
            onPress={handleSubmit(submitBudget)}
            variant="primary"
            disabled={isSubmitting || categoriesLoading}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default EditBudgetPage;

const styles = StyleSheet.create({
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
  pickerContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.borderLight,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  categoryItemText: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
});
