import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface RegisterForm {
  name: string;
  email: string;
  mobile: string;
  dob: Date;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      dob: new Date(),
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data: RegisterForm) => {
    try {
      const url = "http://192.168.1.6:5141/api/auth/register";
      const request = {
        Name: data.name,
        Email: data.email,
        PhoneNumber: data.mobile,
        DOB: data.dob,
        Password: data.password,
      };
      const response = await axios.post(url, request);

      console.log("Registered successfully:", response.data);
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
          <Title text="Create Account" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Name"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

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

        <Controller
          control={control}
          name="mobile"
          rules={{ required: "Mobile number is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Mobile Number"
              placeholder="Enter your mobile number"
              type="number"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.mobile && (
          <Text style={styles.errorText}>{errors.mobile.message}</Text>
        )}

        <Controller
          control={control}
          name="dob"
          rules={{ required: "Date of birth is required" }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Date of Birth"
              type="date"
              placeholder="Select date of birth"
              value={value.toISOString().split("T")[0]}
              onChangeText={onChange}
              iconName="calendar"
            />
          )}
        />
        {errors.dob && (
          <Text style={styles.errorText}>{errors.dob.message}</Text>
        )}
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
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <View style={styles.privacyContainer}>
          <Text style={styles.text}>
            By Continuing, you agree to {"\n"}
            <Text style={styles.textSpecial}>Terms of Use </Text>and
            <Text style={styles.textSpecial}> Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title={isSubmitting ? "Creating Account..." : "Create Account"}
            variant="primary"
            onPress={handleSubmit(handleRegister)}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.text}>
            Already have an account?
            <Text
              style={styles.textSpecial}
              onPress={() => router.push("/login")}
            >
              {" "}
              Login
            </Text>
          </Text>
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
    marginTop: -30,
  },
  privacyContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  text: {
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
    fontFamily: "JakarthaRegular",
  },
  textSpecial: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
    fontFamily: "JakarthaBold",
  },
  loginContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default RegisterPage;
