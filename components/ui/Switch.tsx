import React, { useState } from "react";
import { View, Switch, StyleSheet, Text } from "react-native";

interface SwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<SwitchProps> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
});

export default CustomSwitch;
