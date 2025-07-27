// src/components/employees/new/mobile/MobileAddEmployeeStep2.js
'use client';

import { FiPhone, FiMail, FiLock, FiUser, FiChevronLeft } from 'react-icons/fi';

export default function MobileAddEmployeeStep2({ 
  formData, 
  onInputChange,
  onNext,
  onPrevious
}) {
  const isValid = formData.email.trim() && formData.password.trim() && formData.password.length >= 6;

  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiPhone className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="employee@company.com"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => onInputChange('emergencyContact', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => onInputChange('password', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 6 characters"
              />
            </div>
            {formData.password && formData.password.length < 6 && (
              <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 text-sm mb-1">Account Access</h4>
          <p className="text-xs text-blue-700">
            The employee will use this email and password to log into the system
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-4 space-y-3">
        <button
          onClick={onPrevious}
          className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
        >
          <FiChevronLeft className="mr-2 h-5 w-5" />
          Previous: Personal Info
        </button>
        
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Work Information
        </button>
      </div>
    </div>
  );
}