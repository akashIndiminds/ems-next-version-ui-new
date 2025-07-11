// src/app/lib/api/leaveAPI.js
import apiClient from "../apiClient";

export const leaveAPI = {
  // ================================
  // EMPLOYEE OPERATIONS
  // ================================

  // Apply for leave
  apply: async (data) => {
    return await apiClient.post('/leaves/apply', data);
  },

  // Cancel leave
  cancel: async (leaveId) => {
    return await apiClient.put(`/leaves/${leaveId}/cancel`);
  },

  // Get employee's leaves with pagination and filters
  getEmployeeLeaves: async (employeeId, params = {}) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/employee/${id}${queryString ? `?${queryString}` : ''}`);
  },

  // Get leave balance
  getBalance: async (employeeId, year = null) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const params = year ? `?year=${year}` : '';
    return await apiClient.get(`/leaves/balance/${id}${params}`);
  },

  // ================================
  // MANAGER/ADMIN OPERATIONS
  // ================================

  // Get pending leaves for approval
  getPending: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/pending${queryString ? `?${queryString}` : ''}`);
  },

  // Update leave status (approve/reject)
  updateStatus: async (leaveId, data) => {
    return await apiClient.put(`/leaves/${leaveId}/status`, data);
  },

  // Get approved leaves with advanced filtering
  getApprovedLeaves: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/approved${queryString ? `?${queryString}` : ''}`);
  },

  // Get leave statistics for dashboard
  getStatistics: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/statistics${queryString ? `?${queryString}` : ''}`);
  },

  // ================================
  // ADMIN ONLY OPERATIONS
  // ================================

  // Revoke approved leave (admin only)
  revokeApprovedLeave: async (leaveId, data) => {
    return await apiClient.put(`/leaves/${leaveId}/revoke`, data);
  },

  // Modify approved leave dates (admin only)
  modifyApprovedLeave: async (leaveId, data) => {
    return await apiClient.put(`/leaves/${leaveId}/modify`, data);
  },

  // ================================
  // REPORTING & ANALYTICS
  // ================================

  // Get leave analytics
  getAnalytics: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/analytics${queryString ? `?${queryString}` : ''}`);
  },

  // Get leave trends
  getTrends: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/trends${queryString ? `?${queryString}` : ''}`);
  },

  // Export leave data
  exportLeaves: async (params = {}, format = 'excel') => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });
    searchParams.append('format', format);

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/export${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  },

  // ================================
  // BULK OPERATIONS
  // ================================

  // Bulk approve/reject leaves
  bulkUpdateStatus: async (leaveIds, status, remarks = '') => {
    return await apiClient.put('/leaves/bulk/status', {
      leaveIds,
      status,
      remarks
    });
  },

  // Bulk import leave applications
  bulkImport: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    return await apiClient.post('/leaves/bulk/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // ================================
  // VALIDATION & UTILITIES
  // ================================

  // Validate leave application before submission
  validateApplication: async (data) => {
    return await apiClient.post('/leaves/validate', data);
  },

  // Check leave balance availability
  checkBalance: async (employeeId, leaveTypeId, totalDays) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return await apiClient.post('/leaves/check-balance', {
      employeeId: id,
      leaveTypeId,
      totalDays
    });
  },

  // Get leave calendar for employee
  getCalendar: async (employeeId, params = {}) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/calendar/${id}${queryString ? `?${queryString}` : ''}`);
  },

  // Get team leave calendar (for managers)
  getTeamCalendar: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/team-calendar${queryString ? `?${queryString}` : ''}`);
  },

  // ================================
  // NOTIFICATIONS & REMINDERS
  // ================================

  // Get leave notifications
  getNotifications: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    const queryString = searchParams.toString();
    return await apiClient.get(`/leaves/notifications${queryString ? `?${queryString}` : ''}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    return await apiClient.put(`/leaves/notifications/${notificationId}/read`);
  },

  // Send reminder for pending approvals
  sendApprovalReminder: async (leaveId) => {
    return await apiClient.post(`/leaves/${leaveId}/remind`);
  },

  // ================================
  // CONFIGURATION & SETTINGS
  // ================================

  // Get leave policies
  getPolicies: async (companyId = null) => {
    const params = companyId ? `?companyId=${companyId}` : '';
    return await apiClient.get(`/leaves/policies${params}`);
  },

  // Update leave policy (admin only)
  updatePolicy: async (policyId, data) => {
    return await apiClient.put(`/leaves/policies/${policyId}`, data);
  },

  // Get leave approval workflow
  getWorkflow: async (departmentId = null) => {
    const params = departmentId ? `?departmentId=${departmentId}` : '';
    return await apiClient.get(`/leaves/workflow${params}`);
  },

  // ================================
  // MOBILE APP SPECIFIC
  // ================================

  // Quick apply for common leave types
  quickApply: async (data) => {
    return await apiClient.post('/leaves/quick-apply', data);
  },

  // Get today's leave status
  getTodayStatus: async (employeeId) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return await apiClient.get(`/leaves/today/${id}`);
  },

  // Get upcoming leaves
  getUpcoming: async (employeeId, days = 30) => {
    const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    return await apiClient.get(`/leaves/upcoming/${id}?days=${days}`);
  }
};

// ================================
// LEAVE UTILITIES
// ================================

export const leaveUtils = {
  // Calculate leave days between dates
  calculateDays: (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  },

  // Calculate working days (excluding weekends)
  calculateWorkingDays: (fromDate, toDate, holidays = []) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    let workingDays = 0;
    
    for (let date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const dateString = date.toISOString().split('T')[0];
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip holidays
        if (!holidays.includes(dateString)) {
          workingDays++;
        }
      }
    }
    
    return workingDays;
  },

  // Format leave status for display
  formatStatus: (status) => {
    const statusMap = {
      'Pending': { text: 'Pending', color: 'amber', icon: '⏳' },
      'Approved': { text: 'Approved', color: 'green', icon: '✅' },
      'Rejected': { text: 'Rejected', color: 'red', icon: '❌' },
      'Cancelled': { text: 'Cancelled', color: 'gray', icon: '⚫' },
      'Revoked': { text: 'Revoked', color: 'purple', icon: '🔄' }
    };
    
    return statusMap[status] || { text: status, color: 'gray', icon: '❓' };
  },

  // Get leave type color
  getLeaveTypeColor: (leaveType) => {
    const colorMap = {
      'Annual Leave': 'blue',
      'Sick Leave': 'red',
      'Casual Leave': 'green',
      'Maternity Leave': 'pink',
      'Paternity Leave': 'indigo',
      'Emergency Leave': 'orange',
      'Study Leave': 'purple',
      'Compensatory Leave': 'yellow'
    };
    
    return colorMap[leaveType] || 'gray';
  },

  // Validate leave dates
  validateDates: (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const errors = [];

    if (from < today) {
      errors.push('From date cannot be in the past');
    }

    if (to < from) {
      errors.push('To date cannot be before from date');
    }

    const daysDiff = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      errors.push('Leave duration cannot exceed 1 year');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Format leave period for display
  formatPeriod: (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    if (from.toDateString() === to.toDateString()) {
      return from.toLocaleDateString('en-US', options);
    }
    
    return `${from.toLocaleDateString('en-US', options)} - ${to.toLocaleDateString('en-US', options)}`;
  }
};

// ================================
// LEAVE CONSTANTS
// ================================

export const LEAVE_CONSTANTS = {
  STATUS: {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
    REVOKED: 'Revoked'
  },
  
  TYPES: {
    ANNUAL: 'Annual Leave',
    SICK: 'Sick Leave',
    CASUAL: 'Casual Leave',
    MATERNITY: 'Maternity Leave',
    PATERNITY: 'Paternity Leave',
    EMERGENCY: 'Emergency Leave',
    STUDY: 'Study Leave',
    COMPENSATORY: 'Compensatory Leave'
  },
  
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee'
  }
};