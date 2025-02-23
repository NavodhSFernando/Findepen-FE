import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); // Get device safe area insets

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.text,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height:
            Platform.OS === "ios" ? 80 + insets.bottom : 40 + insets.bottom, // Dynamic height to avoid overlap
          backgroundColor: Colors.neutral, // Ensures visibility
          borderTopLeftRadius: 20, // Rounded top edges (optional)
          borderTopRightRadius: 20,
          elevation: 5, // Shadow for Android
          display: "flex",
          justifyContent: "center",
          paddingVertical: "auto",
        },
      }}
    >
      {/* Overview Tab */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "house.fill" : "house"}
              size={35}
              color={color}
              focused={focused}
              style={styles.icon}
            />
          ),
        }}
      />

      {/* Budgets Tab */}
      <Tabs.Screen
        name="budget"
        options={{
          headerShown: false,
          title: "Budgets",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "creditcard.fill" : "creditcard"}
              size={35}
              color={color}
              focused={focused}
              style={styles.icon}
            />
          ),
        }}
      />

      {/* Goals Tab */}
      <Tabs.Screen
        name="goal"
        options={{
          headerShown: false,
          title: "Goals",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "target.fill" : "target"}
              size={35}
              color={color}
              focused={focused}
              style={styles.icon}
            />
          ),
        }}
      />

      {/* Transactions Tab */}
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "list.bullet.circle.fill" : "list.bullet"}
              size={35}
              color={color}
              focused={focused}
              style={styles.icon}
            />
          ),
        }}
      />

      {/* More Tab (Profile, Settings, etc.) */}
      <Tabs.Screen
        name="more"
        options={{
          headerShown: false,
          title: "More",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "ellipsis.circle.fill" : "ellipsis.circle"}
              size={35}
              color={color}
              focused={focused}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
