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
    <div className=" bg-white border-b border-gray-200 safe-area-inset-top">
      <div className="px-4 py-4">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-4 p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Go back"
                style={{ minWidth: '44px', minHeight: '44px' }} // iOS guideline
              >
                <FiArrowLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-base text-gray-600 mt-1">
                {locationsCount} {locationsCount === 1 ? 'location' : 'locations'}
              </p>
            </div>
          </div>
          
          {/* Add button - WCAG 2.2 compliant 44px touch target */}
          <button
            onClick={onAddLocation}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Add new location"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FiPlus className="h-6 w-6" />
          </button>
        </div>

        {/* Feature highlight bar with improved accessibility */}
        <div className="mt-4 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
          <FiMapPin className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
          <span className="text-sm text-blue-700 font-medium text-center">
            Google Maps Integration • Smart Geofencing
          </span>
        </div>
      </div>
    </div>
  );
}