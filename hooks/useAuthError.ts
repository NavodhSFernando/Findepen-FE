import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

/**
 * Custom hook to handle authentication errors consistently across the app
 * Provides centralized auth error handling and automatic logout on auth failures
 */
export const useAuthError = () => {
  const { logout } = useAuth();
  const router = useRouter();

  /**
   * Handle API errors with authentication awareness
   * @param error - The error from API calls
   * @param customErrorMessage - Custom message to show for auth errors
   * @returns Object with error message and whether it's an auth error
   */
  const handleAuthError = (error: any, customErrorMessage?: string) => {
    const isAuthError = error?.response?.status === 401;
    
    if (isAuthError) {
      // Clear auth state and redirect to login
      logout();
      return {
        errorMessage: customErrorMessage || 'Please log in to continue',
        isAuthError: true
      };
    }
    
    // Handle other errors
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
    return {
      errorMessage,
      isAuthError: false
    };
  };

  /**
   * Handle authentication errors specifically
   * @param error - The error from API calls
   * @param customErrorMessage - Custom message to show
   * @returns Error message string
   */
  const handleAuthErrorOnly = (error: any, customErrorMessage?: string): string => {
    const { errorMessage, isAuthError } = handleAuthError(error, customErrorMessage);
    
    if (isAuthError) {
      // Auth errors are handled automatically by logout()
      return errorMessage;
    }
    
    return errorMessage;
  };

  return {
    handleAuthError,
    handleAuthErrorOnly,
  };
};
