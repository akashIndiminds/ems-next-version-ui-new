
// components/locations/mainpage/desktop/DesktopLocationFeatures.js
"use client";

import { FiMap } from "react-icons/fi";

export default function DesktopLocationFeatures() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <FiMap className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-blue-900">
          Smart Location Management Features
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            🗺️ Google Maps Integration
          </h3>
          <ul className="space-y-1 text-xs">
            <li>• Search any place worldwide</li>
            <li>• Auto-fill address details</li>
            <li>• Precise coordinate selection</li>
            <li>• Visual map confirmation</li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            🎯 Smart Geofencing
          </h3>
          <ul className="space-y-1 text-xs">
            <li>• Customizable radius settings</li>
            <li>• Real-time location validation</li>
            <li>• Distance calculation accuracy</li>
            <li>• Nearby locations detection</li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            🔧 Management Tools
          </h3>
          <ul className="space-y-1 text-xs">
            <li>• Auto-generated location codes</li>
            <li>• Bulk location import/export</li>
            <li>• Location testing & validation</li>
            <li>• Advanced analytics & reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

