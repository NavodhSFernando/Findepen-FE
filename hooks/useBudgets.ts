import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

export interface Budget {
  Id: string;
  Category: string;
  PlannedAmount: number;
  SpentAmount: number;
  Reminder: boolean;
  StartDate: string;
  RenewalFrequency: string;
  RemainingAmount: number;
  ProgressPercentage: number;
  Status: 'onTrack' | 'warning' | 'exceeded';
  NextRenewalDate: string;
  DaysRemainingInPeriod: number;
  // Auto-renewal fields
  AutoRenewalEnabled: boolean;
  LastRenewalDate?: string;
  EndDate?: string;
}

export interface BudgetSummary {
  TotalBudgets: number;
  TotalPlannedAmount: number;
  TotalSpentAmount: number;
  TotalRemainingAmount: number;
  OverallProgressPercentage: number;
  OnTrackBudgets: number;
  WarningBudgets: number;
  ExceededBudgets: number;
}

export interface CreateBudgetData {
  Category: string;
  PlannedAmount: number;
  Reminder: boolean;
  StartDate: string;
  RenewalFrequency: string;
}

export interface UpdateBudgetData {
  Category: string;
  PlannedAmount: number;
  SpentAmount: number;
  Reminder: boolean;
  StartDate: string;
  RenewalFrequency: string;
}

const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/budgets');
      setBudgets(response.data);
      setIsAuthenticated(true);
      // Clear any previous errors when data is successfully fetched
      setError(null);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        setError('Please log in to view your budgets');
        setIsAuthenticated(false);
        setBudgets([]);
        setSummary(null);
      } else if (err.response?.status !== 404 && !(Array.isArray(err.response?.data) && err.response?.data.length === 0)) {
        setError(err.response?.data?.message || 'Failed to fetch budgets');
      } else {
        // If it's a 404 or empty array, just set empty budgets (no error)
        setBudgets([]);
        setError(null);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get('/budgets/summary');
      setSummary(response.data);
    } catch (err: any) {
      console.error('Error fetching budget summary:', err);
      // Don't set error for summary, just leave it null
      setSummary(null);
    }
  };

  const createBudget = async (budgetData: CreateBudgetData): Promise<Budget | null> => {
    try {
      setError(null);
      const response = await api.post('/budgets', budgetData);
      await Promise.all([fetchBudgets(), fetchSummary()]); // Refresh list and summary
      return response.data;
    } catch (err: any) {
      console.error('Error creating budget:', err);
      if (err.response?.status === 401) {
        setError('Please log in to create budgets');
      } else {
        setError(err.response?.data?.message || 'Failed to create budget');
      }
      return null;
    }
  };

  const updateBudget = async (id: string, budgetData: UpdateBudgetData): Promise<Budget | null> => {
    try {
      setError(null);
      const response = await api.put(`/budgets/${id}`, budgetData);
      await Promise.all([fetchBudgets(), fetchSummary()]); // Refresh list and summary
      return response.data;
    } catch (err: any) {
      console.error('Error updating budget:', err);
      if (err.response?.status === 401) {
        setError('Please log in to update budgets');
      } else {
        setError(err.response?.data?.message || 'Failed to update budget');
      }
      return null;
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await api.delete(`/budgets/${id}`);
      await Promise.all([fetchBudgets(), fetchSummary()]); // Refresh list and summary
      return true;
    } catch (err: any) {
      console.error('Error deleting budget:', err);
      if (err.response?.status === 401) {
        setError('Please log in to delete budgets');
      } else {
        setError(err.response?.data?.message || 'Failed to delete budget');
      }
      return false;
    }
  };

  const getBudgetById = async (id: string): Promise<Budget | null> => {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching budget:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view budget details');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch budget');
      }
      return null;
    }
  };

  const toggleAutoRenewal = async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.put(`/budgets/${id}/auto-renewal`, {
        autoRenewalEnabled: enabled
      });
      await Promise.all([fetchBudgets(), fetchSummary()]); // Refresh list and summary
      return true;
    } catch (err: any) {
      console.error('Error toggling auto-renewal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to modify auto-renewal settings');
      } else {
        setError(err.response?.data?.message || 'Failed to update auto-renewal setting');
      }
      return false;
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, []);

  return {
    budgets,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchBudgets,
    fetchSummary,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    toggleAutoRenewal,
  };
};

export default useBudgets; 