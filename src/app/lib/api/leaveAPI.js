// src/app/lib/api/leaveAPI.js
import apiClient from "../apiClient";

export const leaveAPI = {
  // ================================
  // EMPLOYEE OPERATIONS
  // ================================

  // Apply for leave
  apply: async (data) => {
    try {
      console.log('Applying for leave with data:', data);
      const response = await apiClient.post('/leaves/apply', data);
      console.log('Leave application response:', response);
      return response;
    } catch (error) {
      console.error('Error applying for leave:', error);
      throw error;
    }
  },

  // Cancel leave
  cancel: async (leaveId) => {
    try {
      console.log('Cancelling leave:', leaveId);
      const response = await apiClient.put(`/leaves/${leaveId}/cancel`);
      console.log('Cancel leave response:', response);
      return response;
    } catch (error) {
      console.error('Error cancelling leave:', error);
      throw error;
    }
  },

  // Get employee's leaves with pagination and filters
  getEmployeeLeaves: async (employeeId, params = {}) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const searchParams = new URLSearchParams();
      
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          searchParams.append(key, params[key]);
        }
      });

      const queryString = searchParams.toString();
      const url = `/leaves/employee/${id}${queryString ? `?${queryString}` : ''}`;
      
      console.log('Getting employee leaves:', url);
      const response = await apiClient.get(url);
      console.log('Employee leaves response:', response);
      return response;
    } catch (error) {
      console.error('Error getting employee leaves:', error);
      throw error;
    }
  },

  // Get leave balance
  getBalance: async (employeeId, year = null) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const params = year ? { year } : {};
      const url = `/leaves/balance/${id}`;
      
      console.log('Getting leave balance:', url);
      const response = await apiClient.get(url, params);
      console.log('Leave balance response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave balance:', error);
      throw error;
    }
  },

  // ================================
  // MANAGER/ADMIN OPERATIONS
  // ================================

  // Get pending leaves for approval
  getPending: async (params = {}) => {
    try {
      const url = '/leaves/pending';
      
      console.log('Getting pending leaves:', url, 'with params:', params);
      const response = await apiClient.get(url, { params });
      console.log('Pending leaves response:', response);
      return response;
    } catch (error) {
      console.error('Error getting pending leaves:', error);
      throw error;
    }
  },

  // Update leave status (approve/reject)
  updateStatus: async (leaveId, data) => {
    try {
      console.log('Updating leave status:', leaveId, data);
      const response = await apiClient.put(`/leaves/${leaveId}/status`, data);
      console.log('Update status response:', response);
      return response;
    } catch (error) {
      console.error('Error updating leave status:', error);
      throw error;
    }
  },

  // Get approved leaves with advanced filtering
  getApprovedLeaves: async (params = {}) => {
    try {
      console.log('getApprovedLeaves called with params:', params);
      
      const url = '/leaves/approved';
      
      console.log('Making API call to:', url);
      
      const response = await apiClient.get(url, { params });
      console.log('✅ Approved leaves response received:', response);
      
      // Ensure the response has the expected structure
      if (response && response.data) {
        console.log('Response data structure:', {
          success: response.data.success,
          dataLength: response.data.data?.length,
          total: response.data.total
        });
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Error getting approved leaves:', error);
      throw error;
    }
  },

  // ================================
  // NEW: LEAVE MODIFICATION OPERATIONS
  // ================================

  // Modify approved leave dates (Admin/Manager only)
  modifyApprovedLeave: async (leaveId, data) => {
    try {
      console.log('Modifying approved leave:', leaveId, data);
      const response = await apiClient.put(`/leaves/${leaveId}/modify`, data);
      console.log('Modify leave response:', response);
      return response;
    } catch (error) {
      console.error('Error modifying leave:', error);
      throw error;
    }
  },

  // Revoke approved leave (Admin only)
  revokeApprovedLeave: async (leaveId, data) => {
    try {
      console.log('Revoking approved leave:', leaveId, data);
      const response = await apiClient.put(`/leaves/${leaveId}/revoke`, data);
      console.log('Revoke leave response:', response);
      return response;
    } catch (error) {
      console.error('Error revoking leave:', error);
      throw error;
    }
  },

  // Get leave modification history
  getLeaveHistory: async (leaveId) => {
    try {
      console.log('Getting leave history:', leaveId);
      const response = await apiClient.get(`/leaves/${leaveId}/history`);
      console.log('Leave history response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave history:', error);
      throw error;
    }
  },

  // ================================
  // DASHBOARD & ANALYTICS
  // ================================

  // Get leave statistics for dashboard
  getStatistics: async (params = {}) => {
    try {
      const url = '/leaves/statistics';
      
      console.log('Getting leave statistics:', url);
      const response = await apiClient.get(url, { params });
      console.log('Leave statistics response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave statistics:', error);
      throw error;
    }
  },

  // Get leave analytics
  getAnalytics: async (params = {}) => {
    try {
      const url = '/leaves/analytics';
      
      console.log('Getting leave analytics:', url);
      const response = await apiClient.get(url, { params });
      console.log('Leave analytics response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave analytics:', error);
      throw error;
    }
  },

  // Export leave data
  exportLeaves: async (params = {}, format = 'excel') => {
    try {
      const exportParams = { ...params, format };
      const url = '/leaves/export';
      
      console.log('Exporting leave data:', url);
      const response = await apiClient.get(url, { 
        params: exportParams,
        responseType: 'blob'
      });
      console.log('Export response:', response);
      return response;
    } catch (error) {
      console.error('Error exporting leave data:', error);
      throw error;
    }
  },

  // ================================
  // BULK OPERATIONS
  // ================================

  // Bulk approve/reject leaves
  bulkUpdateStatus: async (leaveIds, status, remarks = '') => {
    try {
      const data = { leaveIds, status, remarks };
      console.log('Bulk updating leave status:', data);
      const response = await apiClient.put('/leaves/bulk/status', data);
      console.log('Bulk update response:', response);
      return response;
    } catch (error) {
      console.error('Error bulk updating leave status:', error);
      throw error;
    }
  },

  // ================================
  // VALIDATION & UTILITIES
  // ================================

  // Validate leave application before submission
  validateApplication: async (data) => {
    try {
      console.log('Validating leave application:', data);
      const response = await apiClient.post('/leaves/validate', data);
      console.log('Validation response:', response);
      return response;
    } catch (error) {
      console.error('Error validating leave application:', error);
      throw error;
    }
  },

  // Check leave balance availability
  checkBalance: async (employeeId, leaveTypeId, totalDays) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const data = { employeeId: id, leaveTypeId, totalDays };
      console.log('Checking leave balance:', data);
      const response = await apiClient.post('/leaves/check-balance', data);
      console.log('Balance check response:', response);
      return response;
    } catch (error) {
      console.error('Error checking leave balance:', error);
      throw error;
    }
  },

  // Get leave calendar for employee
  getCalendar: async (employeeId, params = {}) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const url = `/leaves/calendar/${id}`;
      
      console.log('Getting leave calendar:', url);
      const response = await apiClient.get(url, { params });
      console.log('Leave calendar response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave calendar:', error);
      throw error;
    }
  },

  // Get team leave calendar (for managers)
  getTeamCalendar: async (params = {}) => {
    try {
      const url = '/leaves/team-calendar';
      
      console.log('Getting team calendar:', url);
      const response = await apiClient.get(url, { params });
      console.log('Team calendar response:', response);
      return response;
    } catch (error) {
      console.error('Error getting team calendar:', error);
      throw error;
    }
  },

  // ================================
  // MOBILE APP SPECIFIC
  // ================================

  // Get today's leave status
  getTodayStatus: async (employeeId) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const url = `/leaves/today/${id}`;
      
      console.log('Getting today status:', url);
      const response = await apiClient.get(url);
      console.log('Today status response:', response);
      return response;
    } catch (error) {
      console.error('Error getting today status:', error);
      throw error;
    }
  },

  // Get upcoming leaves
  getUpcoming: async (employeeId, days = 30) => {
    try {
      const id = Array.isArray(employeeId) ? employeeId[0] : employeeId;
      const params = { days };
      const url = `/leaves/upcoming/${id}`;
      
      console.log('Getting upcoming leaves:', url);
      const response = await apiClient.get(url, { params });
      console.log('Upcoming leaves response:', response);
      return response;
    } catch (error) {
      console.error('Error getting upcoming leaves:', error);
      throw error;
    }
  }
};

