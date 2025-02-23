import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

interface InsightProps {
  message: string;
}

const Insight: React.FC<InsightProps> = ({
  message = "No insight available today.",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Insight of the day!</Text>
      <Text style={styles.bodyText}>{message}</Text>
    </View>
  );
};

export default Insight;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: "100%",
    borderBottomColor: Colors.borderLight,
    borderBottomWidth: 1.5,
  },
  headerText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: "JakarthaBold",
    textAlign: "center",
  },
  bodyText: {
    color: Colors.text,
    fontSize: 12,
    fontFamily: "JakarthaRegular",
    marginTop: 10,
    textAlign: "center",
  },
});
