import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";

interface DailyBalanceSnapshot {
  id: string;
  userId: string;
  date: string;
  balanceAmount: number;
  createdAt: string;
}

interface DailyReserveSnapshot {
  id: string;
  userId: string;
  date: string;
  reserveAmount: number;
  createdAt: string;
}

interface HistoricalDataChartProps {
  balanceHistory: DailyBalanceSnapshot[];
  reserveHistory: DailyReserveSnapshot[];
  loading?: boolean;
  error?: string | null;
}

const screenWidth = Dimensions.get("window").width;

export default function HistoricalDataChart({
  balanceHistory,
  reserveHistory,
  loading = false,
  error = null,
}: HistoricalDataChartProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!balanceHistory.length && !reserveHistory.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No historical data available</Text>
      </View>
    );
  }

  // Combine and sort data by date (most recent first)
  const allData = [...balanceHistory, ...reserveHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates (oldest first, so most recent appears on the right)
  const uniqueDates = [...new Set(allData.map((item) => item.date))].sort();

  // Scroll to the end (most recent data) when component mounts
  useEffect(() => {
    if (scrollViewRef.current && uniqueDates.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [uniqueDates.length]);

  // Prepare chart data
  const balanceData = uniqueDates.map((date) => {
    const balanceItem = balanceHistory.find((item) => item.date === date);
    return balanceItem ? balanceItem.balanceAmount : 0;
  });

  const reserveData = uniqueDates.map((date) => {
    const reserveItem = reserveHistory.find((item) => item.date === date);
    return reserveItem ? reserveItem.reserveAmount : 0;
  });

  // Format labels for x-axis (show all dates for scrolling)
  const labels = uniqueDates.map((date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${day}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: balanceData,
        color: () => `rgba(255, 255, 255, 1)`, // Solid white line for balance
        strokeWidth: 4,
      },
      {
        data: reserveData,
        color: () => `rgba(255, 255, 255, 1)`, // Solid white line for reserve
        strokeWidth: 4,
      },
    ],
  };

  const maxValue = Math.max(...balanceData, ...reserveData, 1);
  const minValue = Math.min(...balanceData, ...reserveData, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <LineChart
          data={chartData}
          width={Math.max(screenWidth, uniqueDates.length * 80)} // Add spacing between data points
          height={180}
          chartConfig={{
            backgroundColor: Colors.secondary,
            backgroundGradientFrom: Colors.secondary,
            backgroundGradientTo: Colors.secondary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 0,
            },
            propsForLabels: {
              fontSize: 14,
              fontFamily: "JakarthaRegular",
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // Remove background lines
            },
            propsForDots: {
              r: "0", // Remove dots but keep spacing
            },
          }}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false} // Keep x-axis labels visible
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 0,
    marginVertical: 0,
    marginTop: 20,
    width: "100%",
  },
  title: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    marginVertical: 0,
    borderRadius: 0,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: "JakarthaRegular",
    fontSize: 12,
    color: Colors.text,
  },
  loadingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.neutral,
    textAlign: "center",
    paddingVertical: 40,
  },
});
