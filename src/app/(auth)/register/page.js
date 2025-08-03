// src/app/(auth)/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Import Mobile Components
import { 
  MobileAuthHeader, 
  MobileRegisterForm, 
  MobileAuthFooter 
} from '@/components/responsiveAuth/mobile/MobileAuthComponents';

// Import Desktop Components
import { 
  DesktopAuthHeader, 
  DesktopRegisterForm, 
  DesktopAuthFooter 
} from '@/components/responsiveAuth/desktop/DesktopAuthComponents';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    companyCode: '',
    address: '',
    contactNumber: '',
    email: '',
    establishedDate: '',
    
    // Admin Details
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminMobile: '',
    adminPassword: '',
    adminConfirmPassword: '',
    adminDateOfBirth: '',
    adminGender: 'Male'
  });
  const [loading, setLoading] = useState(false);
  const { registerCompany } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    if (!formData.companyName || !formData.companyCode || !formData.email) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.adminFirstName || !formData.adminLastName || !formData.adminEmail || !formData.adminPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.adminPassword !== formData.adminConfirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.adminPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    const result = await registerCompany(formData);
    setLoading(false);

    if (!result.success) {
      // Error is already handled in registerCompany function
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileAuthHeader 
          title="Register Company" 
          showBack={true} 
          backUrl="/" 
        />
        <MobileRegisterForm
          step={step}
          setStep={setStep}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          validateStep1={validateStep1}
        />
        <MobileAuthFooter />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <DesktopAuthHeader 
          title="Register Company"
          showLoginButton={true}
        />
        <DesktopRegisterForm
          step={step}
          setStep={setStep}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          validateStep1={validateStep1}
        />
        <DesktopAuthFooter />
      </div>
    </div>
  );
}