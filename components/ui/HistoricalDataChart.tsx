import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

type ChartType = "balance" | "reserve";

const HistoricalDataChart: React.FC<HistoricalDataChartProps> = ({
  balanceHistory,
  reserveHistory,
  loading = false,
  error = null,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [selectedTab, setSelectedTab] = useState<ChartType>("balance");

  // Transform data for chart
  const getChartData = (type: ChartType) => {
    const history = type === "balance" ? balanceHistory : reserveHistory;

    if (history.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };
    }

    // Sort by date
    const sortedData = history
      .map((snapshot) => {
        const date = snapshot.Date.split("T")[0];
        let value: number;

        if (type === "balance") {
          value = (snapshot as DailyBalanceSnapshot).BalanceAmount;
        } else {
          value = (snapshot as DailyReserveSnapshot).ReserveAmount;
        }

        return { date, value };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      labels: sortedData.map((point) => {
        const date = new Date(point.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: sortedData.map((point) => point.value),
          color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartData = getChartData(selectedTab);

  // Calculate value range for Y-axis
  const getValueRange = () => {
    const history = selectedTab === "balance" ? balanceHistory : reserveHistory;
    if (history.length === 0) return { min: 0, max: 1000 };

    const values = history.map((snapshot) => {
      if (selectedTab === "balance") {
        return (snapshot as DailyBalanceSnapshot).BalanceAmount;
      } else {
        return (snapshot as DailyReserveSnapshot).ReserveAmount;
      }
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    return {
      min: Math.max(0, min - range * 0.1),
      max: max + range * 0.1,
    };
  };

  const valueRange = getValueRange();

  // Generate Y-axis labels
  const generateYAxisLabels = () => {
    const { min, max } = valueRange;
    const step = (max - min) / 4;
    const labels = [];

    // Generate labels from bottom (min) to top (max)
    for (let i = 4; i >= 0; i--) {
      const value = min + step * i;
      labels.push(Math.round(value).toString());
    }

    return labels;
  };

  const yAxisLabels = generateYAxisLabels();

  // Scroll to the end (most recent data) when chart data changes
  useEffect(() => {
    if (scrollViewRef.current && chartData.labels.length > 0) {
      const chartWidth = Math.max(
        screenWidth - 140, // Account for dynamic Y-axis space
        chartData.labels.length * 60
      );
      const scrollToX = chartWidth - (screenWidth - 140);
      scrollViewRef.current.scrollTo({ x: scrollToX, animated: false });
    }
  }, [chartData.labels.length, screenWidth, selectedTab]);

  const chartConfig = {
    backgroundGradientFrom: Colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: Colors.background,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.primary,
      fill: Colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
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

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "balance" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("balance")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "balance" && styles.activeTabText,
            ]}
          >
            Balance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "reserve" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("reserve")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "reserve" && styles.activeTabText,
            ]}
          >
            Reserves
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart with Y-axis */}
      <View style={styles.chartContainer}>
        {/* Y-axis Labels */}
        <View style={styles.yAxisContainer}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <LineChart
              data={chartData}
              width={Math.max(screenWidth - 140, chartData.labels.length * 60)}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={true}
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={false}
              fromZero={false}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={0}
              segments={4}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: "JakarthaRegular",
    fontSize: 14,
    color: Colors.text,
  },
  activeTabText: {
    fontFamily: "JakarthaBold",
    color: Colors.background,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 10, // Add padding to ensure proper spacing
  },
  yAxisContainer: {
    minWidth: 40,
    height: 200,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingBottom: 40, // Increased padding to avoid X-axis crossover
  },
  yAxisLabel: {
    fontFamily: "JakarthaRegular",
    fontSize: 10,
    color: Colors.text,
  },
  chartWrapper: {
    flex: 1,
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
