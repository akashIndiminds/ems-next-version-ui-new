// src/components/mobile/MobileAuthComponents.js
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCalendar, 
  FiBriefcase, FiClock, FiArrowLeft, FiChevronRight, FiCheck, FiAlertCircle
} from 'react-icons/fi';

// Floating Input Component with modern design
const FloatingInput = ({ 
  label, 
  type = "text", 
  icon: Icon, 
  error, 
  success,
  className = "",
  onFocus,
  onBlur,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(e.target.value.length > 0);
    onBlur?.(e);
  };

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className={`w-5 h-5 transition-colors duration-300 ${
              error ? 'text-red-500' : 
              success ? 'text-green-500' :
              focused ? 'text-blue-600' : 'text-slate-400'
            }`} />
          </div>
        )}
        
        <input
          type={type}
          className={`peer w-full bg-white/80 backdrop-blur-sm border-2 rounded-2xl px-4 py-4 text-base font-medium
            transition-all duration-300 ease-out placeholder-transparent
            focus:outline-none focus:ring-4 focus:shadow-lg
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error 
              ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-red-100/50 bg-red-50/50' 
              : success
              ? 'border-green-400 text-green-900 focus:border-green-500 focus:ring-green-100/50 bg-green-50/50'
              : 'border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-100/50 hover:border-slate-300'
            } ${className}`}
          placeholder={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        <label className={`absolute left-4 transition-all duration-300 pointer-events-none
          ${Icon ? 'left-12' : 'left-4'}
          ${focused || hasValue || props.value
            ? '-top-2.5 text-sm bg-white px-2 rounded-md' 
            : 'top-4 text-base'
          }
          ${error ? 'text-red-600' : 
            success ? 'text-green-600' :
            focused ? 'text-blue-600' : 'text-slate-500'
          }`}>
          {label}
        </label>
      </div>
      
      {/* Error message with animation */}
      {error && (
        <div className="mt-2 flex items-center space-x-2 animate-fadeIn">
          <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Success indicator */}
      {success && !error && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scaleIn">
            <FiCheck className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

// Premium Button Component
const PremiumButton = ({ 
  variant = 'primary', 
  loading = false, 
  children, 
  className = '',
  size = 'lg',
  ...props 
}) => {
  const baseClasses = `w-full rounded-2xl font-semibold transition-all duration-200 ease-out 
    active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
    flex items-center justify-center gap-3 shadow-lg`;

  const sizes = {
    md: 'min-h-[44px] px-6 py-3 text-base',
    lg: 'min-h-[52px] px-6 py-4 text-lg'
  };

  const variants = {
    primary: `bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200/50
      hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-200/30
      focus:outline-none focus:ring-4 focus:ring-blue-200/50`,
    
    secondary: `bg-white border-2 border-slate-200 text-slate-700 shadow-slate-200/50
      hover:bg-slate-50 hover:border-slate-300 hover:shadow-md
      focus:outline-none focus:ring-4 focus:ring-slate-200/50`,
    
    glass: `bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-white/10
      hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/20`,
      
    success: `bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50
      hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-200/30
      focus:outline-none focus:ring-4 focus:ring-green-200/50`
  };

  return (
    <button 
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" 
            stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// Modern Auth Header with glassmorphism
export const MobileAuthHeader = ({ title, showBack = false, backUrl = "/" }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 md:hidden sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Link href={backUrl} className="p-2 rounded-xl hover:bg-slate-100/80 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AttendanceHub</span>
          </div>
        </div>
      </div>
      {title && (
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        </div>
      )}
    </header>
  );
};

// Premium Login Form with modern design
export const MobileLoginForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  loading, 
  showPassword, 
  setShowPassword,
  errors = {}
}) => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Welcome Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <FiClock className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">AttendanceHub</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome Back</h2>
          <p className="text-slate-600 text-lg">Sign in to continue to your account</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Employee Code Input */}
            <FloatingInput
              label="Email / Employee Code"
              type="text"
              icon={FiMail}
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              error={errors.identifier}
              autoComplete="email"
              required
            />

            {/* Password Input */}
            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={FiLock}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                className="pr-12"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                    rememberMe 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-slate-300 group-hover:border-blue-400'
                  }`}>
                    {rememberMe && (
                      <FiCheck className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-slate-700">Remember me</span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PremiumButton
                type="submit"
                loading={loading}
                variant="primary"
              >
                {loading ? (
                  <>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiChevronRight className="w-5 h-5" />
                  </>
                )}
              </PremiumButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link href="/register">
              <PremiumButton variant="secondary" size="md">
                <span>Register Your Company</span>
                <FiChevronRight className="w-4 h-4" />
              </PremiumButton>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2025 AttendanceHub. Secure & Trusted</p>
        </div>
      </div>
    </div>
  );
};

// Premium Registration Form with Progress Steps
export const MobileRegisterForm = ({ 
  step, 
  setStep, 
  formData, 
  handleChange, 
  handleSubmit, 
  loading, 
  validateStep1,
  errors = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { title: "Company Details", subtitle: "Tell us about your organization" },
    { title: "Admin Account", subtitle: "Create your admin profile" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FiClock className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AttendanceHub</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Register Your Company</h2>
          <p className="text-slate-600">Start your 30-day free trial today</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((stepInfo, index) => (
              <React.Fragment key={index}>
                <div className={`flex flex-col items-center space-y-2 ${
                  step >= index + 1 ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= index + 1 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step > index + 1 ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">
                    {stepInfo.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 transition-colors duration-300 ${
                    step >= index + 2 ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mt-3">
            <p className="text-sm text-slate-500">{steps[step - 1].subtitle}</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Company Details */}
            {step === 1 && (
              <div className="space-y-6">
                <FloatingInput
                  label="Company Name"
                  type="text"
                  icon={FiBriefcase}
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                  required
                />

                <FloatingInput
                  label="Company Code (e.g., COMP001)"
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleChange}
                  error={errors.companyCode}
                  className="uppercase"
                  required
                />

                <FloatingInput
                  label="Company Email"
                  type="email"
                  icon={FiMail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <FloatingInput
                  label="Contact Number (Optional)"
                  type="tel"
                  icon={FiPhone}
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={errors.contactNumber}
                />

                <div className="relative">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl px-4 py-4 text-base font-medium
                      transition-all duration-300 ease-out resize-none
                      focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 hover:border-slate-300"
                    placeholder="Company Address (Optional)"
                  />
                </div>

                <PremiumButton
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                >
                  <span>Continue to Admin Setup</span>
                  <FiChevronRight className="w-5 h-5" />
                </PremiumButton>
              </div>
            )}

            {/* Step 2: Admin Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="First Name"
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    error={errors.adminFirstName}
                    required
                  />

                  <FloatingInput
                    label="Last Name"
                    type="text"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    error={errors.adminLastName}
                    required
                  />
                </div>

                <FloatingInput
                  label="Admin Email"
                  type="email"
                  icon={FiMail}
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={errors.adminEmail}
                  required
                />

                <FloatingInput
                  label="Mobile Number (Optional)"
                  type="tel"
                  icon={FiPhone}
                  name="adminMobile"
                  value={formData.adminMobile}
                  onChange={handleChange}
                  error={errors.adminMobile}
                />

                <div className="relative">
                  <FloatingInput
                    label="Password (Min 8 characters)"
                    type={showPassword ? 'text' : 'password'}
                    icon={FiLock}
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    error={errors.adminPassword}
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <FloatingInput
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={FiLock}
                    name="adminConfirmPassword"
                    value={formData.adminConfirmPassword}
                    onChange={handleChange}
                    error={errors.adminConfirmPassword}
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors z-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <PremiumButton
                    type="submit"
                    loading={loading}
                    variant="success"
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>Create Account & Start Trial</span>
                        <FiCheck className="w-5 h-5" />
                      </>
                    )}
                  </PremiumButton>
                  
                  <PremiumButton
                    type="button"
                    onClick={() => setStep(1)}
                    variant="secondary"
                    size="md"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Company Details</span>
                  </PremiumButton>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Already have an account?</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <span>🔒 256-bit SSL Encryption</span>
            <span>✨ 30-day Free Trial</span>
            <span>🚀 No Credit Card Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these CSS animations to your global CSS file
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
`;

// Mobile Auth Footer - Simplified
export const MobileAuthFooter = () => {
  return (
    <footer className="bg-slate-900 text-white px-6 py-6 mt-8">
      <div className="text-center space-y-3">
        <p className="text-sm text-slate-300">© 2025 AttendanceHub. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};