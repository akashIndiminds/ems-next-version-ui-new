// src/components/MobileBottomNavigation.js
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiMoreHorizontal,
  FiChevronUp,
  FiX,
  FiFileText,
  FiBarChart,
  FiSettings,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineBeachAccess, MdOutlineCalendarMonth } from "react-icons/md";
import { MdBusiness, MdLocationOn } from "react-icons/md";

const MobileBottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Primary navigation items (max 4 + More button = 5 total as per research)
  const primaryNavItems = [
    {
      id: "home",
      name: "Home",
      href: "/dashboard",
      icon: FiHome,
      roles: ["admin", "manager", "employee"],
      description: "Dashboard & Overview",
    },
    {
      id: "people",
      name: "People",
      href: "/employees",
      icon: FiUsers,
      roles: ["admin", "manager", "employee"],
      description: "Team & Directory",
      fallback: "/leaves", // Changed fallback for employees to see their leaves
      employeeIcon: MdOutlineBeachAccess, // Different icon for employees
    },
    {
      id: "time",
      name: "Time",
      href: "/attendance",
      icon: FiClock,
      roles: ["admin", "manager", "employee"],
      description: "Attendance & Leaves",
    },
    {
      id: "more",
      name: "More",
      href: null, // No direct href - opens menu
      icon: FiMoreHorizontal,
      roles: ["admin", "manager", "employee"],
      description: "More Options",
      isMoreButton: true,
    },
  ];

  // Secondary navigation items - accessed via "More" menu
  const secondaryNavItems = [
    // Reports & Analytics Section
    {
      section: "Reports & Analytics",
      items: [
        {
          name: "Reports",
          href: "/reports",
          icon: FiFileText,
          roles: ["admin", "manager"],
          description: "View attendance and leave reports",
        },
        {
          name: "Attendance Manager",
          href: "/attendanceManagement",
          icon: FiBarChart,
          roles: ["admin", "manager"],
          description: "Manage team attendance",
        },
      ],
    },
    // Organization Section
    {
      section: "Organization",
      items: [
        {
          name: "Departments",
          href: "/departments",
          icon: MdBusiness,
          roles: ["admin", "manager"],
          description: "Manage departments",
        },
        {
          name: "Locations",
          href: "/locations",
          icon: MdLocationOn,
          roles: ["admin"],
          description: "Manage office locations",
        },
        {
          name: "Company Settings",
          href: "/company",
          icon: FiSettings,
          roles: ["admin"],
          description: "Configure company settings",
        },
      ],
    },
    // Personal Section - Added Leave Management for employees
    {
      section: "Personal",
      items: [
        {
          name: "My Leaves",
          href: "/leaves",
          icon: MdOutlineBeachAccess,
          roles: ["employee"], // Only for employees
          description: "View and manage your leave applications",
        },
        {
          name: "Leave Balance",
          href: "/leaveBalance",
          icon: MdOutlineCalendarMonth,
          roles: ["employee"], // Only for employees
          description: "Check your leave balance",
        },
        {
          name: "My Profile",
          href: "/profile",
          icon: FiUser,
          roles: ["admin", "manager", "employee"],
          description: "Update your profile information",
        },
        {
          name: "Settings",
          href: "/settings",
          icon: FiSettings,
          roles: ["admin", "manager", "employee"],
          description: "App settings and preferences",
        },
      ],
    },
  ];

  const handleNavigation = async (item) => {
    if (activeTab === item.id) return;

    // Handle "More" button
    if (item.isMoreButton) {
      setMoreMenuOpen(!moreMenuOpen);
      return;
    }

    setActiveTab(item.id);

    // Handle role-based navigation
    let targetHref = item.href;

    // For employees, redirect People tab to their leaves instead of employees list
    if (item.id === "people" && user.role === "employee" && item.fallback) {
      targetHref = item.fallback;
    }

    try {
      router.push(targetHref);
      setMoreMenuOpen(false); // Close more menu when navigating
      setTimeout(() => setActiveTab(null), 300);
    } catch (error) {
      console.error("Navigation error:", error);
      setActiveTab(null);
    }
  };

  const handleSecondaryNavigation = async (href, itemName) => {
    setActiveTab(itemName);

    try {
      router.push(href);
      setMoreMenuOpen(false);
      setTimeout(() => setActiveTab(null), 300);
    } catch (error) {
      console.error("Navigation error:", error);
      setActiveTab(null);
    }
  };

  const isActive = (item) => {
    // Home tab logic
    if (item.id === "home") {
      return pathname === "/dashboard";
    }

    // People tab logic - different behavior based on role
    if (item.id === "people") {
      if (user.role === "employee") {
        // For employees, People tab is active when viewing leaves
        return (
          pathname.startsWith("/leaves") || pathname.startsWith("/leaveBalance")
        );
      } else {
        // For admin/manager, People tab is active for employee-related pages
        return (
          pathname.startsWith("/employees") ||
          pathname.startsWith("/departments")
        );
      }
    }

    // Time tab logic - attendance related
    if (item.id === "time") {
      return pathname.startsWith("/attendance");
    }

    // More tab logic - check if current path is in secondary navigation
    if (item.id === "more") {
      const allSecondaryPaths = secondaryNavItems.flatMap((section) =>
        section.items.map((item) => item.href)
      );
      return (
        allSecondaryPaths.some((path) => pathname.startsWith(path)) ||
        pathname.startsWith("/reports") ||
        pathname.startsWith("/locations") ||
        pathname.startsWith("/company") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/profile") ||
        pathname === "/more"
      );
    }

    return false;
  };

  const getDisplayName = (item) => {
    if (item.id === "people" && user.role === "employee") {
      return "Leaves"; // Changed from 'Team' to 'Leaves' for employees
    }
    return item.name;
  };

  // Close more menu when clicking outside or on route change
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".more-menu-container")) {
        setMoreMenuOpen(false);
      }
    };

    if (moreMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [moreMenuOpen]);

  useEffect(() => {
    setMoreMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* More Menu Overlay */}
      {moreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto more-menu-container">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <h3 className="text-lg font-semibold text-gray-900">
                More Options
              </h3>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {user.fullName}
                  </h4>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.role}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Secondary Navigation Sections */}
            <div className="pb-4">
              {secondaryNavItems.map((section) => {
                const visibleItems = section.items.filter((item) =>
                  item.roles.includes(user.role)
                );

                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.section} className="mt-6">
                    <div className="px-4 mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {section.section}
                      </h4>
                    </div>
                    <div className="space-y-1 px-2">
                      {visibleItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.name}
                            onClick={() =>
                              handleSecondaryNavigation(item.href, item.name)
                            }
                            disabled={activeTab === item.name}
                            className={`
                              w-full flex items-center px-3 py-3 text-left rounded-xl transition-all duration-200
                              ${
                                activeTab === item.name
                                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                                  : "hover:bg-gray-50 active:bg-gray-100"
                              }
                              ${
                                pathname.startsWith(item.href)
                                  ? "bg-blue-50 border border-blue-200"
                                  : ""
                              }
                            `}
                          >
                            <div
                              className={`
                              flex-shrink-0 p-2 rounded-lg
                              ${
                                pathname.startsWith(item.href)
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }
                            `}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h5>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {item.description}
                              </p>
                            </div>
                            {activeTab === item.name && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Logout Section */}
              <div className="mt-6 px-2">
                <div className="px-2 mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </h4>
                </div>
                <button
                  onClick={() => {
                    // Add your actual logout function here
                    if (typeof logout === "function") {
                      logout();
                    } else {
                      console.log("Logout clicked - implement logout logic");
                    }
                  }}
                  className="w-full flex items-center px-3 py-3 text-left rounded-xl transition-all duration-200 hover:bg-red-50 active:bg-red-100"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-red-100 text-red-600">
                    <FiLogOut className="h-4 w-4" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h5 className="text-sm font-medium text-red-600">
                      Sign Out
                    </h5>
                    <p className="text-xs text-red-500 mt-0.5">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-white border-t border-gray-200 shadow-2xl">
          {/* Navigation Items */}
          <div className="grid grid-cols-4 h-16">
            {primaryNavItems
              .filter((item) => item.roles.includes(user.role))
              .map((item) => {
                const active = isActive(item);
                const loading = activeTab === item.id;
                const isMoreActive = item.isMoreButton && moreMenuOpen;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    disabled={loading && !item.isMoreButton}
                    className={`
                      flex flex-col items-center justify-center px-1 py-2 transition-all duration-200 relative
                      ${
                        active || isMoreActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }
                      ${loading ? "opacity-60" : ""}
                    `}
                  >
                    <div className="relative">
                      {/* Use different icon for employees on People tab */}
                      {item.id === "people" && user.role === "employee" ? (
                        <item.employeeIcon
                          className={`
                            h-5 w-5 transition-all duration-200
                            ${
                              active || isMoreActive
                                ? "text-blue-600 scale-110"
                                : "text-gray-500"
                            }
                            ${loading ? "animate-pulse" : ""}
                            ${
                              item.isMoreButton && moreMenuOpen
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      ) : (
                        <item.icon
                          className={`
                            h-5 w-5 transition-all duration-200
                            ${
                              active || isMoreActive
                                ? "text-blue-600 scale-110"
                                : "text-gray-500"
                            }
                            ${loading ? "animate-pulse" : ""}
                            ${
                              item.isMoreButton && moreMenuOpen
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      )}
                      {(active || isMoreActive) && (
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span
                      className={`
                      text-xs font-medium mt-1 transition-all duration-200
                      ${
                        active || isMoreActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600"
                      }
                    `}
                    >
                      {getDisplayName(item)}
                    </span>

                    {/* More button indicator */}
                    {item.isMoreButton && moreMenuOpen && (
                      <FiChevronUp className="absolute -top-1 right-1 h-3 w-3 text-blue-600" />
                    )}
                  </button>
                );
              })}
          </div>

          {/* Safe area for iPhone home indicator */}
          <div className="h-safe-area-inset-bottom bg-white"></div>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNavigation;
