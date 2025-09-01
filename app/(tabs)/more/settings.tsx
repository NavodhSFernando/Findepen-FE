import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useUser, { UserSettings } from "@/hooks/useUser";
import PasswordChangeModal from "@/components/ui/PasswordChangeModal";
import BalanceAdjustmentModal from "@/components/ui/BalanceAdjustmentModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";

const Settings = () => {
  const router = useRouter();
  const {
    profile,
    settings,
    updateSettings,
    changePassword,
    adjustBalance,
    loading,
    error,
    clearError,
  } = useUser();

  // Modal states
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);

  // Theme options
  const themeOptions = [
    { value: "light", label: "Light Mode", icon: "sunny" },
    { value: "dark", label: "Dark Mode", icon: "moon" },
    { value: "system", label: "System Default", icon: "settings" },
  ];

  // Handle theme change
  const handleThemeChange = async (theme: "light" | "dark" | "system") => {
    try {
      const newSettings: UserSettings = { Theme: theme };
      const updatedSettings = await updateSettings(newSettings);
      if (updatedSettings) {
        Alert.alert("Success", "Theme updated successfully!");
      }
    } catch (err) {
      console.error("Error updating theme:", err);
    }
  };

  // Handle password change
  const handlePasswordChange = async (passwordData: any) => {
    try {
      const success = await changePassword(passwordData);
      if (success) {
        Alert.alert("Success", "Password changed successfully!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error changing password:", err);
      return false;
    }
  };

  // Handle balance adjustment
  const handleBalanceAdjustment = async (balanceData: any) => {
    try {
      const success = await adjustBalance(balanceData);
      if (success) {
        Alert.alert("Success", "Balance updated successfully!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adjusting balance:", err);
      return false;
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Clear errors when they occur
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading settings...</Text>
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
          <Title text="Settings" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Content */}
        <View style={styles.sectionsContainer}>
          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <Text style={styles.sectionSubtitle}>
              Choose your preferred theme
            </Text>

            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    settings?.Theme === option.value && styles.selectedTheme,
                  ]}
                  onPress={() =>
                    handleThemeChange(
                      option.value as "light" | "dark" | "system"
                    )
                  }
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={
                      settings?.Theme === option.value
                        ? Colors.neutral
                        : Colors.text
                    }
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings?.Theme === option.value &&
                        styles.selectedThemeText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {settings?.Theme === option.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.neutral}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <Text style={styles.sectionSubtitle}>
              Manage your account security
            </Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.settingItemContent}>
                <Ionicons name="lock-closed" size={20} color={Colors.text} />
                <Text style={styles.settingItemText}>Change Password</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.fadedText}
              />
            </TouchableOpacity>
          </View>

          {/* Balance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Balance Management</Text>
            <Text style={styles.sectionSubtitle}>
              Adjust your account balance
            </Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setBalanceModalVisible(true)}
            >
              <View style={styles.settingItemContent}>
                <Ionicons name="wallet" size={20} color={Colors.text} />
                <Text style={styles.settingItemText}>Adjust Balance</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.fadedText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Password Change Modal */}
      <PasswordChangeModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onSubmit={handlePasswordChange}
        loading={loading}
      />

      {/* Balance Adjustment Modal */}
      <BalanceAdjustmentModal
        visible={balanceModalVisible}
        onClose={() => setBalanceModalVisible(false)}
        onSubmit={handleBalanceAdjustment}
        currentBalance={profile?.BalanceAmount || 0}
        loading={loading}
      />
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topContainer: {
    padding: 40,
  },
  buttonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  bodyContainer: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: Colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  sectionsContainer: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    marginBottom: 15,
  },
  themeOptions: {
    gap: 10,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  selectedTheme: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  themeOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  selectedThemeText: {
    color: Colors.neutral,
    fontFamily: "JakarthaBold",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
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
});

export default Settings;
