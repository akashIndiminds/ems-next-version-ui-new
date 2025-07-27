// src/components/MobileBottomNavigation.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiUsers, FiClock, FiFileText, FiMoreHorizontal
} from 'react-icons/fi';

const MobileBottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(null);

  // Mobile navigation structure based on enterprise 4-tab pattern
  const navItems = [
    {
      id: 'home',
      name: 'Home',
      href: '/dashboard',
      icon: FiHome,
      roles: ['admin', 'manager', 'employee'],
      description: 'Dashboard & Overview'
    },
    {
      id: 'people',
      name: 'People',
      href: '/employees',
      icon: FiUsers,
      roles: ['admin', 'manager', 'employee'],
      description: 'Team & Directory',
      fallback: '/attendance' // For employees who can't access /employees
    },
    {
      id: 'attendance',
      name: 'Time',
      href: '/attendance',
      icon: FiClock,
      roles: ['admin', 'manager', 'employee'],
      description: 'Attendance & Leaves'
    },
    {
      id: 'more',
      name: 'More',
      href: '/more',
      icon: FiMoreHorizontal,
      roles: ['admin', 'manager', 'employee'],
      description: 'Reports & Settings'
    }
  ];

  const handleNavigation = async (item) => {
    if (activeTab === item.id) return;

    setActiveTab(item.id);

    // Handle role-based navigation
    let targetHref = item.href;
    if (item.id === 'people' && !item.roles.includes(user.role) && item.fallback) {
      targetHref = item.fallback;
    }

    try {
      router.push(targetHref);
      // Reset active state after navigation
      setTimeout(() => setActiveTab(null), 300);
    } catch (error) {
      console.error('Navigation error:', error);
      setActiveTab(null);
    }
  };

  const isActive = (item) => {
    // Home tab logic
    if (item.id === 'home') {
      return pathname === '/dashboard';
    }
    
    // People tab logic - active for employee-related pages
    if (item.id === 'people') {
      return pathname.startsWith('/employees') || 
             pathname.startsWith('/departments') ||
             (pathname.startsWith('/attendance') && user.role === 'employee');
    }
    
    // Time tab logic - attendance and leave related
    if (item.id === 'attendance') {
      return pathname.startsWith('/attendance') || 
             pathname.startsWith('/leaves') || 
             pathname.startsWith('/leaveBalance');
    }
    
    // More tab logic - everything else
    if (item.id === 'more') {
      return pathname.startsWith('/reports') || 
             pathname.startsWith('/locations') || 
             pathname.startsWith('/company') ||
             pathname.startsWith('/settings') ||
             pathname.startsWith('/profile') ||
             pathname === '/more';
    }
    
    return false;
  };

  const getDisplayName = (item) => {
    // Customize display based on user role and context
    if (item.id === 'people' && user.role === 'employee') {
      return 'Team';
    }
    return item.name;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        {/* Navigation Items */}
        <div className="grid grid-cols-4 h-16">
          {navItems
            .filter(item => item.roles.includes(user.role))
            .map((item) => {
              const active = isActive(item);
              const loading = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  disabled={loading}
                  className={`
                    flex flex-col items-center justify-center px-1 py-2 transition-all duration-200
                    ${active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                    ${loading ? 'opacity-60' : ''}
                  `}
                >
                  <div className="relative">
                    <item.icon 
                      className={`
                        h-5 w-5 transition-all duration-200
                        ${active ? 'text-blue-600 scale-110' : 'text-gray-500'}
                        ${loading ? 'animate-pulse' : ''}
                      `} 
                    />
                    {active && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium mt-1 transition-all duration-200
                    ${active ? 'text-blue-600 font-semibold' : 'text-gray-600'}
                  `}>
                    {getDisplayName(item)}
                  </span>
                </button>
              );
            })}
        </div>
        
        {/* Safe area for iPhone home indicator */}
        <div className="h-safe-area-inset-bottom bg-white"></div>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;