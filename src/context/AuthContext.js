// src/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI} from '@/app/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Fix duplicate employeeId issue if it exists
        if (parsedUser.employeeId && Array.isArray(parsedUser.employeeId)) {
          parsedUser.employeeId = parsedUser.employeeId[0];
        }
        
        // Fix duplicate companyId issue if it exists
        if (parsedUser.company?.companyId && Array.isArray(parsedUser.company.companyId)) {
          parsedUser.company.companyId = parsedUser.company.companyId[0];
        }
        
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { token, employee } = response.data.data;
        
        // Fix duplicate IDs before storing
        let cleanEmployee = { ...employee };
        
        // Fix employeeId if it's an array
        if (cleanEmployee.employeeId && Array.isArray(cleanEmployee.employeeId)) {
          cleanEmployee.employeeId = cleanEmployee.employeeId[0];
        }
        
        // Fix companyId if it's an array
        if (cleanEmployee.company?.companyId && Array.isArray(cleanEmployee.company.companyId)) {
          cleanEmployee.company.companyId = cleanEmployee.company.companyId[0];
        }
        
        // Store token and user data
        Cookies.set('token', token, { expires: 1 }); // 1 day
        Cookies.set('user', JSON.stringify(cleanEmployee), { expires: 1 });
        
        setUser(cleanEmployee);
        toast.success('Login successful!');
        
        // Redirect based on role
        if (cleanEmployee.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/attendance');
        }
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const registerCompany = async (data) => {
    try {
      const response = await authAPI.registerCompany(data);
      
      if (response.data.success) {
        const { token, admin } = response.data.data;
        
        // Fix duplicate IDs before storing
        let cleanAdmin = { ...admin };
        
        // Fix employeeId if it's an array
        if (cleanAdmin.employeeId && Array.isArray(cleanAdmin.employeeId)) {
          cleanAdmin.employeeId = cleanAdmin.employeeId[0];
        }
        
        // Fix companyId if it's an array
        if (cleanAdmin.company?.companyId && Array.isArray(cleanAdmin.company.companyId)) {
          cleanAdmin.company.companyId = cleanAdmin.company.companyId[0];
        }
        
        // Store token and user data
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('user', JSON.stringify(cleanAdmin), { expires: 1 });
        
        setUser(cleanAdmin);
        toast.success('Company registered successfully!');
        router.push('/dashboard');
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    // Fix duplicate IDs before updating
    let cleanUserData = { ...userData };
    
    if (cleanUserData.employeeId && Array.isArray(cleanUserData.employeeId)) {
      cleanUserData.employeeId = cleanUserData.employeeId[0];
    }
    
    if (cleanUserData.company?.companyId && Array.isArray(cleanUserData.company.companyId)) {
      cleanUserData.company.companyId = cleanUserData.company.companyId[0];
    }
    
    setUser(cleanUserData);
    Cookies.set('user', JSON.stringify(cleanUserData), { expires: 1 });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerCompany,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};