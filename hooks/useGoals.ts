import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

export interface Goal {
  Id: string;
  Title: string;
  Description: string;
  TargetAmount: number;
  CurrentAmount: number;
  TargetDate: string;
  Priority: 'High' | 'Medium' | 'Low';
  Status: 'Active' | 'Completed' | 'Paused' | 'Cancelled';
  Reminder: boolean;
  IsActive: boolean;
  CreatedDate: string;
  LastUpdatedDate: string;
  ProgressPercentage: number;
  RemainingAmount: number;
  DaysRemaining: number;
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

export interface CreateGoalData {
  Title: string;
  Description: string;
  TargetAmount: number;
  TargetDate: string;
  Priority: 'High' | 'Medium' | 'Low';
  Status: 'Active' | 'Completed' | 'Paused' | 'Cancelled';
  Reminder: boolean;
}

export interface UpdateGoalData {
  Title?: string;
  Description?: string;
  TargetAmount?: number;
  TargetDate?: string;
  Priority?: 'High' | 'Medium' | 'Low';
  Status?: 'Active' | 'Completed' | 'Paused' | 'Cancelled';
  Reminder?: boolean;
}

export interface AddFundsData {
  amount: number;
}

export interface WithdrawFundsData {
  amount: number;
}

export interface ConvertToExpenseData {
  amount: number;
  category: string;
  description: string;
}

const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/goals');
      setGoals(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching goals:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your goals');
        setIsAuthenticated(false);
        setGoals([]);
        setSummary(null);
      } else if (err.response?.status !== 404 && !(Array.isArray(err.response?.data) && err.response?.data.length === 0)) {
        setError(err.response?.data?.message || 'Failed to fetch goals');
      } else {
        setGoals([]);
        setError(null);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get('/goals/summary');
      setSummary(response.data);
    } catch (err: any) {
      console.error('Error fetching goal summary:', err);
      setSummary(null);
    }
  };

  const createGoal = async (goalData: CreateGoalData): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await api.post('/goals', goalData);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return response.data;
    } catch (err: any) {
      console.error('Error creating goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to create goals');
      } else {
        setError(err.response?.data?.message || 'Failed to create goal');
      }
      return null;
    }
  };

  const updateGoal = async (id: string, goalData: UpdateGoalData): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await api.put(`/goals/${id}`, goalData);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return response.data;
    } catch (err: any) {
      console.error('Error updating goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to update goals');
      } else {
        setError(err.response?.data?.message || 'Failed to update goal');
      }
      return null;
    }
  };

  const deleteGoal = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await api.delete(`/goals/${id}`);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return true;
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to delete goals');
      } else {
        setError(err.response?.data?.message || 'Failed to delete goal');
      }
      return false;
    }
  };

  const getGoalById = async (id: string): Promise<Goal | null> => {
    try {
      const response = await api.get(`/goals/${id}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view goal details');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch goal');
      }
      return null;
    }
  };

  const addFundsToGoal = async (id: string, fundsData: AddFundsData): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await api.post(`/goals/${id}/add-funds`, fundsData);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return response.data;
    } catch (err: any) {
      console.error('Error adding funds to goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to add funds to goals');
      } else {
        setError(err.response?.data?.message || 'Failed to add funds to goal');
      }
      return null;
    }
  };

  const withdrawFundsFromGoal = async (id: string, fundsData: WithdrawFundsData): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await api.post(`/goals/${id}/withdraw-funds`, fundsData);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return response.data;
    } catch (err: any) {
      console.error('Error withdrawing funds from goal:', err);
      if (err.response?.status === 401) {
        setError('Please log in to withdraw funds from goals');
      } else {
        setError(err.response?.data?.message || 'Failed to withdraw funds from goal');
      }
      return null;
    }
  };

  const convertGoalToExpense = async (id: string, expenseData: ConvertToExpenseData): Promise<Goal | null> => {
    try {
      setError(null);
      const response = await api.post(`/goals/${id}/convert-to-expense`, expenseData);
      await Promise.all([fetchGoals(), fetchSummary()]);
      return response.data;
    } catch (err: any) {
      console.error('Error converting goal to expense:', err);
      if (err.response?.status === 401) {
        setError('Please log in to convert goals to expenses');
      } else {
        setError(err.response?.data?.message || 'Failed to convert goal to expense');
      }
      return null;
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchSummary();
  }, []);

  return {
    goals,
    summary,
    loading,
    error,
    isAuthenticated,
    fetchGoals,
    fetchSummary,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    addFundsToGoal,
    withdrawFundsFromGoal,
    convertGoalToExpense,
  };
};

export default useGoals; 