// src/components/dashboard/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  FiHome, FiUsers, FiCalendar, FiClock, FiFileText, FiSettings,
  FiLogOut, FiBriefcase, FiMapPin, FiDollarSign
} from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'manager', 'employee'] },
  { name: 'Attendance', href: '/attendance', icon: FiClock, roles: ['admin', 'manager', 'employee'] },
  { name: 'Employees', href: '/employees', icon: FiUsers, roles: ['admin', 'manager'] },
  { name: 'Leave Management', href: '/leaves', icon: FiCalendar, roles: ['admin', 'manager', 'employee'] },
  { name: 'Departments', href: '/departments', icon: MdBusiness, roles: ['admin', 'manager'] },
  { name: 'Locations', href: '/locations', icon: FiMapPin, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: FiFileText, roles: ['admin', 'manager'] },
  { name: 'Company', href: '/company', icon: FiBriefcase, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: FiSettings, roles: ['admin', 'manager', 'employee'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [navigating, setNavigating] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);

  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (href) => pathname === href;

  const handleNavigation = async (href, itemName) => {
    // Prevent multiple clicks
    if (navigating || activeNavItem === itemName) {
      return;
    }

    try {
      setNavigating(true);
      setActiveNavItem(itemName);
      
      // Close mobile sidebar immediately
      if (onClose) {
        onClose();
      }
      
      // Navigate to the route
      router.push(href);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setNavigating(false);
      setActiveNavItem(null);
    }
  };

  const handleLogout = async () => {
    if (navigating) return;
    
    setNavigating(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setNavigating(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-semibold text-white">AttendanceHub</h1>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredSidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  disabled={navigating || activeNavItem === item.name}
                  className={`
                    group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                    ${(navigating || activeNavItem === item.name) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${activeNavItem === item.name ? 'bg-gray-700' : ''}
                  `}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${activeNavItem === item.name ? 'animate-pulse' : ''}`} />
                  {item.name}
                  {activeNavItem === item.name && (
                    <div className="ml-auto">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="flex-shrink-0 flex flex-col bg-gray-700 p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                <p className="text-xs font-medium text-gray-300 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={navigating}
              className={`
                flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-all
                ${navigating 
                  ? 'text-gray-400 cursor-not-allowed opacity-50' 
                  : 'text-gray-300 hover:bg-gray-600 hover:text-white cursor-pointer'
                }
              `}
            >
              <FiLogOut className={`mr-3 h-5 w-5 ${navigating ? 'animate-pulse' : ''}`} />
              Sign out
              {navigating && (
                <div className="ml-auto">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}