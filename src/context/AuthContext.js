'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, getMyProfile, socketService } from '@/services';
import { mockLoginUser, mockRegisterUser, mockGetMyProfile } from '@/services/mockAuthService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setUser(null);
    socketService.disconnect();
    router.push('/login');
  }, [router]);

  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('skillswap_user');
      const storedToken = localStorage.getItem('skillswap_token');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        socketService.connect(storedToken, userData.userId);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      logout();
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (credentials) => {
    try {
      let response;
      try {
        response = await loginUser(credentials);
      } catch (error) {
        // Fallback to mock service if backend is not available
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          response = await mockLoginUser(credentials);
        } else {
          throw error;
        }
      }

      const { data } = response;
      // Backend returns { user: {...}, token: "jwt_token" }
      localStorage.setItem('skillswap_token', data.token);
      localStorage.setItem('skillswap_user', JSON.stringify(data.user));
      setUser(data.user);

      socketService.connect(data.token, data.user.userId);

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Login failed.');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      let response;
      try {
        response = await registerUser(userData);
      } catch (error) {
        // Fallback to mock service if backend is not available
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          response = await mockRegisterUser(userData);
        } else {
          throw error;
        }
      }

      const { data } = response;
      // Backend returns { user: {...}, token: "jwt_token" }
      localStorage.setItem('skillswap_token', data.token);
      localStorage.setItem('skillswap_user', JSON.stringify(data.user));
      setUser(data.user);

      socketService.connect(data.token, data.user.userId);

      toast.success('Welcome to SkillSwap!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Registration failed.');
      throw error;
    }
  };

  const value = { user, loading, isAuthenticated: !!user, login, register, logout };

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;