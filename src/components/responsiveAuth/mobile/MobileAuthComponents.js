// src/components/mobile/MobileAuthComponents.js
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCalendar, 
  FiBriefcase, FiClock, FiArrowLeft, FiChevronRight 
} from 'react-icons/fi';

// Mobile Auth Header
export const MobileAuthHeader = ({ title, showBack = false, backUrl = "/" }) => {
  return (
    <header className=" bg-white border-b border-gray-100 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Link href={backUrl} className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AttendanceHub</span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
};

// Mobile Login Form
export const MobileLoginForm = ({ formData, handleChange, handleSubmit, loading, showPassword, setShowPassword }) => {
  return (
    <div className="px-4 py-8 md:hidden">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Employee Code Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email / Employee Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="email"
                required
                value={formData.identifier}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                placeholder="Enter email or employee code"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-semibold">
              Register Company
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Mobile Register Form
export const MobileRegisterForm = ({ 
  step, 
  setStep, 
  formData, 
  handleChange, 
  handleSubmit, 
  loading, 
  validateStep1 
}) => {
  return (
    <div className="px-4 py-8 md:hidden">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Company</h2>
          <p className="text-gray-600">Start your 30-day free trial</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Company</span>
            </div>
            <div className={`mx-3 h-0.5 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company Details */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              {/* Company Code */}
              <div>
                <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Code *
                </label>
                <input
                  id="companyCode"
                  name="companyCode"
                  type="text"
                  required
                  value={formData.companyCode}
                  onChange={handleChange}
                  className="block w-full px-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg uppercase"
                  placeholder="COMP001"
                />
              </div>

              {/* Company Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Enter company address"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <span>Next Step</span>
                <FiChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Admin Details */}
          {step === 2 && (
            <div className="space-y-6">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="adminFirstName"
                    name="adminFirstName"
                    type="text"
                    required
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className="block w-full px-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="adminLastName"
                    name="adminLastName"
                    type="text"
                    required
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className="block w-full px-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Admin Email */}
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="adminMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="adminMobile"
                    name="adminMobile"
                    type="tel"
                    value={formData.adminMobile}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    required
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="adminConfirmPassword"
                    name="adminConfirmPassword"
                    type="password"
                    required
                    value={formData.adminConfirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Previous Step
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Mobile Auth Footer
export const MobileAuthFooter = () => {
  return (
    <footer className="bg-gray-900 text-white px-4 py-6 fixed bottom-0 w-full md:hidden">
      <div className="text-center space-y-3">
        <p className="text-xs text-gray-400">© 2025 AttendanceHub. All rights reserved.</p>
        <div className="flex justify-center space-x-4 text-xs">
          <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};