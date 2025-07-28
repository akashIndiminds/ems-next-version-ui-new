// components/locations/mainpage/mobile/MobileLocationStats.js
"use client";

import { FiMapPin, FiCheckCircle, FiActivity } from "react-icons/fi";

export default function MobileLocationStats({ locations }) {
  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.IsActive).length;
  const avgRadius = Math.round(
    locations.reduce((acc, loc) => acc + (loc.AllowedRadius || 0), 0) / locations.length
  ) || 0;

  const stats = [
    {
      icon: FiMapPin,
      value: totalLocations,
      label: "Total",
      color: "blue",
      bgFrom: "from-blue-100",
      bgTo: "to-blue-200",
      textColor: "text-blue-600"
    },
    {
      icon: FiCheckCircle,
      value: activeLocations,
      label: "Active",
      color: "green",
      bgFrom: "from-green-100",
      bgTo: "to-green-200",
      textColor: "text-green-600"
    },
    {
      icon: FiActivity,
      value: `${avgRadius}m`,
      label: "Avg Radius",
      color: "purple",
      bgFrom: "from-purple-100",
      bgTo: "to-purple-200",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="px-4 py-3">
      {/* Horizontal scrollable stats */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-w-[120px]"
            >
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600 text-center">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}