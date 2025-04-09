import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      setLoginError(null);
      const response = await axios.post(
        "http://192.168.1.6:5141/api/auth/login",
        data
      );

      console.log("Logged in successfully:", response.data);
      router.push("/");

      // Store token securely
      const token = response.data.token;
      if (token) {
        await SecureStore.setItemAsync("authToken", token);
        console.log("Token stored successfully");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Incorrect email or password");
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
          <Title text="Welcome" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {loginError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{loginError}</Text>
          </View>
        )}
        <View style={{ width: "100%" }}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
        <View style={{ width: "100%" }}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Signing in..." : "Sign in"}
            variant="primary"
            onPress={handleSubmit(handleLogin)}
            disabled={isSubmitting}
          />
        </View>
        <Text
          style={styles.text}
          onPress={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </Text>
        <View style={[styles.buttonWrapper, styles.reduceMargin]}>
          <Button
            title={"Sign up"}
            variant="secondary"
            onPress={() => router.push("/register")}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 20,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  errorText: {
    color: Colors.error,
    fontSize: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  reduceMargin: {
    marginTop: -10,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: "auto",
    fontFamily: "JakarthaBold",
  },
  errorBox: {
    backgroundColor: Colors.error,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  errorBoxText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "JakarthaRegular",
  },
});

export default LoginPage;
