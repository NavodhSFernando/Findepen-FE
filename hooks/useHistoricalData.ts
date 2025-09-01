import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

export interface DailyBalanceSnapshot {
  Id: string;
  UserId: string;
  Date: string;
  BalanceAmount: number;
  CreatedAt: string;
}

export interface DailyReserveSnapshot {
  Id: string;
  UserId: string;
  Date: string;
  ReserveAmount: number;
  CreatedAt: string;
}

export interface HistoricalData {
  BalanceHistory: DailyBalanceSnapshot[];
  ReserveHistory: DailyReserveSnapshot[];
  DateRange: {
    StartDate: string;
    EndDate: string;
  };
}

export interface ChartDataPoint {
  date: string;
  balance: number;
  reserve: number;
}

const useHistoricalData = (days: number = 30) => {
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchHistoricalData = async () => {
    // Don't set loading to true if we already have data and this is a refresh
    if (!data) {
      setLoading(true);
    }
    setError(null);

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Format dates for API
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch combined historical data
      const response = await api.get('/dailysnapshots/combined', {
        params: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      });

      setData(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching historical data:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your historical data');
        setIsAuthenticated(false);
        setData(null);
      } else if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch historical data');
      } else {
        setData(null);
        setError(null);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceHistory = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/dailysnapshots/balance', {
        params: {
          startDate,
          endDate
        }
      });

      return response.data;
    } catch (err: any) {
      console.error('Error fetching balance history:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReserveHistory = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/dailysnapshots/reserve', {
        params: {
          startDate,
          endDate
        }
      });

      return response.data;
    } catch (err: any) {
      console.error('Error fetching reserve history:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLatestBalance = async () => {
    try {
      const response = await api.get('/dailysnapshots/balance/latest');
      return response.data;
    } catch (err: any) {
      console.error('Error fetching latest balance:', err);
      return null;
    }
  };

  const getLatestReserve = async () => {
    try {
      const response = await api.get('/dailysnapshots/reserve/latest');
      return response.data;
    } catch (err: any) {
      console.error('Error fetching latest reserve:', err);
      return null;
    }
  };

  // Transform data for chart usage
  const getChartData = (): ChartDataPoint[] => {
    if (!data) return [];

    const { BalanceHistory: balanceHistory, ReserveHistory: reserveHistory } = data;
    
    // Create a map of dates to balance and reserve amounts
    const dateMap = new Map<string, { balance: number; reserve: number }>();

    // Add balance data
    balanceHistory.forEach(snapshot => {
      const date = snapshot.Date.split('T')[0]; // Get just the date part
      dateMap.set(date, { 
        balance: snapshot.BalanceAmount, 
        reserve: dateMap.get(date)?.reserve || 0 
      });
    });

    // Add reserve data
    reserveHistory.forEach(snapshot => {
      const date = snapshot.Date.split('T')[0]; // Get just the date part
      const existing = dateMap.get(date) || { balance: 0, reserve: 0 };
      dateMap.set(date, { 
        balance: existing.balance, 
        reserve: snapshot.ReserveAmount 
      });
    });

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, amounts]) => ({
        date,
        balance: amounts.balance,
        reserve: amounts.reserve
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Get formatted data for react-native-chart-kit
  const getFormattedChartData = () => {
    const chartData = getChartData();
    
    if (chartData.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`, // Primary color
            strokeWidth: 2
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(172, 216, 255, ${opacity})`, // Secondary color
            strokeWidth: 2
          }
        ],
        legend: ['Balance', 'Reserve']
      };
    }

    return {
      labels: chartData.map(point => {
        const date = new Date(point.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: chartData.map(point => point.balance),
          color: (opacity = 1) => `rgba(19, 62, 135, ${opacity})`, // Primary color
          strokeWidth: 2
        },
        {
          data: chartData.map(point => point.reserve),
          color: (opacity = 1) => `rgba(172, 216, 255, ${opacity})`, // Secondary color
          strokeWidth: 2
        }
      ],
      legend: ['Balance', 'Reserve']
    };
  };

  // Remove the automatic data fetching from useEffect
  // Data will be fetched explicitly when needed

  return {
    data,
    loading,
    error,
    isAuthenticated,
    fetchHistoricalData,
    fetchBalanceHistory,
    fetchReserveHistory,
    getLatestBalance,
    getLatestReserve,
    getChartData,
    getFormattedChartData,
    refetch: fetchHistoricalData
  };
};

export default useHistoricalData;
