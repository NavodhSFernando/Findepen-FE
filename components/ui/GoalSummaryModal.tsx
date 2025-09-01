import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface GoalSummary {
  TotalGoals: number;
  ActiveGoals: number;
  CompletedGoals: number;
  TotalTargetAmount: number;
  TotalCurrentAmount: number;
  TotalRemainingAmount: number;
  OverallProgressPercentage: number;
}

interface GoalSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  summary: GoalSummary | null;
}

const GoalSummaryModal: React.FC<GoalSummaryModalProps> = ({
  visible,
  onClose,
  summary,
}) => {
  if (!summary) return null;

  const progress = summary.OverallProgressPercentage / 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>🎯 Goal Summary</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Overall Progress Section */}
            <View style={styles.section}>
              <View style={styles.progressContainer}>
                <View style={styles.progressRow}>
                  <View style={styles.circularProgressContainer}>
                    <Progress.Circle
                      size={120}
                      progress={progress}
                      color={Colors.primary}
                      unfilledColor={Colors.secondary}
                      borderWidth={0}
                      strokeCap="round"
                      thickness={6}
                    />
                    <View style={styles.progressTextContainer}>
                      <Text style={styles.progressPercentage}>
                        {summary.OverallProgressPercentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalsStatsContainer}>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Active Goals</Text>
                      <Text style={styles.statValue}>
                        {summary.ActiveGoals}
                      </Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Completed Goals</Text>
                      <Text style={styles.statValue}>
                        {summary.CompletedGoals}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Financial Breakdown Section */}
            <View style={styles.section}>
              <View style={styles.financialCards}>
                <View style={styles.financialCard}>
                  <View style={styles.financialCardContent}>
                    <View style={styles.financialCardLeft}>
                      <Icon name="target" size={20} color="#FF9500" />
                      <Text style={styles.financialCardLabel}>
                        Target Amount
                      </Text>
                    </View>
                    <Text style={styles.financialCardValue}>
                      Rs.{summary.TotalTargetAmount.toFixed(0)}
                    </Text>
                  </View>
                </View>

                <View style={styles.financialCard}>
                  <View style={styles.financialCardContent}>
                    <View style={styles.financialCardLeft}>
                      <Icon name="camera" size={20} color="#4CD964" />
                      <Text style={styles.financialCardLabel}>
                        Current Amount
                      </Text>
                    </View>
                    <Text style={styles.financialCardValue}>
                      Rs.{summary.TotalCurrentAmount.toFixed(0)}
                    </Text>
                  </View>
                </View>

                <View style={styles.financialCard}>
                  <View style={styles.financialCardContent}>
                    <View style={styles.financialCardLeft}>
                      <Icon name="chart-bar" size={20} color="#FF9500" />
                      <Text style={styles.financialCardLabel}>Remaining</Text>
                    </View>
                    <Text style={styles.financialCardValue}>
                      Rs.{summary.TotalRemainingAmount.toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Motivational Message */}
            <View style={styles.motivationalSection}>
              <LinearGradient
                colors={[Colors.secondary, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.motivationalCard}
              >
                <Text style={styles.motivationalText}>
                  Keep going! Only Rs.{summary.TotalRemainingAmount.toFixed(0)}{" "}
                  left to achieve your goals
                </Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default GoalSummaryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 15,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  circularProgressContainer: {
    position: "relative",
  },
  progressTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.primary,
  },
  goalsStatsContainer: {
    flexDirection: "column",
    gap: 12,
    flex: 1,
    marginLeft: 20,
  },
  statCard: {
    backgroundColor: Colors.neutral,
    padding: 10,
    borderRadius: 12,
    minWidth: 120,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  financialCards: {
    gap: 12,
  },
  financialCard: {
    backgroundColor: Colors.neutral,
    borderRadius: 12,
    overflow: "hidden",
  },
  financialCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  financialCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  financialCardLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.text,
  },
  financialCardValue: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  motivationalSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  motivationalCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  motivationalText: {
    fontSize: 16,
    fontFamily: "JakarthaBold",
    color: Colors.neutral,
    textAlign: "center",
  },
});
