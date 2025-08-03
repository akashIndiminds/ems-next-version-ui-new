

// components/locations/new/desktop/DesktopNewLocationHeader.js
"use client";

import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function DesktopNewLocationHeader({ 
  onBack, 
  isEditing = false,
  apiKeyMissing = false 
}) {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <FiArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Location" : "Add New Location"}
          </h1>
          <p className="mt-1 text-gray-600 text-sm">
            {isEditing 
              ? "Update location details with Google Maps integration"
              : "Search and select location with Google Maps"}
          </p>
        </div>
      </div>
    </div>
  );
}