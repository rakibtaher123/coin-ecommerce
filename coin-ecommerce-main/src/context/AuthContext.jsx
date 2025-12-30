// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// 1. Create Auth Context
export const AuthContext = createContext();

// 2. Create Auth Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Check localStorage on App Load
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');

      if (storedToken) {
        setIsLoggedIn(true);
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          setUser(parsedUser);
        } catch (e) {
          // Fallback if parsing fails or old data
          const storedRole = localStorage.getItem('userRole');
          const storedEmail = localStorage.getItem('userEmail');
          setUser({
            role: storedRole || 'user',
            email: storedEmail || '',
            name: 'User'
          });
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 4. Login Function
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData)); // Store full object

    // Legacy support (optional, can remove if not used elsewhere)
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);

    setIsLoggedIn(true);
    setUser(userData);
  };

  // 5. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    setIsLoggedIn(false);
    setUser(null);

    // Force full page reload to ensure all components reset properly
    window.location.href = '/login';
  };

  const contextValue = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};