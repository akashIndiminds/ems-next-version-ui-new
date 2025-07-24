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
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      href: "/employees",
      change: "+5.2%"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiClock,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      href: "/attendanceManagement",
      change: "+12%"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      color: "from-amber-500 to-amber-600", 
      bgColor: "from-amber-50 to-amber-100",
      href: "/leaves/approved",
      change: "-8%"
    },
    {
      title: "Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiTrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      href: "/departments"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiTrendingUp className="mr-2 text-indigo-600 h-5 w-5" />
          Quick Stats
        </h2>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4 min-w-[140px] flex-shrink-0 hover:shadow-md transition-shadow duration-200"
              >
                {/* Icon with gradient background */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>

                {/* Stats */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-600">{stat.title}</div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  
                  {/* Change indicator */}
                  {stat.change && (
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-flex ${
                      stat.change.startsWith('+') 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-red-700 bg-red-50'
                    }`}>
                      {stat.change}
                    </div>
                  )}

                  {/* Link */}
                  {stat.href && (
                    <Link
                      href={stat.href}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center mt-2 group"
                    >
                      View
                      <FiArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
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