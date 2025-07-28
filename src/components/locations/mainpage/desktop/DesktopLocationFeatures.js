// components/locations/mainpage/desktop/DesktopLocationFeatures.js
"use client";

import { FiMap } from "react-icons/fi";

export default function DesktopLocationFeatures() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <FiMap className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-blue-900">
          Smart Location Management Features
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
        <div>
          <h3 className="font-semibold mb-2">
            🗺️ Google Maps Integration:
          </h3>
          <ul className="space-y-1">
            <li>• Search any place worldwide</li>
            <li>• Auto-fill address details</li>
            <li>• Precise coordinate selection</li>
            <li>• Visual map confirmation</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">🎯 Smart Geofencing:</h3>
          <ul className="space-y-1">
            <li>• Customizable radius settings</li>
            <li>• Real-time location validation</li>
            <li>• Distance calculation accuracy</li>
            <li>• Nearby locations detection</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">🔧 Management Tools:</h3>
          <ul className="space-y-1">
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