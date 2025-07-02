// src/app/(dashboard)/employees/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, departmentAPI, dropdownAPI } from '@/app/lib/api';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiHeart, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { locationAPI } from '@/app/lib/api/locationAPI';
export default function EditEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showCustomDesignation, setShowCustomDesignation] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    departmentId: '',
    designationId: '',
    customDesignation: '',
    locationId: '',
    dateOfBirth: '',
    dateOfJoining: '',
    gender: 'Male',
    isActive: undefined,
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
    fetchLocations();
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
          customDesignation: '',
          locationId: emp.LocationID || '',
          dateOfBirth: formatDate(emp.DateOfBirth),
          dateOfJoining: formatDate(emp.DateOfJoining),
          gender: emp.Gender || 'Male',
          isActive: actualIsActive,
          employeeCode: emp.EmployeeCode || '',
          address: emp.Address || '',
          emergencyContact: emp.EmergencyContact || '',
          bloodGroup: emp.BloodGroup || ''
        });

        // Fetch designations for the current department
        if (emp.DepartmentID) {
          fetchDesignationsByDepartment(emp.DepartmentID);
        }
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

  // Fetch locations using the correct API endpoint
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      
      // Use the locationAPI directly instead of dropdownAPI
      const response = await locationAPI.getByCompany(user.company.companyId);
      
      if (response.data.success) {
        setLocations(response.data.data);
      } else {
        setLocations([]);
        toast.error('Failed to load locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
      
      // Handle different error scenarios
      if (error.response?.status === 404) {
        toast.error('No locations found for your company. Please contact admin.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view locations.');
      } else {
        toast.error('Failed to load locations. Please try again.');
      }
    } finally {
      setLoadingLocations(false);
    }
  };

  // Fetch designations based on selected department
  const fetchDesignationsByDepartment = async (departmentId) => {
    if (!departmentId) {
      setDesignations([]);
      setShowCustomDesignation(false);
      return;
    }

    try {
      setLoadingDesignations(true);
      // Use the dropdown API for department designations
      const response = await dropdownAPI.getDesignationsByDepartment(departmentId);
      
      if (response.data.success) {
        setDesignations(response.data.data);
        setShowCustomDesignation(response.data.data.length === 0);
        
        if (response.data.data.length === 0) {
          toast.info('No designations found for this department. You can add a custom designation.');
        }
      } else {
        setDesignations([]);
        setShowCustomDesignation(true);
        toast.info('No designations found for this department. You can add a custom designation.');
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      setDesignations([]);
      setShowCustomDesignation(true);
      toast.error('Failed to load designations. You can add a custom designation.');
    } finally {
      setLoadingDesignations(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.departmentId) {
      toast.error('Please select a department');
      return;
    }

    if (!formData.locationId) {
      toast.error('Please select a location');
      return;
    }

    // Check designation selection
    if (!showCustomDesignation && !formData.designationId) {
      toast.error('Please select a designation');
      return;
    }

    if (showCustomDesignation && !formData.customDesignation.trim()) {
      toast.error('Please enter a custom designation');
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
        LocationID: parseInt(formData.locationId),
        DateOfBirth: formData.dateOfBirth || null,
        DateOfJoining: formData.dateOfJoining || null,
        Gender: formData.gender,
        IsActive: formData.isActive ? 1 : 0,
        Address: formData.address.trim(),
        EmergencyContact: formData.emergencyContact.trim(),
        BloodGroup: formData.bloodGroup
      };

      // Handle designation - convert to number if not custom
      if (showCustomDesignation) {
        // For custom designation, remove designationId and keep customDesignation
        updateData.customDesignation = formData.customDesignation.trim();
      } else {
        // For existing designation, convert ID to number
        updateData.DesignationID = parseInt(formData.designationId);
      }

      console.log('🚀 Update Data:', {
        'Form isActive': formData.isActive,
        'Sending IsActive': updateData.IsActive,
        'Update Data': updateData
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
      
      // Better error handling
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(`Validation Error: ${error.response.data.error}`);
      } else {
        toast.error('Failed to update employee');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
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

    // Handle department change
    if (field === 'departmentId') {
      setFormData(prev => ({
        ...prev,
        designationId: '',
        customDesignation: ''
      }));
      fetchDesignationsByDepartment(value);
    }

    // Handle designation selection
    if (field === 'designationId' && value === 'custom') {
      setShowCustomDesignation(true);
      setFormData(prev => ({
        ...prev,
        designationId: ''
      }));
    } else if (field === 'designationId' && value !== 'custom') {
      setShowCustomDesignation(false);
      setFormData(prev => ({
        ...prev,
        customDesignation: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
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
      <div className="p-6 space-y-8">
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
              <p className="mt-2 text-gray-600">
                Update {employee.FirstName} {employee.LastName}'s information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Employee Code:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {employee.EmployeeCode}
            </span>
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
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {employee.FirstName?.[0]}{employee.LastName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h2>
                <p className="text-gray-600">{employee.DepartmentName}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiUser className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHeart className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiMail className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                      placeholder="Enter emergency contact"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Contact Information</h4>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>• Email cannot be changed if used for login</p>
                    <p>• Mobile number used for notifications</p>
                    <p>• Emergency contact for urgent situations</p>
                    <p>• Changes will be reflected immediately</p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiBriefcase className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => handleInputChange('departmentId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.DepartmentID} value={dept.DepartmentID}>
                        {dept.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation Section */}
                {formData.departmentId && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    {loadingDesignations ? (
                      <div className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                        <span className="text-gray-600">Loading designations...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {designations.length > 0 && !showCustomDesignation && (
                          <select
                            required
                            value={formData.designationId}
                            onChange={(e) => handleInputChange('designationId', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                          >
                            <option value="">Select Designation</option>
                            {designations.map(designation => (
                              <option 
                                key={designation.id} 
                                value={designation.id}  
                              >
                                {designation.label}  
                                {designation.BaseSalary && ` (₹${designation.BaseSalary.toLocaleString()})`}
                              </option>
                            ))}
                            <option value="custom">Others (Specify Custom)</option>
                          </select>
                        )}

                        {(showCustomDesignation || designations.length === 0) && (
                          <div>
                            <input
                              type="text"
                              required
                              value={formData.customDesignation}
                              onChange={(e) => handleInputChange('customDesignation', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                              placeholder="Enter custom designation"
                            />
                            <p className="mt-1 text-xs text-blue-600">
                              A new designation will be created and mapped to this department
                            </p>
                          </div>
                        )}

                        {designations.length > 0 && showCustomDesignation && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomDesignation(false);
                              setFormData(prev => ({ ...prev, customDesignation: '' }));
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            ← Back to available designations
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    {loadingLocations ? (
                      <div className="flex items-center justify-center py-3 px-4 pl-10 border border-gray-300 rounded-xl">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                        <span className="text-gray-600">Loading locations...</span>
                      </div>
                    ) : (
                      <select
                        required
                        value={formData.locationId}
                        onChange={(e) => handleInputChange('locationId', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                      >
                        <option value="">Select Work Location</option>
                        {locations.map(location => (
                          <option 
                            key={location.LocationID} 
                            value={location.LocationID.toString()}
                          >
                            {location.LocationName}
                            {location.Address && ` - ${location.Address}`}
                            {location.City && `, ${location.City}`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {/* Location Status Messages */}
                  {!loadingLocations && locations.length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">No locations found.</span> 
                        Please contact your admin to add work locations for your company.
                      </p>
                    </div>
                  )}
                  
                  {!loadingLocations && locations.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700">
                        ✓ {locations.length} location(s) available for selection
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.dateOfJoining}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                          className="form-radio h-4 w-4 text-green-600"
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
                          className="form-radio h-4 w-4 text-red-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-medium">
                          ❌ Inactive
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Employee Update Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {designations.length > 0 && (
                      <p>• {designations.length} designation(s) available for this department</p>
                    )}
                    {designations.length === 0 && formData.departmentId && (
                      <p>• No pre-defined designations found for this department</p>
                    )}
                    {locations.length > 0 && (
                      <p>• {locations.length} work location(s) available</p>
                    )}
                    <p>• Custom designations will be automatically created</p>
                    <p>• Employee Code: Cannot be modified</p>
                    <p>• Changes will be reflected immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/employees')}
                  className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || loadingDesignations || loadingLocations}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Updating Employee...
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