// src/app/(dashboard)/more/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FiFileText, FiSettings, FiUser, FiLogOut, FiMapPin, 
  FiBell, FiHelpCircle, FiShield, FiBarChart, FiCalendar
} from 'react-icons/fi';
import { MdBusiness, MdLocationOn } from 'react-icons/md';

const MorePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Categorized menu items for the More section
  const menuSections = [
    {
      title: 'Reports & Analytics',
      items: [
        {
          name: 'Reports',
          href: '/reports',
          icon: FiFileText,
          roles: ['admin', 'manager'],
          description: 'View attendance and leave reports'
        },
        {
          name: 'Attendance Manager',
          href: '/attendanceManagement',
          icon: FiBarChart,
          roles: ['admin', 'manager'],
          description: 'Manage team attendance'
        },
        {
          name: 'Leave Balance',
          href: '/leaveBalanceManagement',
          icon: FiCalendar,
          roles: ['admin', 'manager'],
          description: 'Manage leave balances'
        }
      ]
    },
    {
      title: 'Organization',
      items: [
        {
          name: 'Departments',
          href: '/departments',
          icon: MdBusiness,
          roles: ['admin', 'manager'],
          description: 'Manage departments'
        },
        {
          name: 'Locations',
          href: '/locations',
          icon: MdLocationOn,
          roles: ['admin'],
          description: 'Manage office locations'
        },
        {
          name: 'Company Settings',
          href: '/company',
          icon: FiSettings,
          roles: ['admin'],
          description: 'Configure company settings'
        }
      ]
    },
    {
      title: 'Personal',
      items: [
        {
          name: 'My Profile',
          href: '/profile',
          icon: FiUser,
          roles: ['admin', 'manager', 'employee'],
          description: 'Update your profile information'
        },
        {
          name: 'Notifications',
          href: '/notifications',
          icon: FiBell,
          roles: ['admin', 'manager', 'employee'],
          description: 'Manage notification preferences'
        },
        {
          name: 'Settings',
          href: '/settings',
          icon: FiSettings,
          roles: ['admin', 'manager', 'employee'],
          description: 'App settings and preferences'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          name: 'Help & Support',
          href: '/help',
          icon: FiHelpCircle,
          roles: ['admin', 'manager', 'employee'],
          description: 'Get help and support'
        },
        {
          name: 'Privacy & Security',
          href: '/privacy',
          icon: FiShield,
          roles: ['admin', 'manager', 'employee'],
          description: 'Privacy settings and security'
        }
      ]
    }
  ];

  const handleNavigation = async (href, itemName) => {
    if (navigating || activeItem === itemName) return;

    setNavigating(true);
    setActiveItem(itemName);

    try {
      router.push(href);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setNavigating(false);
      setActiveItem(null);
    }
  };

  const handleLogout = async () => {
    if (navigating) return;
    
    setNavigating(true);
    setActiveItem('logout');
    
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setNavigating(false);
      setActiveItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">More</h1>
          <p className="text-sm text-gray-600 mt-1">Additional tools and settings</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{user.fullName}</h2>
              <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => handleNavigation('/profile', 'My Profile')}
              disabled={navigating}
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <FiUser className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 space-y-6">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter(item => 
            item.roles.includes(user.role)
          );
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {visibleItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href, item.name)}
                    disabled={navigating || activeItem === item.name}
                    className={`
                      w-full flex items-center px-4 py-4 text-left transition-all duration-200
                      ${navigating || activeItem === item.name 
                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                        : 'hover:bg-gray-50 active:bg-gray-100'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 p-2 rounded-lg
                      ${activeItem === item.name 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {item.description}
                      </p>
                    </div>
                    {activeItem === item.name && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Logout Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={handleLogout}
            disabled={navigating || activeItem === 'logout'}
            className={`
              w-full flex items-center px-4 py-4 text-left transition-all duration-200
              ${navigating || activeItem === 'logout'
                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                : 'hover:bg-red-50 active:bg-red-100'
              }
            `}
          >
            <div className={`
              flex-shrink-0 p-2 rounded-lg
              ${activeItem === 'logout'
                ? 'bg-red-100 text-red-600'
                : 'bg-red-100 text-red-600'
              }
            `}>
              <FiLogOut className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-red-600">
                {navigating && activeItem === 'logout' ? 'Signing out...' : 'Sign Out'}
              </h4>
              <p className="text-xs text-red-500 mt-1">
                Sign out of your account
              </p>
            </div>
            {activeItem === 'logout' && (
              <div className="ml-2 flex-shrink-0">
                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="px-4 mt-6 mb-6">
        <div className="text-center text-xs text-gray-500">
          <p>{user.company?.companyName || 'AttendanceHub'}</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MorePage;