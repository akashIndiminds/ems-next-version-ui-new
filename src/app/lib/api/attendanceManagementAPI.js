// =====================================================
// FRONTEND API CLIENT FOR ATTENDANCE MANAGEMENT
// =====================================================

// src/app/lib/api/attendanceManagementAPI.js
import apiClient from "../apiClient";

export const attendanceManagementAPI = {
  // ================================
  // EMPLOYEE ATTENDANCE MANAGEMENT
  // ================================

  // Get employee attendance for a specific date
  getEmployeeAttendanceByDate: async (employeeId, date) => {
    try {
      console.log('Getting employee attendance for:', { employeeId, date });
      const response = await apiClient.get('/attendance-management/employee-attendance', {
        employeeId,
        date
      });
      console.log('Employee attendance response:', response);
      return response;
    } catch (error) {
      console.error('Error getting employee attendance:', error);
      throw error;
    }
  },

  // Set/Create new attendance record
  setEmployeeAttendance: async (data) => {
    try {
      console.log('Setting employee attendance:', data);
      const response = await apiClient.post('/attendance-management/set-attendance', data);
      console.log('Set attendance response:', response);
      return response;
    } catch (error) {
      console.error('Error setting employee attendance:', error);
      throw error;
    }
  },

  // Update existing attendance record
  updateEmployeeAttendance: async (attendanceId, data) => {
    try {
      console.log('Updating employee attendance:', { attendanceId, data });
      const response = await apiClient.put(`/attendance-management/update-attendance/${attendanceId}`, data);
      console.log('Update attendance response:', response);
      return response;
    } catch (error) {
      console.error('Error updating employee attendance:', error);
      throw error;
    }
  },

  // Delete attendance record
  deleteEmployeeAttendance: async (attendanceId) => {
    try {
      console.log('Deleting employee attendance:', attendanceId);
      const response = await apiClient.delete(`/attendance-management/delete-attendance/${attendanceId}`);
      console.log('Delete attendance response:', response);
      return response;
    } catch (error) {
      console.error('Error deleting employee attendance:', error);
      throw error;
    }
  },

  // Get employees list for dropdown
  getEmployeesList: async (params = {}) => {
    try {
      console.log('Getting employees list:', params);
      const response = await apiClient.get('/attendance-management/employees-list', params);
      console.log('Employees list response:', response);
      return response;
    } catch (error) {
      console.error('Error getting employees list:', error);
      throw error;
    }
  },

  // Get attendance summary for multiple employees
  getAttendanceSummary: async (params = {}) => {
    try {
      console.log('Getting attendance summary:', params);
      const response = await apiClient.get('/attendance-management/attendance-summary', params);
      console.log('Attendance summary response:', response);
      return response;
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      throw error;
    }
  }
};

// ================================
// ATTENDANCE MANAGEMENT UTILITIES
// ================================

export const attendanceManagementUtils = {
  // Format time for display (HH:MM AM/PM)
  formatTime: (timeString) => {
    if (!timeString) return '-';
    
    try {
      const time = new Date(`1970-01-01 ${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  },

  // Format time for input (HH:MM 24-hour format)
  formatTimeForInput: (timeString) => {
    if (!timeString) return '';
    
    try {
      // If it's already in HH:MM format, return as is
      if (timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      
      // If it's a full datetime, extract time part
      const time = new Date(timeString);
      return time.toTimeString().slice(0, 5); // HH:MM
    } catch (error) {
      return '';
    }
  },

  // Calculate working hours between two times
  calculateWorkingHours: (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return 0;
    
    try {
      const checkIn = new Date(`1970-01-01 ${checkInTime}`);
      const checkOut = new Date(`1970-01-01 ${checkOutTime}`);
      const diffMs = checkOut - checkIn;
      const diffHours = diffMs / (1000 * 60 * 60);
      return Math.max(0, Math.round(diffHours * 100) / 100); // Round to 2 decimal places
    } catch (error) {
      return 0;
    }
  },

  // Get attendance status color for UI
  getAttendanceStatusColor: (status) => {
    const statusColors = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Absent': 'bg-red-100 text-red-800 border-red-200',
      'Late': 'bg-amber-100 text-amber-800 border-amber-200',
      'HalfDay': 'bg-blue-100 text-blue-800 border-blue-200',
      'OnLeave': 'bg-purple-100 text-purple-800 border-purple-200',
      'No Record': 'bg-gray-100 text-gray-800 border-gray-200',
      'Checked In': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Complete': 'bg-green-100 text-green-800 border-green-200'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  },

  // Get attendance status icon
  getAttendanceStatusIcon: (status) => {
    const statusIcons = {
      'Present': '✅',
      'Absent': '❌',
      'Late': '⏰',
      'HalfDay': '🕐',
      'OnLeave': '🏖️',
      'No Record': '📝',
      'Checked In': '🔄',
      'Complete': '✅'
    };
    
    return statusIcons[status] || '❓';
  },

  // Validate attendance data
  validateAttendanceData: (data) => {
    const errors = [];
    
    if (!data.employeeId) {
      errors.push('Employee is required');
    }
    
    if (!data.attendanceDate) {
      errors.push('Attendance date is required');
    }
    
    if (!data.attendanceStatus) {
      errors.push('Attendance status is required');
    }
    
    // If check-in and check-out times are provided, validate them
    if (data.checkInTime && data.checkOutTime) {
      const checkIn = new Date(`1970-01-01 ${data.checkInTime}`);
      const checkOut = new Date(`1970-01-01 ${data.checkOutTime}`);
      
      if (checkOut <= checkIn) {
        errors.push('Check-out time must be after check-in time');
      }
    }
    
    // Check if attendance date is not in the future
    const attendanceDate = new Date(data.attendanceDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (attendanceDate > today) {
      errors.push('Attendance date cannot be in the future');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  },

  // Format date for input (YYYY-MM-DD)
  formatDateForInput: (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  }
};

// ================================
// ATTENDANCE MANAGEMENT CONSTANTS
// ================================

export const ATTENDANCE_CONSTANTS = {
  STATUS: {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    HALF_DAY: 'HalfDay',
    ON_LEAVE: 'OnLeave'
  },
  
  STATUS_OPTIONS: [
    { value: 'Present', label: 'Present', icon: '✅' },
    { value: 'Absent', label: 'Absent', icon: '❌' },
    { value: 'Late', label: 'Late', icon: '⏰' },
    { value: 'HalfDay', label: 'Half Day', icon: '🕐' },
    { value: 'OnLeave', label: 'On Leave', icon: '🏖️' }
  ],
  
  TIME_FORMAT: {
    DISPLAY: 'h:mm A', // 12-hour format for display
    INPUT: 'HH:mm',    // 24-hour format for input
    API: 'HH:mm:ss'    // Full time format for API
  }
};