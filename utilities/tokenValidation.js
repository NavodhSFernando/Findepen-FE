import * as SecureStore from "expo-secure-store";

/**
 * Validates if a JWT token is valid and not expired
 * @param {string | null} token - The JWT token to validate
 * @returns {boolean} - True if token is valid, false otherwise
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Decode the JWT token to check expiration
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      console.log("Token is expired");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

/**
 * Gets the token expiration time in milliseconds
 * @param {string} token - The JWT token
 * @returns {number | null} - Expiration time in milliseconds or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
};

/**
 * Checks if token will expire within the specified time
 * @param {string} token - The JWT token
 * @param {number} minutes - Minutes before expiration to consider as "expiring soon"
 * @returns {boolean} - True if token expires within specified time
 */
export const isTokenExpiringSoon = (token, minutes = 5) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  
  const currentTime = Date.now();
  const timeUntilExpiration = expiration - currentTime;
  const minutesUntilExpiration = timeUntilExpiration / (1000 * 60);
  
  return minutesUntilExpiration <= minutes;
};

/**
 * Clears the authentication token from storage
 * @returns {Promise<void>}
 */
export const clearAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    console.log("Auth token cleared from storage");
  } catch (error) {
    console.error("Error clearing auth token:", error);
  }
};

/**
 * Validates and cleans up invalid tokens
 * @param {string | null} token - The token to validate
 * @returns {Promise<boolean>} - True if token is valid, false if cleared
 */
export const validateAndCleanupToken = async (token) => {
  if (!token) return false;
  
  if (!isTokenValid(token)) {
    await clearAuthToken();
    return false;
  }
  
  return true;
};

/**
 * Gets user information from token payload
 * @param {string} token - The JWT token
 * @returns {object | null} - User information or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.Name,
      exp: payload.exp
    };
  } catch (error) {
    console.error("Error extracting user from token:", error);
    return null;
  }
};
