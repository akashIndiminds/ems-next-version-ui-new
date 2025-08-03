
// components/dashboard/desktop/DesktopDashboardStats.js
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/employees",
      change: "+5.2%",
      changeType: "increase"
    },
    {
      title: "Present Today", 
      value: stats?.TodayAttendance || 0,
      icon: FiClock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/attendanceManagement",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Pending Leaves",
      value: stats?.PendingLeaves || 0,
      icon: FiCalendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/leaves/approved",
      change: "-8%",
      changeType: "decrease"
    },
    {
      title: "Departments",
      value: stats?.TotalDepartments || 0,
      icon: FiTrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/departments"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4" />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  stat.changeType === 'increase' 
                    ? 'text-emerald-700 bg-emerald-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
            </div>
            
            {stat.href && (
              <Link
                href={stat.href}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View details
                <FiArrowRight className="ml-1 w-3 h-3" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesktopDashboardStats;