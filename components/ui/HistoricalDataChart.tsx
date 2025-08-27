import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";
import {
  DailyBalanceSnapshot,
  DailyReserveSnapshot,
} from "@/hooks/useHistoricalData";

interface HistoricalDataChartProps {
  balanceHistory: DailyBalanceSnapshot[];
  reserveHistory: DailyReserveSnapshot[];
  loading?: boolean;
  error?: string | null;
}

const HistoricalDataChart: React.FC<HistoricalDataChartProps> = ({
  balanceHistory,
  reserveHistory,
  loading = false,
  error = null,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Transform data for chart
  const getChartData = () => {
    if (balanceHistory.length === 0 && reserveHistory.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`, // Primary color
            strokeWidth: 2,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(172, 216, 255, ${opacity})`, // Secondary color
            strokeWidth: 2,
          },
        ],
        legend: ["Balance", "Reserve"],
      };
    }

    // Create a map of dates to balance and reserve amounts
    const dateMap = new Map<string, { balance: number; reserve: number }>();

    // Add balance data
    balanceHistory.forEach((snapshot) => {
      const date = snapshot.Date.split("T")[0]; // Get just the date part
      dateMap.set(date, {
        balance: snapshot.BalanceAmount,
        reserve: dateMap.get(date)?.reserve || 0,
      });
    });

    // Add reserve data
    reserveHistory.forEach((snapshot) => {
      const date = snapshot.Date.split("T")[0]; // Get just the date part
      const existing = dateMap.get(date) || { balance: 0, reserve: 0 };
      dateMap.set(date, {
        balance: existing.balance,
        reserve: snapshot.ReserveAmount,
      });
    });

    // Convert to array and sort by date
    const chartData = Array.from(dateMap.entries())
      .map(([date, amounts]) => ({
        date,
        balance: amounts.balance,
        reserve: amounts.reserve,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      labels: chartData.map((point) => {
        const date = new Date(point.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: chartData.map((point) => point.balance),
          color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`, // Primary color
          strokeWidth: 4, // Thicker stroke for better visibility
        },
        {
          data: chartData.map((point) => point.reserve),
          color: (opacity = 1) => `rgba(172, 216, 255, ${opacity})`, // Secondary color
          strokeWidth: 4, // Thicker stroke for better visibility
        },
      ],
      legend: ["Balance", "Reserve"],
    };
  };

  const chartData = getChartData();

  // Scroll to the end (most recent data) when chart data changes
  useEffect(() => {
    if (scrollViewRef.current && chartData.labels.length > 0) {
      const chartWidth = Math.max(
        screenWidth - 80,
        chartData.labels.length * 60
      );
      const scrollToX = chartWidth - (screenWidth - 80);
      scrollViewRef.current.scrollTo({ x: scrollToX, animated: false });
    }
  }, [chartData.labels.length, screenWidth]);

  const chartConfig = {
    backgroundGradientFrom: Colors.secondary,
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: Colors.secondary,
    backgroundGradientToOpacity: 0.1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 4, // Increased stroke width for better visibility
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5", // Slightly larger dots
      strokeWidth: "3", // Thicker dot borders
      stroke: Colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // Solid lines
      stroke: Colors.borderLight,
      strokeWidth: 0.5,
    },
    propsForLabels: {
      fontSize: 10,
      fontFamily: "JakarthaRegular",
      color: Colors.text,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Financial Overview</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chart data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Financial Overview</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (chartData.labels.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Financial Overview</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No historical data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Financial Overview</Text>
      </View>
      <View style={styles.chartWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 80, chartData.labels.length * 60)} // More space between data points
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            withInnerLines={false} // Remove inner grid lines
            withOuterLines={false} // Remove outer grid lines
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            fromZero={false}
            yAxisLabel="" // Remove y-axis label
            yAxisSuffix="" // Remove y-axis suffix
            yAxisInterval={0} // Hide y-axis
            segments={0} // Remove segments
          />
        </ScrollView>
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: Colors.primary }]}
          />
          <Text style={styles.legendText}>Balance</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: Colors.secondary }]}
          />
          <Text style={styles.legendText}>Reserve</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontFamily: "JakarthaBold",
    fontSize: 16,
    color: Colors.text,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
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
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.fadedText,
  },
  errorContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
  },
  emptyContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.fadedText,
  },
});

export default HistoricalDataChart;
