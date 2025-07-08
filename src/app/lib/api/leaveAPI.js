// src/app/lib/api/leaveAPI.js
import axios from './axios';

export const leaveAPI = {
  // Apply for leave
  apply: (data) => axios.post('/leaves/apply', data),

  // Update leave status (approve/reject)
  updateStatus: (leaveId, data) => axios.put(`/leaves/${leaveId}/status`, data),

  // Cancel leave
  cancel: (leaveId) => axios.put(`/leaves/${leaveId}/cancel`),

  // Get employee's leaves
  getEmployeeLeaves: (employeeId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return axios.get(`/leaves/employee/${employeeId}${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get leave balance
  getBalance: (employeeId, year) => {
    const params = year ? `?year=${year}` : '';
    return axios.get(`/leaves/balance/${employeeId}${params}`);
  },

  // Get pending leaves for approval
  getPending: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return axios.get(`/leaves/pending${queryParams ? `?${queryParams}` : ''}`);
  },

  // NEW: Get approved leaves (admin/manager only)
  getApprovedLeaves: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return axios.get(`/leaves/approved${queryParams ? `?${queryParams}` : ''}`);
  },

  // NEW: Revoke approved leave (admin only)
  revokeApprovedLeave: (leaveId, data) => axios.put(`/leaves/${leaveId}/revoke`, data),

  // NEW: Modify approved leave dates (admin only)
  modifyApprovedLeave: (leaveId, data) => axios.put(`/leaves/${leaveId}/modify`, data),

  // Leave reports (if you want to add reporting)
  getLeaveReport: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return axios.get(`/reports/leave${queryParams ? `?${queryParams}` : ''}`);
  },

  // Export leave data
  exportLeaves: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return axios.get(`/leaves/export${queryParams ? `?${queryParams}` : ''}`, {
      responseType: 'blob'
    });
  }
};