// src/components/dashboard/mobile/MobileDashboardStats.js
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiArrowRight, FiGrid, FiUserCheck } from 'react-icons/fi';
import Link from 'next/link';

const MobileDashboardStats = ({ stats, userRole }) => {
  // Only show stats for admin/manager
  if (userRole !== 'admin' && userRole !== 'manager') {
    return null;
  }

  const statsData = [
    {
      title: "Total Employees",
      value: stats?.ActiveEmployees || 0,
      icon: FiUsers,
      bgColor: "bg-blue-500",
      href: "/employees",
      change: "+5.2%",
      changeType: "increase",
      description: "Active workforce"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiUserCheck,
      bgColor: "bg-emerald-500",
      href: "/attendanceManagement",
      change: "+12%",
      changeType: "increase",
      description: "Currently working"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      bgColor: "bg-amber-500",
      href: "/leaves/pending",
      change: "-8%",
      changeType: "decrease",
      description: "Awaiting approval"
    },
    {
      title: "Total Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiGrid,
      bgColor: "bg-purple-500",
      href: "/departments",
      description: "Active departments"
    },
    {
      title: "Monthly Hours",
      value: `${stats?.MonthlyHours || 0}h`,
      icon: FiClock,
      bgColor: "bg-indigo-500",
      href: "/reports/hours",
      change: "+15%",
      changeType: "increase",
      description: "This month"
    },
    {
      title: "Attendance Rate",
      value: `${stats?.AttendanceRate || 0}%`,
      icon: FiTrendingUp,
      bgColor: "bg-rose-500",
      href: "/reports/attendance",
      change: "+3.2%",
      changeType: "increase",
      description: "Monthly average"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiTrendingUp className="mr-2 text-indigo-600 h-5 w-5" />
              Quick Stats
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Overview and shortcuts</p>
          </div>
          <div className="text-xs text-indigo-600 font-medium">
            {userRole === 'admin' ? 'Admin View' : 'Manager View'}
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 p-4 min-w-[140px] flex-shrink-0 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                {/* Icon and Change */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {stat.change && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                      stat.changeType === 'increase' 
                        ? 'text-emerald-700 bg-emerald-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {stat.change}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-3">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 leading-tight">{stat.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                </div>

                {/* Link */}
                {stat.href && (
                  <Link
                    href={stat.href}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold group"
                  >
                    View Details
                    <FiArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Last updated: {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <Link 
              href="/reports" 
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"
            >
              All Reports
              <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardStats;