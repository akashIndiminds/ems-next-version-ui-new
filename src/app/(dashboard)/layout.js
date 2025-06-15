// src/app/(dashboard)/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiUsers, FiCalendar, FiClock, FiFileText, FiSettings,
  FiLogOut, FiMenu, FiX, FiBell, FiUser, FiChevronDown
} from 'react-icons/fi';
import { MdBusiness, MdLocationOn } from 'react-icons/md';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'manager', 'employee'] },
  { name: 'Attendance', href: '/attendance', icon: FiClock, roles: ['admin', 'manager', 'employee'] },
  { name: 'Employees', href: '/employees', icon: FiUsers, roles: ['admin', 'manager'] },
  { name: 'Leave Management', href: '/leaves', icon: FiCalendar, roles: ['admin', 'manager', 'employee'] },
  { name: 'Departments', href: '/departments', icon: MdBusiness, roles: ['admin', 'manager'] },
  { name: 'Locations', href: '/locations', icon: MdLocationOn, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: FiFileText, roles: ['admin', 'manager'] },
  { name: 'Company', href: '/company', icon: FiSettings, roles: ['admin'] },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle navigation with loading states
  const handleNavigation = async (href, itemName, event) => {
    event.preventDefault();
    
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );

  const isActive = (href) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-semibold text-white">AttendanceHub</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredSidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => handleNavigation(item.href, item.name, e)}
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
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-white">{user.fullName}</p>
                <p className="text-xs font-medium text-gray-300">{user.role}</p>
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-semibold text-white">AttendanceHub</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {filteredSidebarItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={(e) => handleNavigation(item.href, item.name, e)}
                      disabled={navigating || activeNavItem === item.name}
                      className={`
                        group flex items-center w-full px-2 py-2 text-base font-medium rounded-md transition-all
                        ${isActive(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                        ${(navigating || activeNavItem === item.name) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${activeNavItem === item.name ? 'bg-gray-700' : ''}
                      `}
                    >
                      <item.icon className={`mr-4 h-6 w-6 ${activeNavItem === item.name ? 'animate-pulse' : ''}`} />
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
              <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <div className="flex items-center">
                  <div>
                    <p className="text-base font-medium text-white">{user.fullName}</p>
                    <p className="text-sm font-medium text-gray-300">{user.role}</p>
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
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full max-w-xs text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-full">
                    <span className="text-lg font-medium text-gray-900">
                      {user.company?.companyName || 'Company'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FiBell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    disabled={navigating}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700 text-sm font-medium">{user.fullName}</span>
                    <FiChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation('/profile', 'profile', e);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      disabled={navigating}
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation('/settings', 'settings', e);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      disabled={navigating}
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={navigating}
                      className={`
                        block w-full text-left px-4 py-2 text-sm transition-all
                        ${navigating 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {navigating ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}