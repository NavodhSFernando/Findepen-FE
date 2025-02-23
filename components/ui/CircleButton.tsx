import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface CircleButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  icon,
  size = 40,
  backgroundColor = Colors.neutral,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={size * 0.5} color={Colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 4px rgba(142, 192, 236, 1)",
  },
});

export default CircleButton;
