// src/app/(auth)/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Import Premium Mobile Components
import { 
  MobileAuthHeader, 
  MobileLoginForm 
} from '@/components/responsiveAuth/mobile/MobileAuthComponents';


import { 
  DesktopAuthHeader, 
  DesktopLoginForm, 
  DesktopAuthFooter 
} from '@/components/responsiveAuth/desktop/DesktopAuthComponents';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const router = useRouter();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Employee Code is required';
    } else if (formData.identifier.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier)) {
        newErrors.identifier = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.success('Login successful! Redirecting...');
        // Router will handle redirect based on user role
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Version - Full Screen Premium Design */}
      <div className="md:hidden">
        <MobileLoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          errors={errors}
        />
      </div>

      {/* Desktop Version - You can uncomment this when you have desktop components */}
      
      <div className="hidden md:block">
        <DesktopAuthHeader 
          title="Sign In"
          showRegisterButton={true}
        />
        <DesktopLoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          errors={errors}
        />
        <DesktopAuthFooter />
      </div>
     
      
      {/* Temporary desktop fallback */}
      <div className="hidden md:block min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Desktop Version</h1>
          <p className="text-slate-600 mb-8">Please use a mobile device or resize your browser window</p>
          <div className="max-w-md mx-auto">
            <MobileLoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </>
  );
}