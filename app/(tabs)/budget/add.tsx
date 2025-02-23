import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter } from "expo-router";

const add = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Budget" />
        </View>
      }
    >
      <View style={styles.bodyContainer}></View>
    </ParallaxScrollView>
  );
};

export default add;

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  budgetText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.borderLight,
    textTransform: "uppercase",
    paddingBottom: 10,
  },
});
