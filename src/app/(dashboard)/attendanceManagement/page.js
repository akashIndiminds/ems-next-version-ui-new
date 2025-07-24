// src/app/(dashboard)/attendance-management/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceManagementAPI, attendanceManagementUtils, ATTENDANCE_CONSTANTS } from '@/app/lib/api/attendanceManagementAPI';
import { FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Import responsive components
import MobileEmployeeSelection from '@/components/attendanceManagement/MobileEmployeeSelection';
import DesktopEmployeeSelection from '@/components/attendanceManagement/DesktopEmployeeSelection';
import MobileAttendanceDetails from '@/components/attendanceManagement/MobileAttendanceDetails';
import DesktopAttendanceDetails from '@/components/attendanceManagement/DesktopAttendanceDetails';

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

  // Handle reset form
  const handleReset = () => {
    setFormData({
      checkInTime: '',
      checkOutTime: '',
      attendanceStatus: 'Present',
      remarks: ''
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Set Attendance Status
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage employee attendance records for any date
            </p>
          </div>
        </div>

        {/* Employee and Date Selection - Mobile Version */}
        <MobileEmployeeSelection 
          selectedEmployee={selectedEmployee}
          selectedDate={selectedDate}
          employees={employees}
          searching={searching}
          loading={loading}
          onEmployeeSelect={handleEmployeeSelect}
          onDateChange={setSelectedDate}
          onFetchData={fetchAttendanceData}
          getSelectedEmployeeDetails={getSelectedEmployeeDetails}
          fetchEmployees={fetchEmployees}
        />

        {/* Employee and Date Selection - Desktop Version */}
        <DesktopEmployeeSelection 
          selectedEmployee={selectedEmployee}
          selectedDate={selectedDate}
          employees={employees}
          searching={searching}
          loading={loading}
          onEmployeeSelect={handleEmployeeSelect}
          onDateChange={setSelectedDate}
          onFetchData={fetchAttendanceData}
          getSelectedEmployeeDetails={getSelectedEmployeeDetails}
          fetchEmployees={fetchEmployees}
        />

        {/* Attendance Data Display */}
        {attendanceData && (
          <>
            {/* Mobile Attendance Details */}
            <MobileAttendanceDetails 
              attendanceData={attendanceData}
              selectedDate={selectedDate}
              formData={formData}
              setFormData={setFormData}
              isEditMode={isEditMode}
              saving={saving}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onReset={handleReset}
              attendanceManagementUtils={attendanceManagementUtils}
              ATTENDANCE_CONSTANTS={ATTENDANCE_CONSTANTS}
            />

            {/* Desktop Attendance Details */}
            <DesktopAttendanceDetails 
              attendanceData={attendanceData}
              selectedDate={selectedDate}
              formData={formData}
              setFormData={setFormData}
              isEditMode={isEditMode}
              saving={saving}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onReset={handleReset}
              attendanceManagementUtils={attendanceManagementUtils}
              ATTENDANCE_CONSTANTS={ATTENDANCE_CONSTANTS}
            />
          </>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
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