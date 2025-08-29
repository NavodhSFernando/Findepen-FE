import { Stack } from "expo-router";

export default function RecurringTransactionLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Recurring Transactions", headerShown: false }}
      />
      <Stack.Screen
        name="add"
        options={{ title: "Add Recurring Transaction", headerShown: false }}
      />
      <Stack.Screen
        name="view"
        options={{ title: "View Recurring Transaction", headerShown: false }}
      />

    </Stack>
  );
}
