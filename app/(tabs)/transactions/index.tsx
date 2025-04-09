import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import CircleButton from "@/components/ui/CircleButton";
import Title from "@/components/ui/Title";
import { TransactionInputMethodSelector } from "@/components/ui/TransactionInputMethodSelector";
import TotalBalance from "@/components/ui/TotalBalance";
import TotalExpenses from "@/components/ui/TotalExpenses";

const transactions = () => {
  const router = useRouter();
  const [isInputMethodVisible, setIsInputMethodVisible] = useState(false);

  const handleInputMethodSelect = (method: "manual" | "scan" | "file") => {
    // Handle the selected input method
    console.log("Selected method:", method);
    // Add logic to navigate or handle the selected method
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <Title text="Transactions" />
          <View style={styles.buttonContainer}>
            <CircleButton
              icon="add"
              onPress={() => setIsInputMethodVisible(true)}
              size={40}
            />
          </View>
          <View style={styles.summaryContainer}>
            <TotalBalance />
            <View style={styles.vl} />
            <TotalExpenses />
          </View>
        </View>
      }
    >
      <View style={styles.bodyContainer}></View>

      <TransactionInputMethodSelector
        visible={isInputMethodVisible}
        onClose={() => setIsInputMethodVisible(false)}
        onSelect={handleInputMethodSelect}
      />
    </ParallaxScrollView>
  );
};

export default transactions;

const styles = StyleSheet.create({
  backgroundContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  topContainer: {
    padding: 40,
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 52,
  },
  vl: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.neutral,
    height: 34,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 52,
    paddingTop: 30,
    width: "100%",
  },
  headerTextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  headerText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
  },
  greetingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    position: "absolute",
    top: 65,
    right: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    height: "100%",
    flexShrink: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
  },
  recentTransactions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: 20,
  },
  transactionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  transactionLink: {
    fontFamily: "JakarthaRegular",
    fontSize: 10,
    color: Colors.text,
  },
  transactionList: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
});
