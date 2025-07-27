// src/app/(dashboard)/employees/[id]/view/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, FiEdit2, FiUser, FiPhone, FiMail, 
  FiBriefcase, FiMapPin, FiCalendar, FiHeart,
  FiShield, FiClock, FiMoreVertical
} from 'react-icons/fi';

export default function ViewEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [params.id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(params.id);
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error('Failed to load employee details');
      router.push('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/employees/${params.id}/edit`);
  };

  const handleBack = () => {
    router.push('/employees');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Employee not found</p>
          <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
            Go back to employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-black">Employee Details</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    <span>Edit Employee</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">
                  {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h2>
                <p className="text-sm text-gray-500">{employee.EmployeeCode}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  employee.Status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.Status}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black">Personal Information</h3>
            </div>
            <div className="space-y-3">
              <InfoRow label="Date of Birth" value={formatDate(employee.DateOfBirth)} />
              <InfoRow label="Gender" value={employee.Gender || 'N/A'} />
              <InfoRow label="Blood Group" value={employee.BloodGroup || 'N/A'} icon={<FiHeart className="h-4 w-4 text-red-500" />} />
              <InfoRow label="Address" value={employee.Address || 'N/A'} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiPhone className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black">Contact Information</h3>
            </div>
            <div className="space-y-3">
              <InfoRow label="Email" value={employee.Email} icon={<FiMail className="h-4 w-4 text-gray-500" />} />
              <InfoRow label="Mobile" value={employee.MobileNumber || 'N/A'} icon={<FiPhone className="h-4 w-4 text-gray-500" />} />
              <InfoRow label="Emergency Contact" value={employee.EmergencyContact || 'N/A'} />
            </div>
          </div>

          {/* Work Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiBriefcase className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-black">Work Information</h3>
            </div>
            <div className="space-y-3">
              <InfoRow label="Department" value={employee.department?.DepartmentName || 'N/A'} />
              <InfoRow label="Designation" value={employee.designation?.DesignationName || 'N/A'} />
              <InfoRow label="Location" value={employee.location?.LocationName || 'N/A'} icon={<FiMapPin className="h-4 w-4 text-gray-500" />} />
              <InfoRow label="Date of Joining" value={formatDate(employee.DateOfJoining)} icon={<FiCalendar className="h-4 w-4 text-gray-500" />} />
              <InfoRow label="Employee Type" value={employee.EmployeeType || 'N/A'} />
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FiShield className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-black">System Information</h3>
            </div>
            <div className="space-y-3">
              <InfoRow label="User Role" value={employee.UserRole || 'Employee'} />
              <InfoRow label="Created At" value={formatDate(employee.createdAt)} icon={<FiClock className="h-4 w-4 text-gray-500" />} />
              <InfoRow label="Last Updated" value={formatDate(employee.updatedAt)} icon={<FiClock className="h-4 w-4 text-gray-500" />} />
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleEdit}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FiEdit2 className="h-5 w-5" />
            <span>Edit Employee</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6">
        {/* Desktop Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
                <p className="text-gray-600">View employee information</p>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiEdit2 className="h-5 w-5" />
              <span>Edit Employee</span>
            </button>
          </div>
        </div>

        {/* Desktop Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-semibold text-blue-600">
                    {employee.FirstName?.charAt(0)}{employee.LastName?.charAt(0)}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h2>
                <p className="text-gray-500">{employee.EmployeeCode}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                  employee.Status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.Status}
                </span>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <QuickInfo icon={<FiBriefcase />} text={employee.department?.DepartmentName || 'N/A'} />
                  <QuickInfo icon={<FiShield />} text={employee.designation?.DesignationName || 'N/A'} />
                  <QuickInfo icon={<FiMapPin />} text={employee.location?.LocationName || 'N/A'} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="First Name" value={employee.FirstName} />
                <DetailItem label="Last Name" value={employee.LastName} />
                <DetailItem label="Date of Birth" value={formatDate(employee.DateOfBirth)} />
                <DetailItem label="Gender" value={employee.Gender || 'N/A'} />
                <DetailItem label="Blood Group" value={employee.BloodGroup || 'N/A'} />
                <DetailItem label="Address" value={employee.Address || 'N/A'} fullWidth />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Email" value={employee.Email} />
                <DetailItem label="Mobile Number" value={employee.MobileNumber || 'N/A'} />
                <DetailItem label="Emergency Contact" value={employee.EmergencyContact || 'N/A'} />
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black text-gray-900 mb-4">Work Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Employee Code" value={employee.EmployeeCode} />
                <DetailItem label="Department" value={employee.department?.DepartmentName || 'N/A'} />
                <DetailItem label="Designation" value={employee.designation?.DesignationName || 'N/A'} />
                <DetailItem label="Location" value={employee.location?.LocationName || 'N/A'} />
                <DetailItem label="Date of Joining" value={formatDate(employee.DateOfJoining)} />
                <DetailItem label="Employee Type" value={employee.EmployeeType || 'N/A'} />
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black text-gray-900 mb-4">System Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="User Role" value={employee.UserRole || 'Employee'} />
                <DetailItem label="Status" value={employee.Status} />
                <DetailItem label="Created At" value={formatDate(employee.createdAt)} />
                <DetailItem label="Last Updated" value={formatDate(employee.updatedAt)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ label, value, icon }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right flex items-center space-x-1">
        {icon}
        <span>{value}</span>
      </span>
    </div>
  );
}

function QuickInfo({ icon, text }) {
  return (
    <div className="flex items-center space-x-3 text-gray-600">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function DetailItem({ label, value, fullWidth }) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}