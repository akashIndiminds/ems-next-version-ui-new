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
      bgFrom: "from-blue-100",
      bgTo: "to-blue-200",
      textColor: "text-blue-600"
    },
    {
      icon: FiCheckCircle,
      value: activeLocations,
      label: "Active Locations",
      color: "green",
      bgFrom: "from-green-100",
      bgTo: "to-green-200",
      textColor: "text-green-600"
    },
    {
      icon: FiActivity,
      value: `${avgRadius}m`,
      label: "Avg. Radius",
      color: "purple",
      bgFrom: "from-purple-100",
      bgTo: "to-purple-200",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}