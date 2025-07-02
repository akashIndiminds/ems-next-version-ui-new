// src/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/app/lib/api';
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

  // Helper function to clean array values and ensure proper data structure
  const cleanUserData = (userData) => {
    const cleaned = { ...userData };
    
    // Fix employeeId if it's an array
    if (cleaned.employeeId && Array.isArray(cleaned.employeeId)) {
      cleaned.employeeId = cleaned.employeeId[0];
    }
    
    // Fix companyId if it's an array
    if (cleaned.company?.companyId && Array.isArray(cleaned.company.companyId)) {
      cleaned.company.companyId = cleaned.company.companyId[0];
    }

    // 🔧 FIX ROLE: Ensure role is available at root level
    if (!cleaned.role && cleaned.employee?.role) {
      cleaned.role = cleaned.employee.role;
    }

    // 🔧 FIX LOCATION DATA: Ensure proper location structure
    if (cleaned.location) {
      // Fix locationId if it's an array
      if (cleaned.location.locationId && Array.isArray(cleaned.location.locationId)) {
        cleaned.location.locationId = cleaned.location.locationId[0];
      }
      
      // Add locationId at root level for backward compatibility
      cleaned.locationId = cleaned.location.locationId;
      
      // Store complete location details as assignedLocation
      cleaned.assignedLocation = {
        locationId: cleaned.location.locationId,
        locationCode: cleaned.location.locationCode,
        locationName: cleaned.location.locationName,
        address: cleaned.location.address,
        latitude: cleaned.location.latitude,
        longitude: cleaned.location.longitude,
        allowedRadius: cleaned.location.allowedRadius,
        hasCoordinates: !!(cleaned.location.latitude && cleaned.location.longitude)
      };
    } else {
      // Handle case where no location is assigned
      cleaned.locationId = null;
      cleaned.assignedLocation = null;
    }
    
    return cleaned;
  };

  const checkAuth = () => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const cleanedUser = cleanUserData(parsedUser);
        
        console.log('🔍 Auth check - cleaned user data:', cleanedUser);
        console.log('🔍 User role:', cleanedUser.role); // Debug role
        setUser(cleanedUser);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
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
        
        console.log('🔧 Raw login response employee:', employee);
        
        // 🔧 CRITICAL FIX: Map backend response to expected frontend structure
        const mappedEmployee = {
          ...employee,
          // Ensure all required fields are at root level
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          email: employee.email,
          employeeCode: employee.employeeCode,
          role: employee.role, // This is the key fix!
          
          // Keep nested structures as well
          company: employee.company,
          department: employee.department,
          designation: employee.designation,
          location: employee.location
        };
        
        console.log('🔧 Mapped employee data:', mappedEmployee);
        
        // Clean employee data including location
        const cleanEmployee = cleanUserData(mappedEmployee);
        
        console.log('✅ Login successful with clean data:', cleanEmployee);
        console.log('✅ Final user role:', cleanEmployee.role); // Debug final role
        
        // Store token and user data
        Cookies.set('token', token, { expires: 7 }); // 7 days
        Cookies.set('user', JSON.stringify(cleanEmployee), { expires: 7 });
        
        setUser(cleanEmployee);
        
        // 🌟 ENHANCED SUCCESS MESSAGE: Include location status
        if (cleanEmployee.assignedLocation?.hasCoordinates) {
          toast.success(`Welcome ${cleanEmployee.fullName}! Location: ${cleanEmployee.assignedLocation.locationName}`);
        } else if (cleanEmployee.assignedLocation) {
          toast.success(`Welcome ${cleanEmployee.fullName}! Note: Your location needs coordinate setup.`);
        } else {
          toast.success(`Welcome ${cleanEmployee.fullName}! Please contact admin to assign a location.`);
        }
        
        // 🔧 DEBUG: Log role before redirect
        console.log('🚀 Redirecting user with role:', cleanEmployee.role);
        
        // Redirect based on role
        if (cleanEmployee.role === 'admin') {
          console.log('🔧 Redirecting to dashboard (admin)');
          router.push('/dashboard');
        } else {
          console.log('🔧 Redirecting to attendance (employee/manager)');
          router.push('/attendance');
        }
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      console.error('❌ Login error:', error);
      toast.error(message);
      return { success: false, message };
    }
  };

  const registerCompany = async (data) => {
    try {
      const response = await authAPI.registerCompany(data);
      
      if (response.data.success) {
        const { token, admin } = response.data.data;
        
        // 🔧 Map admin response similar to employee
        const mappedAdmin = {
          ...admin,
          role: admin.role || 'admin' // Ensure admin role is set
        };
        
        // Clean admin data including location
        const cleanAdmin = cleanUserData(mappedAdmin);
        
        console.log('✅ Company registration successful:', cleanAdmin);
        
        // Store token and user data
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user', JSON.stringify(cleanAdmin), { expires: 7 });
        
        setUser(cleanAdmin);
        toast.success('Company registered successfully!');
        router.push('/dashboard');
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('❌ Registration error:', error);
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
    // Clean and merge with existing user data
    const mergedData = { ...user, ...userData };
    const cleanedData = cleanUserData(mergedData);
    
    console.log('🔄 Updating user data:', cleanedData);
    
    setUser(cleanedData);
    Cookies.set('user', JSON.stringify(cleanedData), { expires: 7 });
  };

  // 🔧 HELPER METHODS: Location-related utilities
  const hasValidLocationForAttendance = () => {
    return user?.assignedLocation?.hasCoordinates === true;
  };

  const getLocationInfo = () => {
    if (!user?.assignedLocation) {
      return {
        hasLocation: false,
        hasCoordinates: false,
        message: 'No location assigned to your account',
        status: 'no_location'
      };
    }

    if (!user.assignedLocation.hasCoordinates) {
      return {
        hasLocation: true,
        hasCoordinates: false,
        message: `Location "${user.assignedLocation.locationName}" needs coordinate setup`,
        status: 'missing_coordinates'
      };
    }

    return {
      hasLocation: true,
      hasCoordinates: true,
      message: `Ready for attendance at "${user.assignedLocation.locationName}"`,
      status: 'ready'
    };
  };

  // 🔧 DEBUGGING HELPER: Log current user state
  const debugUserInfo = () => {
    console.group('🐛 Debug User Info');
    console.log('Full User Object:', user);
    console.log('Employee ID:', user?.employeeId);
    console.log('Company ID:', user?.company?.companyId);
    console.log('User Role:', user?.role); // Key debug info
    console.log('Location ID:', user?.locationId);
    console.log('Assigned Location:', user?.assignedLocation);
    console.log('Location Info:', getLocationInfo());
    console.groupEnd();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerCompany,
    updateUser,
    
    // Authentication status
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    
    // 🌟 LOCATION UTILITIES
    hasValidLocationForAttendance,
    getLocationInfo,
    
    // Quick access to location data
    userLocation: user?.assignedLocation,
    locationId: user?.locationId,
    
    // Debugging helper
    debugUserInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};