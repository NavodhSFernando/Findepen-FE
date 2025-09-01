import { Stack } from "expo-router";

export default function GoalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Goals", headerShown: false }}
      />
      <Stack.Screen
        name="add"
        options={{ title: "Add Goal", headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{ title: "Edit Goal", headerShown: false }}
      />
    </Stack>
  );
}
