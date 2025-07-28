// src/app/(dashboard)/more/page.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FiFileText,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMapPin,
  FiBell,
  FiHelpCircle,
  FiShield,
  FiBarChart,
  FiCalendar,
  FiArrowLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdBusiness, MdLocationOn } from "react-icons/md";

const MorePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Enhanced menu sections with better organization
  const menuSections = [
    {
      title: "Quick Actions",
      priority: "high",
      items: [
        {
          name: "My Profile",
          href: "/profile",
          icon: FiUser,
          roles: ["admin", "manager", "employee"],
          description: "Update your profile information",
          color: "blue",
        },
        {
          name: "Notifications",
          href: "/notifications",
          icon: FiBell,
          roles: ["admin", "manager", "employee"],
          description: "Manage notification preferences",
          color: "orange",
          badge: "3", // Example notification count
        },
      ],
    },
    {
      title: "Reports & Analytics",
      priority: "high",
      items: [
        {
          name: "Reports",
          href: "/reports",
          icon: FiFileText,
          roles: ["admin", "manager"],
          description: "View attendance and leave reports",
          color: "green",
        },
        {
          name: "Attendance Manager",
          href: "/attendanceManagement",
          icon: FiBarChart,
          roles: ["admin", "manager"],
          description: "Manage team attendance",
          color: "purple",
        },
        {
          name: "Leave Balance",
          href: "/leaveBalanceManagement",
          icon: FiCalendar,
          roles: ["admin", "manager"],
          description: "Manage leave balances",
          color: "indigo",
        },
      ],
    },
    {
      title: "Organization",
      priority: "medium",
      items: [
        {
          name: "Departments",
          href: "/departments",
          icon: MdBusiness,
          roles: ["admin", "manager"],
          description: "Manage departments",
          color: "teal",
        },
        {
          name: "Locations",
          href: "/locations",
          icon: MdLocationOn,
          roles: ["admin"],
          description: "Manage office locations",
          color: "cyan",
        },
        {
          name: "Company Settings",
          href: "/company",
          icon: FiSettings,
          roles: ["admin"],
          description: "Configure company settings",
          color: "gray",
        },
      ],
    },
    {
      title: "Support & Help",
      priority: "low",
      items: [
        {
          name: "Settings",
          href: "/settings",
          icon: FiSettings,
          roles: ["admin", "manager", "employee"],
          description: "App settings and preferences",
          color: "gray",
        },
        {
          name: "Help & Support",
          href: "/help",
          icon: FiHelpCircle,
          roles: ["admin", "manager", "employee"],
          description: "Get help and support",
          color: "yellow",
        },
        {
          name: "Privacy & Security",
          href: "/privacy",
          icon: FiShield,
          roles: ["admin", "manager", "employee"],
          description: "Privacy settings and security",
          color: "red",
        },
      ],
    },
  ];

  const handleNavigation = async (href, itemName) => {
    if (navigating || activeItem === itemName) return;

    setNavigating(true);
    setActiveItem(itemName);

    try {
      router.push(href);
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setNavigating(false);
      setActiveItem(null);
    }
  };

  const handleLogout = async () => {
    if (navigating) return;

    setNavigating(true);
    setActiveItem("logout");

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setNavigating(false);
      setActiveItem(null);
    }
  };

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-600",
      green: isActive
        ? "bg-green-100 text-green-600"
        : "bg-green-50 text-green-600",
      purple: isActive
        ? "bg-purple-100 text-purple-600"
        : "bg-purple-50 text-purple-600",
      orange: isActive
        ? "bg-orange-100 text-orange-600"
        : "bg-orange-50 text-orange-600",
      indigo: isActive
        ? "bg-indigo-100 text-indigo-600"
        : "bg-indigo-50 text-indigo-600",
      teal: isActive ? "bg-teal-100 text-teal-600" : "bg-teal-50 text-teal-600",
      cyan: isActive ? "bg-cyan-100 text-cyan-600" : "bg-cyan-50 text-cyan-600",
      gray: isActive ? "bg-gray-100 text-gray-600" : "bg-gray-50 text-gray-600",
      yellow: isActive
        ? "bg-yellow-100 text-yellow-600"
        : "bg-yellow-50 text-yellow-600",
      red: isActive ? "bg-red-100 text-red-600" : "bg-red-50 text-red-600",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header with back navigation for mobile */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">More Options</h1>
              <p className="text-sm text-gray-600 mt-1">
                Additional tools and settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white border-opacity-30">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-white">
                  {user.fullName}
                </h2>
                <p className="text-sm text-blue-100 capitalize">{user.role}</p>
                <p className="text-xs text-blue-200 mt-1">{user.email}</p>
              </div>
              <button
                onClick={() => handleNavigation("/profile", "My Profile")}
                disabled={navigating}
                className="text-white hover:text-blue-100 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 bg-gray-50">
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Department
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {user.department || "N/A"}
              </p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Status
              </p>
              <p className="text-sm font-semibold text-green-600 mt-1">
                Active
              </p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Role
              </p>
              <p className="text-sm font-semibold text-blue-600 mt-1 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Menu Sections */}
      <div className="px-4 space-y-6">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(user.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  {section.priority === "high" && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      Priority
                    </span>
                  )}
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {visibleItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href, item.name)}
                    disabled={navigating || activeItem === item.name}
                    className={`
                      w-full flex items-center px-4 py-4 text-left transition-all duration-200 group
                      ${
                        navigating || activeItem === item.name
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : "hover:bg-gray-50 active:bg-gray-100"
                      }
                    `}
                  >
                    <div
                      className={`
                      flex-shrink-0 p-3 rounded-xl transition-all duration-200
                      ${
                        activeItem === item.name
                          ? getColorClasses(item.color, true)
                          : getColorClasses(item.color)
                      }
                      group-hover:scale-105
                    `}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-3 flex items-center">
                      {activeItem === item.name ? (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      ) : (
                        <FiChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Enhanced Logout Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
            <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider">
              Account
            </h3>
          </div>
          <button
            onClick={handleLogout}
            disabled={navigating || activeItem === "logout"}
            className={`
              w-full flex items-center px-4 py-4 text-left transition-all duration-200 group
              ${
                navigating || activeItem === "logout"
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : "hover:bg-red-50 active:bg-red-100"
              }
            `}
          >
            <div
              className={`
              flex-shrink-0 p-3 rounded-xl transition-all duration-200
              ${
                activeItem === "logout"
                  ? "bg-red-100 text-red-600"
                  : "bg-red-100 text-red-600"
              }
              group-hover:scale-105
            `}
            >
              <FiLogOut className="h-5 w-5" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-red-600">
                {navigating && activeItem === "logout"
                  ? "Signing out..."
                  : "Sign Out"}
              </h4>
              <p className="text-xs text-red-500 mt-1">
                Sign out of your account
              </p>
            </div>
            <div className="ml-3 flex items-center">
              {activeItem === "logout" ? (
                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
              ) : (
                <FiChevronRight className="h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors duration-200" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Company Info */}
      <div className="px-4 mt-8 mb-6">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-900">
                {user.company?.companyName || "AttendanceHub"}
              </span>
            </div>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
