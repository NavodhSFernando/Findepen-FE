import { useState, useEffect } from 'react';
import api from '@/utilities/axiosInstance';

// User Profile Interfaces - Updated to match backend UserProfileModel exactly
export interface UserProfile {
  Id: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  DOB: string; // Changed to match backend PascalCase
  BalanceAmount: number;
  Theme: string;
  // Calculated properties from backend
  Age: number;
  FormattedDOB: string;
  FormattedBalance: string;
}

export interface UpdateProfileData {
  Name: string;
  Email: string;
  PhoneNumber: string;
  DOB: string; // Changed to match backend PascalCase
}

// Password Change Interfaces - Updated to match backend ChangePasswordModel
export interface ChangePasswordData {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

// Balance Management Interfaces - Updated to match backend UserBalanceModel
export interface BalanceInfo {
  CurrentBalance: number;
  MonthlyIncome: number;
  MonthlyExpenses: number;
  MonthlyNet: number;
  // Calculated properties from backend
  FormattedCurrentBalance: number;
  FormattedMonthlyIncome: number;
  FormattedMonthlyExpenses: number;
  FormattedMonthlyNet: number;
  MonthlyNetFormatted: string;
}

export interface SetInitialBalanceData {
  InitialBalance: number;
}

export interface BalanceAdjustmentData {
  Amount: number;
  Reason: string;
  Notes?: string;
}

// Settings Interfaces - Updated to match backend UserSettingsModel
export interface UserSettings {
  Theme: 'light' | 'dark' | 'system';
}

// Hook State Interface
interface UserState {
  profile: UserProfile | null;
  balance: BalanceInfo | null;
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const useUser = () => {
  const [state, setState] = useState<UserState>({
    profile: null,
    balance: null,
    settings: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Profile Management
  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.get('/User/profile');
      const profile = response.data;
      setState(prev => ({ 
        ...prev, 
        profile, 
        loading: false, 
        isAuthenticated: true,
        error: null 
      }));
      return profile;
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to view your profile'
        : err.response?.data?.message || 'Failed to fetch profile';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        isAuthenticated: err.response?.status !== 401
      }));
      return null;
    }
  };

  const updateProfile = async (profileData: UpdateProfileData): Promise<UserProfile | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Sending profile update data:', profileData);
      const response = await api.put('/User/profile', profileData);
      console.log('Profile update response:', response.data);
      const updatedProfile = response.data.Profile; // Fixed: use PascalCase to match backend
      console.log('Updated profile data:', updatedProfile);
      setState(prev => ({ 
        ...prev, 
        profile: updatedProfile, 
        loading: false,
        error: null 
      }));
      return updatedProfile;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to update your profile'
        : err.response?.data?.message || 'Failed to update profile';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  // Password Management
  const changePassword = async (passwordData: ChangePasswordData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await api.put('/User/password', passwordData);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: null 
      }));
      return true;
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to change your password'
        : err.response?.data?.message || 'Failed to change password';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return false;
    }
  };

  // Balance Management
  const fetchBalance = async (): Promise<BalanceInfo | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.get('/User/balance');
      const balance = response.data;
      setState(prev => ({ 
        ...prev, 
        balance, 
        loading: false,
        error: null 
      }));
      return balance;
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to view your balance'
        : err.response?.data?.message || 'Failed to fetch balance';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const setInitialBalance = async (balanceData: SetInitialBalanceData): Promise<BalanceInfo | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.post('/User/balance', balanceData);
      const balance = response.data.Balance; // Fixed: use PascalCase to match backend
      setState(prev => ({ 
        ...prev, 
        balance, 
        loading: false,
        error: null 
      }));
      return balance;
    } catch (err: any) {
      console.error('Error setting initial balance:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to set your balance'
        : err.response?.data?.message || 'Failed to set initial balance';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const adjustBalance = async (adjustmentData: BalanceAdjustmentData): Promise<BalanceInfo | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.put('/User/balance/adjust', adjustmentData);
      const balance = response.data.Balance; // Fixed: use PascalCase to match backend
      setState(prev => ({ 
        ...prev, 
        balance, 
        loading: false,
        error: null 
      }));
      return balance;
    } catch (err: any) {
      console.error('Error adjusting balance:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to adjust your balance'
        : err.response?.data?.message || 'Failed to adjust balance';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  // Settings Management
  const fetchSettings = async (): Promise<UserSettings | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.get('/User/settings');
      const settings = response.data;
      setState(prev => ({ 
        ...prev, 
        settings, 
        loading: false,
        error: null 
      }));
      return settings;
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to view your settings'
        : err.response?.data?.message || 'Failed to fetch settings';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const updateSettings = async (settingsData: UserSettings): Promise<UserSettings | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.put('/User/settings', settingsData);
      const settings = response.data.Settings; // Fixed: use PascalCase to match backend
      setState(prev => ({ 
        ...prev, 
        settings, 
        loading: false,
        error: null 
      }));
      return settings;
    } catch (err: any) {
      console.error('Error updating settings:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Please log in to update your settings'
        : err.response?.data?.message || 'Failed to update settings';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Initialize user data on mount
  useEffect(() => {
    const initializeUserData = async () => {
      await fetchProfile();
      await fetchBalance();
      await fetchSettings();
    };

    initializeUserData();
  }, []);

  return {
    // State
    profile: state.profile,
    balance: state.balance,
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,

    // Actions
    fetchProfile,
    updateProfile,
    changePassword,
    fetchBalance,
    setInitialBalance,
    adjustBalance,
    fetchSettings,
    updateSettings,
    clearError,
  };
};

export default useUser; 