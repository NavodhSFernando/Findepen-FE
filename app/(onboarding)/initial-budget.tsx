import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import useUser from "@/hooks/useUser";

export default function InitialBudgetScreen() {
  const router = useRouter();
  const { setInitialBalance } = useUser();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    let numericAmount = 0; // Default to 0 if no amount entered

    if (amount.trim()) {
      // Only validate if user entered something
      numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount < 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }
    }

    try {
      setLoading(true);
      await setInitialBalance({ InitialBalance: numericAmount });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to set initial balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💰</Text>
          </View>

          <Text style={styles.title}>Set Your Initial Balance</Text>
          <Text style={styles.subtitle}>
            Enter your current account balance to get started with accurate
            financial tracking
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Initial Balance</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>Rs.</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.fadedText}
                keyboardType="numeric"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why set an initial balance?</Text>
            <Text style={styles.infoText}>
              This helps us set you up with a starting point for your financial
              journey. Note: You'll need to have a positive balance set before
              you can start making expense transactions.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            disabled={loading}
          >
            <Text style={styles.getStartedButtonText}>
              {loading ? "Setting..." : "Get Started"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.fadedText,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: "100%",
    maxWidth: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 12,
    color: Colors.fadedText,
    textAlign: "center",
    lineHeight: 15,
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});
