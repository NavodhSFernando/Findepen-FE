import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "expo-router";
import { getToken } from "@/utilities/getToken";
import {
  validateAndCleanupToken,
  isTokenExpiringSoon,
  clearAuthToken,
} from "@/utilities/tokenValidation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearAuthError: () => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const token = await getToken();

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Validate token and clean up if invalid
      const isValid = await validateAndCleanupToken(token);

      if (!isValid) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Check if token is expiring soon (within 5 minutes)
      if (isTokenExpiringSoon(token, 5)) {
        console.log("Token expiring soon - consider refreshing");
        // You could implement token refresh logic here
      }

      setIsAuthenticated(true);
      // You could decode user info from token here if needed
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthError("Authentication check failed");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      setAuthError(null);
      setIsAuthenticated(true);
      // You could decode and set user info here
      await checkAuthStatus(); // This will validate the token
    } catch (error) {
      console.error("Error during login:", error);
      setAuthError("Login failed");
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      setAuthError(null);

      await clearAuthToken();
      // Token will be cleared by the axios interceptor or layout
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Check auth status on mount and when app comes to foreground
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus,
    clearAuthError,
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
