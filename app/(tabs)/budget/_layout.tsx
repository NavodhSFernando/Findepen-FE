import { Stack } from "expo-router";

export default function BudgetLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Budgets", headerShown: false }}
      />
      <Stack.Screen
        name="add"
        options={{ title: "Add Budget", headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{ title: "Edit Budget", headerShown: false }}
      />
    </Stack>
  );
}
