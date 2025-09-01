import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import SkeletonLoader from "./SkeletonLoader";

const SummaryCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader height={16} width="60%" style={styles.title} />
      <SkeletonLoader height={24} width="80%" style={styles.amount} />
      <SkeletonLoader height={12} width="40%" style={styles.subtitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: 8,
  },
  amount: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 4,
  },
});

export default SummaryCardSkeleton;
