import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MenuItem = ({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <Feather
        name={icon as any}
        size={20}
        color={Colors.text}
        strokeWidth={5}
      />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
    padding: 10,
    paddingLeft: 16,
    borderRadius: 10,
    borderColor: Colors.borderLight,
    borderWidth: 1,
    backgroundColor: Colors.neutral,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
});

export default MenuItem;
