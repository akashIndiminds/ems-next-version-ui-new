'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceManagementAPI, attendanceManagementUtils, ATTENDANCE_CONSTANTS } from '@/app/lib/api/attendanceManagementAPI';
import { dropdownAPI } from '@/app/lib/api';
import { 
  FiUser, FiCalendar, FiClock, FiSave, FiTrash2, FiEdit3, 
  FiRefreshCw, FiSearch, FiAlertCircle, FiCheckCircle,
  FiXCircle, FiEye
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function SetAttendanceStatusPage() {
  const { user } = useAuth();
  
  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form data for attendance
  const [formData, setFormData] = useState({
    checkInTime: '',
    checkOutTime: '',
    attendanceStatus: 'Present',
    remarks: ''
  });
  
  // UI states
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Check if user can manage attendance
  const canManageAttendance = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    if (canManageAttendance) {
      fetchEmployees();
    }
  }, [canManageAttendance]);

  // Fetch employees list
  const fetchEmployees = async (search = '') => {
    try {
      setSearching(true);
      const params = {};
      
      if (user?.companyId) {
        params.companyId = user.companyId;
      }
      
      if (search) {
        params.search = search;
      }
      
      const response = await attendanceManagementAPI.getEmployeesList(params);
      
      if (response.data.success) {
        setEmployees(response.data.data || []);
      } else {
        console.error('Failed to fetch employees:', response.data.message);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      setEmployees([]);
    } finally {
      setSearching(false);
    }
  };

  // Fetch attendance data for selected employee and date
  const fetchAttendanceData = async () => {
    if (!selectedEmployee || !selectedDate) {
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceManagementAPI.getEmployeeAttendanceByDate(
        selectedEmployee, 
        selectedDate
      );
      
      if (response.data.success) {
        const data = response.data.data;
        setAttendanceData(data);
        
        // Populate form with existing data or defaults
        if (data.attendance.attendanceId) {
          setFormData({
            checkInTime: attendanceManagementUtils.formatTimeForInput(data.attendance.checkInTime) || '',
            checkOutTime: attendanceManagementUtils.formatTimeForInput(data.attendance.checkOutTime) || '',
            attendanceStatus: data.attendance.attendanceStatus || 'Present',
            remarks: data.attendance.remarks || ''
          });
          setIsEditMode(true);
        } else {
          // Reset form for new record
          setFormData({
            checkInTime: '',
            checkOutTime: '',
            attendanceStatus: data.context.isOnLeave ? 'OnLeave' : 'Present',
            remarks: ''
          });
          setIsEditMode(false);
        }
      } else {
        console.error('Failed to fetch attendance data:', response.data.message);
        toast.error(response.data.message || 'Failed to load attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    setShowEmployeeSearch(false);
    setAttendanceData(null);
    setFormData({
      checkInTime: '',
      checkOutTime: '',
      attendanceStatus: 'Present',
      remarks: ''
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedDate) {
      toast.error('Please select employee and date');
      return;
    }

    // Validate form data
    const validation = attendanceManagementUtils.validateAttendanceData({
      employeeId: selectedEmployee,
      attendanceDate: selectedDate,
      ...formData
    });

    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    try {
      setSaving(true);
      
      const submitData = {
        employeeId: selectedEmployee,
        attendanceDate: selectedDate,
        checkInTime: formData.checkInTime || null,
        checkOutTime: formData.checkOutTime || null,
        attendanceStatus: formData.attendanceStatus,
        remarks: formData.remarks || null
      };

      let response;
      
      if (isEditMode && attendanceData?.attendance?.attendanceId) {
        // Update existing record
        response = await attendanceManagementAPI.updateEmployeeAttendance(
          attendanceData.attendance.attendanceId,
          {
            checkInTime: submitData.checkInTime,
            checkOutTime: submitData.checkOutTime,
            attendanceStatus: submitData.attendanceStatus,
            remarks: submitData.remarks
          }
        );
      } else {
        // Create new record
        response = await attendanceManagementAPI.setEmployeeAttendance(submitData);
      }
      
      if (response.data.success) {
        toast.success(isEditMode ? 'Attendance updated successfully' : 'Attendance set successfully');
        // Refresh data
        fetchAttendanceData();
      } else {
        toast.error(response.data.message || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete attendance
  const handleDelete = async () => {
    if (!attendanceData?.attendance?.attendanceId) {
      return;
    }

    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await attendanceManagementAPI.deleteEmployeeAttendance(
        attendanceData.attendance.attendanceId
      );
      
      if (response.data.success) {
        toast.success('Attendance record deleted successfully');
        // Refresh data
        fetchAttendanceData();
      } else {
        toast.error(response.data.message || 'Failed to delete attendance');
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to delete attendance');
    } finally {
      setSaving(false);
    }
  };

  // Calculate working hours when times change
  const calculateWorkingHours = () => {
    if (formData.checkInTime && formData.checkOutTime) {
      return attendanceManagementUtils.calculateWorkingHours(
        formData.checkInTime, 
        formData.checkOutTime
      );
    }
    return 0;
  };

  // Handle employee search
  const handleEmployeeSearch = (searchTerm) => {
    setEmployeeSearchTerm(searchTerm);
    if (searchTerm.length >= 2) {
      fetchEmployees(searchTerm);
    } else {
      fetchEmployees();
    }
  };

  // Get selected employee details
  const getSelectedEmployeeDetails = () => {
    return employees.find(emp => emp.EmployeeID == selectedEmployee);
  };

  // Redirect if user doesn't have permission
  if (!canManageAttendance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Access Denied</div>
          <p className="text-sm text-gray-600">You don't have permission to manage attendance.</p>
        </div>
      </div>
    );
  }

  const selectedEmployeeDetails = getSelectedEmployeeDetails();
  const workingHours = calculateWorkingHours();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Set Attendance Status
            </h1>
            <p className="mt-2 text-gray-600">
              Manage employee attendance records for any date
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAttendanceData}
              disabled={!selectedEmployee || !selectedDate || loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-lg font-medium disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>
        </div>

        {/* Employee and Date Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiSearch className="mr-3 text-blue-600" />
              Employee & Date Selection
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmployeeSearch(true)}
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-colors duration-200"
                  >
                    {selectedEmployeeDetails ? (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedEmployeeDetails.EmployeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedEmployeeDetails.EmployeeCode} • {selectedEmployeeDetails.DepartmentName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Click to select employee...</span>
                    )}
                  </button>

                  {/* Employee Search Modal */}
                  {showEmployeeSearch && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowEmployeeSearch(false)}></div>
                        
                        <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Select Employee</h3>
                            <div className="mt-3 relative">
                              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search employees..."
                                value={employeeSearchTerm}
                                onChange={(e) => handleEmployeeSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              />
                            </div>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {searching ? (
                              <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                              </div>
                            ) : employees.length > 0 ? (
                              employees.map((employee) => (
                                <button
                                  key={employee.EmployeeID}
                                  onClick={() => handleEmployeeSelect(employee.EmployeeID)}
                                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                >
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <FiUser className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {employee.EmployeeName}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {employee.EmployeeCode} • {employee.DepartmentName}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                No employees found
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => setShowEmployeeSearch(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attendance Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Fetch Button */}
            {selectedEmployee && selectedDate && (
              <div className="flex justify-center">
                <button
                  onClick={fetchAttendanceData}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-lg font-medium disabled:opacity-50"
                >
                  <FiEye className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'View Attendance'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Data Display */}
        {attendanceData && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiUser className="mr-3 text-purple-600" />
                Attendance Details
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-600">Employee</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {attendanceData.employee.employeeName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {attendanceData.employee.employeeCode}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Department</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {attendanceData.employee.departmentName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Date</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {attendanceManagementUtils.formatDate(selectedDate)}
                  </div>
                </div>
              </div>

              {/* Context Information */}
              {(attendanceData.context.isHoliday || attendanceData.context.isOnLeave) && (
                <div className="space-y-3">
                  {attendanceData.context.isHoliday && (
                    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div className="text-sm text-yellow-800">
                        This date is marked as a holiday
                      </div>
                    </div>
                  )}
                  
                  {attendanceData.context.isOnLeave && (
                    <div className="flex items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <FiAlertCircle className="h-5 w-5 text-purple-600 mr-3" />
                      <div className="text-sm text-purple-800">
                        Employee is on {attendanceData.context.leaveDetails?.LeaveTypeName || 'leave'} for this date
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Current Attendance Status */}
              {attendanceData.attendance.attendanceId ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Attendance Record Exists
                        </div>
                        <div className="text-xs text-green-600">
                          Status: {attendanceData.attendance.attendanceStatus} • 
                          Working Hours: {attendanceData.attendance.workingHours || 0}h
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                      attendanceManagementUtils.getAttendanceStatusColor(attendanceData.attendance.attendanceStatus)
                    }`}>
                      {attendanceManagementUtils.getAttendanceStatusIcon(attendanceData.attendance.attendanceStatus)} 
                      {attendanceData.attendance.attendanceStatus}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center">
                    <FiAlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                    <div className="text-sm font-medium text-orange-800">
                      No attendance record found for this date
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in Time
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={formData.checkInTime}
                        onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>

                  {/* Check-out Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out Time
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        value={formData.checkOutTime}
                        onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours Display */}
                {workingHours > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800">
                      <strong>Calculated Working Hours:</strong> {workingHours} hours
                    </div>
                  </div>
                )}

                {/* Attendance Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attendance Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {ATTENDANCE_CONSTANTS.STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({...formData, attendanceStatus: option.value})}
                        className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
                          formData.attendanceStatus === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-lg mb-1">{option.icon}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    rows="3"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Optional remarks about this attendance record..."
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.remarks.length}/500 characters
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    {isEditMode && attendanceData?.attendance?.attendanceId && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 flex items-center transition-colors duration-200 shadow-lg font-medium disabled:opacity-50"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Delete Record
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          checkInTime: '',
                          checkOutTime: '',
                          attendanceStatus: 'Present',
                          remarks: ''
                        });
                      }}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 flex items-center transition-colors duration-200 font-medium"
                    >
                      <FiXCircle className="mr-2 h-4 w-4" />
                      Reset
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving || !formData.attendanceStatus}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-lg font-medium disabled:opacity-50"
                    >
                      <FiSave className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : isEditMode ? 'Update Attendance' : 'Set Attendance'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FiAlertCircle className="mr-2 h-5 w-5" />
            How to Use
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Select Employee:</strong> Choose the employee from the dropdown</p>
            <p>• <strong>Choose Date:</strong> Select the attendance date (cannot be future date)</p>
            <p>• <strong>View Data:</strong> Click "View Attendance" to load existing data</p>
            <p>• <strong>Set/Update:</strong> Fill in the times and status, then save</p>
            <p>• <strong>Delete:</strong> Remove attendance records if needed (admin only)</p>
          </div>
        </div>
      </div>
    </div>
  );
}