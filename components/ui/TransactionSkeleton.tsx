import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import SkeletonLoader from "./SkeletonLoader";

const TransactionSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <SkeletonLoader height={16} width="70%" style={styles.title} />
        <SkeletonLoader height={12} width="50%" style={styles.category} />
      </View>
      <View style={styles.rightSection}>
        <SkeletonLoader height={16} width="60%" style={styles.amount} />
        <SkeletonLoader height={12} width="40%" style={styles.date} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  title: {
    marginBottom: 4,
  },
  category: {
    marginBottom: 2,
  },
  amount: {
    marginBottom: 4,
  },
  date: {
    marginBottom: 2,
  },
});

export default TransactionSkeleton;
