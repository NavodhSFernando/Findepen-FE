import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordForm) => {
    try {
      const url = "http://192.168.1.6:5141/api/auth/reset-password";
      const request = {
        Otp: otp,
        Email: email,
        NewPassword: data.password,
      };
      const response = await axios.post(url, request);

      console.log("Password reset successfully:", response.data);
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
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
          <Title text="Reset Password" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            validate: {
              hasUpperCase: (value) =>
                /[A-Z]/.test(value) ||
                "Password must contain at least one uppercase letter",
              hasLowerCase: (value) =>
                /[a-z]/.test(value) ||
                "Password must contain at least one lowercase letter",
              hasNumber: (value) =>
                /\d/.test(value) || "Password must contain at least one number",
              hasSpecialChar: (value) =>
                /[@$!%*?&]/.test(value) ||
                "Password must contain at least one special character",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="New Password"
              placeholder="Enter your new password"
              type="password"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Confirm new Password"
              placeholder="Re-enter your new password"
              type="password"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Resetting Password..." : "Reset Password"}
            variant="primary"
            onPress={handleSubmit(handleResetPassword)}
            disabled={isSubmitting}
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
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
    fontFamily: "JakarthaRegular",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

export default ResetPasswordPage;
