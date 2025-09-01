import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useUser, { UpdateProfileData } from "@/hooks/useUser";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import { useForm, Controller } from "react-hook-form";

interface ProfileForm {
  Name: string;
  Email: string;
  PhoneNumber: string;
  DOB: string;
}

const Profile = () => {
  const router = useRouter();
  const { profile, updateProfile, loading, error, clearError } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileForm>({
    defaultValues: {
      Name: "",
      Email: "",
      PhoneNumber: "",
      DOB: "",
    },
  });

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      reset({
        Name: profile.Name || "",
        Email: profile.Email || "",
        PhoneNumber: profile.PhoneNumber || "",
        DOB: profile.DOB || "",
      });
    }
  }, [profile, reset]);

  // Clear errors when profile changes
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  // Handle form submission
  const onSubmit = async (data: ProfileForm) => {
    try {
      console.log("Submitting form data:", data);
      const updatedProfile = await updateProfile(data);
      console.log("Profile update result:", updatedProfile);
      if (updatedProfile) {
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <View style={styles.buttonContainer}>
            <CircleButton icon="chevron-back" onPress={handleBack} size={40} />
          </View>
          <Title text="Edit Profile" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Profile Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Controller
            control={control}
            name="Name"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
                value={value}
                onChangeText={onChange}
                iconName="card-account-details-outline"
              />
            )}
          />
          {errors.Name && (
            <Text style={styles.errorText}>{errors.Name.message}</Text>
          )}

          <Controller
            control={control}
            name="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={value}
                onChangeText={onChange}
                iconName="email-outline"
              />
            )}
          />
          {errors.Email && (
            <Text style={styles.errorText}>{errors.Email.message}</Text>
          )}

          <Controller
            control={control}
            name="PhoneNumber"
            rules={{
              pattern: {
                value: /^\+?[\d\s\-\(\)]+$/,
                message: "Please enter a valid phone number",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Phone Number"
                placeholder="Enter your phone number"
                type="text"
                value={value}
                onChangeText={onChange}
                iconName="phone"
              />
            )}
          />
          {errors.PhoneNumber && (
            <Text style={styles.errorText}>{errors.PhoneNumber.message}</Text>
          )}

          <Controller
            control={control}
            name="DOB"
            rules={{
              validate: (value) => {
                if (!value) return true; // Optional field
                const date = new Date(value);
                const today = new Date();
                if (date > today) {
                  return "Date of birth cannot be in the future";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Date of Birth"
                placeholder="Select your date of birth"
                type="date"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.DOB && (
            <Text style={styles.errorText}>{errors.DOB.message}</Text>
          )}
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.Email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Balance</Text>
            <Text style={styles.infoValue}>
              Rs {profile?.BalanceAmount?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title={isSubmitting ? "Saving..." : "Save Changes"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            variant="primary"
          />

          <Button
            title="Cancel"
            variant="secondary"
            onPress={handleBack}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  buttonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  section: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "JakarthaSemiBold",
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: 10,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "JakarthaRegular",
  },
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: "auto",
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default Profile;
