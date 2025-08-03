
// components/locations/mainpage/desktop/DesktopLocationHeader.js
"use client";

import { FiPlus, FiMap } from "react-icons/fi";

export default function DesktopLocationHeader({ 
  locationsCount, 
  onAddLocation,
  title = "Location Management"
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-gray-600 text-sm">
          Manage office locations with Google Maps integration and geofencing
        </p>
      </div>
      <button
        onClick={onAddLocation}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-sm hover:shadow text-sm font-medium"
      >
        <FiPlus className="mr-2 h-4 w-4" />
        Add New Location
      </button>
    </div>
  );
}

