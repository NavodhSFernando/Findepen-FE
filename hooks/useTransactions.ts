import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

export interface Transaction {
  Id: string;
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: 'Income' | 'Expense';
  Date: string;
}

export interface BalanceSummary {
  CurrentBalance: number;
  MonthlyIncome: number;
  MonthlyExpenses: number;
  MonthlyNet: number;
}

export interface GoalSummary {
  TotalGoals: number;
  ActiveGoals: number;
  CompletedGoals: number;
  OverdueGoals: number;
  TotalTargetAmount: number;
  TotalCurrentAmount: number;
  TotalRemainingAmount: number;
  OverallProgressPercentage: number;
  TotalMonthlyRequired: number;
  TotalWeeklyRequired: number;
  PriorityBreakdown: Record<string, number>;
  StatusBreakdown: Record<string, number>;
}

export interface CreateTransactionData {
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: 'Income' | 'Expense';
  Date: string;
}

export interface UpdateTransactionData {
  Title?: string;
  Description?: string;
  Amount?: number;
  Category?: string;
  Type?: 'Income' | 'Expense';
  Date?: string;
}

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [reserves, setReserves] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchTransactions = async () => {
    // Don't set loading to true if we already have data and this is a refresh
    if (transactions.length === 0) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your transactions');
        setIsAuthenticated(false);
        setTransactions([]);
      } else if (err.response?.status !== 404 && !(Array.isArray(err.response?.data) && err.response?.data.length === 0)) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
      } else {
        setTransactions([]);
        setError(null);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await api.get('/user/balance');
      setBalance(response.data.CurrentBalance);
      setExpenses(response.data.MonthlyExpenses);
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setBalance(0);
      setExpenses(0);
    }
  };

  const fetchReserves = async () => {
    try {
      const response = await api.get('/goals/summary');
      setReserves(response.data.TotalCurrentAmount || 0);
    } catch (err: any) {
      console.error('Error fetching reserves:', err);
      setReserves(0);
    }
  };

  const createTransaction = async (transactionData: CreateTransactionData): Promise<Transaction | null> => {
    try {
      setError(null);
      const response = await api.post('/transactions', transactionData);
      await Promise.all([fetchTransactions(), fetchBalance()]);
      return response.data;
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      if (err.response?.status === 401) {
        setError('Please log in to create transactions');
      } else {
        setError(err.response?.data?.message || 'Failed to create transaction');
      }
      return null;
    }
  };

  const updateTransaction = async (id: string, transactionData: UpdateTransactionData): Promise<Transaction | null> => {
    try {
      setError(null);
      const response = await api.put(`/transactions/${id}`, transactionData);
      await Promise.all([fetchTransactions(), fetchBalance()]);
      return response.data;
    } catch (err: any) {
      console.error('Error updating transaction:', err);
      if (err.response?.status === 401) {
        setError('Please log in to update transactions');
      } else {
        setError(err.response?.data?.message || 'Failed to update transaction');
      }
      return null;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await api.delete(`/transactions/${id}`);
      await Promise.all([fetchTransactions(), fetchBalance()]);
      return true;
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      if (err.response?.status === 401) {
        setError('Please log in to delete transactions');
      } else {
        setError(err.response?.data?.message || 'Failed to delete transaction');
      }
      return false;
    }
  };

  const getTransactionById = async (id: string): Promise<Transaction | null> => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching transaction:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view transaction details');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch transaction');
      }
      return null;
    }
  };

  // Remove the automatic data fetching from useEffect
  // Data will be fetched explicitly when needed

  return {
    transactions,
    balance,
    expenses,
    reserves,
    loading,
    error,
    isAuthenticated,
    fetchTransactions,
    fetchBalance,
    fetchReserves,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  };
};

export default useTransactions; 