// ================================
// DROPDOWN API (for Leave Types)
// ================================
export const dropdownAPI = {
  // Get leave types specifically for leave functionality
  getLeaveTypes: async () => {
    try {
      console.log('Getting leave types from dropdown API');
      const response = await apiClient.get('/dropdowns/leave-types');
      console.log('Leave types response:', response);
      return response;
    } catch (error) {
      console.error('Error getting leave types:', error);
      throw error;
    }
  },

  // Get departments for filtering
  getDepartments: async (companyId) => {
    try {
      const params = companyId ? { companyId } : {};
      const response = await apiClient.get('/dropdowns/departments', { params });
      return response;
    } catch (error) {
      console.error('Error getting departments:', error);
      throw error;
    }
  },

  // Get employees for filtering
  getEmployees: async (companyId, departmentId) => {
    try {
      const params = {};
      if (companyId) params.companyId = companyId;
      if (departmentId) params.departmentId = departmentId;
      const response = await apiClient.get('/dropdowns/employees', { params });
      return response;
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
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
  formatStatus: (status, isRevoked = false) => {
    if (isRevoked) {
      return { text: 'Revoked', color: 'red', icon: '🔄' };
    }
    
    const statusMap = {
      'Pending': { text: 'Pending', color: 'amber', icon: '⏳' },
      'Approved': { text: 'Approved', color: 'green', icon: '✅' },
      'Rejected': { text: 'Rejected', color: 'red', icon: '❌' },
      'Cancelled': { text: 'Cancelled', color: 'gray', icon: '⚫' }
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
  },

  // Check if leave can be modified (12-hour rule)
  canModifyLeave: (leave, userRole) => {
    if (!['admin', 'manager'].includes(userRole)) return false;
    if (leave.IsRevoked) return false;
    
    const now = new Date();
    const leaveStartDate = new Date(leave.FromDate);
    const hoursDifference = (leaveStartDate.getTime() - now.getTime()) / (1000 * 3600);
    
    return hoursDifference >= 12;
  },

  // Check if leave can be revoked (12-hour rule, admin only)
  canRevokeLeave: (leave, userRole) => {
    if (userRole !== 'admin') return false;
    if (leave.IsRevoked) return false;
    
    const now = new Date();
    const leaveStartDate = new Date(leave.FromDate);
    const hoursDifference = (leaveStartDate.getTime() - now.getTime()) / (1000 * 3600);
    
    return hoursDifference >= 12;
  },

  // Get time remaining for modification/revocation
  getTimeRemaining: (leave) => {
    const now = new Date();
    const leaveStartDate = new Date(leave.FromDate);
    const hoursDifference = (leaveStartDate.getTime() - now.getTime()) / (1000 * 3600);
    
    if (hoursDifference < 12) {
      return {
        canModify: false,
        message: `Cannot modify/revoke (${Math.max(0, Math.floor(hoursDifference))} hours remaining, need 12+)`
      };
    }
    
    return {
      canModify: true,
      message: `${Math.floor(hoursDifference)} hours remaining to modify/revoke`
    };
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
  },

  MODIFICATION_TYPES: {
    DATE_CHANGE: 'DateChange',
    STATUS_CHANGE: 'StatusChange',
    REVOCATION: 'Revocation'
  },

  TIME_LIMITS: {
    MODIFICATION_HOURS: 12,
    REVOCATION_HOURS: 12
  }
};

export default leaveAPI;