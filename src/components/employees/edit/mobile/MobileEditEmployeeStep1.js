// src/components/employees/edit/mobile/MobileEditEmployeeStep1.js
'use client';

import { FiUser, FiCalendar, FiHeart, FiMapPin } from 'react-icons/fi';

export default function MobileEditEmployeeStep1({ 
  formData, 
  onInputChange,
  onNext,
  bloodGroups
}) {
  const safeBloodGroups = bloodGroups || ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const isValid = formData.firstName.trim() && formData.lastName.trim();

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiUser className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        </div>

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => onInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHeart className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.bloodGroup}
                onChange={(e) => onInputChange('bloodGroup', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                {safeBloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={formData.address}
                onChange={(e) => onInputChange('address', e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="sticky bottom-4">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Contact Information
        </button>
      </div>
    </div>
  );
}