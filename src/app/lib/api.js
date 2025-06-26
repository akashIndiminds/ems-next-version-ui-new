// src/lib/api.js (Complete version with all integrations)
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
api.interceptors.response.use(
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
      } else if (error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

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
  getTodayStatus: (employeeId) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return api.get(`/attendance/today/${id}`);
  },
};

// Company APIs
export const companyAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  getDashboard: (id) => {
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

// Leave Balance APIs - COMPLETE IMPLEMENTATION
export const leaveBalanceAPI = {
  // Get all leave types
  getLeaveTypes: () => api.get('/leave-balance/leave-types'),
  
  // Get employee leave balance
  getBalance: (employeeId, year) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const params = year ? { year } : {};
    return api.get(`/leave-balance/balance/${id}`, { params });
  },
  
  // Initialize leave balance for an employee
  initialize: (employeeId, year) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return api.post('/leave-balance/initialize', { 
      employeeId: id, 
      year: year || new Date().getFullYear() 
    });
  },
  
  // Adjust leave balance
  adjust: (data) => api.post('/leave-balance/adjust', data),
  
  // Bulk initialize for company
  bulkInitialize: (companyId, year) => {
    const id = Array.isArray(companyId) ? companyId[0] : companyId;
    return api.post('/leave-balance/bulk-initialize', { 
      companyId: id, 
      year: year || new Date().getFullYear() 
    });
  },
  
  // Get company summary
  getSummary: (params) => {
    const companyId = Array.isArray(params.companyId) ? params.companyId[0] : params.companyId;
    return api.get(`/leave-balance/summary/${companyId}`, { 
      params: { year: params.year } 
    });
  },
  
  // Carry forward balance
  carryForward: (fromYear, toYear) => 
    api.post('/leave-balance/carry-forward', { fromYear, toYear })
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

// Dropdown APIs
export const dropdownAPI = {
  // Get multiple dropdowns in one call
  getMultiple: (types, filters = {}) => {
    const params = { types: types.join(','), ...filters };
    return api.get('/dropdowns', { params });
  },
  
  // Individual dropdown endpoints
  getCompanies: () => api.get('/dropdowns/companies'),
  getDepartments: (companyId) => {
    const params = companyId ? { companyId } : {};
    return api.get('/dropdowns/departments', { params });
  },
  getDesignations: () => api.get('/dropdowns/designations'),
  getLocations: (companyId) => {
    const params = companyId ? { companyId } : {};
    return api.get('/dropdowns/locations', { params });
  },
  getEmployees: (companyId, departmentId) => {
    const params = {};
    if (companyId) params.companyId = companyId;
    if (departmentId) params.departmentId = departmentId;
    return api.get('/dropdowns/employees', { params });
  },
  getLeaveTypes: () => api.get('/dropdowns/leave-types'),
  getShiftTypes: () => api.get('/dropdowns/shift-types'),
  getManagers: (companyId) => {
    const params = companyId ? { companyId } : {};
    return api.get('/dropdowns/managers', { params });
  },
  getStaticDropdowns: () => api.get('/dropdowns/static'),
  getSubscriptionPlans: () => api.get('/dropdowns/subscription-plans'),
};

export default api;