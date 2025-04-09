import React from "react";
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

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    try {
      const url = "http://192.168.1.6:5141/api/auth/forgot-password";
      const request = {
        Email: data.email,
      };
      const response = await axios.post(url, request);

      router.push({
        pathname: "/verify-otp",
        params: { email: data.email },
      });
    } catch (err) {
      console.error("Login error:", err);
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
          <Title text="Forgot Password" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Text style={styles.text}>
          Please enter your email address to reset your password
        </Text>
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

        <View style={styles.buttonWrapper}>
          <Button
            title="Next"
            variant="primary"
            onPress={handleSubmit(handleForgotPassword)}
            disabled={isSubmitting}
          />
        </View>
        <View style={[styles.buttonWrapper, styles.margin]}>
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
  margin: {
    marginTop: 30,
  },
  text: {
    color: Colors.text,
    fontSize: 12,
    marginVertical: 10,
    marginHorizontal: "auto",
    fontFamily: "JakarthaRegular",
  },
});

export default ForgotPasswordPage;
