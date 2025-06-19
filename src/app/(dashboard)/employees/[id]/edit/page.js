// src/app/(dashboard)/employees/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, departmentAPI } from '@/app/lib/api';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function EditEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 🔧 FIX: Initial state mein isActive undefined rakha, actual value load hone tak
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    departmentId: '',
    designationId: '',
    locationId: '',
    dateOfBirth: '',
    dateOfJoining: '',
    gender: 'Male',
    isActive: undefined, // ✅ Initially undefined, actual value se set hoga
    employeeCode: '',
    address: '',
    emergencyContact: '',
    bloodGroup: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    fetchEmployeeDetails();
    fetchDepartments();
  }, [employeeId, user]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(employeeId);
      if (response.data.success) {
        const emp = response.data.data;
        setEmployee(emp);
        
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // 🔧 FIX: Database se actual IsActive value set kar rahe hain
        // Database se true/false ya 1/0 dono handle kar rahe hain
        const actualIsActive = emp.IsActive === true || emp.IsActive === 1;
        
        console.log('🔍 Employee Status Debug:', {
          'Database IsActive': emp.IsActive,
          'Type of IsActive': typeof emp.IsActive,
          'Converted isActive': actualIsActive,
          'Should be Active': actualIsActive ? 'YES' : 'NO'
        });

        setFormData({
          firstName: emp.FirstName || '',
          lastName: emp.LastName || '',
          email: emp.Email || '',
          mobileNumber: emp.MobileNumber || '',
          departmentId: emp.DepartmentID || '',
          designationId: emp.DesignationID || '',
          locationId: emp.LocationID || '',
          dateOfBirth: formatDate(emp.DateOfBirth),
          dateOfJoining: formatDate(emp.DateOfJoining),
          gender: emp.Gender || 'Male',
          isActive: actualIsActive, // ✅ Actual database value
          employeeCode: emp.EmployeeCode || '',
          address: emp.Address || '',
          emergencyContact: emp.EmergencyContact || '',
          bloodGroup: emp.BloodGroup || ''
        });
      } else {
        toast.error('Employee not found');
        router.push('/employees');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error('Failed to load employee details');
      router.push('/employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getByCompany(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        FirstName: formData.firstName.trim(),
        LastName: formData.lastName.trim(),
        Email: formData.email.trim(),
        MobileNumber: formData.mobileNumber.trim(),
        DepartmentID: parseInt(formData.departmentId),
        DesignationID: parseInt(formData.designationId),
        LocationID: parseInt(formData.locationId),
        DateOfBirth: formData.dateOfBirth || null,
        DateOfJoining: formData.dateOfJoining || null,
        Gender: formData.gender,
        IsActive: formData.isActive ? 1 : 0, // ✅ Correct conversion
        Address: formData.address.trim(),
        EmergencyContact: formData.emergencyContact.trim(),
        BloodGroup: formData.bloodGroup
      };

      console.log('🚀 Update Data:', {
        'Form isActive': formData.isActive,
        'Sending IsActive': updateData.IsActive
      });

      const response = await employeeAPI.update(employeeId, updateData);
      
      if (response.data.success) {
        toast.success('Employee updated successfully!');
        router.push('/employees');
      } else {
        toast.error(response.data.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    // 🔧 FIX: Status change ki debug logging
    if (field === 'isActive') {
      console.log('📝 Status Change:', {
        'Previous': formData.isActive,
        'New': value,
        'Type': typeof value
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 🔧 FIX: Loading state mein proper skeleton
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Employee not found</p>
          <button
            onClick={() => router.push('/employees')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  // 🔧 FIX: Form data load hone tak wait karo
  if (formData.isActive === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/employees')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Employee
              </h1>
              <p className="mt-1 text-gray-600">
                Update {employee.FirstName} {employee.LastName}'s information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Employee Code:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {employee.EmployeeCode}
            </span>
            {/* 🔧 FIX: Current status indicator */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              formData.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {employee.FirstName?.[0]}{employee.LastName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h2>
                <p className="text-gray-600">{employee.DepartmentName}</p>
                {/* 🔧 FIX: Database status display */}
                <p className={`text-sm font-medium ${
                  employee.IsActive === true || employee.IsActive === 1 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Database Status: {employee.IsActive === true || employee.IsActive === 1 ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdateEmployee} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FiUser className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FiMail className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FiBriefcase className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.departmentId}
                      onChange={(e) => handleInputChange('departmentId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.DepartmentID} value={dept.DepartmentID}>
                          {dept.DepartmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                    <input
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* 🔧 FIX: Improved Status Section with Current Value Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Status
                    </label>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 mb-2">
                        Current: {formData.isActive ? '✅ Active' : '❌ Inactive'}
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            checked={formData.isActive === true}
                            onChange={() => handleInputChange('isActive', true)}
                            className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 font-medium">
                            ✅ Active
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            checked={formData.isActive === false}
                            onChange={() => handleInputChange('isActive', false)}
                            className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 font-medium">
                            ❌ Inactive
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note & Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              {/* 🔧 FIX: Status change warning */}
              {formData.isActive !== (employee.IsActive === true || employee.IsActive === 1) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="text-sm text-yellow-700">
                    <strong>⚠️ Status Change Detected:</strong> 
                    {(employee.IsActive === true || employee.IsActive === 1) ? ' Deactivating' : ' Activating'} this employee 
                    {formData.isActive ? ' will grant' : ' will revoke'} system access.
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-amber-700">
                  <strong>Note:</strong> Employee Code cannot be modified • Changes will be reflected immediately • Employee will be notified of profile updates
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/employees')}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Update Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}