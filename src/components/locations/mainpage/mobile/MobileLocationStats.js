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
      color: "bg-blue-500",
      lightBg: "bg-blue-50"
    },
    {
      icon: FiCheckCircle,
      value: activeLocations,
      label: "Active",
      color: "bg-green-500",
      lightBg: "bg-green-50"
    },
    {
      icon: FiActivity,
      value: `${avgRadius}m`,
      label: "Radius",
      color: "bg-purple-500",
      lightBg: "bg-purple-50"
    }
  ];

  // Option 1: Horizontal compact cards
  const HorizontalStats = () => (
    <div className="px-4 py-2">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex h-8 w-8 rounded-full ${stat.lightBg} items-center justify-center mb-1`}>
                  <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Option 2: Inline single row
  const InlineStats = () => (
    <div className="px-4 py-2">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`h-6 w-6 rounded ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Option 3: Header style with dots
  const HeaderStats = () => (
    <div className="px-4 py-2 bg-gray-50">
      <div className="flex items-center justify-center space-x-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${stat.color}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {stat.value} <span className="text-gray-500">{stat.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Option 4: Minimal badges
  const BadgeStats = () => (
    <div className="px-4 py-2">
      <div className="flex items-center justify-center space-x-2">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.lightBg} px-3 py-1 rounded-full border`}>
            <span className="text-sm font-semibold text-gray-800">
              {stat.value}
            </span>
            <span className="text-xs text-gray-600 ml-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Return the compact horizontal version (change this to test different options)
  return <HorizontalStats />;
}