import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

interface GoalProgressCardProps {
  title: string;
  deadline: Date;
  currentAmount: number;
  targetAmount: number;
}

const getNoteByProgress = (progress: number): string => {
  if (progress < 0.25) {
    return "Just getting started!";
  } else if (progress < 0.5) {
    return "Good start, keep it up!";
  } else if (progress < 0.75) {
    return "Over halfway there!";
  } else if (progress < 1) {
    return "So close to your goal!";
  } else {
    return "Goal completed — great job!";
  }
};

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  title,
  deadline,
  currentAmount,
  targetAmount,
}) => {
  // Add null checks and default values to prevent runtime errors
  const safeCurrentAmount = currentAmount || 0;
  const safeTargetAmount = targetAmount || 0;
  const progress =
    safeTargetAmount > 0 ? safeCurrentAmount / safeTargetAmount : 0; // Progress percentage
  const note = getNoteByProgress(progress);

  const targetDate = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.category}>{title}</Text>
          <Text style={styles.date}>Deadline: {targetDate}</Text>
        </View>
        <View>
          <Text style={styles.current}>Rs. {safeCurrentAmount.toFixed(2)}</Text>
          <Text style={styles.target}>
            of Rs. {safeTargetAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={30}
          borderRadius={50}
          color="#003366"
          unfilledColor="#B3D9FF"
          borderWidth={0}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            Rs. {safeCurrentAmount.toFixed(2)}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      {/* Note & Action Icons */}
      <View style={styles.footer}>
        <Text style={styles.note}>{note}</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Icon name="plus" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="pencil-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash-can-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GoalProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.fadedPrimary,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#333",
    fontFamily: "JakarthaBold",
  },
  date: {
    fontSize: 10,
    color: "#666",
    fontFamily: "JakarthaRegular",
  },
  current: {
    fontSize: 14,
    textAlign: "right",
    fontFamily: "JakarthaBold",
  },
  target: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    fontFamily: "JakarthaRegular",
  },
  progressContainer: {
    position: "relative",
    marginVertical: 10,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
    top: 5,
  },
  progressText: {
    fontSize: 12,
    color: Colors.neutral,
    fontFamily: "JakarthaBold",
    textShadowColor: Colors.text,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  progressPercentage: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: "JakarthaBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  note: {
    fontSize: 12,
    color: "#555",
    fontFamily: "JakarthaRegular",
  },
  icons: {
    flexDirection: "row",
    gap: 15,
  },
});
