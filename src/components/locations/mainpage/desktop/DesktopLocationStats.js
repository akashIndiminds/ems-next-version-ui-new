
// components/locations/mainpage/desktop/DesktopLocationStats.js
"use client";

import { FiUser, FiCheckCircle, FiActivity } from "react-icons/fi";

export default function DesktopLocationStats({ locations }) {
  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.IsActive).length;
  const avgRadius = Math.round(
    locations.reduce((acc, loc) => acc + (loc.AllowedRadius || 0), 0) / locations.length
  ) || 0;

  const stats = [
    {
      icon: FiUser,
      value: totalLocations,
      label: "Total Locations",
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: FiCheckCircle,
      value: activeLocations,
      label: "Active Locations",
      color: "green",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      icon: FiActivity,
      value: `${avgRadius}m`,
      label: "Avg. Radius",
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm p-4 border ${stat.borderColor}`}
          >
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}