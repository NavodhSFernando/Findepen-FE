import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export type IconSymbolName = keyof typeof MAPPING;

// Mapping SF Symbols to MaterialCommunityIcons
const MAPPING = {
  house: "home-outline",
  "house.fill": "home",
  creditcard: "piggy-bank-outline",
  "creditcard.fill": "piggy-bank",
  target: "bullseye-arrow",
  "target.fill": "bullseye-arrow",
  "list.bullet": "clipboard-list-outline",
  "list.bullet.circle.fill": "clipboard-list",
  "ellipsis.circle": "dots-horizontal",
  "ellipsis.circle.fill": "dots-horizontal-circle",
  "chevron.left.forwardslash.chevron.right": "code-braces",
  "chevron.right": "arrow-right-thin",
} as const;

export function IconSymbol({
  name,
  size = 40,
  color,
  focused = false,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const iconName = MAPPING[name] || "help-circle-outline"; // Fallback icon

  return (
    <View style={[style, { transform: [{ scale: 0.75 }] }]}>
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </View>
  );
}
