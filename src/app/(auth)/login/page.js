// src/app/(auth)/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Import Mobile Components
import { 
  MobileAuthHeader, 
  MobileLoginForm, 
  MobileAuthFooter 
} from '@/components/responsiveAuth/mobile/MobileAuthComponents';

// Import Desktop Components
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
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (!result.success) {
      // Error is already handled in the login function
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileAuthHeader 
          title="Sign In" 
          showBack={true} 
          backUrl="/" 
        />
        <MobileLoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <MobileAuthFooter />
      </div>

      {/* Desktop Version */}
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
        />
        <DesktopAuthFooter />
      </div>
    </div>
  );
}