import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  PlusJakartaSans_400Regular as JakarthaRegular,
  PlusJakartaSans_600SemiBold as JakarthaSemiBold,
  PlusJakartaSans_700Bold as JakarthaBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack, useRouter, useSegments, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getToken } from "@/utilities/getToken";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  // const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    JakarthaRegular,
    JakarthaSemiBold,
    JakarthaBold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = await getToken();
  //       const inAuthGroup = segments[0] === "(auth)";

  //       if (!token && !inAuthGroup) {
  //         // Use setTimeout to ensure navigation happens after mount
  //         setTimeout(() => {
  //           router.replace("/login");
  //         }, 0);
  //       } else if (token && inAuthGroup) {
  //         setTimeout(() => {
  //           router.replace("/");
  //         }, 0);
  //       }
  //     } catch (error) {
  //       console.error("Auth check error:", error);
  //       setTimeout(() => {
  //         router.replace("/login");
  //       }, 0);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [segments]);

  // Show loading state while checking auth
  // if (isLoading) {
  //   return null;
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Slot />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
