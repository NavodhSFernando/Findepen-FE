import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="budgeting"
        options={{ title: "Budgeting", headerShown: false }}
      />
      <Stack.Screen
        name="analysis"
        options={{ title: "Analysis", headerShown: false }}
      />
      <Stack.Screen
        name="goals"
        options={{ title: "Goals", headerShown: false }}
      />
      <Stack.Screen
        name="bill-scanning"
        options={{ title: "Bill Scanning", headerShown: false }}
      />
      <Stack.Screen
        name="security"
        options={{ title: "Security", headerShown: false }}
      />
      <Stack.Screen
        name="initial-budget"
        options={{ title: "Initial Budget", headerShown: false }}
      />
    </Stack>
  );
}
