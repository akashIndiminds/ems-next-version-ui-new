// src/components/dashboard/DesktopDashboardStats.js
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const DesktopDashboardStats = ({ stats, userRole }) => {
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
      borderColor: "border-blue-200",
      href: "/employees",
      change: "+5.2%",
      changeType: "increase"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiClock,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100", 
      borderColor: "border-emerald-200",
      href: "/attendanceManagement",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200", 
      href: "/leaves/approved",
      change: "-8%",
      changeType: "decrease"
    },
    {
      title: "Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiTrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      href: "/departments"
    }
  ];

  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`group relative bg-white overflow-hidden shadow-sm hover:shadow-lg rounded-2xl transition-all duration-300 hover:-translate-y-1 border ${stat.borderColor}`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-600 mb-2">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      {stat.change && (
                        <div className={`ml-3 flex items-baseline text-sm font-semibold px-2 py-1 rounded-full ${
                          stat.changeType === 'increase' 
                            ? 'text-emerald-700 bg-emerald-50' 
                            : 'text-red-700 bg-red-50'
                        }`}>
                          {stat.change}
                        </div>
                      )}
                    </dd>
                    {stat.href && (
                      <div className="mt-3">
                        <Link
                          href={stat.href}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:underline"
                        >
                          View details
                          <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopDashboardStats;