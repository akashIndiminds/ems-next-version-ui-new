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
      const deviceInfo = DeviceManager.getDeviceInfo();
      if (!DeviceManager.validateDeviceInfo(deviceInfo)) {
        throw new Error('Invalid device information');
      }

      console.log(`📤 Sending check-in request for Employee ${data.employeeId}`, {
        deviceUUID: deviceInfo.deviceUUID.substring(0, 8) + '...',
        deviceType: deviceInfo.deviceType,
      });

      const response = await attendanceApi.post('/checkin', {
        ...data,
        deviceInfo: {
          deviceUUID: deviceInfo.deviceUUID,
          deviceType: deviceInfo.deviceType,
          fingerprint: deviceInfo.fingerprint,
        },
      });

      if (response.data.success) {
        console.log('✅ Check-in successful:', response.data);
        if (response.data.deviceInfo?.requiresOTP) {
          console.log('⚠️ OTP required for this device');
          toast.warn('OTP required for this device');
        }
      } else {
        console.error('❌ Check-in failed:', response.data.message);
        if (response.data.reason === 'HIGH_RISK_DEVICE') {
          console.error('High risk device:', response.data.riskDetails);
        } else if (response.data.reason === 'MULTI_USER_DEVICE') {
          console.error('Multi-user device detected:', response.data.details);
        }
      }
      return response.data;
    } catch (error) {
      console.error('❌ Check-in request error:', error);
      throw error;
    }
  },

  checkOut: async (data) => {
    try {
      const deviceInfo = DeviceManager.getDeviceInfo();
      if (!DeviceManager.validateDeviceInfo(deviceInfo)) {
        throw new Error('Invalid device information');
      }

      console.log(`📤 Sending check-out request for Employee ${data.employeeId}`, {
        deviceUUID: deviceInfo.deviceUUID.substring(0, 8) + '...',
        deviceType: deviceInfo.deviceType,
      });

      const response = await attendanceApi.post('/checkout', {
        ...data,
        deviceInfo: {
          deviceUUID: deviceInfo.deviceUUID,
          deviceType: deviceInfo.deviceType,
          fingerprint: deviceInfo.fingerprint,
        },
      });

      if (response.data.success) {
        console.log('✅ Check-out successful:', response.data);
        if (response.data.deviceInfo?.requiresOTP) {
          console.log('⚠️ OTP required for this device');
          toast.warn('OTP required for this device');
        }
      } else {
        console.error('❌ Check-out failed:', response.data.message);
        if (response.data.reason === 'HIGH_RISK_DEVICE') {
          console.error('High risk device:', response.data.riskDetails);
        } else if (response.data.reason === 'MULTI_USER_DEVICE') {
          console.error('Multi-user device detected:', response.data.details);
        }
      }
      return response.data;
    } catch (error) {
      console.error('❌ Check-out request error:', error);
      throw error;
    }
  },

  getRecords: async (params) => {
    try {
      const response = await attendanceApi.get('/records', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get records error:', error);
      throw error;
    }
  },

  getTodayStatus: async (employeeId) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const response = await attendanceApi.get(`/today/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get today status error:', error);
      throw error;
    }
  },
};

export default attendanceAPI;