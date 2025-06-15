// src/lib/api.js
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Using same cookie name as your AuthContext
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Remove helper functions as you're managing auth in AuthContext

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  registerCompany: (data) => api.post('/auth/register-company', data),
  addEmployee: (data) => api.post('/auth/add-employee', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Employee APIs
export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Attendance APIs
export const attendanceAPI = {
  checkIn: (data) => api.post('/attendance/checkin', data),
  checkOut: (data) => api.post('/attendance/checkout', data),
  getRecords: (params) => api.get('/attendance/records', { params }),
  // Fixed: Only pass employeeId once
  getTodayStatus: (employeeId) => {
    // Ensure employeeId is a single value, not an array
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return api.get(`/attendance/today/${id}`);
  },
};

// Company APIs
export const companyAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  getDashboard: (id) => {
    // Ensure companyId is a single value
    const companyId = Array.isArray(id) ? id[0] : id;
    return api.get(`/companies/${companyId}/dashboard`);
  },
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

// Department APIs
export const departmentAPI = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  getByCompany: (companyId, params) => {
    const id = Array.isArray(companyId) ? companyId[0] : companyId;
    return api.get(`/departments/company/${id}`, { params });
  },
  getEmployees: (id, params) => api.get(`/departments/${id}/employees`, { params }),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Leave APIs
export const leaveAPI = {
  apply: (data) => api.post('/leaves/apply', data),
  updateStatus: (id, data) => api.put(`/leaves/${id}/status`, data),
  cancel: (id) => api.put(`/leaves/${id}/cancel`),
  getEmployeeLeaves: (employeeId, params) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return api.get(`/leaves/employee/${id}`, { params });
  },
  getBalance: (employeeId, params) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return api.get(`/leaves/balance/${id}`, { params });
  },
  getPending: (params) => api.get('/leaves/pending', { params }),
};

// Location APIs
export const locationAPI = {
  getAll: (params) => api.get('/locations', { params }),
  getById: (id) => api.get(`/locations/${id}`),
  getNearby: (lat, lon, params) => api.get(`/locations/nearby/${lat}/${lon}`, { params }),
  validate: (data) => api.post('/locations/validate', data),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  getHistory: (params) => api.get('/payments/history', { params }),
};

export default api;