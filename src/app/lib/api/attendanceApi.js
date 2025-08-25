// src/app/lib/api/attendanceApi.js - FIXED VERSION
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import DeviceManager from '../deviceManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance for attendance APIs
const attendanceApi = axios.create({
  baseURL: `${API_BASE_URL}/attendance`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
attendanceApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
attendanceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response.status === 423) {
        toast.error('Device sharing detected. Please contact administrator.');
      } else if (error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export const attendanceAPI = {
  checkIn: async (data) => {
    try {
      // ✅ Get device info in correct format
      const deviceInfo = DeviceManager.getDeviceInfo();
      
      // ✅ Validate device info before sending
      if (!DeviceManager.validateDeviceInfo(deviceInfo)) {
        throw new Error('Invalid device information');
      }

      console.log(`📤 Sending check-in request for Employee ${data.employeeId}`, {
        deviceUUID: deviceInfo.deviceUUID.substring(0, 8) + '...',
        deviceType: deviceInfo.deviceType,
        hasFingerprint: !!deviceInfo.fingerprint
      });

      // ✅ Send data in the exact format backend expects
      const requestPayload = {
        ...data,
        deviceInfo: {
          deviceUUID: deviceInfo.deviceUUID,
          deviceType: deviceInfo.deviceType,
          fingerprint: deviceInfo.fingerprint
        }
      };

      console.log('📤 Final request payload:', {
        employeeId: requestPayload.employeeId,
        deviceInfo: {
          deviceUUID: requestPayload.deviceInfo.deviceUUID.substring(0, 8) + '...',
          deviceType: requestPayload.deviceInfo.deviceType,
          fingerprintKeys: Object.keys(requestPayload.deviceInfo.fingerprint)
        }
      });

      const response = await attendanceApi.post('/checkin', requestPayload);

      if (response.data.success) {
        console.log('✅ Check-in successful:', {
          message: response.data.message,
          deviceRegistered: !!response.data.deviceInfo
        });
        
        // Handle OTP requirement
        if (response.data.deviceInfo?.requiresOTP) {
          console.log('⚠️ OTP required for this device');
          toast.warn('OTP required for this device');
        }

        // Update stored device info if backend returned deviceId
        if (response.data.deviceInfo?.deviceId) {
          try {
            const currentDeviceInfo = DeviceManager.getStoredDeviceInfo();
            if (currentDeviceInfo) {
              const updatedInfo = {
                ...currentDeviceInfo,
                deviceId: response.data.deviceInfo.deviceId,
                lastUsed: new Date().toISOString()
              };
              DeviceManager.storeDeviceInfo(updatedInfo);
              console.log('✅ Device ID stored:', response.data.deviceInfo.deviceId);
            }
          } catch (storeError) {
            console.warn('⚠️ Failed to store device ID:', storeError);
          }
        }
      } else {
        console.error('❌ Check-in failed:', response.data.message);
        if (response.data.reason === 'HIGH_RISK_DEVICE') {
          console.error('High risk device:', response.data.riskDetails);
        } else if (response.data.reason === 'MULTI_USER_DEVICE') {
          console.error('Multi-user device detected:', response.data.details);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Check-in request error:', error);
      
      // Enhanced error handling
      if (error.response?.status === 400 && error.response?.data?.message?.includes('deviceUUID')) {
        console.error('❌ Device info validation failed on backend');
        // Try to refresh device info and retry once
        try {
          console.log('🔄 Refreshing device info and retrying...');
          DeviceManager.refreshDeviceInfo();
          // Don't retry automatically to avoid infinite loop
          toast.error('Device registration failed. Please try again.');
        } catch (refreshError) {
          console.error('❌ Device refresh failed:', refreshError);
        }
      }
      
      throw error;
    }
  },

  checkOut: async (data) => {
    try {
      // ✅ Get device info in correct format
      const deviceInfo = DeviceManager.getDeviceInfo();
      
      // ✅ Validate device info before sending
      if (!DeviceManager.validateDeviceInfo(deviceInfo)) {
        throw new Error('Invalid device information');
      }

      console.log(`📤 Sending check-out request for Employee ${data.employeeId}`, {
        deviceUUID: deviceInfo.deviceUUID.substring(0, 8) + '...',
        deviceType: deviceInfo.deviceType,
        hasFingerprint: !!deviceInfo.fingerprint
      });

      // ✅ Send data in the exact format backend expects
      const requestPayload = {
        ...data,
        deviceInfo: {
          deviceUUID: deviceInfo.deviceUUID,
          deviceType: deviceInfo.deviceType,
          fingerprint: deviceInfo.fingerprint
        }
      };

      const response = await attendanceApi.post('/checkout', requestPayload);

      if (response.data.success) {
        console.log('✅ Check-out successful:', {
          message: response.data.message,
          deviceRegistered: !!response.data.deviceInfo
        });
        
        if (response.data.deviceInfo?.requiresOTP) {
          console.log('⚠️ OTP required for this device');
          toast.warn('OTP required for this device');
        }

        // Update stored device info if backend returned deviceId
        if (response.data.deviceInfo?.deviceId) {
          try {
            const currentDeviceInfo = DeviceManager.getStoredDeviceInfo();
            if (currentDeviceInfo) {
              const updatedInfo = {
                ...currentDeviceInfo,
                deviceId: response.data.deviceInfo.deviceId,
                lastUsed: new Date().toISOString()
              };
              DeviceManager.storeDeviceInfo(updatedInfo);
              console.log('✅ Device ID updated:', response.data.deviceInfo.deviceId);
            }
          } catch (storeError) {
            console.warn('⚠️ Failed to store device ID:', storeError);
          }
        }
      } else {
        console.error('❌ Check-out failed:', response.data.message);
        if (response.data.reason === 'HIGH_RISK_DEVICE') {
          console.error('High risk device:', response.data.riskDetails);
        } else if (response.data.reason === 'MULTI_USER_DEVICE') {
          console.error('Multi-user device detected:', response.data.details);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Check-out request error:', error);
      throw error;
    }
  },

  getRecords: async (params) => {
    try {
      const response = await attendanceApi.get('/records', { params });
      return response;
    } catch (error) {
      console.error('❌ Get records error:', error);
      throw error;
    }
  },

  getTodayStatus: async (employeeId) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const response = await attendanceApi.get(`/today/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get today status error:', error);
      throw error;
    }
  },

  // ✅ NEW: Get employee devices
  getEmployeeDevices: async (employeeId) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const response = await attendanceApi.get(`/devices/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get employee devices error:', error);
      throw error;
    }
  },

  // ✅ NEW: Get device usage logs (Admin/Manager only)
  getDeviceUsageLogs: async (params = {}) => {
    try {
      const response = await attendanceApi.get('/device-usage-logs', { params });
      return response;
    } catch (error) {
      console.error('❌ Get device usage logs error:', error);
      throw error;
    }
  },

  // ✅ NEW: Get security incidents (Admin/Manager only)
  getSecurityIncidents: async (params = {}) => {
    try {
      const response = await attendanceApi.get('/security-incidents', { params });
      return response;
    } catch (error) {
      console.error('❌ Get security incidents error:', error);
      throw error;
    }
  }
};

export default attendanceAPI;