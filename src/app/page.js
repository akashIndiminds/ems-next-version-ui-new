// src/app/page.js
'use client';

import React, { useState, useEffect } from 'react';

// Import Mobile Components
import {
  MobileHeader,
  MobileHero,
  MobileFeatures,
  MobileStats,
  MobileTestimonials,
  MobileCTA,
  MobileFooter
} from '@/components/mainlayout/mobile/MobileComponents';


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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Version - Shows only on screens < 768px */}
      <div className="md:hidden">
        <MobileHeader />
        <MobileHero />
        <MobileFeatures />
        <MobileStats />
        <MobileTestimonials />
        <MobileCTA />
        <MobileFooter />
      </div>

      {/* Desktop Version - Shows only on screens >= 768px */}
      <div className="hidden md:block">
        <DesktopNavbar />
        <DesktopHero />
        <DesktopFeatures />
        <DesktopStats />
        <DesktopTestimonials />
        <DesktopCTA />
        <DesktopFooter />
      </div>
    </div>
  );
}