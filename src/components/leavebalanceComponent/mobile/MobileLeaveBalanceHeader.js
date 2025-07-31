"use client";
import { useState } from "react";
import {
  FiUsers,
  FiPlus,
  FiEdit,
  FiRefreshCw,
  FiCalendar,
  FiTrendingUp,
  FiBarChart,
} from "react-icons/fi";

const MobileLeaveBalanceHeader = ({ 
  activeTab, 
  setActiveTab, 
  user, 
  statistics 
}) => {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const tabs = [
    { id: "view-balance", label: "Balance", icon: FiBarChart },
    { id: "initialize", label: "Initialize", icon: FiPlus },
    { id: "adjust", label: "Adjust", icon: FiEdit },
    { id: "bulk-operations", label: "Bulk", icon: FiRefreshCw },
  ];

  const stats = [
    {
      id: "total",
      label: "Total Employees",
      value: statistics?.totalEmployees || 0,
      icon: FiUsers,
      color: "blue",
      bgGradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "bg-blue-500/20",
      textColor: "text-blue-700",
    },
    {
      id: "with-balance",
      label: "With Balance",
      value: statistics?.employeesWithBalance || 0,
      icon: FiCalendar,
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-emerald-600/20",
      iconBg: "bg-emerald-500/20",
      textColor: "text-emerald-700",
    },
    {
      id: "year",
      label: "Active Year",
      value: new Date().getFullYear(),
      icon: FiTrendingUp,
      color: "purple",
      bgGradient: "from-purple-500/20 to-purple-600/20",
      iconBg: "bg-purple-500/20",
      textColor: "text-purple-700",
    },
  ];

  return (
    <>
      {/* Glassmorphic Header with reduced height */}
      <div className=" backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="px-4 py-4">
          {/* Compact Title Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Leave Balance
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {user?.company?.companyName}
              </p>
            </div>
            
            {/* Stats Toggle Button */}
            <button
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              className="p-2.5 rounded-xl bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/80 transition-all duration-200 active:scale-95"
            >
              <FiBarChart className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Progressive Disclosure Stats - Compact horizontal cards */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isStatsExpanded ? 'max-h-32 opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className={`flex-shrink-0 relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-white/30 min-w-[100px] p-3`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`p-1.5 rounded-lg ${stat.iconBg} backdrop-blur-sm`}>
                      <stat.icon className="h-4 w-4 text-gray-700" />
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${stat.textColor}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 font-medium leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Bottom Navigation Bar (replacing hamburger) */}
        <div className="px-4 pb-2">
          <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 border border-white/30">
            <div className="flex justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white shadow-lg scale-105 transform"
                      : "hover:bg-white/50"
                  }`}
                >
                  <tab.icon 
                    className={`h-5 w-5 mb-1 transition-colors ${
                      activeTab === tab.id 
                        ? "text-blue-600" 
                        : "text-gray-600"
                    }`} 
                  />
                  <span 
                    className={`text-xs font-medium transition-colors ${
                      activeTab === tab.id 
                        ? "text-blue-600" 
                        : "text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Stats Summary (when collapsed) */}
      {!isStatsExpanded && (
        <div className="fixed top-20 right-4 z-40">
          <div className="bg-white/90 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-lg border border-white/30">
            <div className="flex items-center space-x-2 text-xs">
              <FiUsers className="h-3 w-3 text-blue-600" />
              <span className="font-semibold text-gray-800">
                {statistics?.employeesWithBalance || 0}/{statistics?.totalEmployees || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileLeaveBalanceHeader;