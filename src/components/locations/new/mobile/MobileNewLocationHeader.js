// components/locations/new/mobile/MobileNewLocationHeader.js
"use client";

import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function MobileNewLocationHeader({ 
  onBack, 
  isEditing = false,
  apiKeyMissing = false 
}) {
  return (
    <div className="bg-white border-b border-gray-100 ">
      <div className="px-3 py-2">
        {/* Main header */}
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 active:scale-95"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {isEditing ? "Edit Location" : "Add Location"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              {isEditing ? "Update location details" : "Search with Google Maps"}
            </p>
          </div>
        </div>

        {/* API Key Warning - More compact */}
        {apiKeyMissing && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
            <div className="flex items-start">
              <FiAlertCircle className="h-3.5 w-3.5 text-red-600 mt-0.5 mr-1.5 flex-shrink-0" />
              <div className="text-xs text-red-800 min-w-0">
                <p className="font-medium">API Key Missing!</p>
                <p className="text-red-700">Add Google Maps API key to .env.local</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
