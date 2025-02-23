import { useState } from "react";
import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  // Capture header image height dynamically before rendering
  const onHeaderImageLayout = (event: LayoutChangeEvent) => {
    if (!headerHeight) {
      setHeaderHeight(event.nativeEvent.layout.height);
    }
  };

  // Animated header style based on measured height
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight!, 0, headerHeight!],
            [-headerHeight! / 2, 0, headerHeight! * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight!, 0, headerHeight!],
            [2, 1, 1]
          ),
        },
      ],
    };
  }, [headerHeight]);

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        {/* Step 1: Measure header image height first */}
        {headerHeight === null ? (
          <View style={styles.hiddenContainer} onLayout={onHeaderImageLayout}>
            {headerImage}
          </View>
        ) : (
          // Step 2: Render the header with measured height
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: headerBackgroundColor[colorScheme],
                height: headerHeight,
              },
              headerAnimatedStyle,
            ]}
          >
            {headerImage}
          </Animated.View>
        )}

        {/* Content */}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenContainer: {
    position: "absolute",
    opacity: 0, // Prevents visible flickering
  },
  header: {
    overflow: "hidden",
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    backgroundColor: Colors.secondary,
  },
});
