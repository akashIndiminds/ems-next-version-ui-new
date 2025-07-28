// components/locations/new/desktop/DesktopNewLocationHeader.js
"use client";

import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function DesktopNewLocationHeader({ 
  onBack, 
  isEditing = false,
  apiKeyMissing = false 
}) {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          <FiArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {isEditing ? "Edit Location" : "Add New Location"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing 
              ? "Update location details with Google Maps integration"
              : "Search and select location with Google Maps"}
          </p>
        </div>
      </div>

      {/* API Key Status */}
      {apiKeyMissing && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Google Maps API Key Missing!</p>
              <p>Add <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env.local file</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}