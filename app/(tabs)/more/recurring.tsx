import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CircleButton from "@/components/ui/CircleButton";

const Recurring = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: Colors.secondary,
          dark: Colors.secondary,
        }}
        headerImage={<View style={styles.headerContainer}></View>}
      >
        <View style={styles.bodyContainer}>
          {/* Header */}
          <View style={styles.header}>
            <CircleButton icon="arrow-back" onPress={handleBack} />
            <Text style={styles.headerTitle}>Recurring Transactions</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.comingSoon}>Coming Soon!</Text>
            <Text style={styles.description}>
              Recurring transactions feature will be available soon.
            </Text>
          </View>
        </View>
      </ParallaxScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    height: 150,
    backgroundColor: Colors.secondary,
  },
  bodyContainer: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: Colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  comingSoon: {
    fontSize: 24,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    textAlign: "center",
  },
});

export default Recurring;
