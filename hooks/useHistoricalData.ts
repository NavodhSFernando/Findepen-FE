import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

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

interface HistoricalData {
  balanceHistory: DailyBalanceSnapshot[];
  reserveHistory: DailyReserveSnapshot[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export const useHistoricalData = (days: number = 30) => {
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await api.get(
        `dailysnapshots/combined?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      setData(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching historical data:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view historical data');
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

  useEffect(() => {
    fetchHistoricalData();
  }, [days]);

  const refetch = () => {
    fetchHistoricalData();
  };

  return {
    data,
    loading,
    error,
    isAuthenticated,
    refetch,
  };
};
