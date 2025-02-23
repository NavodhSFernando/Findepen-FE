import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "More options", headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "Edit Profile", headerShown: false }}
      />
      <Stack.Screen
        name="logout"
        options={{ title: "Logout", headerShown: false }}
      />
      <Stack.Screen
        name="recurring"
        options={{ title: "Recurring Transactions", headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: "Settings", headerShown: false }}
      />
    </Stack>
  );
}
