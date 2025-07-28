// components/locations/mainpage/mobile/MobileLocationHeader.js
"use client";

import { FiPlus, FiMapPin, FiArrowLeft } from "react-icons/fi";

export default function MobileLocationHeader({ 
  locationsCount, 
  onAddLocation, 
  showBackButton = false, 
  onBack,
  title = "Locations"
}) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{locationsCount} locations</p>
            </div>
          </div>
          
          {/* Add button - always visible on mobile */}
          <button
            onClick={onAddLocation}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg active:scale-95"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>

        {/* Feature highlight bar */}
        <div className="mt-3 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
          <FiMapPin className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-xs text-blue-700 font-medium">
            Google Maps • Smart Geofencing
          </span>
        </div>
      </div>
    </div>
  );
}