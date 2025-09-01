import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function GoalsScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/bill-scanning");
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
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>4/6</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎯</Text>
          </View>

          <Text style={styles.title}>Goal Setting</Text>
          <Text style={styles.subtitle}>
            Set financial goals and track your progress with visual milestones
          </Text>

          <View style={styles.goalExamples}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>🏠</Text>
                <Text style={styles.goalTitle}>Buy a House</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <Text style={styles.goalAmount}>$65,000 / $100,000</Text>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>🚗</Text>
                <Text style={styles.goalTitle}>New Car</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "30%" }]} />
              </View>
              <Text style={styles.goalAmount}>$6,000 / $20,000</Text>
            </View>
          </View>
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
  goalExamples: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 30,
  },
  goalCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
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
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  goalAmount: {
    color: Colors.fadedText,
    fontSize: 14,
    fontWeight: "500",
  },
  featureCard: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  featureText: {
    fontSize: 16,
    color: Colors.fadedText,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 80,
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
