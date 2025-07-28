// components/locations/mainpage/desktop/DesktopLocationHeader.js
"use client";

import { FiPlus, FiMap } from "react-icons/fi";

export default function DesktopLocationHeader({ 
  locationsCount, 
  onAddLocation,
  title = "Location Management"
}) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="mt-2 text-gray-600">
          Manage office locations with Google Maps integration and geofencing
        </p>
      </div>
      <button
        onClick={onAddLocation}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        <FiPlus className="mr-2" />
        Add New Location
      </button>
    </div>
  );
}