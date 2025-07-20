// src/app/(dashboard)/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiUsers, FiCalendar, FiClock, FiFileText, FiSettings,
  FiLogOut, FiMenu, FiX, FiBell, FiUser, FiChevronDown, FiBarChart
} from 'react-icons/fi';
import { MdBusiness, MdLocationOn } from 'react-icons/md';

// Organized sidebar items with categories
const sidebarItems = [
  // Main Dashboard
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: FiHome, 
    roles: ['admin', 'manager', 'employee'],
    category: 'main'
  },
  
  // Attendance Section
  { 
    name: 'My Attendance', 
    href: '/attendance', 
    icon: FiClock, 
    roles: ['admin', 'manager', 'employee'],
    category: 'attendance'
  },
  { 
    name: 'Attendance Manager', 
    href: '/attendanceManagement', 
    icon: FiBarChart, 
    roles: ['admin', 'manager'],
    category: 'attendance'
  },
  
  // Employee Management
  { 
    name: 'Employees', 
    href: '/employees', 
    icon: FiUsers, 
    roles: ['admin', 'manager'],
    category: 'employee'
  },
  { 
    name: 'Departments', 
    href: '/departments', 
    icon: MdBusiness, 
    roles: ['admin', 'manager'],
    category: 'employee'
  },
  
  // Leave Management
  { 
    name: 'Leave Requests', 
    href: '/leaves', 
    icon: FiCalendar, 
    roles: ['admin', 'manager', 'employee'],
    category: 'leave'
  },
  { 
    name: 'Leave Balance', 
    href: '/leaveBalanceManagement', 
    icon: FiCalendar, 
    roles: ['admin', 'manager'],
    category: 'leave'
  },
  
  // Reports & Analytics
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FiFileText, 
    roles: ['admin', 'manager'],
    category: 'reports'
  },
  
  // System Settings
  { 
    name: 'Locations', 
    href: '/locations', 
    icon: MdLocationOn, 
    roles: ['admin'],
    category: 'settings'
  },
  { 
    name: 'Company Settings', 
    href: '/company', 
    icon: FiSettings, 
    roles: ['admin'],
    category: 'settings'
  },
];

const categoryLabels = {
  main: '',
  attendance: 'Attendance',
  employee: 'Employee Management',
  leave: 'Leave Management',
  reports: 'Reports & Analytics',
  settings: 'System Settings'
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle navigation with loading states
  const handleNavigation = async (href, itemName, event) => {
    if (event) event.preventDefault();
    
    // Prevent multiple clicks
    if (navigating || activeNavItem === itemName || pathname === href) {
      return;
    }

    try {
      setNavigating(true);
      setActiveNavItem(itemName);
      
      // Close mobile sidebar immediately
      setSidebarOpen(false);
      
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
    setDropdownOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setNavigating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter and organize sidebar items by category
  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );

  // Group items by category
  const groupedItems = filteredSidebarItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const isActive = (href) => pathname === href;

  // Render navigation items with categories
  const renderNavigation = (isMobile = false) => {
    return Object.entries(groupedItems).map(([category, items]) => (
      <div key={category} className={`${category === 'main' ? '' : 'mt-6'}`}>
        {category !== 'main' && (
          <div className="px-4 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {categoryLabels[category]}
            </h3>
          </div>
        )}
        <div className="space-y-1">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={(e) => handleNavigation(item.href, item.name, e)}
              disabled={navigating || activeNavItem === item.name}
              className={`
                group flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                ${(navigating || activeNavItem === item.name) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${activeNavItem === item.name ? 'bg-gray-100' : ''}
                ${isMobile ? 'py-3' : ''}
              `}
            >
              <item.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${
                isActive(item.href) ? 'text-blue-600' : 'text-gray-500'
              } ${activeNavItem === item.name ? 'animate-pulse' : ''}`} />
              <span className="truncate">{item.name}</span>
              {activeNavItem === item.name && (
                <div className="ml-auto flex-shrink-0">
                  <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white">AttendanceHub</h1>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4">
              {renderNavigation()}
            </nav>
          </div>
          
          {/* User info */}
          <div className="flex-shrink-0 flex bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-200">
            <div className="flex items-center w-full">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                <p className="text-xs font-medium text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0" onClick={() => setSidebarOpen(false)}>
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-6 w-6 text-white" />
                </button>
              </div>
              
              {/* Mobile Logo */}
              <div className="flex-shrink-0 flex items-center px-6 h-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <h1 className="text-xl font-bold text-white">AttendanceHub</h1>
              </div>
              
              {/* Mobile Navigation */}
              <div className="flex-1 h-0 pt-4 pb-4 overflow-y-auto">
                <nav className="px-3">
                  {renderNavigation(true)}
                </nav>
              </div>
              
              {/* Mobile User info */}
              <div className="flex-shrink-0 flex bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-200">
                <div className="flex items-center w-full">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-sm font-medium text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white shadow-lg border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full max-w-xs text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-full">
                    <span className="text-lg font-semibold text-gray-900">
                      {user.company?.companyName || 'Company Dashboard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <div className="relative dropdown-container">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationOpen(!notificationOpen);
                    setDropdownOpen(false);
                  }}
                  className="relative bg-white p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 transition-all duration-200"
                >
                  <FiBell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                {notificationOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <p className="text-sm text-gray-900 font-medium">Your leave request has been approved</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <p className="text-sm text-gray-900 font-medium">New employee added to your department</p>
                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <p className="text-sm text-gray-900 font-medium">Reminder: Submit monthly report</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                      <button 
                        onClick={() => {
                          setNotificationOpen(false);
                          handleNavigation('/notifications', 'notifications');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative dropdown-container">
                <button
                  className="max-w-xs bg-white flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 transition-all duration-200 px-3 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                    setNotificationOpen(false);
                  }}
                  disabled={navigating}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-3 text-gray-700 text-sm font-medium hidden lg:block max-w-32 truncate">{user.fullName}</span>
                  <FiChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation('/profile', 'profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      disabled={navigating}
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      Your Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation('/settings', 'settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      disabled={navigating}
                    >
                      <FiSettings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        disabled={navigating}
                        className={`
                          flex items-center w-full text-left px-4 py-2 text-sm transition-all duration-200
                          ${navigating 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        {navigating ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}