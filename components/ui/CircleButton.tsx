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
    shadowColor: "#8EC0EC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default CircleButton;
