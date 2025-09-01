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
import { validateAndCleanupToken } from "@/utilities/tokenValidation";
import { AuthProvider } from "@/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      const inAuthGroup = segments[0] === "(auth)";

      // Validate token and clear if invalid
      const validToken = await validateAndCleanupToken(token);

      if (!validToken && !inAuthGroup) {
        router.replace("/login");
      } else if (validToken && inAuthGroup) {
        router.replace("/");
      }

      setIsReady(true);
    };

    checkAuth();
  }, [segments]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
