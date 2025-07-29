// components/locations/new/mobile/MobileNewLocationHeader.js
"use client";

import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function MobileNewLocationHeader({ 
  onBack, 
  isEditing = false,
  apiKeyMissing = false 
}) {
  return (
    <div className=" bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Main header */}
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FiArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Location" : "Add Location"}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? "Update location details" : "Search with Google Maps"}
            </p>
          </div>
        </div>

        {/* API Key Warning */}
        {apiKeyMissing && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start">
              <FiAlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-red-800">
                <p className="font-medium mb-1">API Key Missing!</p>
                <p>Add Google Maps API key to .env.local</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}