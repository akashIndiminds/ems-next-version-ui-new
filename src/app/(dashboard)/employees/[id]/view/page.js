// src/app/(dashboard)/employees/[id]/view/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI } from '@/app/lib/api';
import { FiArrowLeft, FiEdit, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiClock, FiUserCheck, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ViewEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'employee' && user.employeeId !== employeeId) {
      router.push('/dashboard');
      return;
    }
    fetchEmployeeDetails();
  }, [employeeId, user]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(employeeId);
      if (response.data.success) {
        setEmployee(response.data.data);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const calculateTenure = (dateOfJoining) => {
    if (!dateOfJoining) return 'N/A';
    const today = new Date();
    const joinDate = new Date(dateOfJoining);
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0 && months > 0) {
      return `${years} year(s) ${months} month(s)`;
    } else if (years > 0) {
      return `${years} year(s)`;
    } else if (months > 0) {
      return `${months} month(s)`;
    } else {
      return 'Less than a month';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    )
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
                Employee Details
              </h1>
              <p className="mt-2 text-gray-600">
                View {employee.FirstName} {employee.LastName}'s complete information
              </p>
            </div>
          </div>
          
          {(user.role === 'admin' || user.role === 'manager') && (
            <button
              onClick={() => router.push(`/employees/${employeeId}/edit`)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg font-semibold"
            >
              <FiEdit className="mr-2" />
              Edit Employee
            </button>
          )}
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-3xl shadow-lg">
                {employee.FirstName?.[0]}{employee.LastName?.[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h2>
                <p className="text-lg text-gray-600 mt-1">{employee.DesignationName || 'Employee'}</p>
                <p className="text-gray-500">{employee.DepartmentName}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="text-sm text-gray-500">Employee Code:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {employee.EmployeeCode}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    employee.IsActive === true || employee.IsActive === 1
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.IsActive === true || employee.IsActive === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiUser className="mr-3 text-green-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                    <p className="text-gray-900 font-medium">{employee.FirstName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                    <p className="text-gray-900 font-medium">{employee.LastName || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Birth</label>
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">{formatDate(employee.DateOfBirth)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Age</label>
                    <p className="text-gray-900 font-medium">{calculateAge(employee.DateOfBirth)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 font-medium">{employee.Gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Blood Group</label>
                    <div className="flex items-center space-x-2">
                      <FiHeart className="h-4 w-4 text-red-400" />
                      <p className="text-gray-900 font-medium">{employee.BloodGroup || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Address</label>
                  <div className="flex items-start space-x-2">
                    <FiMapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-900 font-medium text-sm">{employee.Address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiMail className="mr-3 text-blue-600" />
                Contact Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <FiMail className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`mailto:${employee.Email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    {employee.Email || 'N/A'}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number</label>
                <div className="flex items-center space-x-2">
                  <FiPhone className="h-4 w-4 text-gray-400" />
                  {employee.MobileNumber ? (
                    <a 
                      href={`tel:${employee.MobileNumber}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      {employee.MobileNumber}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium">N/A</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Emergency Contact</label>
                <div className="flex items-center space-x-2">
                  <FiPhone className="h-4 w-4 text-red-400" />
                  {employee.EmergencyContact ? (
                    <a 
                      href={`tel:${employee.EmergencyContact}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      {employee.EmergencyContact}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium">N/A</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Contact Information</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Primary contact via email preferred</p>
                  <p>• Emergency contact for urgent matters only</p>
                  <p>• Mobile number for work-related communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiBriefcase className="mr-3 text-purple-600" />
                Work Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Company</label>
                <p className="text-gray-900 font-medium">{employee.CompanyName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Department</label>
                <p className="text-gray-900 font-medium">{employee.DepartmentName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Designation</label>
                <p className="text-gray-900 font-medium">{employee.DesignationName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Joining</label>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{formatDate(employee.DateOfJoining)}</p>
                </div>
              </div>

              {/* <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tenure</label>
                <div className="flex items-center space-x-2">
                  <FiClock className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{calculateTenure(employee.DateOfJoining)}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Account Created</label>
                <div className="flex items-center space-x-2">
                  <FiUserCheck className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 font-medium">{formatDate(employee.CreatedAt)}</p>
                </div>
              </div> */}

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
                <h4 className="font-semibold text-purple-900 mb-2 text-sm">Employment Status</h4>
                <div className="text-xs text-purple-700 space-y-1">
                  <p>• Employee Code: Auto-generated</p>
                  <p>• Status: {employee.IsActive === true || employee.IsActive === 1 ? 'Active Employee' : 'Inactive Employee'}</p>
                  {/* <p>• Department mapping completed</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information - spans full width on large screens */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden lg:col-span-2 xl:col-span-3">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiMapPin className="mr-3 text-orange-600" />
                Location Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Work Location</label>
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-4 w-4 text-orange-500" />
                    <p className="text-gray-900 font-medium">{employee.LocationName || 'N/A'}</p>
                  </div>
                </div>

                {employee.Address && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Location Address</label>
                    <p className="text-gray-900 font-medium text-sm">{employee.LocationAddress || 'N/A'}</p>
                  </div>
                )}

                {employee.City && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">City</label>
                    <p className="text-gray-900 font-medium">{employee.City || 'N/A'}</p>
                  </div>
                )}

                {employee.Latitude && employee.Longitude && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">GPS Coordinates</label>
                    <p className="text-gray-900 font-medium text-sm">
                      {employee.Latitude}, {employee.Longitude}
                    </p>
                  </div>
                )}

                {employee.AllowedRadius && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Allowed Radius</label>
                    <p className="text-gray-900 font-medium">{employee.AllowedRadius} meters</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Location Status</label>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Assigned
                  </span>
                </div>
              </div>

              {/* Location Information Summary */}
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-semibold text-orange-900 mb-2 text-sm">Location Setup Information</h4>
                <div className="text-xs text-orange-700 space-y-1">
                  <p>• Work location assigned for attendance tracking</p>
                  <p>• GPS coordinates used for location-based check-ins</p>
                  <p>• Allowed radius defines acceptable check-in distance</p>
                  {employee.LocationName && <p>• Current assignment: {employee.LocationName}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}