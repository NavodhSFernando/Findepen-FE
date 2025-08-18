import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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

  // Combine and sort data by date
  const allData = [...balanceHistory, ...reserveHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get unique dates
  const uniqueDates = [...new Set(allData.map((item) => item.date))].sort();

  // Prepare chart data
  const balanceData = uniqueDates.map((date) => {
    const balanceItem = balanceHistory.find((item) => item.date === date);
    return balanceItem ? balanceItem.balanceAmount : 0;
  });

  const reserveData = uniqueDates.map((date) => {
    const reserveItem = reserveHistory.find((item) => item.date === date);
    return reserveItem ? reserveItem.reserveAmount : 0;
  });

  // Format labels for x-axis (show only some dates to avoid crowding)
  const labels = uniqueDates.map((date, index) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString("en-US", { month: "short" });

    // Show label for every 3rd point or first/last
    if (index === 0 || index === uniqueDates.length - 1 || index % 3 === 0) {
      return `${month} ${day}`;
    }
    return "";
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: balanceData,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White line for balance
        strokeWidth: 2,
      },
      {
        data: reserveData,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`, // Slightly transparent white for reserve
        strokeWidth: 2,
      },
    ],
  };

  const maxValue = Math.max(...balanceData, ...reserveData, 1);
  const minValue = Math.min(...balanceData, ...reserveData, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Overview</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            backgroundColor: Colors.secondary,
            backgroundGradientFrom: Colors.secondary,
            backgroundGradientTo: Colors.secondary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(255, 255, 255, ${opacity * 0.7})`,
            style: {
              borderRadius: 16,
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
        />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: "rgba(255, 255, 255, 1)" },
            ]}
          />
          <Text style={styles.legendText}>Balance</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: "rgba(255, 255, 255, 0.7)" },
            ]}
          />
          <Text style={styles.legendText}>Reserve</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
