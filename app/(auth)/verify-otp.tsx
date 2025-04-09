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
import { useLocalSearchParams } from "expo-router/build/hooks";

interface verifyOtpForm {
  otp: string;
}

const VerifyOtpPage: React.FC = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
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
      const url = "http://192.168.1.6:5141/api/auth/verify-otp";
      const request = {
        otp: data.otp,
        email: email,
      };
      const response = await axios.post(url, request);

      console.log("OTP verified successfully:", response.data);
      router.push({
        pathname: "/reset-password",
        params: { email: email, otp: data.otp },
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const resendOtp = async () => {
    try {
      const url = "http://192.168.1.6:5141/api/auth/forgot-password";
      const response = await axios.post(url, email);
      console.log("OTP sent successfully:", response.data);
    } catch (err) {
      console.error("Resend OTP error:", err);
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
});

export default VerifyOtpPage;
