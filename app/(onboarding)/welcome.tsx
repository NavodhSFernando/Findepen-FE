import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/budgeting");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>1/6</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🚀</Text>
          </View>

          <Text style={styles.title}>Welcome to FinDepen</Text>
          <Text style={styles.subtitle}>
            Take control of your finances with intuitive tools designed for real
            people
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
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
    alignItems: "flex-end",
    marginBottom: 60,
  },
  progressContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
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
  footer: {
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
