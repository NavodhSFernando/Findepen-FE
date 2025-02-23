import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text}</Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontFamily: "JakarthaBold",
    paddingTop: 30,
    textAlign: "center",
    color: Colors.text,
  },
});
