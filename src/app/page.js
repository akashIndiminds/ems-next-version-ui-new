// src/app/page.js - Alternative Cleaner Approach
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import Desktop Components
import {
  DesktopNavbar,
  DesktopHero,
  DesktopFeatures,
  DesktopStats,
  DesktopTestimonials,
  DesktopCTA,
  DesktopFooter
} from '@/components/mainlayout/desktop/DesktopComponents';

// Main Responsive Homepage Component
export default function ResponsiveAttendanceHubPage() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Redirect mobile users directly to login page
      if (mobile) {
        router.push('/login');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  // Show loading for mobile users while redirecting
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Version - Shows full landing page */}
      <DesktopNavbar />
      <DesktopHero />
      <DesktopFeatures />
      <DesktopStats />
      <DesktopTestimonials />
      <DesktopCTA />
      <DesktopFooter />
    </div>
  );
}