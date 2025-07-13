import { Stack } from "expo-router";

export default function GoalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Transactions", headerShown: false }}
      />
      <Stack.Screen
        name="add"
        options={{ title: "Add Transaction", headerShown: false }}
      />
      <Stack.Screen
        name="view"
        options={{ title: "View Transaction", headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{ title: "Edit Transaction", headerShown: false }}
      />
    </Stack>
  );
}
