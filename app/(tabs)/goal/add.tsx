import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import InputField from "@/components/ui/Input";
import { Switch } from "react-native-gesture-handler";
import Button from "@/components/ui/Button";

interface GoalForm {
  title: string;
  deadline: Date;
  amount: string;
  reminder: boolean;
}

const AddGoalPage: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalForm>({
    defaultValues: {
      title: "",
      deadline: new Date(),
      amount: "",
      reminder: false,
    },
  });

  const submitGoal = async (data: GoalForm) => {
    try {
      console.log("Budget data:", {
        title: data.title,
        deadline: data.deadline,
        amount: parseFloat(data.amount),
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
          name="title"
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
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
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
          name="deadline"
          rules={{ required: "Deadline is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Set deadline"
              placeholder="Select "
              type="date"
              value={value.toISOString().split("T")[0]}
              onChangeText={onChange}
              iconName="calendar"
            />
          )}
        />
        {errors.deadline && (
          <Text style={styles.errorText}>{errors.deadline.message}</Text>
        )}

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
