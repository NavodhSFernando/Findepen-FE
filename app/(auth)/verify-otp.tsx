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
import { useLocalSearchParams } from "expo-router/build/hooks";

interface verifyOtpForm {
  otp: string;
}

const VerifyOtpPage: React.FC = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [verifyOtpError, setVerifyOtpError] = useState<string | null>(null);
  const [resendOtpError, setResendOtpError] = useState<string | null>(null);
  const [resendOtpSuccess, setResendOtpSuccess] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<verifyOtpForm>({
    defaultValues: {
      otp: "",
    },
  });

  const handleVerifyPassword = async (data: verifyOtpForm) => {
    try {
      setVerifyOtpError(null);
      const url = "http://192.168.1.6:5141/api/auth/verify-otp";
      const request = {
        Otp: data.otp,
        Email: email,
      };
      const response = await axios.post(url, request);

      console.log("OTP verified successfully:", response.data);
      router.push({
        pathname: "/reset-password",
        params: { email: email, otp: data.otp },
      });
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      if (err.response?.data?.message) {
        setVerifyOtpError(err.response.data.message);
      } else {
        setVerifyOtpError("Invalid OTP. Please try again.");
      }
    }
  };

  const resendOtp = async () => {
    try {
      setResendOtpError(null);
      setResendOtpSuccess(null);
      const url = "http://192.168.1.6:5141/api/auth/forgot-password";
      const request = { Email: email };
      const response = await axios.post(url, request);
      console.log("OTP sent successfully:", response.data);
      setResendOtpSuccess("OTP sent successfully. Please check your email.");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      if (err.response?.data?.message) {
        setResendOtpError(err.response.data.message);
      } else {
        setResendOtpError("Failed to resend OTP. Please try again.");
      }
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
          <Title text="Verify Secure Pin" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {verifyOtpError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{verifyOtpError}</Text>
          </View>
        )}
        {resendOtpError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{resendOtpError}</Text>
          </View>
        )}
        {resendOtpSuccess && (
          <View style={styles.successBox}>
            <Text style={styles.successBoxText}>{resendOtpSuccess}</Text>
          </View>
        )}
        <Text style={styles.text}>
          Please enter the security pin sent to your email address
        </Text>
        <View style={{ width: "100%" }}>
          <Controller
            control={control}
            name="otp"
            rules={{ required: "OTP is required" }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Security Pin"
                placeholder="Enter your security pin"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.otp && (
            <Text style={styles.errorText}>{errors.otp.message}</Text>
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Verify OTP"
            variant="primary"
            onPress={handleSubmit(handleVerifyPassword)}
            disabled={isSubmitting}
          />
        </View>
        <Text style={styles.text}>Forgot Password?</Text>
        <View style={[styles.buttonWrapper, styles.reduceMargin]}>
          <Button
            title="Send again"
            variant="secondary"
            onPress={handleSubmit(resendOtp)}
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
    marginTop: -30,
  },
  text: {
    color: Colors.text,
    fontSize: 12,
    marginVertical: 10,
    marginHorizontal: "auto",
    fontFamily: "JakarthaRegular",
  },
  errorBox: {
    backgroundColor: Colors.error,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorBoxText: {
    color: "white",
    fontSize: 12,
    fontFamily: "JakarthaRegular",
  },
  successBox: {
    backgroundColor: Colors.success,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successBoxText: {
    color: "white",
    fontSize: 12,
    fontFamily: "JakarthaRegular",
  },
});

export default VerifyOtpPage;
