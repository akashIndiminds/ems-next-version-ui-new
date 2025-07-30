// src/components/dashboard/MobileDashboardStats.js
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
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
      change: "+5.2%"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiClock,
      bgColor: "bg-emerald-500",
      href: "/attendanceManagement",
      change: "+12%"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      bgColor: "bg-amber-500",
      href: "/leaves/approved",
      change: "-8%"
    },
    {
      title: "Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiTrendingUp,
      bgColor: "bg-purple-500",
      href: "/departments"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-sm font-medium text-gray-900 flex items-center">
          <FiTrendingUp className="mr-2 text-indigo-600 h-4 w-4" />
          Quick Stats
        </h2>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="p-3">
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-3 min-w-[110px] flex-shrink-0 hover:shadow-md transition-shadow duration-200"
              >
                {/* Compact Icon */}
                <div className={`w-7 h-7 ${stat.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>

                {/* Stats */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">{stat.title}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  
                  {/* Change indicator */}
                  {stat.change && (
                    <div className={`text-xs font-medium px-1.5 py-0.5 rounded-full inline-flex ${
                      stat.change.startsWith('+') 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-red-700 bg-red-50'
                    }`}>
                      {stat.change}
                    </div>
                  )}

                  {/* Compact Link */}
                  {stat.href && (
                    <Link
                      href={stat.href}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center mt-1.5 group"
                    >
                      View
                      <FiArrowRight className="ml-1 h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardStats;