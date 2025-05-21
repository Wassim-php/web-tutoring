// Import necessary React functions
import React, { createContext, useContext, useState } from 'react';

// Create a context for authentication. Initially undefined.
const AuthContext = createContext();

/**
 * AuthProvider component to wrap around parts of the app that need access to auth state.
 * Provides authentication state and methods via React Context.
 */
export const AuthProvider = ({ children }) => {
  // State to track whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to store the currently authenticated user's information
  const [user, setUser] = useState(null);

  /**
   * Logs in the user by:
   * - Saving the token to localStorage
   * - Updating the auth state and user data
   * 
   * @param token - JWT or auth token to be stored
   * @param userData - Object containing user details
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  /**
   * Logs out the user by:
   * - Removing the token from localStorage
   * - Resetting the auth state and clearing user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Return the context provider with auth state and functions
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 * Throws an error if used outside of the AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Exporting context for possible external access (optional)
export default AuthContext;
