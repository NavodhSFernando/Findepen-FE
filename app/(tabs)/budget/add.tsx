import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter } from "expo-router";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Switch } from "react-native-gesture-handler";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

interface BudgetForm {
  name: string;
  amount: string;
  startDate: Date;
  repeatMonthly: boolean;
  reminder: boolean;
}

const AddBudgetPage: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BudgetForm>({
    defaultValues: {
      name: "",
      amount: "",
      startDate: new Date(),
      repeatMonthly: false,
      reminder: false,
    },
  });

  const submitBudget = async (data: BudgetForm) => {
    try {
      console.log("Budget data:", {
        name: data.name,
        amount: parseFloat(data.amount),
        startDate: data.startDate,
        repeatMonthly: data.repeatMonthly,
        reminder: data.reminder,
      });
      // Uncomment when API is ready
      // const response = await axios.post("http://192.168.1.6:5141/api/budgets", {
      //   name: data.name,
      //   amount: parseFloat(data.amount),
      //   startDate: data.startDate,
      //   repeatMonthly: data.repeatMonthly,
      //   reminder: data.reminder,
      // });
      // console.log("Budget created successfully:", response.data);

      router.back(); // Navigate back after successful submission
    } catch (err) {
      console.error("Budget creation error:", err);
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
              onPress={() => router.back()}
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
          name="name"
          rules={{ required: "Budget name is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Name"
              placeholder="Enter budget name"
              type="text"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          name="amount"
          rules={{
            required: "Amount is required",
            validate: {
              isPositive: (value) =>
                parseFloat(value) > 0 || "Amount must be greater than 0",
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
          name="startDate"
          rules={{ required: "Start date is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Set start date"
              placeholder="Select date"
              type="date"
              value={value.toISOString().split("T")[0]}
              onChangeText={onChange}
              iconName="calendar"
            />
          )}
        />
        {errors.startDate && (
          <Text style={styles.errorText}>{errors.startDate.message}</Text>
        )}

        <Controller
          control={control}
          name="repeatMonthly"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Repeat for every month</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
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
            title={isSubmitting ? "Saving..." : "Save"}
            onPress={handleSubmit(submitBudget)}
            variant="primary"
            disabled={isSubmitting}
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
