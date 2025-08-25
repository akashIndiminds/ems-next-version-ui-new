// src/components/dashboard/desktop/DesktopDashboardStats.js
import React from 'react';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiArrowRight, FiGrid, FiUserCheck } from 'react-icons/fi';
import Link from 'next/link';

const DesktopDashboardStats = ({ stats, userRole }) => {
  // Only show stats for admin/manager
  if (userRole !== 'admin' && userRole !== 'manager') {
    return null;
  }

  const statsData = [
    {
      title: "Active Employees",
      value: stats?.ActiveEmployees || 0,
      icon: FiUsers,
      color: "blue",
      href: "/employees",
      change: "+5.2%",
      changeType: "increase",
      description: "Total workforce"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiUserCheck,
      color: "green",
      href: "/attendanceManagement",
      change: "+12%",
      changeType: "increase",
      description: "Currently working"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      color: "orange",
      href: "/leaves/pending",
      change: "-8%",
      changeType: "decrease",
      description: "Awaiting approval"
    },
    {
      title: "Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiGrid,
      color: "purple",
      href: "/departments",
      description: "Active divisions"
    },
    {
      title: "Monthly Hours",
      value: `${stats?.MonthlyHours || 0}h`,
      icon: FiClock,
      color: "indigo",
      href: "/reports/hours",
      change: "+15%",
      changeType: "increase",
      description: "This month"
    },
    {
      title: "Attendance Rate",
      value: `${stats?.AttendanceRate || 0}%`,
      icon: FiTrendingUp,
      color: "red",
      href: "/reports/attendance",
      change: "+3.2%",
      changeType: "increase",
      description: "Monthly avg"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-500',
        text: 'text-blue-600',
        iconText: 'text-white'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'bg-green-500',
        text: 'text-green-600',
        iconText: 'text-white'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'bg-orange-500',
        text: 'text-orange-600',
        iconText: 'text-white'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'bg-purple-500',
        text: 'text-purple-600',
        iconText: 'text-white'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'bg-indigo-500',
        text: 'text-indigo-600',
        iconText: 'text-white'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'bg-red-500',
        text: 'text-red-600',
        iconText: 'text-white'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-500 rounded-lg mr-3">
            <FiGrid className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Dashboard Overview</h2>
            <p className="text-xs text-gray-500">
              Key metrics • {userRole === 'admin' ? 'Admin' : 'Manager'} View
            </p>
          </div>
        </div>
        <Link 
          href="/reports" 
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 px-3 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          All Reports
          <FiArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = getColorClasses(stat.color);
          
          return (
            <div
              key={index}
              className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-3 hover:shadow-md transition-all duration-200 group`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className={`${colorClasses.icon} p-2 rounded-lg`}>
                  <IconComponent className={`w-4 h-4 ${colorClasses.iconText}`} />
                </div>
                {stat.change && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.changeType === 'increase' 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              
              {/* Stats */}
              <div className="mb-2">
                <h3 className="text-xs font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              
              {/* Link */}
              {stat.href && (
                <Link
                  href={stat.href}
                  className={`inline-flex items-center text-xs ${colorClasses.text} hover:opacity-80 font-medium group-hover:underline`}
                >
                  View
                  <FiArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <FiClock className="w-3 h-3 mr-1" />
            Updated: {new Date().toLocaleString('en-US', { 
              month: 'short',
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>
              <span className="font-medium text-gray-900">{stats?.ActiveEmployees || 0}</span> employees
            </span>
            <span>
              <span className="font-medium text-green-700">{stats?.AttendanceRate || 0}%</span> rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboardStats;