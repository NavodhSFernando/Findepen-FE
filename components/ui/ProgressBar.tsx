import { View, Text, StyleSheet } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";

function progressLevel(totalExpenses: number, totalBudget: number) {
  return totalExpenses / totalBudget;
}

const ProgressBar = ({ totalExpenses = 3000, totalBudget = 10000 }) => {
  const progress = progressLevel(totalExpenses, totalBudget);
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <Progress.Bar
        progress={progress}
        height={30}
        width={275}
        // Ensure width is fixed to align text properly
        borderRadius={20}
        unfilledColor={Colors.neutral}
        color={Colors.primary}
        borderWidth={0}
        style={styles.progressBar}
      >
        {/* Text Overlay */}
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </Progress.Bar>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  progressBar: {
    boxShadow: "0px 4px 4px rgba(142, 192, 236, 1)",
  },
  progressText: {
    position: "absolute",
    color: Colors.text, // Adjust based on the progress bar color
    fontWeight: "bold",
    fontSize: 14,
    top: 5, // Adjust based on the progress bar height
    left: 20, // Adjust based on the progress bar width
  },
});
