import { useState, useEffect, useCallback } from 'react';
import api from '@/utilities/axiosInstance';

// Types
export interface RecurringTransactionType {
  Id: string;
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: "Income" | "Expense";
  Date: string;
  Frequency: "Weekly" | "Monthly" | "Yearly";
  StartDate: string;
  EndDate?: string;
  NextOccurrenceDate: string;
  Status: "Active" | "Paused" | "Cancelled";
  OccurrenceCount: number;
  LastCreatedDate?: string;
  FormattedAmount: number;
  FormattedDate: string;
  BalanceImpact: string;
  FormattedAmountWithSign: string;
  IsIncome: boolean;
  IsExpense: boolean;
  IsActive: boolean;
  CanBeProcessed: boolean;
  IsExpired: boolean;
  DaysUntilNextOccurrence: number;
  StatusDisplayName: string;
  FrequencyDisplayName: string;
  NextOccurrenceFormatted: string;
  StartDateFormatted: string;
  EndDateFormatted?: string;
}

export interface RecurringTransactionSummary {
  TotalRecurringTransactions: number;
  ActiveRecurringTransactions: number;
  PausedRecurringTransactions: number;
  CancelledRecurringTransactions: number;
  TotalMonthlyAmount: number;
  TotalWeeklyAmount: number;
  TotalYearlyAmount: number;
  CategoryBreakdown: Record<string, number>;
  TypeBreakdown: Record<string, number>;
  RecentRecurringTransactions: RecurringTransactionType[];
  FormattedTotalMonthlyAmount: number;
  FormattedTotalWeeklyAmount: number;
  FormattedTotalYearlyAmount: number;
  TotalActiveAmount: number;
  FormattedTotalActiveAmount: number;
}

export interface CreateRecurringTransactionData {
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: "Income" | "Expense";
  Date: string; // Add the missing Date field
  Frequency: "Weekly" | "Monthly" | "Yearly";
  StartDate: string;
  EndDate?: string;
}

const useRecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransactionType[]>([]);
  const [summary, setSummary] = useState<RecurringTransactionSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchRecurringTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/RecurringTransaction');
      setRecurringTransactions(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recurring transactions:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your recurring transactions');
        setIsAuthenticated(false);
        setRecurringTransactions([]);
      } else if (err.response?.status !== 404 && !(Array.isArray(err.response?.data) && err.response?.data.length === 0)) {
        setError(err.response?.data?.message || 'Failed to fetch recurring transactions');
      } else {
        setRecurringTransactions([]);
        setError(null);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await api.get('/RecurringTransaction/summary');
      setSummary(response.data);
    } catch (err: any) {
      console.error('Error fetching recurring transaction summary:', err);
      setSummary(null);
    }
  }, []);

  const fetchRecurringTransaction = useCallback(async (id: string): Promise<RecurringTransactionType | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/RecurringTransaction/${id}`);
      setIsAuthenticated(true);
      setError(null);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching recurring transaction:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view this recurring transaction');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch recurring transaction');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecurringTransaction = useCallback(async (data: CreateRecurringTransactionData): Promise<RecurringTransactionType | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/RecurringTransaction', data);
      setIsAuthenticated(true);
      setError(null);
      return response.data;
    } catch (err: any) {
      console.error('Error creating recurring transaction:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to create recurring transactions');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to create recurring transaction');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecurringTransactionStatus = useCallback(async (
    id: string, 
    status: "Active" | "Paused" | "Cancelled"
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/RecurringTransaction/${id}/status`, { status });
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Error updating recurring transaction status:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to update recurring transactions');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to update recurring transaction status');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Remove automatic data loading on mount to prevent double-fetching
  // Data will be loaded by the component's useFocusEffect instead

  return {
    recurringTransactions,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchRecurringTransactions,
    fetchSummary,
    fetchRecurringTransaction,
    createRecurringTransaction,
    updateRecurringTransactionStatus,
    clearError,
  };
};

export default useRecurringTransactions;