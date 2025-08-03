"use client";
import React from 'react';
import {
  FiPlus, 
  FiEdit, 
  FiUsers, 
  FiCalendar, 
  FiTrendingUp, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiAward
} from "react-icons/fi";

const DesktopLeaveBalanceHeader = ({ 
  activeTab, 
  setActiveTab, 
  user = {}, 
  statistics = {},
  employees = [],
  leaveTypes = []
}) => {
  // Tab configuration
  const tabs = [
    { 
      id: "view-balance", 
      label: "View Balance", 
      icon: FiUsers, 
      color: "blue" 
    },
    { 
      id: "initialize", 
      label: "Initialize Balance", 
      icon: FiPlus, 
      color: "green" 
    },
    { 
      id: "adjust", 
      label: "Adjust Balance", 
      icon: FiEdit, 
      color: "yellow" 
    },
    { 
      id: "bulk-operations", 
      label: "Bulk Operations", 
      icon: FiRefreshCw, 
      color: "purple" 
    },
  ];

  // Safe access to statistics with fallbacks
  const safeStatistics = {
    employeesWithBalance: 0,
    totalLeaveRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    ...statistics // Spread any existing statistics
  };

  // Calculate statistics safely
  const totalEmployees = Array.isArray(employees) ? employees.length : 0;
  const employeesWithBalance = safeStatistics.employeesWithBalance || 0;
  const totalLeaveTypes = Array.isArray(leaveTypes) ? leaveTypes.length : 0;
  
  // Calculate success rate safely
  const successRate = totalEmployees > 0 
    ? Math.round((employeesWithBalance / totalEmployees) * 100)
    : 0;

  // Statistics configuration
  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: FiUsers,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900"
    },
    {
      title: "With Balance",
      value: employeesWithBalance,
      icon: FiCheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-900"
    },
    {
      title: "Leave Types",
      value: totalLeaveTypes,
      icon: FiCalendar,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900"
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: FiTrendingUp,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-purple-900"
    }
  ];

  // Tab styling function
  const getTabColors = (tabId, isActive) => {
    const baseClasses = "transition-colors duration-200";
    
    const colorMap = {
      "view-balance": {
        active: "border-blue-500 text-blue-600",
        inactive: "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
      },
      "initialize": {
        active: "border-green-500 text-green-600",
        inactive: "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
      },
      "adjust": {
        active: "border-yellow-500 text-yellow-600",
        inactive: "border-transparent text-gray-500 hover:text-yellow-600 hover:border-yellow-300"
      },
      "bulk-operations": {
        active: "border-purple-500 text-purple-600",
        inactive: "border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300"
      }
    };

    const colors = colorMap[tabId];
    if (!colors) return `${baseClasses} border-transparent text-gray-500`;
    
    return `${baseClasses} ${isActive ? colors.active : colors.inactive}`;
  };

  // Get company name safely
  const companyName = user?.company?.companyName || 'Your Company';
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Leave Balance Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage employee leave allocations, adjustments, and balance tracking for{" "}
                <span className="font-medium text-blue-600">
                  {companyName}
                </span>
              </p>
            </div>
            
            {/* Current Year Display */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 mb-1">
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Current Year
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={`stat-${index}`} 
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`flex-shrink-0 h-10 w-10 ${stat.bgColor} rounded-lg flex items-center justify-center ml-3`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getTabColors(tab.id, activeTab === tab.id)}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DesktopLeaveBalanceHeader;