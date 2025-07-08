// src/app/lib/api/reportsAPI.js
import api from '../api'; // Import your existing API instance

export const reportsAPI = {
  // Attendance Reports
  getAttendanceReport: (params) => 
    api.get('/reports/attendance', { params }),

  // Leave Reports
  getLeaveReport: (params) => 
    api.get('/reports/leave', { params }),

  // Employee Reports
  getEmployeeReport: (params) => 
    api.get('/reports/employee', { params }),

  getEmployeeDetailedReport: (employeeId, params) => 
    api.get(`/reports/employee/${employeeId}/detailed`, { params }),

  // Department Reports
  getDepartmentReport: (params) => 
    api.get('/reports/department', { params }),

  // Monthly Reports
  getMonthlyReport: (params) => 
    api.get('/reports/monthly', { params }),

  // Dashboard Analytics
  getDashboardAnalytics: (params) => 
    api.get('/reports/dashboard', { params }),

  // Performance Analytics
  getPerformanceAnalytics: (params) => 
    api.get('/reports/performance', { params }),

  // Late Arrival Trends
  getLateArrivalTrends: (params) => 
    api.get('/reports/late-trends', { params }),

  // Export Reports
  exportReport: (params) => 
    api.get('/reports/export', { params }),

  // Utility methods using your existing API structure
  getDepartments: (companyId) => {
    const id = Array.isArray(companyId) ? companyId[0] : companyId;
    return api.get(`/departments/company/${id}`, { 
      params: { isActive: true } 
    });
  },

  getEmployees: (companyId, departmentId = null) => {
    const params = { 
      companyId: Array.isArray(companyId) ? companyId[0] : companyId,
      isActive: true 
    };
    if (departmentId) {
      params.departmentId = Array.isArray(departmentId) ? departmentId[0] : departmentId;
    }
    return api.get('/employees', { params });
  },

  getLeaveTypes: () => 
    api.get('/dropdowns/leave-types'),

  // Additional utility methods using existing APIs
  getDesignations: (departmentId = null) => {
    if (departmentId) {
      const id = Array.isArray(departmentId) ? departmentId[0] : departmentId;
      return api.get(`/dropdowns/departments/${id}/designations`);
    }
    return api.get('/dropdowns/designations');
  },

  getLocations: (companyId) => {
    const params = companyId ? { 
      companyId: Array.isArray(companyId) ? companyId[0] : companyId 
    } : {};
    return api.get('/dropdowns/locations', { params });
  },

  // Helper method for getting all dropdown data needed for reports
  async getReportDropdowns(companyId) {
    try {
      const id = Array.isArray(companyId) ? companyId[0] : companyId;
      
      const [
        departmentsRes, 
        employeesRes, 
        leaveTypesRes
      ] = await Promise.all([
        this.getDepartments(id),
        this.getEmployees(id),
        this.getLeaveTypes()
      ]);
      
      return {
        departments: departmentsRes.data.data || [],
        employees: employeesRes.data.data || [],
        leaveTypes: leaveTypesRes.data.data || []
      };
    } catch (error) {
      console.error('Error fetching report dropdown data:', error);
      throw error;
    }
  }
};